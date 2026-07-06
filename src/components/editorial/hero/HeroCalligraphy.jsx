import { motion, useReducedMotion } from 'framer-motion';
import { heroCalligraphyLines } from './heroCalligraphy.js';

// 이름을 얇고 우아한 script(Sacramento) 글리프 outline path 로 변환해 두고,
// framer-motion pathLength 로 한 글자씩 펜으로 써내려가듯 그린 뒤 fill 을 채운다.
// (Motion 권장: pathLength 0→1 = stroke draw-on)
// 연필 텍스처는 feTurbulence + feDisplacementMap 필터로 — 단, scale 을 낮게 둬서
// 가장자리에 미세한 결만 주고 글자가 삐뚤빼뚤해지지 않게 한다.
// (best practice: Camillo Visini / Codrops 의 hand-drawn SVG filter)
const BASE = 0.45; // 첫 글자 시작 지연(초)
const STEP = 0.15; // 글자 간 간격
const DRAW = 0.6; // 한 글자 stroke 그리는 시간
const FILL = 0.5; // fill fade-in 시간

// 마지막 글자가 다 채워지는 대략적 시점 — 부제(날짜) 등장 타이밍에 사용.
export const HERO_WRITE_DURATION =
  BASE + (heroCalligraphyLines.reduce((n, l) => n + l.glyphs.length, 0) - 1) * STEP + DRAW * 0.55 + FILL;

export default function HeroCalligraphy({ label }) {
  const reduce = useReducedMotion();

  // 줄 경계를 넘어 왼→오, 위→아래로 이어 써지도록 연속 순번을 부여한다.
  let order = 0;
  const lines = heroCalligraphyLines.map((line) => ({
    ...line,
    glyphs: line.glyphs.map((g) => ({ d: g.d, i: order++ })),
  }));

  return (
    <div
      className="flex flex-col items-center [transform:rotate(-6deg)]"
      role="img"
      aria-label={label}
    >
      {/* 손그림 느낌 필터 정의(문서 전역에서 url(#...) 로 참조) */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <filter id="heroPencil" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {lines.map((line) => {
        const isAmp = line.text === '&';
        return (
          <svg
            key={line.text}
            viewBox={line.viewBox}
            aria-hidden="true"
            className={
              isAmp
                ? 'my-[-0.6rem] block w-[min(13vw,72px)] overflow-visible'
                : 'block w-[min(90vw,520px)] overflow-visible'
            }
            fill="currentColor"
            stroke="currentColor"
          >
            <g filter="url(#heroPencil)">
              {line.glyphs.map((g) => {
                const delay = BASE + g.i * STEP;
                return (
                  <motion.path
                    key={g.i}
                    d={g.d}
                    strokeWidth={0.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={reduce ? { fillOpacity: 1 } : { pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            pathLength: { delay, duration: DRAW, ease: 'easeInOut' },
                            fillOpacity: { delay: delay + DRAW * 0.55, duration: FILL, ease: 'easeOut' },
                          }
                    }
                  />
                );
              })}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
