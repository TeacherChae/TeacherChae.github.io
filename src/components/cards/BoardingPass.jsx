import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding.js';
import { CardSerial, CardTypeLabel, FieldLabel, CardFooterMarks } from './_shared.jsx';

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

// 셀 한 칸 — 라벨 + 값 + 옵션 sub/alert. 진짜 보딩패스 필드 셀 느낌.
function GridCell({ en, ko, value, sub, alert }) {
  return (
    <div className="bg-paper px-2.5 py-2">
      <FieldLabel en={en} ko={ko} />
      <p className="mt-1 font-mono text-[15px] text-forest font-semibold leading-tight truncate">
        {value}
      </p>
      {alert && (
        <p className="mt-0.5 font-mono text-[8px] tracking-[0.18em] text-terracotta-dark uppercase">
          {alert}
        </p>
      )}
      {sub && !alert && (
        <p className="mt-0.5 text-[10px] text-forest/45 truncate">{sub}</p>
      )}
    </div>
  );
}

// 스텁의 mini info 셀 — 매우 컴팩트
function StubCell({ en, value }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[8px] tracking-[0.2em] text-forest/55 uppercase">{en}</p>
      <p className="mt-0.5 font-mono text-[12px] text-forest font-semibold truncate">{value}</p>
    </div>
  );
}

// 곡선 비행 경로 SVG
function FlightPath() {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none" aria-hidden>
      <path
        d="M 4 34 Q 60 -8, 116 34"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
        className="text-sage/60"
      />
      <circle cx="60" cy="9" r="6" className="fill-paper" />
      <text x="60" y="13" textAnchor="middle" className="fill-sage-dark" fontSize="10">✈</text>
    </svg>
  );
}

// Barcode 가로 스트립 — 변동 폭 검정 막대
function Barcode({ className = '' }) {
  // 결정적 패턴이 보드패스 답게 보임 (랜덤보다)
  const widths = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3];
  return (
    <div className={`bg-paper border border-forest/20 p-1 flex items-stretch gap-[1px] overflow-hidden ${className}`}>
      {widths.map((w, i) => (
        <div key={i} className="bg-forest h-full shrink-0" style={{ width: `${w}px`, opacity: i % 5 === 0 ? 0.85 : 1 }} />
      ))}
    </div>
  );
}

// 하단 magnetic stripe — 가짜 자기띠 점선
function MagneticStripe({ className = '' }) {
  return (
    <div className={`h-7 bg-gradient-to-r from-forest via-forest/85 to-forest flex items-center px-3 ${className}`}>
      <div className="flex gap-[3px] items-center w-full overflow-hidden">
        {Array.from({ length: 56 }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] h-3.5 rounded-sm shrink-0"
            style={{ backgroundColor: i % 3 === 0 ? 'rgba(184, 197, 169, 0.7)' : 'rgba(251, 250, 247, 0.18)' }}
          />
        ))}
      </div>
    </div>
  );
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
  const dateShort = date.short.replace(/\s/g, '');

  // 성씨만 따서 mini 라벨용
  const groomLast = (groom.nameEn || '').split(' ').slice(-1)[0]?.toUpperCase() || '';
  const brideLast = (bride.nameEn || '').split(' ').slice(-1)[0]?.toUpperCase() || '';

  const statusColor =
    status.tone === 'live' ? 'bg-sage text-paper' :
    status.tone === 'warn' ? 'bg-sage-light text-forest' :
    status.tone === 'past' ? 'bg-paper/20 text-paper' :
    'bg-paper/15 text-paper';

  // ── 브랜드 헤더 바 (forest bg) ──
  const HeaderBar = () => (
    <div className="bg-forest px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-sage flex items-center justify-center">
          <span className="text-paper text-sm leading-none">✈</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-paper font-mono text-[11px] tracking-[0.22em] uppercase font-semibold">
            {ticket.airline}
          </span>
          <span className="text-sage-light/70 font-mono text-[8px] tracking-[0.22em] uppercase mt-0.5">
            EST · MMXXVI
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.2em] text-paper/65 uppercase">
          {ticket.class}
        </span>
        <span className={`font-mono text-[10px] tracking-[0.15em] px-2 py-0.5 rounded-sm ${statusColor}`}>
          {status.text}
        </span>
      </div>
    </div>
  );

  const Front = (
    <div
      className="ticket-card bg-paper border border-forest/10 shadow-md relative overflow-hidden"
      style={{ minHeight: '660px' }}
    >
      <HeaderBar />

      {/* 카드 타입 + 시리얼 — 헤더 바 바로 아래 */}
      <div className="flex items-start justify-between px-5 pt-3">
        <CardTypeLabel>{ticket.labels.boardingPass}</CardTypeLabel>
        <CardSerial no={1} />
      </div>

      {/* ── 탑승자 + PRIORITY 배지 ── */}
      <div className="px-5 pt-3 pb-2 relative">
        <div className="flex items-center justify-between gap-2 mb-1">
          <FieldLabel en="Passenger" ko="탑승자" />
          <span className="font-mono text-[9px] tracking-[0.18em] text-paper bg-sage-dark px-1.5 py-0.5 uppercase rounded-sm">
            PRIORITY · ZONE 1
          </span>
        </div>
        <p className="mt-1 text-xl text-forest leading-tight">
          {groom.nameKo} <span className="mx-1 text-sage">&</span> {bride.nameKo}
        </p>
        <p className="font-script text-[26px] text-sage-dark leading-none mt-0.5">
          {groom.nameEn} <span className="mx-1">&</span> {bride.nameEn}
        </p>

        {/* 손스탬프 오버레이 — 비스듬한 ISSUED 도장 */}
        <div className="absolute top-1 left-3 z-10 border-2 border-sage-dark/70 rounded-sm px-2 py-0.5 rotate-[-8deg] select-none pointer-events-none bg-paper/85">
          <p className="font-mono text-[9px] tracking-[0.18em] text-sage-dark uppercase font-semibold leading-none">
            ISSUED · {ticket.issued || dateShort}
          </p>
        </div>
      </div>

      {/* ── FROM → TO 거대 코드 + 곡선 비행 경로 ── */}
      <div className="px-5 pt-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <FieldLabel en="From" ko="출발" />
            <p className="mt-0.5 font-mono text-[44px] tracking-tight text-forest leading-none font-bold">
              {ticket.from.code}
            </p>
            <p className="mt-1.5 text-[11px] text-forest/65 truncate max-w-[90px]">{ticket.from.label}</p>
          </div>
          <div className="flex-1 flex flex-col items-center px-1 pt-3 min-w-0">
            <FlightPath />
            <p className="font-mono text-[9px] tracking-[0.18em] text-forest/50 uppercase -mt-1 truncate w-full text-center">
              {ticket.flightCode.replace(' ', '')} · NON-STOP
            </p>
          </div>
          <div className="text-right">
            <FieldLabel en="To" ko="도착" align="right" />
            <p className="mt-0.5 font-mono text-[44px] tracking-tight text-forest leading-none font-bold">
              {ticket.to.code}
            </p>
            <p className="mt-1.5 text-[11px] text-forest/65 truncate max-w-[90px] ml-auto">{ticket.to.label}</p>
          </div>
        </div>
      </div>

      {/* ── 2x 셀 그리드 — DATE/TIME/GATE + BOARDING/CLASS/SEAT ── */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-3 gap-px bg-forest/15 rounded-sm overflow-hidden">
          <GridCell en="Date"    ko="날짜"   value={dateShort} />
          <GridCell en="Time"    ko="시간"   value={hhmm} />
          <GridCell en="Gate"    ko="게이트" value={ticket.gate} alert="GATE CLOSES 10:50" />
        </div>
        <div className="mt-px grid grid-cols-3 gap-px bg-forest/15 rounded-sm overflow-hidden">
          <GridCell en="Boarding" ko="입장" value={ticket.boardingTime} sub="식 시작 30분 전" />
          <GridCell en="Class"    ko="좌석" value={ticket.class} />
          <GridCell en="Seat"     ko="자리" value="OPEN · 자유석" />
        </div>
      </div>

      {/* 절취선 — 노치와 같은 높이 (62%) */}
      <div className="absolute left-[14px] right-[14px] top-[62%] border-t border-dashed border-forest/25 pointer-events-none" />

      {/* ── 스텁 영역: 반복 mini-info + 진짜 barcode 스트립 ── */}
      <div className="px-5 pt-5 pb-3">
        <div className="grid grid-cols-5 gap-2 mb-4">
          <StubCell en="Pax"    value={`${groomLast}/${brideLast}`} />
          <StubCell en="Flight" value={ticket.flightCode.replace(' ', '')} />
          <StubCell en="Date"   value={dateShort.slice(5)} />
          <StubCell en="Gate"   value={ticket.gate} />
          <StubCell en="Seat"   value="OPEN" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <FieldLabel en="Ticket No." ko="고유번호" />
            <p className="mt-0.5 font-mono text-[12px] text-forest">WED-{serial}</p>
            <p className="font-mono text-[9px] text-forest/50 tracking-[0.2em] mt-0.5 uppercase">SEQ NO 0001</p>
          </div>
          <Barcode className="h-12 w-44" />
        </div>

        <p className="mt-4 text-center font-mono text-[10px] tracking-[0.2em] text-forest/40 uppercase">
          ↻ TAP · 식장 정보 보기
        </p>
      </div>
    </div>
  );

  const Back = (
    <div
      className="ticket-card bg-paper border border-forest/10 shadow-md relative overflow-hidden"
      style={{ minHeight: '660px' }}
    >
      <HeaderBar />

      <div className="flex items-start justify-between px-5 pt-3">
        <CardTypeLabel>{ticket.labels.boardingPass} · BACK</CardTypeLabel>
        <CardSerial no={1} />
      </div>

      <div className="px-5 pt-3 pb-4">
        <FieldLabel en="Destination" ko="목적지" />
        <p className="mt-1 text-lg text-forest leading-tight">{venue.name}</p>
        <p className="font-script text-2xl text-sage-dark mt-1">Namsan Hannam</p>

        <div className="mt-5">
          <FieldLabel en="In-flight Schedule" ko="기내 식순" />
          <ul className="mt-2 space-y-1.5 text-[13px] text-forest/85">
            <li><span className="font-mono text-forest/50 mr-2">10:30</span>하객 입장</li>
            <li><span className="font-mono text-forest/50 mr-2">11:00</span>예식 시작</li>
            <li><span className="font-mono text-forest/50 mr-2">11:45</span>피로연 (식사)</li>
            <li><span className="font-mono text-forest/50 mr-2">13:00</span>마무리</li>
          </ul>
        </div>
      </div>

      <div className="absolute left-[14px] right-[14px] top-[62%] border-t border-dashed border-forest/25 pointer-events-none" />

      <div className="px-5 pt-5 pb-3">
        <FieldLabel en="In-flight Notes" ko="기내 안내" />
        <p className="mt-2 text-xs text-forest/70 leading-relaxed">
          더 자세한 길 안내·교통편·주차 정보는 아래 <span className="text-sage-dark">Terminal Map</span> 카드를 확인해 주세요.
        </p>

        {/* 하단 magnetic stripe — 진짜 보딩패스 느낌 */}
        <MagneticStripe className="mt-6" />

        <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-forest/40 uppercase">
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
      <div className="mt-2 px-4">
        <CardFooterMarks />
      </div>
    </section>
  );
}
