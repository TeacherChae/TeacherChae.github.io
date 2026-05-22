import { wedding } from '../config/wedding.js';
import CalendarAdd from './CalendarAdd.jsx';

// 길찾기 deep link. 모바일에서 앱 설치돼 있으면 자동으로 앱이 열림.
function buildMapLinks(venue) {
  const q = encodeURIComponent(venue.name);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}

// 전화번호의 숫자만 추출 — tel: 스킴에는 하이픈/공백이 안전하긴 하지만 깔끔하게.
function telHref(tel) {
  return `tel:${tel.replace(/[^0-9+]/g, '')}`;
}

const mapBtnClass =
  'rounded-sm border border-sage/40 bg-white/60 py-3 text-xs text-forest hover:bg-sage/10 transition text-center';

export default function Location() {
  const { venue, date } = wedding;
  const maps = buildMapLinks(venue);

  return (
    <section className="section text-center">
      <p className="section-label">location</p>
      <p className="section-title">오시는 길</p>
      <div className="divider-leaf" />

      <div className="mt-6 space-y-1 text-[15px]">
        <p className="text-lg font-medium">{venue.name}</p>
        <p className="mt-3 text-sm text-forest/80">{venue.address}</p>
        <a
          href={telHref(venue.tel)}
          className="inline-block text-sm text-forest/60 underline decoration-sage/40 underline-offset-4 hover:text-sage-dark"
        >
          {venue.tel}
        </a>
      </div>

      <p className="mt-6 text-sm tracking-wide text-sage-dark">{date.dayKo}</p>

      <CalendarAdd />

      <div className="mt-6 aspect-[4/3] w-full rounded-sm bg-sage/10 border border-sage/20 flex items-center justify-center text-forest/30 text-sm">
        지도 (네이버/카카오 지도 임베드 예정)
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a href={maps.naver} target="_blank" rel="noreferrer" className={mapBtnClass}>
          네이버 지도
        </a>
        <a href={maps.kakao} target="_blank" rel="noreferrer" className={mapBtnClass}>
          카카오맵
        </a>
        <a href={maps.google} target="_blank" rel="noreferrer" className={mapBtnClass}>
          구글 지도
        </a>
      </div>

      <div className="mt-8 text-left text-sm space-y-3 text-forest/80">
        <details className="rounded-sm border border-sage/30 px-4 py-3">
          <summary className="cursor-pointer text-forest">대중교통</summary>
          <p className="mt-2 text-forest/70">지하철/버스 안내 (추후 작성)</p>
        </details>
        <details className="rounded-sm border border-sage/30 px-4 py-3">
          <summary className="cursor-pointer text-forest">주차 안내</summary>
          <p className="mt-2 text-forest/70">주차 정보 (추후 작성)</p>
        </details>
      </div>
    </section>
  );
}
