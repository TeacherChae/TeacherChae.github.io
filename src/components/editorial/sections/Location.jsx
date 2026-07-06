import { useState } from 'react';
import { wedding } from '../../../config/wedding.js';
import CalendarAdd from '../../CalendarAdd.jsx';
import { SecondaryButton, Section } from '../ui/_shared.jsx';
import { Reveal } from '../ui/motion.jsx';
import VenueMap from '../map/VenueMap.jsx';
import { NaverIcon, KakaoIcon, GoogleMapIcon } from '../map/MapIcons.jsx';

function buildMapLinks(venue) {
  const q = encodeURIComponent(`${venue.name} ${venue.address}`);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}


function AccessGroup({ title, items }) {
  const [open, setOpen] = useState(false);
  const panelId = `access-${title.replace(/\s+/g, '-')}`;

  return (
    <div className="border-t border-ink/12 first:border-t-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="eyebrow text-ink/65">{title}</span>
        <span className="font-titleKo text-small text-ink/45" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <ul id={panelId} className="space-y-2 pb-6 text-left type-body text-ink/72">
          {items.map((item) => (
            <li key={item} className="flex gap-2 leading-loose">
              <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-ink/35" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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
          <SecondaryButton as="a" href={maps.naver} target="_blank" rel="noreferrer" className="gap-2.5">
            <NaverIcon className="h-[18px] w-[18px] shrink-0" /><span>NAVER MAP</span>
          </SecondaryButton>
          <SecondaryButton as="a" href={maps.kakao} target="_blank" rel="noreferrer" className="gap-2.5">
            <KakaoIcon className="h-[18px] w-[18px] shrink-0" /><span>KAKAO MAP</span>
          </SecondaryButton>
          <SecondaryButton as="a" href={maps.google} target="_blank" rel="noreferrer" className="gap-2.5">
            <GoogleMapIcon className="h-[18px] w-[13px] shrink-0" /><span>GOOGLE MAP</span>
          </SecondaryButton>
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-4">CALENDAR</p>
          <CalendarAdd label="ADD TO CALENDAR" />
        </div>

        {venue.access?.length > 0 && (
          <div className="mt-12 border-y border-ink/15">
            {venue.access.map((group) => (
              <AccessGroup key={group.title} title={group.title} items={group.items} />
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  );
}
