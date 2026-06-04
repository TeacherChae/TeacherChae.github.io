import { wedding } from '../../config/wedding.js';
import CalendarAdd from '../CalendarAdd.jsx';
import { SecondaryButton, Section } from './_shared.jsx';
import { Reveal } from './motion.jsx';

function buildMapLinks(venue) {
  const q = encodeURIComponent(`${venue.name} ${venue.address}`);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}

function mapEmbedUrl(venue) {
  // 키 없이 동작하는 OpenStreetMap 임베드(시각적 위치 앵커용).
  // 실제 길찾기는 아래 네이버/카카오/구글 버튼으로 연결한다.
  const dx = 0.004;
  const dy = 0.0024;
  const bbox = `${venue.lng - dx},${venue.lat - dy},${venue.lng + dx},${venue.lat + dy}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${venue.lat},${venue.lng}`;
}

export default function Location() {
  const { venue } = wedding;
  const maps = buildMapLinks(venue);
  return (
    <Section title="LOCATION">
      <Reveal className="mx-auto max-w-content text-center">
        <p className="type-quote text-ink">{venue.name}</p>
        <p className="mt-6 type-body text-ink/65">{venue.address}</p>

        {/* 모노톤 톤에 맞춰 그레이스케일 처리한 지도 미리보기 */}
        <div className="mt-8 aspect-[3/2] w-full overflow-hidden border border-ink/15 grayscale">
          <iframe
            title={`${venue.name} 위치 지도`}
            src={mapEmbedUrl(venue)}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
