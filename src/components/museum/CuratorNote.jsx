import { wedding } from '../../config/wedding.js';

export default function CuratorNote() {
  const { groom, bride, greeting } = wedding;

  // Build body text: use greeting lines from wedding.js if present, else placeholder
  const hasGreeting = Array.isArray(greeting) && greeting.length > 0;
  const bodyLines = hasGreeting
    ? greeting
    : [
        'Two lives, walked along separate paths, now converge in a single, shared direction.',
        'This exhibition presents not objects behind glass, but moments — accumulated quietly over years — now offered openly to those who have made both paths possible.',
        'We are grateful for your presence in our permanent collection.',
      ];

  return (
    <section
      className="bg-museum-cream px-8 py-16"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Wall-text header */}
      <div className="mb-8 border-t border-museum-ink/20 pt-6">
        <p
          className="text-[10px] uppercase tracking-[0.3em] text-museum-ink/50"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          From the Curator
        </p>
      </div>

      {/* Body — justified serif, generous line height */}
      <div
        className="space-y-5 text-[15px] leading-relaxed text-museum-ink/80"
        style={{
          fontFamily: '"Libre Caslon Display", "Playfair Display", serif',
          textAlign: 'justify',
          hyphens: 'auto',
        }}
        lang="ko"
      >
        {bodyLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Signature */}
      <div className="mt-10 border-t border-museum-ink/10 pt-6">
        <p
          className="text-sm text-museum-ink/60"
          style={{
            fontFamily: '"Libre Caslon Display", "Playfair Display", serif',
            fontStyle: 'italic',
          }}
        >
          &mdash;&nbsp;{groom.nameKo} &amp; {bride.nameKo}
        </p>
        <p
          className="mt-1 text-[10px] uppercase tracking-[0.22em] text-museum-ink/35"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          The Curators, Gallery Forever
        </p>
      </div>
    </section>
  );
}
