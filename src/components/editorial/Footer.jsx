import { wedding } from '../../config/wedding.js';
import { Reveal } from './motion.jsx';

export default function Footer() {
  const { motif } = wedding;
  return (
    <Reveal as="footer" className="px-6 py-24 text-center">
      <p className="font-display text-[20px] leading-[0.95] tracking-[-0.04em] text-ink">
        {motif.footer.map((line) => <span key={line} className="block">{line}</span>)}
      </p>
      <div className="hairline" />
      <p className="font-mono text-[10px] tracking-editorial text-ink/40">J & K · 2026</p>
    </Reveal>
  );
}
