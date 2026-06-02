import { wedding } from '../../config/wedding.js';
import { Section } from './_shared.jsx';
import { Reveal, Stagger, StaggerItem } from './motion.jsx';

export default function Invitation() {
  const { scripture, greeting } = wedding;
  return (
    <Section title="INVITATION">
      <div className="mx-auto max-w-[390px] text-center">
        <Reveal delay={0.1}>
          <p className="eyebrow">{scripture.ref}</p>
          <div className="mt-5 space-y-2 text-[12px] leading-loose text-ink/55">
            {scripture.lines.map((line) => <p key={line}>{line}</p>)}
          </div>
        </Reveal>
        <div className="my-12 h-px bg-ink/10" />
        <Stagger className="space-y-2.5 text-[15px] leading-[2.05] text-ink/82">
          {greeting.map((line, i) => line
            ? <StaggerItem as="p" key={i}>{line}</StaggerItem>
            : <div key={i} className="h-3" />)}
        </Stagger>
      </div>
    </Section>
  );
}
