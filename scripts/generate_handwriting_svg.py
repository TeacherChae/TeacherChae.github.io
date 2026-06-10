#!/usr/bin/env python3
"""싱글라인 폰트 → 2레이어 손글씨 SVG 생성기 (PRD §5.E / §8).

레이어 구조:
  <g id="ink">  가변 폭 잉크 폴리곤(fill) — 화면에 보이는 글자
  <g id="pen">  센터라인(stroke)        — 마스크 write-on + 타이밍 측정용
획 단위로 ink-N / pen-N id 가 1:1 페어링되며, 필기 순서(긴 획 먼저)로 정렬됨.

폭 규칙 (PRD §5.E 프로토타입 검증):
  w_dir   = W_MIN + (W_MAX-W_MIN) · clamp(-t̂_y, 0, 1)^1.2   (내리긋기 굵게)
  w_speed = (v/median)^(-ALPHA)                               (§5.C 속도 연동, α=0 이면 무효)
  w       = smooth(w_dir · w_speed)
코너 spike 는 shapely buffer(0) + 끝점 원형 캡 union 으로 제거한다.

좌표는 폰트 단위로 계산 후 높이 150 viewBox 로 스케일해 베이크
(기존 센터라인 에셋과 같은 규모 → 컴포넌트 pxPerSec 등 파라미터 호환).

사용: python3 scripts/generate_handwriting_svg.py [--alpha 0.0] [--out PATH]
의존성(오프라인 전용): fonttools, shapely
"""
import argparse
import math

from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

TEXT = "We are getting married"
FONT = "docs/fonts/ttf/AstutelySingleLine-VGj3l.ttf"
OUT = "docs/fonts/svg/wearegettingmarried_inked.svg"

W_MIN, W_MAX = 7.0, 30.0   # 잉크 폭 범위 기본값 (font units, upm 1000) — --wmin/--wmax
MASK_RATIO = 2.0           # 마스크 stroke 폭 = W_MAX × 2.0 (PRD §5.E-5,
                           # 런타임 inkBoost 로 굵어진 잉크까지 덮도록 여유)
SAMPLES = 200              # 획당 호길이 등간격 샘플 수
SMOOTH_WIN = 15            # 폭 이동평균 반경(샘플) (PRD §5.E-3)
SPEED_P = 0.5              # §5.C 와 동일한 곡률 지수
TARGET_H = 150.0           # 출력 viewBox 높이 (기존 에셋과 동일 규모)
PEN_EVERY = 3              # pen 폴리라인 데시메이션 간격


def flatten_commands(commands, steps=24):
    """RecordingPen 명령 → 서브패스(획)별 폴리라인 목록 (font units)."""
    strokes, cur = [], []

    def bez(pts, t):
        while len(pts) > 1:
            pts = [tuple((1 - t) * a + t * b for a, b in zip(p, q)) for p, q in zip(pts, pts[1:])]
        return pts[0]

    for op, args in commands:
        if op == "moveTo":
            if len(cur) > 1:
                strokes.append(cur)
            cur = [args[0]]
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "curveTo":  # cubic (한 번에 여러 세그먼트 가능)
            pts = [cur[-1], *args]
            for s in range(0, len(args), 3):
                seg = [pts[s], pts[s + 1], pts[s + 2], pts[s + 3]]
                cur += [bez(seg, t / steps) for t in range(1, steps + 1)]
        elif op == "qCurveTo":  # TrueType quadratic, 중간 on-curve 점은 암시됨
            if args[-1] is None:
                raise ValueError("closed all-offcurve qCurve 미지원")
            pts = list(args)
            prev_on = cur[-1]
            offs, segs = pts[:-1], []
            for i, off in enumerate(offs):
                on = pts[i + 1] if i + 1 < len(offs) else pts[-1]
                if i + 1 < len(offs):  # 암시된 on-curve 중점
                    on = ((off[0] + offs[i + 1][0]) / 2, (off[1] + offs[i + 1][1]) / 2)
                segs.append((prev_on, off, on))
                prev_on = on
            for p0, p1, p2 in segs:
                cur += [bez([p0, p1, p2], t / steps) for t in range(1, steps + 1)]
        elif op == "closePath":
            if cur and cur[0] != cur[-1]:
                cur.append(cur[0])
    if len(cur) > 1:
        strokes.append(cur)
    return strokes


def arclen(poly):
    return sum(math.dist(a, b) for a, b in zip(poly, poly[1:]))


def order_strokes(strokes):
    """글리프 내 필기 순서. 기본은 긴 획(줄기) 먼저.
    예외: 'i'/'j'의 점 — 줄기 꼭대기보다 완전히 위에 있는 짧은 획은 먼저 찍는다.
    이 폰트는 줄기를 아래→위로 긋므로 점을 나중에 찍으면 부자연스럽다.
    't' 가로획은 줄기 중간 높이라 이 규칙에 안 걸리고 줄기 뒤에 온다."""
    strokes = sorted(strokes, key=arclen, reverse=True)
    if len(strokes) < 2:
        return strokes
    ys = [y for s in strokes for _, y in s]
    eps = 0.08 * (max(ys) - min(ys))
    top = max(y for _, y in strokes[0])  # 주 획(가장 긴 획)의 꼭대기 (font y-up)
    dots = [s for s in strokes[1:] if min(y for _, y in s) > top - eps]
    rest = [s for s in strokes[1:] if not any(s is d for d in dots)]
    return dots + [strokes[0]] + rest


def resample(poly, n):
    """호길이 등간격 n+1 점으로 리샘플."""
    total = arclen(poly)
    if total == 0:
        return None
    out, acc, j = [poly[0]], 0.0, 0
    step = total / n
    target = step
    while len(out) <= n - 1 and j < len(poly) - 1:
        seg = math.dist(poly[j], poly[j + 1])
        while acc + seg >= target and len(out) <= n - 1:
            t = (target - acc) / seg
            out.append((poly[j][0] + t * (poly[j + 1][0] - poly[j][0]),
                        poly[j][1] + t * (poly[j + 1][1] - poly[j][1])))
            target += step
        acc += seg
        j += 1
    out.append(poly[-1])
    return out


def curvature(p0, p1, p2):
    a, b = math.dist(p0, p1), math.dist(p1, p2)
    c = math.dist(p0, p2)
    if a * b * c < 1e-9:
        return 0.0
    cross = abs((p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]))
    return 2 * cross / (a * b * c)


def widths(pts, alpha, wmin=W_MIN, wmax=W_MAX):
    """샘플별 잉크 폭: 방향 규칙 × 속도 연동(α) → 이동평균 스무딩."""
    n = len(pts)
    # 단위 탄젠트 (중앙차분)
    tans = []
    for i in range(n):
        a, b = pts[max(i - 1, 0)], pts[min(i + 1, n - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        d = math.hypot(dx, dy) or 1.0
        tans.append((dx / d, dy / d))
    w_dir = [wmin + (wmax - wmin) * min(max(-ty, 0.0), 1.0) ** 1.2 for _, ty in tans]

    if alpha > 0:
        raw_v = []
        for i in range(n):
            k = max(curvature(pts[max(i - 1, 0)], pts[i], pts[min(i + 1, n - 1)]), 1e-6)
            raw_v.append(k ** -SPEED_P)
        med = sorted(raw_v)[n // 2] or 1.0
        w = [wd * min(max(v / med, 0.18), 5.0) ** -alpha for wd, v in zip(w_dir, raw_v)]
    else:
        w = w_dir

    # 이동평균 스무딩 (방향 전환점의 폭 튐 방지)
    sm = []
    for i in range(n):
        lo, hi = max(0, i - SMOOTH_WIN), min(n, i + SMOOTH_WIN + 1)
        sm.append(sum(w[lo:hi]) / (hi - lo))
    return [min(max(x, wmin * 0.6), wmax * 1.2) for x in sm]


def ink_polygon(pts, w):
    """센터라인 ± 법선 오프셋 → 자기교차 제거(buffer(0)) + 원형 캡 union."""
    n = len(pts)
    left, right = [], []
    for i in range(n):
        a, b = pts[max(i - 1, 0)], pts[min(i + 1, n - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        d = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / d, dx / d
        h = w[i] / 2
        left.append((pts[i][0] + nx * h, pts[i][1] + ny * h))
        right.append((pts[i][0] - nx * h, pts[i][1] - ny * h))
    strip = Polygon(left + right[::-1]).buffer(0)
    caps = [Point(*pts[0]).buffer(w[0] / 2, resolution=8),
            Point(*pts[-1]).buffer(w[-1] / 2, resolution=8)]
    return unary_union([strip, *caps]).simplify(0.5)


def geom_to_d(geom, tx, fy, s):
    """shapely 폴리곤(들) → SVG d (좌표 베이크: translate + y-flip + scale)."""
    polys = getattr(geom, "geoms", [geom])
    parts = []
    for poly in polys:
        for ring in [poly.exterior, *poly.interiors]:
            cs = [f"{(x + tx) * s:.1f},{fy(y) * s:.1f}" for x, y in list(ring.coords)[:-1]]
            parts.append("M" + cs[0] + "L" + " ".join(cs[1:]) + "Z")
    return " ".join(parts)


def pen_to_d(pts, tx, fy, s):
    dec = pts[::PEN_EVERY]
    if dec[-1] != pts[-1]:
        dec.append(pts[-1])
    coords = [f"{(x + tx) * s:.1f},{fy(y) * s:.1f}" for x, y in dec]
    return "M" + coords[0] + "L" + " ".join(coords[1:])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--alpha", type=float, default=0.0, help="속도-폭 연동 지수 (0=방향 규칙만)")
    ap.add_argument("--wmin", type=float, default=W_MIN, help="최소 잉크 폭 (font units)")
    ap.add_argument("--wmax", type=float, default=W_MAX, help="최대 잉크 폭 (font units)")
    ap.add_argument("--contrast", type=float, default=1.0,
                    help="폭 대비 배율: 평균 폭을 유지한 채 굵음↔가늚 진폭을 키움/줄임")
    ap.add_argument("--text", default=TEXT)
    ap.add_argument("--out", default=OUT)
    args = ap.parse_args()

    # --contrast: 평균 폭(중점)을 고정한 채 진폭만 스케일 (PRD §5.E "폭 대비")
    mid, half = (args.wmin + args.wmax) / 2, (args.wmax - args.wmin) / 2
    args.wmin = max(2.0, mid - half * args.contrast)  # 헤어라인 하한 2 font units
    args.wmax = mid + half * args.contrast

    f = TTFont(FONT)
    upm = f["head"].unitsPerEm
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    hmtx = f["hmtx"]
    asc, desc = f["hhea"].ascent, f["hhea"].descent
    space = hmtx["space"][0] if "space" in hmtx.metrics else int(upm * 0.3)

    pad = upm * 0.12
    s = TARGET_H / (asc - desc + 2 * pad)  # 폰트 단위 → 출력 단위
    fy = lambda y: (asc + pad - y)  # y-flip + 상단 패딩 (font units)

    x, strokes = 0.0, []  # strokes: (tx, 리샘플된 센터라인 점들)
    for ch in args.text:
        if ch == " ":
            x += space
            continue
        pen = RecordingPen()
        gs[cmap[ord(ch)]].draw(pen)
        glyph_strokes = [resample(p, SAMPLES) for p in flatten_commands(pen.value)]
        glyph_strokes = [g for g in glyph_strokes if g]
        # 필기 순서: 점 먼저(i/j) → 긴 획 → 나머지(t 가로획 등)
        strokes += [(x, g) for g in order_strokes(glyph_strokes)]
        x += hmtx[cmap[ord(ch)]][0]

    vb_w, vb_h = (x + 2 * pad) * s, TARGET_H
    inks, pens = [], []
    for i, (tx, pts) in enumerate(strokes):
        w = widths(pts, args.alpha, args.wmin, args.wmax)
        geom = ink_polygon(pts, w)
        assert geom.is_valid, f"stroke {i}: invalid geometry"
        inks.append(f"<path id='ink-{i}' d='{geom_to_d(geom, tx + pad, fy, s)}'/>")
        pens.append(f"<path id='pen-{i}' d='{pen_to_d(pts, tx + pad, fy, s)}'/>")

    mask_w = args.wmax * MASK_RATIO * s
    svg = (
        f"<svg viewBox='0 0 {vb_w:.1f} {vb_h:.1f}' xmlns='http://www.w3.org/2000/svg' "
        f"data-mask-width='{mask_w:.2f}' data-alpha='{args.alpha}'>\n"
        f"<g id='ink' fill='#2b2b2b'>\n" + "\n".join(inks) + "\n</g>\n"
        f"<g id='pen' fill='none' stroke='#2b2b2b' stroke-linecap='round' stroke-linejoin='round'>\n"
        + "\n".join(pens) + "\n</g>\n</svg>\n"
    )
    with open(args.out, "w") as fh:
        fh.write(svg)
    print(f"{args.out}: {len(strokes)} strokes, viewBox {vb_w:.0f}x{vb_h:.0f}, "
          f"mask-width {mask_w:.1f}, alpha {args.alpha}, {len(svg)//1024}KB")


if __name__ == "__main__":
    main()
