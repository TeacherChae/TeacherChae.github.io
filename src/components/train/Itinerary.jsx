// Wedding-day stops rendered as a vertical train-station timeline.

const STOPS = [
  {
    id: 'departure',
    nameKo: '출발역',
    nameEn: 'DEPARTURE STN',
    platform: '1',
    time: '10:30',
    note: '하객 입장 시작',
  },
  {
    id: 'ceremony',
    nameKo: '본식역',
    nameEn: 'CEREMONY STN',
    platform: '2',
    time: '11:00',
    note: '결혼식',
  },
  {
    id: 'photo',
    nameKo: '촬영역',
    nameEn: 'PHOTO STN',
    platform: '3',
    time: '12:00',
    note: '기념 촬영',
  },
  {
    id: 'reception',
    nameKo: '피로연역',
    nameEn: 'RECEPTION STN',
    platform: '4',
    time: '12:30',
    note: '식사 및 축하',
  },
  {
    id: 'sendoff',
    nameKo: '환송역',
    nameEn: 'SEND-OFF STN',
    platform: '5',
    time: '14:00',
    note: '신랑·신부 환송',
  },
];

export default function Itinerary() {
  return (
    <section className="bg-ktx-navy px-6 py-14">
      {/* Section header */}
      <div className="mb-10 text-center">
        <p className="text-korail-turquoise text-[10px] tracking-widest uppercase font-mono mb-1">
          운행 시각표 · Timetable
        </p>
        <h2
          className="text-white text-2xl font-bold"
          style={{ fontFamily: '"Nanum Myeongjo", serif' }}
        >
          당일 여정
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative max-w-page mx-auto">
        {STOPS.map((stop, idx) => {
          const isLast = idx === STOPS.length - 1;
          return (
            <div key={stop.id} className="relative flex gap-5">
              {/* Rail line + station dot */}
              <div className="flex flex-col items-center">
                {/* Station dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 z-10 mt-1 ${
                    idx === 0
                      ? 'bg-korail-turquoise border-korail-turquoise'
                      : isLast
                      ? 'bg-platform-yellow border-platform-yellow'
                      : 'bg-ktx-navy border-korail-turquoise/70'
                  }`}
                />
                {/* Dotted vertical rail connecting to next stop */}
                {!isLast && (
                  <div className="flex-1 w-px border-l-2 border-dashed border-korail-turquoise/30 my-1" style={{ minHeight: '56px' }} />
                )}
              </div>

              {/* Stop content */}
              <div className={`pb-10 flex-1 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-white font-bold text-base leading-tight"
                      style={{ fontFamily: '"Nanum Myeongjo", serif' }}
                    >
                      {stop.nameKo}
                    </p>
                    <p className="text-korail-turquoise/70 text-[10px] tracking-widest uppercase font-mono mt-0.5">
                      {stop.nameEn}
                    </p>
                    <p className="text-white/40 text-xs mt-1">{stop.note}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-mono text-sm font-bold">{stop.time}</p>
                    <p className="text-white/40 text-[10px] font-mono mt-0.5">
                      PF·{stop.platform}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
