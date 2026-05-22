import { wedding } from '../../config/wedding.js';
import { CardFrame, FieldLabel } from './_shared.jsx';
import CalendarAdd from '../CalendarAdd.jsx';

function buildMapLinks(venue) {
  const q = encodeURIComponent(venue.name);
  return {
    naver: venue.naverMapUrl || `https://map.naver.com/v5/search/${q}`,
    kakao: venue.kakaoMapUrl || `https://map.kakao.com/?q=${q}`,
    google: venue.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`,
  };
}
const telHref = (tel) => `tel:${tel.replace(/[^0-9+]/g, '')}`;
const mapBtnClass =
  'rounded-sm border border-sage/40 bg-paper py-2.5 text-xs font-mono tracking-wider text-forest hover:bg-sage/10 transition text-center';

export default function TerminalMap() {
  const { venue, date, ticket } = wedding;
  const maps = buildMapLinks(venue);

  return (
    <section className="px-4 py-2">
      <CardFrame label={ticket.labels.terminalMap} serial={4}>
        <div className="text-center pt-1">
          <p className="font-script text-2xl text-sage-dark">Destination</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            location · 오시는 길
          </p>
        </div>

        <div className="mt-5">
          <FieldLabel en="Venue" ko="식장" />
          <p className="mt-1 text-lg text-forest font-medium">{venue.name}</p>
          <p className="mt-1 text-sm text-forest/80">{venue.address}</p>
          <a href={telHref(venue.tel)} className="mt-1 inline-block text-sm font-mono text-forest underline decoration-sage/40 underline-offset-4">
            {venue.tel}
          </a>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <FieldLabel en="Date" ko="날짜" />
            <p className="mt-1 font-mono text-sm text-forest">{date.short}</p>
          </div>
          <div>
            <FieldLabel en="Time" ko="시간" />
            <p className="mt-1 font-mono text-sm text-forest">11:00 KST</p>
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel en="Add to calendar" ko="일정 추가" />
          <CalendarAdd />
        </div>

        {/* 지도 placeholder */}
        <div className="mt-5 aspect-[5/3] w-full rounded-sm bg-sage/10 border border-sage/20 flex items-center justify-center text-forest/30 text-xs font-mono tracking-widest">
          MAP · 지도 임베드 예정
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <a href={maps.naver} target="_blank" rel="noreferrer" className={mapBtnClass}>네이버지도</a>
          <a href={maps.kakao} target="_blank" rel="noreferrer" className={mapBtnClass}>카카오맵</a>
          <a href={maps.google} target="_blank" rel="noreferrer" className={mapBtnClass}>구글 지도</a>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <details className="rounded-sm border border-sage/30 px-4 py-2.5">
            <summary className="cursor-pointer text-forest text-[13px] font-mono tracking-widest uppercase">
              Transit · 대중교통
            </summary>
            <p className="mt-2 text-forest/70 text-[13px]">지하철/버스 안내 (추후 작성)</p>
          </details>
          <details className="rounded-sm border border-sage/30 px-4 py-2.5">
            <summary className="cursor-pointer text-forest text-[13px] font-mono tracking-widest uppercase">
              Parking · 주차
            </summary>
            <p className="mt-2 text-forest/70 text-[13px]">주차 정보 (추후 작성)</p>
          </details>
        </div>
      </CardFrame>
    </section>
  );
}
