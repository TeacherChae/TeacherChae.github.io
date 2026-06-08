import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import Vivus from 'vivus';
import { heroCalligraphyLines } from './heroCalligraphy.js';

// Vivus 변형 — HeroCalligraphy.jsx(framer-motion pathLength)와 동일한 글리프 데이터를
// 쓰되, Vivus 의 stroke-dashoffset 드로잉으로 "한 글자씩 써내려가는" 효과를 낸다.
// 줄(JuGyeong → & → KeonHee)을 done 콜백으로 체이닝해 글자 순서대로 이어 그린다.
// 각 줄은 다 그려지면 .is-filled 가 붙어 fill 이 페이드인된다(index.css).

// 부제(날짜) 등장 타이밍에 쓰는 대략적 총 소요(초). Vivus duration 은 프레임 단위라
// 정확 매핑은 어렵고, 시각적으로 맞춘 근사값이다.
export const HERO_WRITE_DURATION = 3.6;

// 줄별 드로잉 길이(프레임). '&' 는 짧게.
const lineDuration = (line) => (line.text === '&' ? 16 : 80);

export default function HeroCalligraphyVivus({ label }) {
  const reduce = useReducedMotion();
  const refs = useRef([]);

  useEffect(() => {
    if (reduce) return; // 모션 최소화 선호 시: 정적 fill 만(아래 is-filled)
    let cancelled = false;
    const instances = [];
    const svgs = refs.current.filter(Boolean);

    const drawLine = (i) => {
      if (cancelled || i >= svgs.length) return;
      const svg = svgs[i];
      const v = new Vivus(
        svg,
        {
          type: 'oneByOne',
          duration: lineDuration(heroCalligraphyLines[i]),
          animTimingFunction: Vivus.EASE_OUT,
          start: 'autostart',
        },
        () => {
          if (cancelled) return;
          svg.classList.add('is-filled');
          drawLine(i + 1);
        },
      );
      instances.push(v);
    };
    drawLine(0);

    return () => {
      cancelled = true;
      instances.forEach((v) => v.destroy && v.destroy());
    };
  }, [reduce]);

  return (
    <div
      className="flex flex-col items-center [transform:rotate(-6deg)]"
      role="img"
      aria-label={label}
    >
      {/* 손그림 느낌 필터(문서 전역에서 url(#...) 로 참조) */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <filter id="heroPencilV" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {heroCalligraphyLines.map((line, i) => {
        const isAmp = line.text === '&';
        return (
          <svg
            key={line.text}
            ref={(el) => { refs.current[i] = el; }}
            viewBox={line.viewBox}
            aria-hidden="true"
            className={[
              'hero-vivus block overflow-visible',
              isAmp ? 'my-[-0.6rem] w-[min(13vw,72px)]' : 'w-[min(90vw,520px)]',
              reduce ? 'is-filled' : '',
            ].join(' ')}
          >
            <g filter="url(#heroPencilV)">
              {line.glyphs.map((g, gi) => (
                <path
                  key={gi}
                  d={g.d}
                  stroke="currentColor"
                  strokeWidth={0.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
