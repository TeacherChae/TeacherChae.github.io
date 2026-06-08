import { motion, useReducedMotion } from 'framer-motion';
import { heroCalligraphyLines } from './heroCalligraphy.js';

// 이름을 casual 손글씨(Caveat) 글리프 outline path 로 변환해 두고,
// framer-motion pathLength 로 한 글자씩 펜으로 써내려가듯 그린 뒤 fill 을 채운다.
// (Motion 권장: pathLength 0→1 = stroke draw-on)
// 연필/휘갈긴 느낌은 feTurbulence + feDisplacementMap 필터로 stroke 가장자리를 흔들어 준다.
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
      className="flex flex-col items-center [transform:rotate(-3.2deg)]"
      role="img"
      aria-label={label}
    >
      {/* 손그림 느낌 필터 정의(문서 전역에서 url(#...) 로 참조) */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <filter id="heroPencil" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
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
                ? 'my-[-0.7rem] block w-[min(15vw,84px)] overflow-visible'
                : 'block w-[min(84vw,460px)] overflow-visible'
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
                    strokeWidth={1.3}
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
