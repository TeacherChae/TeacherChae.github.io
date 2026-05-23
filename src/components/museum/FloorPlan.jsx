import { wedding } from '../../config/wedding.js';

function buildMapLinks(venue) {
  const q = encodeURIComponent(venue.name);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google:
      venue.googleMapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}

function VenueFloorPlan() {
  return (
    <svg
      width="100%"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Venue floor plan"
      className="w-full"
    >
      {/* Outer boundary */}
      <rect x="2" y="2" width="276" height="176" stroke="#2B2B2B" strokeWidth="1" fill="none" />

      {/* Hall A — Ceremony (highlighted) */}
      <rect x="2" y="2" width="140" height="120" stroke="#2B2B2B" strokeWidth="0.75" fill="#9C2B2E" fillOpacity="0.08" />
      <rect x="2" y="2" width="140" height="120" stroke="#9C2B2E" strokeWidth="1.5" fill="none" />

      {/* Hall B — Reception */}
      <rect x="142" y="2" width="136" height="120" stroke="#2B2B2B" strokeWidth="0.75" fill="none" />

      {/* Connecting corridor */}
      <rect x="2" y="122" width="276" height="56" stroke="#2B2B2B" strokeWidth="0.75" fill="none" />

      {/* Entrance arrow */}
      <line x1="110" y1="178" x2="170" y2="178" stroke="#9C2B2E" strokeWidth="2" />
      <polygon points="140,170 134,178 146,178" fill="#9C2B2E" />

      {/* Hall A label */}
      <text x="12" y="22" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="600" fill="#9C2B2E" letterSpacing="2">HALL A</text>
      <text x="12" y="34" fontFamily="Inter, system-ui, sans-serif" fontSize="6.5" fill="#2B2B2B" fillOpacity="0.6" letterSpacing="1">CEREMONY</text>

      {/* Altar marker */}
      <rect x="50" y="50" width="40" height="50" rx="1" stroke="#2B2B2B" strokeWidth="0.5" fill="#2B2B2B" fillOpacity="0.05" />
      <text x="70" y="79" fontFamily="Inter, system-ui, sans-serif" fontSize="5.5" fill="#2B2B2B" fillOpacity="0.5" textAnchor="middle" letterSpacing="0.5">ALTAR</text>

      {/* Seating rows — simplified lines */}
      {[95, 103, 111].map((y) => (
        <line key={y} x1="15" y1={y} x2="125" y2={y} stroke="#2B2B2B" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="3 2" />
      ))}

      {/* Hall B label */}
      <text x="152" y="22" fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="600" fill="#2B2B2B" fillOpacity="0.5" letterSpacing="2">HALL B</text>
      <text x="152" y="34" fontFamily="Inter, system-ui, sans-serif" fontSize="6.5" fill="#2B2B2B" fillOpacity="0.5" letterSpacing="1">RECEPTION</text>

      {/* Lobby label */}
      <text x="12" y="140" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fill="#2B2B2B" fillOpacity="0.45" letterSpacing="1.5">LOBBY &amp; FOYER</text>

      {/* Entrance label */}
      <text x="140" y="174" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fill="#9C2B2E" textAnchor="middle" letterSpacing="1">ENTRANCE</text>
    </svg>
  );
}

const linkClass =
  'block rounded-none border border-museum-ink/20 py-3 text-center text-[11px] uppercase tracking-[0.18em] text-museum-ink/60 transition hover:border-museum-accent hover:text-museum-accent';

export default function FloorPlan() {
  const { venue, date } = wedding;
  const maps = buildMapLinks(venue);

  return (
    <section
      className="bg-museum-cream px-8 py-16"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Section header */}
      <div className="mb-8 border-t border-museum-ink/20 pt-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-museum-ink/50">
          Plan Your Visit
        </p>
      </div>

      {/* Wing reference */}
      <div className="mb-6 space-y-3">
        <div className="flex items-baseline gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-museum-accent"
            style={{ minWidth: '3.5rem' }}
          >
            Hall A
          </span>
          <span
            className="text-sm text-museum-ink"
            style={{ fontFamily: '"Libre Caslon Display", "Playfair Display", serif' }}
          >
            The Ceremony &mdash; {venue.name}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-museum-ink/40"
            style={{ minWidth: '3.5rem' }}
          >
            Visiting
          </span>
          <span
            className="text-sm text-museum-ink/70"
            style={{ fontFamily: '"Libre Caslon Display", "Playfair Display", serif' }}
          >
            11:00 KST &mdash; {date.dayEn}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-museum-ink/40"
            style={{ minWidth: '3.5rem' }}
          >
            Address
          </span>
          <span className="text-xs text-museum-ink/60">{venue.address}</span>
        </div>
      </div>

      {/* SVG floor plan */}
      <div className="mb-8 border border-museum-ink/15 p-4">
        <VenueFloorPlan />
      </div>

      {/* Directions */}
      <div className="mb-6 border-t border-museum-ink/10 pt-5">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-museum-ink/50">
          오시는 길
        </p>
        <div className="grid grid-cols-3 gap-2">
          <a href={maps.naver} target="_blank" rel="noreferrer" className={linkClass}>
            네이버
          </a>
          <a href={maps.kakao} target="_blank" rel="noreferrer" className={linkClass}>
            카카오
          </a>
          <a href={maps.google} target="_blank" rel="noreferrer" className={linkClass}>
            Google
          </a>
        </div>
      </div>

      {/* Transport details */}
      <div className="space-y-2 text-xs text-museum-ink/55">
        <details className="border-t border-museum-ink/10 py-3">
          <summary
            className="cursor-pointer text-[10px] uppercase tracking-[0.22em] text-museum-ink/50 hover:text-museum-accent"
          >
            대중교통 안내
          </summary>
          <p className="mt-2 leading-relaxed">지하철 · 버스 안내 (추후 작성)</p>
        </details>
        <details className="border-t border-museum-ink/10 py-3">
          <summary
            className="cursor-pointer text-[10px] uppercase tracking-[0.22em] text-museum-ink/50 hover:text-museum-accent"
          >
            주차 안내
          </summary>
          <p className="mt-2 leading-relaxed">주차 정보 (추후 작성)</p>
        </details>
      </div>
    </section>
  );
}
