import { wedding } from '../../config/wedding.js';
import CalendarAdd from '../CalendarAdd.jsx';
import { SecondaryButton, Section } from './_shared.jsx';
import { Reveal } from './motion.jsx';
import VenueMap from './VenueMap.jsx';

function buildMapLinks(venue) {
  const q = encodeURIComponent(`${venue.name} ${venue.address}`);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}

export default function Location() {
  const { venue } = wedding;
  const maps = buildMapLinks(venue);
  return (
    <Section title="오시는 길">
      <Reveal className="mx-auto max-w-content text-center">
        <p className="type-quote text-ink">{venue.name}</p>
        <p className="mt-6 type-body text-ink/70">{venue.address}</p>

        {/* CARTO Voyager 타일 기반 Leaflet 지도(키 불필요). 길찾기는 아래 버튼이 담당. */}
        <div className="mt-8 aspect-[3/2] w-full overflow-hidden border border-ink/15">
          <VenueMap lat={venue.lat} lng={venue.lng} name={venue.name} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3">
          <SecondaryButton as="a" href={maps.naver} target="_blank" rel="noreferrer">NAVER MAP</SecondaryButton>
          <SecondaryButton as="a" href={maps.kakao} target="_blank" rel="noreferrer">KAKAO MAP</SecondaryButton>
          <SecondaryButton as="a" href={maps.google} target="_blank" rel="noreferrer">GOOGLE MAP</SecondaryButton>
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-4">CALENDAR</p>
          <CalendarAdd label="ADD TO CALENDAR" />
        </div>
      </Reveal>
    </Section>
  );
}
