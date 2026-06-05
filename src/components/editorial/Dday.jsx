import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { wedding } from '../../config/wedding.js';
import { Reveal } from './motion.jsx';

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 예식까지 남은 시간을 총 일수·시·분·초로 분해. 지난 뒤에는 전부 0으로 고정한다.
function remainingParts(targetIso) {
  const target = new Date(targetIso);
  let ms = Math.max(0, target - new Date());
  const d = Math.floor(ms / 86400000);
  ms -= d * 86400000;
  const h = Math.floor(ms / 3600000);
  ms -= h * 3600000;
  const mi = Math.floor(ms / 60000);
  ms -= mi * 60000;
  const s = Math.floor(ms / 1000);
  return { d, h, mi, s };
}

const pad = (n) => String(n).padStart(2, '0');

// 자릿수 하나 — 값이 바뀌면 플립 클록처럼 패널이 젖혀지며 넘어간다.
function FlipDigit({ ch }) {
  const reduce = useReducedMotion();
  return (
    <span
      className="relative inline-flex h-[1.35em] w-[0.72em] items-center justify-center overflow-hidden"
      style={{ perspective: '300px' }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={ch}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
          initial={reduce ? false : { rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={reduce ? undefined : { rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.3, 0.7, 0.4, 1] }}
        >
          {ch}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Dday() {
  const { date } = wedding;
  const [parts, setParts] = useState(() => remainingParts(date.iso));
  const weekday = WEEKDAYS_KO[new Date(date.iso).getDay()];

  useEffect(() => {
    const t = setInterval(() => setParts(remainingParts(date.iso)), 1000);
    return () => clearInterval(t);
  }, [date.iso]);

  // dd일 hh시간 mm분 ss초 — 숫자만 플립, 단위 라벨은 고정.
  const segs = [
    { value: pad(parts.d), unit: '일' },
    { value: pad(parts.h), unit: '시간' },
    { value: pad(parts.mi), unit: '분' },
    { value: pad(parts.s), unit: '초' },
  ];

  return (
    <Reveal as="section" className="px-6 pb-10 text-center">
      <p className="eyebrow">COUNTDOWN</p>
      <div
        role="timer"
        aria-label={`예식까지 ${parts.d}일 ${parts.h}시간 ${parts.mi}분 ${parts.s}초`}
        className="mt-4 flex items-center justify-center font-mono text-quote tracking-wide text-ink"
      >
        {segs.map(({ value, unit }) => (
          <span key={unit} className="flex items-center">
            {value.split('').map((ch, i) => (
              <FlipDigit key={i} ch={ch} />
            ))}
            <span className="ml-0.5 mr-1.5 font-sans text-small text-ink/45" aria-hidden="true">
              {unit}
            </span>
          </span>
        ))}
      </div>
      <p className="mt-4 type-meta text-ink/55">
        {date.short} · {weekday}요일
      </p>
    </Reveal>
  );
}
