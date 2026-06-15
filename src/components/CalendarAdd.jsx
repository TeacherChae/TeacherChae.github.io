import { useEffect, useMemo, useRef, useState } from 'react';
import { wedding } from '../config/wedding.js';

function splitIso(iso) {
  const [date, time = '00:00'] = iso.split('T');
  return { date, time };
}

function compactLocalDateTime(iso) {
  return iso.replace(/[-:]/g, '');
}

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function makeCalendarEvent() {
  const { date, venue, groom, bride, share } = wedding;
  return {
    title: share.title,
    description: `${bride.nameKo} & ${groom.nameKo} 결혼식`,
    startIso: date.iso,
    endIso: date.endIso,
    timeZone: 'Asia/Seoul',
    location: `${venue.name}, ${venue.address}`,
  };
}

function buildIcs(event) {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const uid = `${compactLocalDateTime(event.startIso)}-wedding-invitation@local`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//Calendar//KO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${event.timeZone}:${compactLocalDateTime(event.startIso)}00`,
    `DTEND;TZID=${event.timeZone}:${compactLocalDateTime(event.endIso)}00`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function buildGoogleUrl(event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${compactLocalDateTime(event.startIso)}00/${compactLocalDateTime(event.endIso)}00`,
    ctz: event.timeZone,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildOutlookUrl(event) {
  const { date: startDate, time: startTime } = splitIso(event.startIso);
  const { date: endDate, time: endTime } = splitIso(event.endIso);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: `${startDate}T${startTime}:00`,
    enddt: `${endDate}T${endTime}:00`,
    body: event.description,
    location: event.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function makeDownloadUrl(ics) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/60';
const baseButtonClass =
  `inline-flex min-w-[11.6em] items-center justify-center border px-4 py-3 text-center text-body transition ${focusClass}`;

// 청첩장은 모노톤 에디토리얼 단일 스타일. (이전 'soft' 변형은 팔레트 밖 색이라 제거됨)
const styles = {
  wrapper: 'mt-0 flex justify-center',
  button:
    `${baseButtonClass} rounded-none border-ink bg-transparent font-titleKo text-label uppercase tracking-widest text-ink hover:bg-ink hover:text-paper`,
  menu: 'border-ink/40 bg-paper/95 font-titleKo text-label uppercase tracking-widest text-ink shadow-lg',
  item: `hover:bg-ink hover:text-paper ${focusClass}`,
};

export default function CalendarAdd({ label = '내 캘린더에 추가' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const firstItemRef = useRef(null);
  const event = useMemo(() => makeCalendarEvent(), []);
  const links = useMemo(() => {
    const ics = buildIcs(event);
    return {
      apple: makeDownloadUrl(ics),
      google: buildGoogleUrl(event),
      ical: makeDownloadUrl(ics),
      outlook: buildOutlookUrl(event),
    };
  }, [event]);

  useEffect(() => {
    if (!open) return undefined;
    firstItemRef.current?.focus();

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <div ref={wrapperRef} className="relative inline-block">
        <button
          ref={buttonRef}
          type="button"
          className={styles.button}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          {label}
        </button>

        {open && (
          <div
            role="menu"
            className={`absolute left-1/2 z-20 mt-2 w-full min-w-[190px] -translate-x-1/2 overflow-hidden border ${styles.menu}`}
          >
            <a ref={firstItemRef} className={`block px-4 py-3 ${styles.item}`} href={links.apple} download="wedding.ics" role="menuitem">
              Apple Calendar
            </a>
            <a className={`block px-4 py-3 ${styles.item}`} href={links.google} target="_blank" rel="noreferrer" role="menuitem">
              Google Calendar
            </a>
            <a className={`block px-4 py-3 ${styles.item}`} href={links.ical} download="wedding.ics" role="menuitem">
              iCal File
            </a>
            <a className={`block px-4 py-3 ${styles.item}`} href={links.outlook} target="_blank" rel="noreferrer" role="menuitem">
              Outlook.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
