import { wedding } from '../config/wedding.js';

export default function Location() {
  const { venue, date } = wedding;
  return (
    <section className="section text-center">
      <p className="section-label">location</p>
      <p className="section-title">오시는 길</p>
      <div className="divider-leaf" />

      <div className="mt-6 space-y-1 text-[15px]">
        <p className="text-lg font-medium">{venue.name}</p>
        <p className="mt-3 text-sm text-forest/80">{venue.address}</p>
        <p className="text-sm text-forest/60">{venue.tel}</p>
      </div>

      <p className="mt-6 text-sm tracking-wide text-sage-dark">{date.dayKo}</p>

      <div className="mt-6 aspect-[4/3] w-full rounded-sm bg-sage/10 border border-sage/20 flex items-center justify-center text-forest/30 text-sm">
        지도 (네이버/카카오 지도 임베드 예정)
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={venue.naverMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-sage/40 bg-white/60 py-3 text-sm text-forest hover:bg-sage/10 transition"
        >
          네이버 지도
        </a>
        <a
          href={venue.kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-sage/40 bg-white/60 py-3 text-sm text-forest hover:bg-sage/10 transition"
        >
          카카오 지도
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
