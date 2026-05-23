import { wedding } from '../../config/wedding.js';
import ObjectSection from './ObjectSection.jsx';

/**
 * DateObject — wedding date presented as a single focal element.
 */
export function DateObject() {
  return (
    <ObjectSection title="DATE · 일시">
      {/* Primary date display */}
      <p className="font-serif-ko text-[32px] font-medium text-ink tracking-[0.04em] leading-none">
        2026 · 09 · 05
      </p>

      {/* Hairline divider */}
      <div className="my-5 w-12 border-t border-ink/20" />

      {/* Day + time */}
      <p className="text-[11px] tracking-[0.24em] uppercase text-ink/50 font-sans">
        Saturday&nbsp;&nbsp;11:00 KST
      </p>

      {/* Korean date line */}
      <p className="mt-3 text-[12px] tracking-[0.1em] text-ink/35 font-serif-ko">
        {wedding.date.dayKo}
      </p>
    </ObjectSection>
  );
}

/**
 * VenueObject — venue presented as a single focal element.
 */
export function VenueObject() {
  const { name, address, tel } = wedding.venue;

  return (
    <ObjectSection title="VENUE · 장소">
      {/* Venue name — large focal point */}
      <p className="font-serif-ko text-[22px] font-medium text-ink tracking-[0.04em] leading-snug text-center">
        {name}
      </p>

      {/* Hairline divider */}
      <div className="my-5 w-12 border-t border-ink/20" />

      {/* Address */}
      <p className="text-[11px] tracking-[0.1em] text-ink/45 font-sans leading-relaxed text-center">
        {address}
      </p>

      {/* Tel link */}
      <a
        href={`tel:${tel}`}
        className="mt-3 text-[11px] tracking-[0.14em] text-clay/70 font-sans hover:text-clay transition-colors"
      >
        {tel}
      </a>
    </ObjectSection>
  );
}
