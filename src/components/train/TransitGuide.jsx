import { wedding } from '../../config/wedding.js';

// Board-display sections styled as a dark platform departures board.
// Yellow text on near-black, monospace font for that split-flap / departure-board aesthetic.

const SUBWAY_LINES = [
  {
    line: '6호선',
    lineEn: 'Line 6',
    color: '#C55B3C',
    stations: ['이태원역 → 한강진역 (2정거장)', '도보 약 10분'],
  },
  {
    line: '경의중앙선',
    lineEn: 'Gyeongui-Jungang',
    color: '#73B8D5',
    stations: ['서빙고역', '도보 약 12분'],
  },
];

const SHUTTLE_ROWS = [
  { from: '한강진역 1번 출구', dep: '10:00', dep2: '10:30', note: '30분 간격 운행' },
  { from: '서빙고역 1번 출구', dep: '10:15', dep2: '10:45', note: '30분 간격 운행' },
];

const PARKING = [
  '웨딩가든 지하 주차장 이용 가능',
  '2시간 무료 · 이후 10분당 1,000원',
  '주차 공간 협소 — 대중교통 이용 권장',
];

function BoardHeader({ children }) {
  return (
    <div className="bg-platform-yellow/10 border-b border-platform-yellow/20 px-4 py-2">
      <p className="text-platform-yellow text-[10px] tracking-widest uppercase font-mono">{children}</p>
    </div>
  );
}

function BoardRow({ left, right, sub }) {
  return (
    <div className="px-4 py-3 border-b border-white/5 flex justify-between items-start gap-4">
      <div>
        <p className="text-platform-yellow font-mono text-sm leading-snug">{left}</p>
        {sub && <p className="text-white/40 text-[11px] font-mono mt-0.5">{sub}</p>}
      </div>
      {right && <p className="text-white/70 font-mono text-xs text-right flex-shrink-0">{right}</p>}
    </div>
  );
}

export default function TransitGuide() {
  const { venue } = wedding;

  return (
    <section className="bg-[#0D1B2A] px-4 py-14">
      {/* Section header */}
      <div className="mb-8 text-center">
        <p className="text-platform-yellow text-[10px] tracking-widest uppercase font-mono mb-1">
          PLATFORM GUIDE · 오시는 길
        </p>
        <h2
          className="text-white text-2xl font-bold"
          style={{ fontFamily: '"Nanum Myeongjo", serif' }}
        >
          {venue.name}
        </h2>
        <p className="text-white/40 text-xs font-mono mt-1">{venue.address}</p>
      </div>

      <div className="max-w-page mx-auto space-y-6">

        {/* ── 지하철 Board ── */}
        <div className="rounded overflow-hidden border border-white/10">
          <BoardHeader>지하철 · Subway Transfer</BoardHeader>
          {SUBWAY_LINES.map((s) => (
            <div key={s.line} className="px-4 py-3 border-b border-white/5 flex items-start gap-3">
              <div
                className="mt-0.5 flex-shrink-0 rounded px-2 py-0.5 text-white text-[11px] font-bold font-mono"
                style={{ backgroundColor: s.color }}
              >
                {s.line}
              </div>
              <div>
                {s.stations.map((st) => (
                  <p key={st} className="text-platform-yellow font-mono text-sm leading-snug">{st}</p>
                ))}
                <p className="text-white/40 text-[11px] font-mono">{s.lineEn}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 셔틀 Board ── */}
        <div className="rounded overflow-hidden border border-white/10">
          <BoardHeader>셔틀버스 · Shuttle Schedule</BoardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-platform-yellow font-mono text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-2 text-left text-[10px] text-white/40 uppercase tracking-widest font-normal">탑승지</th>
                  <th className="px-4 py-2 text-center text-[10px] text-white/40 uppercase tracking-widest font-normal">1회</th>
                  <th className="px-4 py-2 text-center text-[10px] text-white/40 uppercase tracking-widest font-normal">2회</th>
                  <th className="px-4 py-2 text-right text-[10px] text-white/40 uppercase tracking-widest font-normal">비고</th>
                </tr>
              </thead>
              <tbody>
                {SHUTTLE_ROWS.map((r) => (
                  <tr key={r.from} className="border-b border-white/5">
                    <td className="px-4 py-3 text-xs leading-tight">{r.from}</td>
                    <td className="px-4 py-3 text-center">{r.dep}</td>
                    <td className="px-4 py-3 text-center">{r.dep2}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-white/50">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 주차 Board ── */}
        <div className="rounded overflow-hidden border border-white/10">
          <BoardHeader>주차 · Parking</BoardHeader>
          {PARKING.map((line) => (
            <BoardRow key={line} left={line} />
          ))}
        </div>

        {/* Tel */}
        {venue.tel && venue.tel !== '02-0000-0000' && (
          <p className="text-center text-white/30 font-mono text-xs">
            문의 · {venue.tel}
          </p>
        )}
      </div>
    </section>
  );
}
