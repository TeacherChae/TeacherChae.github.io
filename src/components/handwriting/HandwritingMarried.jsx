import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReduceMotion } from '../../lib/reduceMotion.js';
import { buildTimeMap, easeFromTimeMap, liftPause } from './strokeTiming.js';
// SVG를 raw 텍스트로 가져와 런타임 파싱한다. 글자를 코드에 박지 않으므로
// 문구/폰트를 바꿔 SVG를 재생성하면 그대로 반영된다(PRD §6).
import svgRaw from '../../../docs/fonts/svg/Wearegettingmarried-578431.svg?raw';
// 가변 폭 잉크 + 센터라인 2레이어 에셋 (scripts/generate_handwriting_svg.py 산출물).
// 폭 대비(--contrast)는 폴리곤에 구워지므로 단계별 에셋을 미리 생성해 전환한다.
import inkedRaw from '../../../docs/fonts/svg/wearegettingmarried_inked.svg?raw';
import inkedRawC15 from '../../../docs/fonts/svg/wearegettingmarried_inked_c15.svg?raw';
import inkedRawC20 from '../../../docs/fonts/svg/wearegettingmarried_inked_c20.svg?raw';

const INKED_RAWS = { 1: inkedRaw, 1.5: inkedRawC15, 2: inkedRawC20 };

// --- SVG 파싱: viewBox + 글자별 path(d, transform) 추출 -----------------
function parseSvg(raw) {
  const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox') || '0 0 648.1 150';
  const paths = [...svg.querySelectorAll('path')].flatMap((p) => {
    const transform = p.getAttribute('transform') || undefined;
    const d = p.getAttribute('d') || '';
    // 글리프 하나에 서브패스가 여러 개면('t'의 가로획, 'i'의 점) 펜 획 단위로
    // 쪼개 획마다 자기 duration/ease/펜 리프트 휴지를 받게 한다.
    // (이 SVG 는 절대좌표 M/C 만 쓰므로 'M' 경계 분리가 안전하다)
    const subs = d.match(/M[^M]+/g) || [d];
    // 필기 순서: 기본은 긴 획(줄기) 먼저. 단 'i'/'j'의 점처럼 줄기 꼭대기보다
    // 완전히 위에 있는 짧은 획은 먼저 찍는다(줄기를 아래→위로 긋는 폰트라
    // 점이 나중이면 부자연스럽다). 't' 가로획은 줄기 중간 높이라 줄기 뒤.
    let parts = subs.map((sd) => {
      const nums = (sd.match(/-?\d*\.?\d+/g) || []).map(Number);
      const ys = nums.filter((_, k) => k % 2 === 1);
      return { d: sd.trim(), len: sd.length, yMin: Math.min(...ys), yMax: Math.max(...ys) };
    });
    if (parts.length > 1) {
      parts.sort((a, b) => b.len - a.len);
      const eps =
        0.08 * (Math.max(...parts.map((p) => p.yMax)) - Math.min(...parts.map((p) => p.yMin)));
      // 화면 좌표는 y-down: "위에 있다" = yMax 가 주 획의 yMin(꼭대기)보다 작다
      const dots = parts.slice(1).filter((p) => p.yMax < parts[0].yMin + eps);
      const rest = parts.slice(1).filter((p) => !dots.includes(p));
      parts = [...dots, parts[0], ...rest];
    }
    return parts.map((p) => ({ d: p.d, transform }));
  });
  return { viewBox, paths };
}

// --- 2레이어(inked) SVG 파싱: pen(센터라인, 타이밍/마스크용) + ink(가변 폭 폴리곤) --
// 생성기가 획 분리·필기 순서 정렬을 끝낸 상태로 ink-N/pen-N 을 같은 순서로 내보낸다.
function parseInked(raw) {
  const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox') || '0 0 636 150';
  const maskWidth = parseFloat(svg.getAttribute('data-mask-width')) || 6;
  const paths = [...svg.querySelectorAll('#pen path')].map((p) => ({ d: p.getAttribute('d') }));
  const inks = [...svg.querySelectorAll('#ink path')].map((p) => p.getAttribute('d'));
  return { viewBox, paths, inks, maskWidth };
}

/**
 * "We are getting married" 손글씨 드로잉.
 * 싱글라인 SVG의 각 path를 pathLength 0→1로 그려 펜으로 쓰는 느낌을 낸다.
 *
 * @param pxPerSec   펜 속도(px/sec). 클수록 빠르게 그려진다.
 * @param overlap    글자 간 겹침(0~1). 클수록 이어쓰는 느낌, 전체는 빨라진다.
 * @param strokeWidth 선 두께(viewBox 단위).
 * @param ink        잉크 색.
 * @param startDelay 진입 후 첫 획까지 지연(sec).
 * @param replayKey  값이 바뀌면 처음부터 다시 그린다(데모 리플레이용).
 * @param speedModel 'curvature'(기본) = 곡률 기반 속도(PRD §5.C)
 *                   + 펜 리프트 휴지(획 간 시간차). 'uniform' = easeInOut.
 * @param curveDrama 커브 감속 과장(0.4~2 권장). 클수록 직선은 빨라지고
 *                   커브에서 더 기어간다. 'curvature' 모드 전용.
 * @param liftDrama  획 간 휴지 배율(0~3). 0이면 휴지 없음, 클수록 펜을
 *                   떼는 멈춤이 길어진다. 'curvature' 모드 전용.
 * @param variant    'centerline'(기본) = 균일 폭 stroke 드로잉.
 *                   'inked' = 가변 폭 잉크 폴리곤 + 센터라인 마스크 reveal(PRD §5.E).
 *                   타이밍·ease·휴지 로직은 두 모드가 완전히 공유한다.
 * @param texture    'inked' 전용. true면 feTurbulence 거친 잉크 가장자리 필터.
 * @param inkContrast 'inked' 전용. 획 안 굵음↔가늚 진폭(폭 대비) 단계: 1 | 1.5 | 2.
 *                   폭은 생성 단계에 폴리곤으로 구워지므로 단계별 에셋을 전환한다.
 *                   다른 값이 필요하면 생성기 --contrast 로 추가 생성.
 */
export default function HandwritingMarried({
  pxPerSec = 700,
  overlap = 0.35,
  strokeWidth = 5,
  ink = '#2b2b2b',
  startDelay = 0.2,
  replayKey = 0,
  speedModel = 'curvature',
  curveDrama = 1,
  liftDrama = 1,
  variant = 'centerline',
  texture = false,
  inkContrast = 1,
  forceMotion = false, // true면 prefers-reduced-motion 을 무시하고 강제로 애니메이션(데모 미리보기용)
  onComplete, // 마지막 획까지 다 그려졌을 때 1회 호출(부제/이름 등장 타이밍용)
  className,
}) {
  const systemReduce = useReduceMotion();
  const reduce = forceMotion ? false : systemReduce;
  const inked = variant === 'inked';
  const { viewBox, paths, inks, maskWidth } = useMemo(
    () => (inked ? parseInked(INKED_RAWS[inkContrast] || inkedRaw) : parseSvg(svgRaw)),
    [inked, inkContrast],
  );
  // 마스크/필터 id — 한 페이지에 인스턴스가 여러 개여도 충돌하지 않게
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });
  const pathRefs = useRef([]);
  const doneRef = useRef(false); // onComplete 중복 호출 방지
  const [timings, setTimings] = useState(null);

  // 마운트(및 파라미터/리플레이 변경) 후 각 path 실제 길이를 측정해
  // 길이 비례 duration + overlap 누적 delay 를 계산한다. (transform 무시한 로컬 길이)
  // speedModel='curvature' 면 추가로 곡률 기반 ease(획 내 속도 재분배)와
  // 펜 리프트 휴지(다음 획까지 공중 거리 비례)를 얹는다.
  useLayoutEffect(() => {
    doneRef.current = false;
    const els = pathRefs.current;
    const curvy = speedModel === 'curvature';
    let cursor = startDelay;
    const next = els.map((el, i) => {
      const len = el ? el.getTotalLength() : 0;
      const duration = Math.max(0.12, len / pxPerSec);
      const map = curvy && el ? buildTimeMap(el, { power: 0.5 * curveDrama }) : null;
      const entry = { delay: cursor, duration, ease: map ? easeFromTimeMap(map) : undefined };
      if (curvy) {
        // 펜은 두 획을 동시에 못 긋는다: overlap 없이 순차 진행하고,
        // 획 사이에 진짜 휴지(최소 휴지 + 공중 이동 시간 × liftDrama)를 둔다.
        // overlap 을 빼면 휴지가 겹침에 상쇄되어 화면에 보이지 않는다.
        cursor += duration;
        if (el && els[i + 1]) {
          cursor += liftPause(el, els[i + 1], paths[i]?.transform, paths[i + 1]?.transform, pxPerSec, liftDrama);
        }
      } else {
        cursor += duration * (1 - overlap);
      }
      return entry;
    });
    setTimings(next);
  }, [pxPerSec, overlap, startDelay, replayKey, speedModel, curveDrama, liftDrama, paths]);

  const shouldDraw = inView && !reduce;

  // 순차 delay 라 마지막 index 가 가장 늦게 끝난다 → 그 path 완료를 전체 완료로 본다.
  const handlePathDone = (i) => {
    if (i !== paths.length - 1) return;
    if (!(reduce || shouldDraw)) return; // 아직 그리기 시작 전(hidden→0)엔 무시
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  // 펜 획 하나의 motion.path — 두 variant 가 공유한다.
  // centerline 에선 보이는 잉크 stroke, inked 에선 마스크 속 흰 stroke 역할.
  const renderPen = (p, i, visual) => {
    const t = timings?.[i];
    return (
      <motion.path
        ref={(el) => (pathRefs.current[i] = el)}
        d={p.d}
        {...visual}
        // round 캡은 pathLength 0 에서도 시작점에 점을 찍는다("round line-cap dots").
        // 그래서 자기 차례(t.delay) 전까지 opacity 0 으로 숨겼다가 그릴 때 켠다.
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        animate={{
          pathLength: reduce || shouldDraw ? 1 : 0,
          opacity: reduce || shouldDraw ? 1 : 0,
        }}
        transition={
          t
            ? {
                pathLength: {
                  duration: t.duration,
                  delay: t.delay,
                  // 곡률 모드면 시간 테이블에서 만든 커스텀 ease (PRD §5.C)
                  ease: t.ease ?? 'easeInOut',
                },
                // 획이 시작되는 순간 즉시 보이게(점이 곧 펜 끝이 됨)
                opacity: { duration: 0.001, delay: t.delay },
              }
            : { duration: 0 }
        }
        onAnimationComplete={() => handlePathDone(i)}
      />
    );
  };

  const [vbW, vbH] = viewBox.split(/\s+/).slice(2).map(Number);

  return (
    <div ref={containerRef} className={className}>
      <svg
        viewBox={viewBox}
        width="100%"
        role="img"
        aria-label="We are getting married"
        style={{ display: 'block', height: 'auto', overflow: 'visible' }}
      >
        {/* key={replayKey}: 리플레이 시 그룹을 리마운트해 처음부터 다시 그린다 */}
        {inked ? (
          <g key={replayKey}>
            <defs>
              {texture && (
                <filter id={`${uid}rough`} x="-5%" y="-5%" width="110%" height="110%">
                  {/* 거친 잉크 가장자리 — 정적 잉크 레이어에만 적용 (PRD §5.E) */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              )}
              {paths.map((p, i) => (
                // 획마다 자기 마스크: 굵은 흰 센터라인 stroke 가 펜 길을 따라 차오르며
                // 아래의 가변 폭 잉크를 드러낸다("mask reveal along path").
                <mask
                  key={i}
                  id={`${uid}m${i}`}
                  maskUnits="userSpaceOnUse"
                  x={-maskWidth}
                  y={-maskWidth}
                  width={vbW + maskWidth * 2}
                  height={vbH + maskWidth * 2}
                >
                  {renderPen(p, i, {
                    fill: 'none',
                    stroke: '#fff',
                    strokeWidth: maskWidth,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                  })}
                </mask>
              ))}
            </defs>
            <g fill={ink} filter={texture ? `url(#${uid}rough)` : undefined}>
              {inks.map((d, i) => (
                <path key={i} d={d} mask={`url(#${uid}m${i})`} />
              ))}
            </g>
          </g>
        ) : (
          <g key={replayKey} fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
            {paths.map((p, i) => (
              // 글자 가로 배치(translate)는 일반 <g>에 둔다. motion.path 에 transform 을
              // 직접 주면 framer-motion 이 style transform 으로 덮어써 배치가 깨질 수 있다.
              <g key={i} transform={p.transform}>
                {renderPen(p, i, { strokeWidth })}
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
