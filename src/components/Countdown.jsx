import { useEffect, useState } from 'react';
import { wedding } from '../config/wedding.js';

// 목표 시각까지 남은 시간을 일/시/분/초로 분해.
function diff(target) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms / 3_600_000) % 24);
  const minutes = Math.floor((ms / 60_000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

// 식이 끝난 후 며칠 지났는지.
function daysSince(target) {
  return Math.floor((Date.now() - target.getTime()) / 86_400_000);
}

export default function Countdown() {
  const { date, groom, bride } = wedding;
  const target = new Date(date.iso);
  const [remaining, setRemaining] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(diff(target)), 1000);
    return () => clearInterval(id);
  }, []);

  // 식이 지났으면 "함께한 시간" 모드
  if (!remaining) {
    const since = daysSince(target);
    return (
      <section className="section text-center">
        <p className="section-label">married</p>
        <p className="section-title">함께한 시간</p>
        <div className="divider-leaf" />
        <p className="mt-6 font-script text-6xl text-sage-dark leading-none">{since + 1}</p>
        <p className="mt-2 text-xs tracking-widest2 text-forest/60">DAYS</p>
        <p className="mt-4 text-sm text-forest/80">
          {groom.nameKo} <span className="mx-1 text-sage">&</span> {bride.nameKo}
        </p>
      </section>
    );
  }

  const cells = [
    { label: 'DAYS', value: remaining.days },
    { label: 'HOURS', value: remaining.hours },
    { label: 'MIN', value: remaining.minutes },
    { label: 'SEC', value: remaining.seconds },
  ];

  return (
    <section className="section text-center">
      <p className="section-label">our day</p>
      <p className="section-title">결혼식까지</p>
      <div className="divider-leaf" />

      <div className="mt-6 grid grid-cols-4 gap-2">
        {cells.map((c) => (
          <div key={c.label} className="rounded-sm border border-sage/30 bg-white/60 py-3">
            <p className="text-2xl font-medium text-forest tabular-nums leading-none">
              {String(c.value).padStart(2, '0')}
            </p>
            <p className="mt-2 text-[10px] tracking-widest text-forest/50">{c.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-forest/80 leading-relaxed">
        {groom.nameKo} <span className="mx-1 text-sage">&</span> {bride.nameKo}의 결혼식이
        <br />
        <span className="text-sage-dark">D-{remaining.days}</span> 남았습니다.
      </p>
    </section>
  );
}
