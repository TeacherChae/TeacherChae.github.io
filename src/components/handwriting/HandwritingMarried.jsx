import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReduceMotion } from '../../lib/reduceMotion.js';
import { buildTimeMap, easeFromTimeMap, liftPause } from './strokeTiming.js';
// SVG를 raw 텍스트로 가져와 런타임 파싱한다. 글자를 코드에 박지 않으므로
// 문구/폰트를 바꿔 SVG를 재생성하면 그대로 반영된다(PRD §6).
import svgRaw from '../../../docs/fonts/svg/Wearegettingmarried-578431.svg?raw';

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
    // 실제 필기 순서 근사: 긴 획(줄기)을 먼저, 짧은 획(가로획·점)을 나중에.
    // 폰트 파일은 't'의 가로획을 줄기보다 앞에 두는데 그대로 그리면 거꾸로 쓰는 듯 보인다.
    if (subs.length > 1) subs.sort((a, b) => b.length - a.length);
    return subs.map((sd) => ({ d: sd.trim(), transform }));
  });
  return { viewBox, paths };
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
 * @param drama      곡률 효과 과장 정도(0.4~2 권장). 클수록 커브 감속과
 *                   획 간 휴지가 커진다. 'curvature' 모드에서만 의미 있음.
 */
export default function HandwritingMarried({
  pxPerSec = 700,
  overlap = 0.35,
  strokeWidth = 5,
  ink = '#2b2b2b',
  startDelay = 0.2,
  replayKey = 0,
  speedModel = 'curvature',
  drama = 1,
  forceMotion = false, // true면 prefers-reduced-motion 을 무시하고 강제로 애니메이션(데모 미리보기용)
  onComplete, // 마지막 획까지 다 그려졌을 때 1회 호출(부제/이름 등장 타이밍용)
  className,
}) {
  const systemReduce = useReduceMotion();
  const reduce = forceMotion ? false : systemReduce;
  const { viewBox, paths } = useMemo(() => parseSvg(svgRaw), []);

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
      const map = curvy && el ? buildTimeMap(el, { power: 0.5 * drama }) : null;
      const entry = { delay: cursor, duration, ease: map ? easeFromTimeMap(map) : undefined };
      if (curvy) {
        // 펜은 두 획을 동시에 못 긋는다: overlap 없이 순차 진행하고,
        // 획 사이에 진짜 휴지(최소 휴지 + 공중 이동 시간 × drama)를 둔다.
        // overlap 을 빼면 휴지가 겹침에 상쇄되어 화면에 보이지 않는다.
        cursor += duration;
        if (el && els[i + 1]) {
          cursor += liftPause(el, els[i + 1], paths[i]?.transform, paths[i + 1]?.transform, pxPerSec, drama);
        }
      } else {
        cursor += duration * (1 - overlap);
      }
      return entry;
    });
    setTimings(next);
  }, [pxPerSec, overlap, startDelay, replayKey, speedModel, drama, paths]);

  const shouldDraw = inView && !reduce;

  // 순차 delay 라 마지막 index 가 가장 늦게 끝난다 → 그 path 완료를 전체 완료로 본다.
  const handlePathDone = (i) => {
    if (i !== paths.length - 1) return;
    if (!(reduce || shouldDraw)) return; // 아직 그리기 시작 전(hidden→0)엔 무시
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

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
        <g key={replayKey} fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
          {paths.map((p, i) => {
            const t = timings?.[i];
            // 글자 가로 배치(translate)는 일반 <g>에 둔다. motion.path 에 transform 을
            // 직접 주면 framer-motion 이 style transform 으로 덮어써 배치가 깨질 수 있다.
            return (
              <g key={i} transform={p.transform}>
                <motion.path
                  ref={(el) => (pathRefs.current[i] = el)}
                  d={p.d}
                  strokeWidth={strokeWidth}
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
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
