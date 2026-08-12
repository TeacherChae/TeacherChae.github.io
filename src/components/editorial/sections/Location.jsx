import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../../config/wedding.js';
import CalendarAdd from '../../CalendarAdd.jsx';
import { useReduceMotion } from '../../../lib/reduceMotion.js';
import { PrimaryButton, SecondaryButton, Section } from '../ui/_shared.jsx';
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

function parkingMapUrl(name) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(name)}`;
}

function RouteList({ items }) {
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/15">
      {items.map(({ route, detail }) => (
        <div key={route} className="py-4">
          <p className="type-body font-medium text-ink">{route}</p>
          <p className="mt-1 text-small leading-relaxed text-ink/60">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function ParkingList({ title, items }) {
  return (
    <div className="mt-7">
      <h4 className="eyebrow mb-3 text-ink/55">{title}</h4>
      <div className="divide-y divide-ink/10 border-y border-ink/15">
        {items.map((parking) => (
          <a
            key={parking.name}
            href={parkingMapUrl(parking.name)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 py-4 text-left transition hover:bg-ink/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/60"
            aria-label={`${parking.name} 지도에서 보기`}
          >
            <span className="type-body text-ink">{parking.name}</span>
            <span className="shrink-0 text-right text-micro leading-relaxed text-ink/55">
              {parking.spaces}대<br />예식장까지 {parking.distance}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TransportDialog({ open, onClose, triggerRef }) {
  const reduce = useReduceMotion();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const { transport } = wedding.venue;
  const publicParking = transport.parking.filter(({ group }) => group === 'public');
  const otherParking = transport.parking.filter(({ group }) => group === 'other');

  const close = useCallback(() => {
    onClose();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onClose, triggerRef]);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('button, a[href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/45 sm:items-center sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="transport-dialog-title"
            className="flex max-h-[90dvh] w-full max-w-page flex-col bg-paper shadow-2xl sm:max-h-[85vh]"
            initial={reduce ? false : { y: 48 }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: 48 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-ink/15 px-6 py-5">
              <h2 id="transport-dialog-title" className="type-kicker text-ink">교통 · 주차 안내</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="px-2 py-1 font-titleKo text-label tracking-widest text-ink/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/60"
                aria-label="교통 안내 닫기"
              >
                CLOSE
              </button>
            </header>

            <div className="overscroll-contain overflow-y-auto px-6 pb-10">
              <section className="pt-8">
                <h3 className="section-kicker">셔틀버스</h3>
                <p className="mb-4 mt-2 text-micro text-ink/50">한강진역 2번 출구 앞에서 탑승해 주세요.</p>
                <RouteList items={transport.shuttle} />
              </section>

              <section className="pt-10">
                <h3 className="section-kicker">전세버스</h3>
                <div className="mt-4"><RouteList items={transport.charter} /></div>
              </section>

              <section className="pt-10">
                <h3 className="section-kicker">대중교통</h3>
                <ul className="mt-4 space-y-2 text-left type-body leading-loose text-ink/70">
                  {transport.publicTransit.map((item) => <li key={item}>· {item}</li>)}
                </ul>
              </section>

              <section className="pt-10">
                <h3 className="section-kicker">주차장</h3>
                <p className="mt-4 border-l-2 border-ink/25 pl-4 text-small leading-loose text-ink/65">
                  {transport.parkingNotice}
                </p>
                <ParkingList title="공영주차장" items={publicParking} />
                <ParkingList title="기타 주차장" items={otherParking} />
                <p className="mt-5 text-micro leading-relaxed text-ink/45">주차장 이름을 누르면 네이버 지도에서 위치를 확인할 수 있습니다.</p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Location() {
  const { venue } = wedding;
  const maps = buildMapLinks(venue);
  const [transportOpen, setTransportOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <Section id="location" title="오시는 길">
      <Reveal className="mx-auto max-w-content text-center">
        <p className="type-quote text-ink">{venue.name}</p>
        <p className="mt-6 type-body text-ink/70">{venue.address}</p>

        <div className="mt-8 aspect-[3/2] w-full overflow-hidden border border-ink/15">
          <VenueMap lat={venue.lat} lng={venue.lng} name={venue.name} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3">
          <SecondaryButton as="a" href={maps.naver} target="_blank" rel="noreferrer" className="gap-2.5"><NaverIcon className="h-[18px] w-[18px] shrink-0" /><span>NAVER MAP</span></SecondaryButton>
          <SecondaryButton as="a" href={maps.kakao} target="_blank" rel="noreferrer" className="gap-2.5"><KakaoIcon className="h-[18px] w-[18px] shrink-0" /><span>KAKAO MAP</span></SecondaryButton>
          <SecondaryButton as="a" href={maps.google} target="_blank" rel="noreferrer" className="gap-2.5"><GoogleMapIcon className="h-[18px] w-[13px] shrink-0" /><span>GOOGLE MAP</span></SecondaryButton>
        </div>

        <PrimaryButton ref={triggerRef} className="mt-6 w-full flex-col gap-1 py-4" onClick={() => setTransportOpen(true)}>
          <span>교통 · 주차 안내 보기</span>
          <span className="text-micro tracking-wider text-paper/70">셔틀버스 · 전세버스 · 주차장 정보</span>
        </PrimaryButton>

        <div className="mt-12">
          <p className="eyebrow mb-4">CALENDAR</p>
          <CalendarAdd label="ADD TO CALENDAR" />
        </div>
      </Reveal>

      <TransportDialog open={transportOpen} onClose={() => setTransportOpen(false)} triggerRef={triggerRef} />
    </Section>
  );
}
