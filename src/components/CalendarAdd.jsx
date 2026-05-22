import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { wedding } from '../config/wedding.js';

// '2026-09-05T11:00' → { date: '2026-09-05', time: '11:00' }
function splitIso(iso) {
  const [date, time] = iso.split('T');
  return { date, time };
}

export default function CalendarAdd() {
  const { date, venue, groom, bride, share } = wedding;
  const start = splitIso(date.iso);
  const end = splitIso(date.endIso);

  return (
    <div className="mt-4 flex justify-center">
      <AddToCalendarButton
        name={share.title}
        description={`${groom.nameKo} & ${bride.nameKo} 결혼식`}
        startDate={start.date}
        startTime={start.time}
        endDate={end.date}
        endTime={end.time}
        timeZone="Asia/Seoul"
        location={`${venue.name}, ${venue.address}`}
        options={['Apple', 'Google', 'iCal', 'Outlook.com']}
        buttonStyle="default"
        label="내 캘린더에 추가"
        language="ko"
        lightMode="light"
        hideBackground
        hideCheckmark
        styleLight="
          --btn-background: rgba(255, 255, 255, 0.6);
          --btn-text: #2F3F36;
          --btn-border: #C97D60;
          --font: Pretendard, system-ui, sans-serif;
        "
      />
    </div>
  );
}
