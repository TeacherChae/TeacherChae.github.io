import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding.js';
import { CardSerial, CardTypeLabel, FieldLabel, Field, CardFooterMarks } from './_shared.jsx';

// D-day 상태 머신: D-N → BOARDING TOMORROW → BOARDING NOW → ARRIVED · DAY n
function useStatus(targetIso) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const target = new Date(targetIso).getTime();
  const dayMs = 86_400_000;
  const days = Math.ceil((target - now) / dayMs);
  if (days > 1) return { tone: 'normal', text: `D-${days} DAYS` };
  if (days === 1) return { tone: 'warn', text: 'BOARDING TOMORROW' };
  if (days === 0) return { tone: 'live', text: 'BOARDING NOW' };
  return { tone: 'past', text: `ARRIVED · DAY ${Math.abs(days) + 1}` };
}

export default function BoardingPass() {
  const [flipped, setFlipped] = useState(false);
  const { groom, bride, date, venue, ticket } = wedding;
  const status = useStatus(date.iso);

  const d = new Date(date.iso);
  const yyyy = d.getFullYear();
  const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const serial = `${yyyy}-${mmdd}-001`;
  const hhmm = d.toTimeString().slice(0, 5);

  const statusColor =
    status.tone === 'live' ? 'bg-sage text-paper' :
    status.tone === 'warn' ? 'bg-sage-light text-forest' :
    status.tone === 'past' ? 'bg-forest/15 text-forest' :
    'bg-forest text-paper';

  const Strip = () => (
    <div className="flex items-center justify-between border-b border-forest/15 px-5 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-forest">✈</span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-forest">{ticket.airline}</span>
      </div>
      <span className={`font-mono text-[10px] tracking-[0.15em] px-2 py-0.5 rounded-sm ${statusColor}`}>
        {status.text}
      </span>
    </div>
  );

  const Front = (
    <div
      className="ticket-card bg-paper border border-forest/10 shadow-sm relative overflow-hidden"
      style={{ minHeight: '560px' }}
    >
      <Strip />

      {/* 우상단 라벨 (보딩패스 + 시리얼) */}
      <div className="flex items-start justify-between px-5 pt-3">
        <span aria-hidden className="h-px" />
        <div className="text-right">
          <CardTypeLabel>{ticket.labels.boardingPass}</CardTypeLabel>
          <CardSerial no={1} />
        </div>
      </div>

      {/* 메인 영역 (노치 위) */}
      <div className="px-5 pt-3 pb-4">
        <FieldLabel en="Passenger" ko="탑승자" />
        <p className="mt-1 text-xl text-forest">
          {groom.nameKo} <span className="mx-1 text-sage">&</span> {bride.nameKo}
        </p>
        <p className="font-script text-[28px] text-sage-dark leading-tight">
          {groom.nameEn} <span className="mx-1">&</span> {bride.nameEn}
        </p>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <FieldLabel en="From" ko="출발" />
            <p className="mt-1 font-mono text-3xl tracking-wider text-forest leading-none">{ticket.from.code}</p>
            <p className="mt-1.5 text-[11px] text-forest/60">{ticket.from.label}</p>
          </div>
          <div className="flex-1 flex items-center justify-center pt-3 text-sage/50">
            <span className="text-xl">✈</span>
          </div>
          <div className="text-right">
            <FieldLabel en="To" ko="도착" align="right" />
            <p className="mt-1 font-mono text-3xl tracking-wider text-forest leading-none">{ticket.to.code}</p>
            <p className="mt-1.5 text-[11px] text-forest/60">{ticket.to.label}</p>
          </div>
        </div>
      </div>

      {/* 절취선 — 노치와 같은 높이 (62%) */}
      <div className="absolute left-[14px] right-[14px] top-[62%] border-t border-dashed border-forest/25 pointer-events-none" />

      {/* 노치 아래 (스텁) 영역 */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex gap-4">
          <Field en="Date" ko="날짜" value={date.short.replace(/\s/g, '')} />
          <Field en="Time" ko="시간" value={hhmm} />
          <Field en="Gate" ko="게이트" value={ticket.gate} />
        </div>
        <div className="mt-4 flex gap-4">
          <Field en="Boarding" ko="입장" value={ticket.boardingTime} sub="식 시작 30분 전" />
          <Field en="Class" ko="좌석" value={ticket.class} />
          <Field en="Flight" ko="편명" value={ticket.flightCode.replace(' ', '')} />
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <FieldLabel en="Ticket No." ko="고유번호" />
            <p className="mt-0.5 font-mono text-[13px] text-forest">WED-{serial}</p>
          </div>
          {/* QR placeholder — 시각용 */}
          <div className="h-12 w-12 grid grid-cols-4 grid-rows-4 gap-[2px] bg-paper p-1 border border-forest/15">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={i % 3 === 0 || i % 5 === 0 ? 'bg-forest' : 'bg-paper'} />
            ))}
          </div>
        </div>

        <p className="mt-5 text-center font-mono text-[10px] tracking-[0.2em] text-forest/40 uppercase">
          ↻ TAP · 식장 정보 보기
        </p>
      </div>
    </div>
  );

  const Back = (
    <div
      className="ticket-card bg-paper border border-forest/10 shadow-sm relative overflow-hidden"
      style={{ minHeight: '560px' }}
    >
      <Strip />

      <div className="flex items-start justify-between px-5 pt-3">
        <span aria-hidden className="h-px" />
        <div className="text-right">
          <CardTypeLabel>{ticket.labels.boardingPass} · BACK</CardTypeLabel>
          <CardSerial no={1} />
        </div>
      </div>

      <div className="px-5 pt-3 pb-4">
        <FieldLabel en="Destination" ko="목적지" />
        <p className="mt-1 text-lg text-forest leading-tight">{venue.name}</p>
        <p className="font-script text-2xl text-sage-dark mt-1">Namsan Hannam</p>

        <div className="mt-5">
          <FieldLabel en="Schedule" ko="식순" />
          <ul className="mt-2 space-y-1.5 text-[13px] text-forest/85">
            <li><span className="font-mono text-forest/50 mr-2">10:30</span>하객 입장</li>
            <li><span className="font-mono text-forest/50 mr-2">11:00</span>예식 시작</li>
            <li><span className="font-mono text-forest/50 mr-2">11:45</span>피로연 (식사)</li>
            <li><span className="font-mono text-forest/50 mr-2">13:00</span>마무리</li>
          </ul>
        </div>
      </div>

      <div className="absolute left-[14px] right-[14px] top-[62%] border-t border-dashed border-forest/25 pointer-events-none" />

      <div className="px-5 pt-5 pb-4">
        <FieldLabel en="In-flight" ko="기내 안내" />
        <p className="mt-2 text-xs text-forest/70 leading-relaxed">
          더 자세한 길 안내·교통편·주차 정보는 아래 <span className="text-sage-dark">Terminal Map</span> 카드를 확인해 주세요.
        </p>

        <p className="mt-10 text-center font-mono text-[10px] tracking-[0.2em] text-forest/40 uppercase">
          ↻ TAP · 보딩패스로 돌아가기
        </p>
      </div>
    </div>
  );

  return (
    <section className="px-4 pt-10 pb-2">
      <div style={{ perspective: '1500px' }} className="relative">
        <motion.div
          className="relative cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.75, type: 'spring', stiffness: 55, damping: 14 }}
          onClick={() => setFlipped((v) => !v)}
        >
          <div className="[backface-visibility:hidden]">{Front}</div>
          <div
            className="absolute inset-0 [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {Back}
          </div>
        </motion.div>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] tracking-[0.2em] text-forest/30">
        ✈ FOREVER AIRLINES · ITINERARY 1 / 7
      </p>
      {/* Footer marks for this card (under the flippable area to avoid affecting flip layout) */}
      <div className="mt-2 px-4">
        <CardFooterMarks />
      </div>
    </section>
  );
}
