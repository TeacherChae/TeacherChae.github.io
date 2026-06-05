import { wedding } from '../../config/wedding.js';
import { Section } from './_shared.jsx';
import { Reveal, Stagger, StaggerItem } from './motion.jsx';

export default function Invitation() {
  const { scripture, greeting } = wedding;
  return (
    <Section title="모시는 글">
      <div className="mx-auto max-w-content text-center">
        <Reveal delay={0.1}>
          <p className="eyebrow">{scripture.ref}</p>
          <p className="mt-5 type-scripture text-ink/70">
            {scripture.lines.map((line) => <span key={line} className="block">{line}</span>)}
          </p>
        </Reveal>
        <div className="my-12 h-px bg-ink/10" />
        <Stagger className="space-y-2.5 type-verse text-ink/82">
          {greeting.map((line, i) => line
            ? <StaggerItem as="p" key={i}>{line}</StaggerItem>
            : <div key={i} className="h-3" />)}
        </Stagger>
      </div>
    </Section>
  );
}
