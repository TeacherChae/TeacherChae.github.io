import { wedding } from '../../config/wedding.js';
import { CardFrame, FieldLabel } from './_shared.jsx';

export default function WelcomeLetter() {
  const { greeting, groom, bride, ticket } = wedding;

  return (
    <section className="px-4 py-2">
      <CardFrame label={ticket.labels.welcome} serial={2}>
        <div className="pt-1 text-center">
          <p className="font-script text-3xl text-sage-dark">Welcome aboard</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            invitation · 모시는 글
          </p>
        </div>

        <div className="mt-6 space-y-2.5 text-[15px] leading-loose text-forest/90 text-center">
          {greeting.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="mt-7 border-t border-forest/10 pt-5">
          <FieldLabel en="Sent by" ko="혼주" />
          <div className="mt-2 grid grid-cols-2 gap-3 text-[13px] text-forest/85">
            <div>
              <p className="text-forest/55 text-[11px] font-mono">GROOM · 신랑측</p>
              <p className="mt-1">{groom.father} · {groom.mother}</p>
              <p className="mt-0.5">
                <span className="text-forest/60">아들</span> {groom.nameKo}
              </p>
            </div>
            <div>
              <p className="text-forest/55 text-[11px] font-mono">BRIDE · 신부측</p>
              <p className="mt-1">{bride.father} · {bride.mother}</p>
              <p className="mt-0.5">
                <span className="text-forest/60">딸</span> {bride.nameKo}
              </p>
            </div>
          </div>
        </div>
      </CardFrame>
    </section>
  );
}
