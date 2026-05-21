import { wedding } from '../config/wedding.js';

export default function Greeting() {
  const { greeting, groom, bride } = wedding;
  return (
    <section className="section text-center">
      <p className="section-label">invitation</p>
      <p className="section-title">소중한 분들을 모십니다</p>
      <div className="divider-leaf" />

      <div className="mt-8 space-y-3 text-[15px] leading-loose text-forest/90">
        {greeting.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="mt-10 text-sm text-forest/80 leading-relaxed">
        <p>
          {groom.father} · {groom.mother}
          <span className="mx-2 text-sage">|</span>
          <span className="text-forest">아들</span> {groom.nameKo}
        </p>
        <p className="mt-1">
          {bride.father} · {bride.mother}
          <span className="mx-2 text-sage">|</span>
          <span className="text-forest">딸</span> {bride.nameKo}
        </p>
      </div>
    </section>
  );
}
