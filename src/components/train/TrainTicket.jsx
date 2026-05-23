import { wedding } from '../../config/wedding.js';

// Derive 3-letter station codes from romanized surnames
// Groom: KeonHee Chae → CHE  |  Bride: JuKyeong Lee → LEE
const GROOM_CODE = 'CHE';
const BRIDE_CODE = 'LEE';

export default function TrainTicket() {
  const { groom, bride, date, venue } = wedding;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-train-paper px-4 py-12">
      {/* Outer ticket wrapper — perforated edge illusion via dashed border */}
      <div className="relative w-full max-w-page rounded-lg overflow-hidden shadow-2xl border-2 border-dashed border-ktx-navy/30">

        {/* ── HEADER BAR (KORAIL turquoise) ── */}
        <div className="bg-ktx-navy px-5 py-3 flex items-center justify-between">
          {/* KORAIL logotype placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-korail-turquoise flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-none">K</span>
            </div>
            <span className="text-korail-turquoise font-bold tracking-widest text-sm uppercase">
              KORAIL
            </span>
          </div>
          <span className="text-white/60 text-xs tracking-widest uppercase">승차권 · Ticket</span>
        </div>

        {/* ── TICKET BODY (train-paper) ── */}
        <div className="bg-train-paper px-5 pt-6 pb-4 relative">

          {/* Hand-stamped date — overlapping at angle */}
          <div
            className="absolute top-4 right-4 z-10 border-2 border-stamp-purple/80 rounded px-3 py-1 rotate-[-8deg] select-none pointer-events-none"
            style={{ fontFamily: '"Nanum Myeongjo", serif' }}
          >
            <span className="text-stamp-purple font-bold text-base tracking-wide">2026.09.05</span>
          </div>

          {/* Train number */}
          <p className="text-ktx-navy/50 text-xs tracking-widest uppercase mb-4 font-mono">
            KTX 2026 EXP · 특실
          </p>

          {/* FROM → TO station codes */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex flex-col items-start">
              <span className="text-ktx-navy/40 text-[10px] tracking-widest uppercase font-mono">FROM · 출발</span>
              <span className="text-ktx-navy font-black text-5xl tracking-tight leading-none" style={{ fontFamily: 'monospace' }}>
                {GROOM_CODE}
              </span>
              <span
                className="text-ktx-navy/70 text-sm mt-1"
                style={{ fontFamily: '"Nanum Myeongjo", serif' }}
              >
                {groom.nameKo} 역
              </span>
            </div>

            {/* Arrow / rail divider */}
            <div className="flex-1 flex flex-col items-center gap-1 pb-4">
              <div className="w-full h-px bg-ktx-navy/20" />
              <span className="text-korail-turquoise text-xl">→</span>
              <div className="w-full h-px bg-ktx-navy/20" />
            </div>

            <div className="flex flex-col items-end">
              <span className="text-ktx-navy/40 text-[10px] tracking-widest uppercase font-mono">TO · 도착</span>
              <span className="text-ktx-navy font-black text-5xl tracking-tight leading-none" style={{ fontFamily: 'monospace' }}>
                {BRIDE_CODE}
              </span>
              <span
                className="text-ktx-navy/70 text-sm mt-1"
                style={{ fontFamily: '"Nanum Myeongjo", serif' }}
              >
                {bride.nameKo} 역
              </span>
            </div>
          </div>

          {/* Full names */}
          <div className="mt-4 flex justify-between text-ktx-navy/60 text-xs font-mono tracking-wider">
            <span>{groom.nameEn}</span>
            <span>{bride.nameEn}</span>
          </div>

          {/* Divider — perforated tear line */}
          <div className="my-5 border-t-2 border-dashed border-ktx-navy/20" />

          {/* Car / Row / Seat grid */}
          <div className="grid grid-cols-3 gap-px bg-ktx-navy/10 rounded overflow-hidden text-center mb-5">
            {[
              { label: 'TRAIN · 열차', value: 'KTX-2026' },
              { label: 'CAR · 호',    value: '1호' },
              { label: 'SEAT · 좌석',  value: '가-나' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-train-paper px-2 py-3">
                <p className="text-[9px] tracking-widest text-ktx-navy/40 uppercase font-mono mb-1">{label}</p>
                <p className="text-ktx-navy font-bold text-sm font-mono">{value}</p>
              </div>
            ))}
          </div>

          {/* Venue + date row */}
          <div className="flex justify-between text-[11px] text-ktx-navy/60 font-mono">
            <span>{venue.name}</span>
            <span>{date.short} 11:00</span>
          </div>
        </div>

        {/* ── MAGNETIC STRIP BOTTOM ── */}
        <div className="h-8 bg-gradient-to-r from-ktx-navy via-ktx-navy/80 to-ktx-navy flex items-center px-4">
          {/* Simulated magnetic track dots */}
          <div className="flex gap-[3px] items-center">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] h-3 rounded-sm"
                style={{ backgroundColor: i % 3 === 0 ? '#00C4B3' : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
