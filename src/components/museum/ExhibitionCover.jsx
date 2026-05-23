import { wedding } from '../../config/wedding.js';

function FloorPlanMiniature() {
  return (
    <svg
      width="72"
      height="54"
      viewBox="0 0 72 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gallery floor plan miniature"
    >
      {/* Outer walls */}
      <rect x="1" y="1" width="70" height="52" stroke="#2B2B2B" strokeWidth="0.75" fill="none" />
      {/* Hall A — Ceremony (left wing) */}
      <rect x="1" y="1" width="34" height="30" stroke="#2B2B2B" strokeWidth="0.5" fill="#9C2B2E" fillOpacity="0.12" />
      {/* Hall B — Reception (right wing) */}
      <rect x="35" y="1" width="36" height="30" stroke="#2B2B2B" strokeWidth="0.5" fill="none" />
      {/* Lower corridor */}
      <rect x="1" y="31" width="70" height="22" stroke="#2B2B2B" strokeWidth="0.5" fill="none" />
      {/* Entrance marker */}
      <line x1="28" y1="53" x2="44" y2="53" stroke="#9C2B2E" strokeWidth="1.5" />
      {/* Room labels — tiny */}
      <text x="4" y="11" fontFamily="Inter, system-ui, sans-serif" fontSize="4" fill="#2B2B2B" letterSpacing="0.5">A</text>
      <text x="38" y="11" fontFamily="Inter, system-ui, sans-serif" fontSize="4" fill="#2B2B2B" letterSpacing="0.5">B</text>
      <text x="4" y="42" fontFamily="Inter, system-ui, sans-serif" fontSize="4" fill="#2B2B2B" letterSpacing="0.5">LOBBY</text>
    </svg>
  );
}

export default function ExhibitionCover() {
  const { groom, bride, date } = wedding;
  const groomSurname = groom.nameEn.split(' ').pop();
  const brideSurname = bride.nameEn.split(' ').pop();

  return (
    <section
      className="relative flex min-h-screen flex-col justify-between bg-museum-cream px-8 py-10"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Top: institution name */}
      <header className="flex items-start justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] text-museum-ink/60"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Gallery Forever &middot; Seoul
        </p>
        {/* Red accent dot */}
        <span
          className="mt-1 block h-2 w-2 rounded-full"
          style={{ backgroundColor: '#9C2B2E' }}
          aria-hidden="true"
        />
      </header>

      {/* Middle: exhibition title block */}
      <div className="flex flex-col gap-4">
        {/* Hairline rule */}
        <div className="h-px w-full bg-museum-ink/20" />

        <p
          className="text-[11px] uppercase tracking-[0.3em] text-museum-ink/50"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Permanent Collection &mdash; No. 2026
        </p>

        {/* Massive display title */}
        <h1
          className="leading-none text-museum-ink"
          style={{
            fontFamily: '"Libre Caslon Display", "Playfair Display", serif',
            fontSize: 'clamp(42px, 11vw, 68px)',
            fontWeight: 400,
          }}
        >
          {groomSurname} &amp; {brideSurname}
        </h1>

        <h2
          className="text-museum-ink/70"
          style={{
            fontFamily: '"Libre Caslon Display", "Playfair Display", serif',
            fontSize: 'clamp(16px, 4vw, 22px)',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          A Permanent Collection
        </h2>

        {/* Hairline rule */}
        <div className="h-px w-full bg-museum-ink/20" />

        {/* Date range */}
        <p
          className="text-xs uppercase tracking-[0.22em] text-museum-ink/60"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          5 September 2026
        </p>
      </div>

      {/* Bottom: floor plan miniature + admission note */}
      <footer className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p
            className="text-[10px] uppercase tracking-[0.2em] text-museum-ink/40"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Floor Plan
          </p>
          <FloorPlanMiniature />
        </div>

        <div className="text-right">
          <p
            className="text-[10px] uppercase tracking-[0.18em] text-museum-ink/40"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Admission
          </p>
          <p
            className="mt-0.5 text-xs text-museum-ink/60"
            style={{ fontFamily: '"Libre Caslon Display", "Playfair Display", serif', fontStyle: 'italic' }}
          >
            By invitation only
          </p>
        </div>
      </footer>
    </section>
  );
}
