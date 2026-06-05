import { wedding } from '../../config/wedding.js';
import { Stagger, StaggerItem } from './motion.jsx';

export default function DateVenue() {
  const { groom, bride, date, venue } = wedding;
  return (
    <Stagger as="section" className="px-6 py-16 text-center">
      <StaggerItem as="p" className="eyebrow">THE WEDDING OF</StaggerItem>
      <StaggerItem as="h2" className="mt-5 type-title text-ink">
        {bride.nameKo} & {groom.nameKo}
      </StaggerItem>
      <StaggerItem className="hairline" />
      <StaggerItem className="space-y-2 type-body text-ink/78">
        <p>{date.dayKo}</p>
        <p>{venue.name}</p>
        <p className="text-small text-ink/50">{venue.address}</p>
      </StaggerItem>
    </Stagger>
  );
}
