import { wedding } from '../../config/wedding.js';
import { Reveal } from './motion.jsx';

export default function Footer() {
  const { motif } = wedding;
  return (
    <Reveal as="footer" className="px-6 py-24 text-center">
      <p className="type-quote font-scripture leading-footer-quote text-ink">
        {motif.footer.map((line) => <span key={line} className="block">{line}</span>)}
      </p>
      <div className="hairline" />
      <p className="type-overline text-ink/40">J & K · 2026</p>
    </Reveal>
  );
}
