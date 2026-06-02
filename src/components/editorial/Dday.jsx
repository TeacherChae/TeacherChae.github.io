import { wedding } from '../../config/wedding.js';
import { Reveal } from './motion.jsx';

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 예식일까지 남은 일수(자정 기준). 지나면 D+N, 당일은 D-DAY.
function daysUntil(iso) {
  const target = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((startTarget - startToday) / 86400000);
}

export default function Dday() {
  const { date } = wedding;
  const days = daysUntil(date.iso);
  const label = days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${Math.abs(days)}`;
  const weekday = WEEKDAYS_KO[new Date(date.iso).getDay()];

  return (
    <Reveal as="section" className="px-6 pb-10 text-center">
      <p className="eyebrow">COUNTDOWN</p>
      <p className="mt-4 font-display text-[64px] leading-none tracking-[-0.04em] text-ink">{label}</p>
      <p className="mt-4 font-mono text-[11px] tracking-editorial text-ink/55">
        {date.short} · {weekday}요일
      </p>
    </Reveal>
  );
}
