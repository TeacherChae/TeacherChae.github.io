# PRD — 청첩장 손글씨 캘리그래피 "써지는" 애니메이션

## 1. 배경 / 목적

웨딩 청첩장 웹사이트(GitHub Pages 호스팅)에 **"We are getting married"** 문구가
펜으로 직접 쓰이는 것처럼 한 글자씩 그려지는 애니메이션을 넣는다.

영상(GIF/mp4)이나 Lottie 마켓 애셋은 다음 이유로 배제했다:

- **GIF**: 1비트 투명도라 글자 가장자리 헤일로/계단 현상, 용량 문제.
- **Lottie 마켓 애셋**: 캘리그래피는 글자가 outline 셰이프로 굳어 있어 문구 수정 불가
  (영문→다른 문구 교체 불가).
- **한글 싱글라인 폰트**: 사실상 존재하지 않음 → 문구는 **영문**으로 확정.

결론적으로 **싱글라인/시그니처 폰트 → SVG path 변환 → 순수 SVG+CSS+JS 애니메이션**
경로를 택했다. 외부 라이브러리(Lottie 등) 의존성 0.

## 2. 핵심 개념 — 폰트 종류에 따라 애니메이션 기법이 다르다

이번 작업의 가장 중요한 제약. 폰트는 두 종류로 나뉘며, 각각 다른 기법을 써야 한다.

| 폰트 종류 | 글자 구조 | 애니메이션 기법 |
|---|---|---|
| **싱글라인 (centerline)** | 글자가 중심선 1개 패스. `fill:none`+`stroke` | `stroke-dashoffset` (진짜 펜 드로잉) ✅ |
| **외곽선 (filled outline)** | 글자가 윤곽선을 채운 fill 셰이프 | **마스크/클립 reveal** (왼→오 쓸어 드러내기) |

> ⚠️ 외곽선 폰트에 `stroke-dashoffset`을 쓰면 글자 **테두리만** 따라 그려져
> 부자연스럽다. 반드시 위 표대로 기법을 적용할 것.

### stroke-dashoffset 원리
패스의 dash 한 칸 길이를 패스 전체 길이와 같게 만들고, dashoffset을 그 길이만큼
밀면 선이 사라진다. offset을 0으로 줄이면 시작점→끝점으로 선이 차오른다.
센터라인 폰트라서 "펜이 지나간 길"이 곧 패스이므로 자연스럽게 써진다.

### 마스크 reveal 원리
완성된 fill 글자 위에, 왼쪽에서 오른쪽으로 폭이 늘어나는 사각형 마스크(clip)를
씌워 글자를 점진적으로 드러낸다. cursive가 좌→우로 흐르므로 "써지는" 것처럼 읽힌다.
글자별로 마스크 구간을 나누면 글자 단위 순차 reveal도 가능.

## 3. 에셋 (이미 생성됨)

문구는 모두 **"We are getting married"**, 색 `#2b2b2b`, 좌표계 변환 처리 완료.

| 파일 | 폰트 | 종류 | 기법 |
|---|---|---|---|
| `we_are_getting_married.svg` | Astutely Single Line | **싱글라인** | `stroke-dashoffset` |
| `HeyBeauty.svg` | Hey Beauty | 외곽선 | 마스크 reveal |
| `BestfriendSignature.svg` | Bestfriend Signature | 외곽선 | 마스크 reveal |
| `BakedSalmon.svg` | Baked Salmon | 외곽선 | 마스크 reveal |
| `Antically.svg` | Antically | 외곽선 | 마스크 reveal |

> 참고용 동작 예시: `we_are_getting_married.html` (Astutely 기반 stroke-dashoffset 완성본).

### SVG 구조
- 좌표계: 폰트는 y-up, SVG는 y-down → 최상위 `<g>`에
  `transform="translate(0, ascent) scale(1,-1)"`로 뒤집어 둠.
- **글자마다 개별 `<path>`**, 각 path에 `transform="translate(glyphX, 0)"`로 가로 배치.
  (글자 단위 순차 애니메이션을 위해 의도적으로 분리)
- 싱글라인 SVG: `<g ... fill="none" stroke="#2b2b2b" stroke-width=14 stroke-linecap=round>`
- 외곽선 SVG: `<g ... fill="#2b2b2b">` (stroke 없음)

## 4. 요구사항

### 기능
1. 폰트별로 **위 표의 기법**에 맞는 "써지는" 애니메이션을 각각 구현한다.
2. **글자 길이(또는 너비)에 비례한 타이밍** — 긴 글자는 오래, 짧은 글자는 짧게 그려져
   손글씨 리듬이 나게 한다. (균일 속도 금지)
3. 글자 간 **약간의 overlap**으로 이어쓰는 느낌을 준다.
4. **IntersectionObserver**로 해당 요소가 뷰포트에 들어올 때 **1회만** 재생.
5. 5개 폰트를 한 페이지에서 **나란히 비교**할 수 있는 데모 페이지를 제공한다
   (어떤 폰트를 최종 채택할지 고르기 위함).

### 비기능 / 제약
- **외부 라이브러리 금지.** 순수 HTML + CSS + vanilla JS. (GitHub Pages 정적 호스팅)
- **`prefers-reduced-motion: reduce`** 존중 → 애니메이션 없이 완성된 글씨를 즉시 표시.
- 모바일 대응(반응형 폭, `viewBox` 기반 스케일).
- 접근성: `<svg>`에 `aria-label="We are getting married"`.
- 조절 가능한 파라미터를 코드 상단에 상수로 노출:
  - 펜 속도 (`PX_PER_SEC` 또는 reveal duration)
  - 글자 overlap 정도 (`OVERLAP`)
  - 색 (`--ink` CSS 변수), 선 두께(`stroke-width`, 싱글라인만 해당)

## 5. 구현 참고 (Claude Code용)

### A. 싱글라인 (Astutely) — stroke-dashoffset
```js
const paths = [...svg.querySelectorAll('path')];
const len = paths.map(p => p.getTotalLength());
paths.forEach((p,i) => { p.style.strokeDasharray = len[i];
                         p.style.strokeDashoffset = len[i]; });
const PX_PER_SEC = 1100, OVERLAP = 0.2;
let t = 0;
paths.forEach((p,i) => {
  const dur = len[i] / PX_PER_SEC;
  p.style.transition = `stroke-dashoffset ${dur}s ease-in-out`;
  p.style.transitionDelay = `${t}s`;
  requestAnimationFrame(() => p.style.strokeDashoffset = 0);
  t += dur * (1 - OVERLAP);
});
```

### B. 외곽선 (나머지 4개) — 마스크 reveal
권장 방식: 글자별 fill path를 그대로 두고, **클립 사각형의 너비를 0→full로
애니메이션**. 글자별 순차로 하려면 각 글자 path를 개별 클립으로 감싸고
글자 x범위에 맞춘 사각형을 좌→우로 확장.

간단 버전(전체 한 번에 좌→우 reveal):
```html
<svg ...>
  <defs>
    <clipPath id="reveal"><rect x="..." y="..." width="0" height="..."/></clipPath>
  </defs>
  <g clip-path="url(#reveal)" fill="#2b2b2b"> ...glyph paths... </g>
</svg>
```
```js
const rect = svg.querySelector('#reveal rect');
const full = /* viewBox 전체 너비 */;
rect.style.transition = `width ${DURATION}s ease-in-out`;
requestAnimationFrame(() => rect.setAttribute('width', full)); // 또는 style.width
```
글자 단위 reveal은 각 `<path>`의 bbox를 `getBBox()`로 구해 글자별 clip rect를
좌→우 확장 + delay 누적.

> reduced-motion일 때: 싱글라인은 `stroke-dashoffset:0`, 외곽선은 clip rect를
> 처음부터 full width로 두면 완성 상태로 표시된다.

## 6. 산출물 (deliverables)

- 폰트별 애니메이션 모듈 5개 (또는 데이터 주도 1개 컴포넌트 + 설정).
- 5개를 세로로 나열해 동시에 비교하는 `compare.html` 데모.
- 청첩장 섹션에 그대로 이식 가능한 형태(자체 완결형 `<svg>`+`<script>` 스니펫).

## 7. 인수 기준 (acceptance criteria)

- [ ] Astutely는 펜으로 긋는 stroke 드로잉으로 자연스럽게 써진다.
- [ ] 나머지 4개는 reveal로 좌→우로 자연스럽게 나타난다(테두리만 그려지는 현상 없음).
- [ ] 글자 길이에 비례한 타이밍 + overlap으로 손글씨 리듬이 느껴진다.
- [ ] 스크롤로 진입 시 1회 재생, 재진입 시 중복 재생 안 함.
- [ ] `prefers-reduced-motion`에서 애니메이션 없이 완성 글씨 표시.
- [ ] 외부 의존성 0, GitHub Pages에서 그대로 동작.
- [ ] 모바일 폭에서 깨지지 않음.

## 8. 문구/폰트 변경 시 SVG 재생성 방법

폰트는 글자를 path로 "구워" 넣으므로 문구를 바꾸면 SVG를 다시 생성해야 한다.
아래 스크립트의 `TEXT`만 바꿔 실행(`pip install fonttools cairosvg`):

```python
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

TEXT = "We are getting married"   # <- 변경
FONT = "AstutelySingleLine-VGj3l.ttf"

f = TTFont(FONT); upm = f["head"].unitsPerEm
gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"]
asc, desc = f["hhea"].ascent, f["hhea"].descent
space = hmtx["space"][0] if "space" in hmtx.metrics else int(upm*0.3)
x, gp = 0, []
for ch in TEXT:
    if ch == " ": x += space; continue
    g = cmap[ord(ch)]; pen = SVGPathPen(gs); gs[g].draw(pen)
    if pen.getCommands(): gp.append((x, pen.getCommands()))
    x += hmtx[g][0]
pad = upm*0.12
vb = f"{-pad} {-pad} {x+pad*2} {asc-desc+pad*2}"
inner = "\n".join(f'<path d="{d}" transform="translate({gx},0)"/>' for gx,d in gp)
# 싱글라인: fill="none" stroke="#2b2b2b"; 외곽선: fill="#2b2b2b"
svg = f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,{asc}) scale(1,-1)" fill="none" stroke="#2b2b2b" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">{inner}</g></svg>'
open("out.svg","w").write(svg)
```

> 싱글라인이면 `fill="none" stroke=...`, 외곽선 폰트면 `fill="#2b2b2b"`(stroke 제거)로
> `<g>` 속성만 바꿔주면 된다. 새 폰트를 쓸 땐 'o'/'e'의 contour 개수로
> 종류를 먼저 판별할 것(1개=싱글라인, 2개+=외곽선).
