import { useMemo, useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { SecondaryButton, Section } from './_shared.jsx';

export default function Gallery() {
  const { gallery } = wedding;
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const total = gallery.length;
  const current = gallery[index];

  const padded = useMemo(() => String(index + 1).padStart(2, '0'), [index]);
  const totalPadded = useMemo(() => String(total).padStart(2, '0'), [total]);

  function move(delta) {
    setIndex((i) => (i + delta + total) % total);
  }

  function handleTouchEnd(e) {
    if (touchStart == null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 42) move(diff > 0 ? 1 : -1);
    setTouchStart(null);
  }

  if (!current) return null;

  return (
    <Section title="GALLERY">
      <div className="mx-auto max-w-[390px]">
        <div className="mb-5 flex items-center justify-between font-mono text-[10px] tracking-[0.28em] text-ink/50">
          <span>{padded}</span>
          <span>/</span>
          <span>{totalPadded}</span>
        </div>
        <div
          className="aspect-[4/5] overflow-hidden bg-ink/5"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="h-full w-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SecondaryButton onClick={() => move(-1)}>PREV</SecondaryButton>
          <SecondaryButton onClick={() => move(1)}>NEXT</SecondaryButton>
        </div>
      </div>
    </Section>
  );
}
