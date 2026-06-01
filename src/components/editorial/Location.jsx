import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { wedding } from '../../config/wedding.js';
import { SecondaryButton, Section } from './_shared.jsx';

function buildMapLinks(venue) {
  const q = encodeURIComponent(`${venue.name} ${venue.address}`);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}

function splitIso(iso) {
  const [date, time] = iso.split('T');
  return { date, time };
}

function telHref(tel) {
  return `tel:${tel.replace(/[^0-9+]/g, '')}`;
}

export default function Location() {
  const { venue, date, groom, bride, share } = wedding;
  const maps = buildMapLinks(venue);
  const start = splitIso(date.iso);
  const end = splitIso(date.endIso);

  return (
    <Section title="LOCATION">
      <div className="mx-auto max-w-[390px] text-center">
        <p className="font-display text-[44px] leading-none tracking-[-0.035em] text-ink">{venue.name}</p>
        <p className="mt-6 text-[14px] leading-relaxed text-ink/65">{venue.address}</p>
        <a href={telHref(venue.tel)} className="mt-3 inline-block font-mono text-[10px] tracking-[0.22em] text-ink/45 underline underline-offset-4">
          {venue.tel}
        </a>

        <div className="mt-10 grid grid-cols-1 gap-3">
          <SecondaryButton as="a" href={maps.naver} target="_blank" rel="noreferrer">NAVER MAP</SecondaryButton>
          <SecondaryButton as="a" href={maps.kakao} target="_blank" rel="noreferrer">KAKAO MAP</SecondaryButton>
          <SecondaryButton as="a" href={maps.google} target="_blank" rel="noreferrer">GOOGLE MAP</SecondaryButton>
        </div>

        <div className="mt-12">
          <p className="eyebrow mb-4">CALENDAR</p>
          <AddToCalendarButton
            name={share.title}
            description={`${bride.nameKo} & ${groom.nameKo} 결혼식`}
            startDate={start.date}
            startTime={start.time}
            endDate={end.date}
            endTime={end.time}
            timeZone="Asia/Seoul"
            location={`${venue.name}, ${venue.address}`}
            options={['Apple', 'Google', 'iCal', 'Outlook.com']}
            buttonStyle="default"
            label="ADD TO CALENDAR"
            language="ko"
            lightMode="light"
            hideBackground
            hideCheckmark
            styleLight="
              --btn-background: transparent;
              --btn-text: #111111;
              --btn-border: #111111;
              --btn-border-radius: 0;
              --btn-shadow: none;
              --btn-font-weight: 500;
              --font: IBM Plex Mono, ui-monospace, monospace;
            "
          />
        </div>
      </div>
    </Section>
  );
}
