import { wedding } from '../../config/wedding.js';
import { Stagger, StaggerItem } from './motion.jsx';

export default function DateVenue() {
  const { groom, bride, date, venue } = wedding;
  return (
    <Stagger as="section" className="px-6 py-16 text-center">
      <StaggerItem as="p" className="eyebrow">THE WEDDING OF</StaggerItem>
      <StaggerItem as="h2" className="mt-5 font-display text-[48px] leading-none tracking-[-0.03em] text-ink">
        {bride.nameKo} & {groom.nameKo}
      </StaggerItem>
      <StaggerItem className="hairline" />
      <StaggerItem className="space-y-2 text-[15px] leading-relaxed text-ink/78">
        <p>{date.dayKo}</p>
        <p>{venue.name}</p>
        <p className="text-[13px] text-ink/50">{venue.address}</p>
      </StaggerItem>
      <StaggerItem as="p" className="mt-10 font-display text-[60px] leading-none tracking-[-0.05em] text-ink">
        SATURDAY
      </StaggerItem>
      <StaggerItem as="p" className="mt-3 font-mono text-[11px] tracking-editorial text-ink/55">{date.time}</StaggerItem>
    </Stagger>
  );
}
