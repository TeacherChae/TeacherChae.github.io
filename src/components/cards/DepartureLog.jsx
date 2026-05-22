import { useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { CardFrame, FieldLabel } from './_shared.jsx';

// 사진 자료가 비어있으면 placeholder를 보여줌.
function PhotoOrPlaceholder({ photo, idx, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block aspect-[3/4] rounded-sm overflow-hidden bg-sage/10 border border-sage/20 hover:opacity-80 transition w-full"
    >
      {photo?.src ? (
        <img src={photo.src} alt={photo.alt ?? `사진 ${idx + 1}`} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-xs text-forest/30">
          사진 {idx + 1}
        </div>
      )}
    </button>
  );
}

export default function DepartureLog() {
  const { gallery, ticket, groom, bride } = wedding;
  const [lightboxIdx, setLightboxIdx] = useState(null);

  // 6장 placeholder를 기본으로 (실제 사진이 들어오면 그것 사용)
  const photos = gallery.length > 0 ? gallery : Array.from({ length: 6 }, (_, i) => ({ src: null, alt: '' }));
  const hero = photos[0];
  const rest = photos.slice(1);

  return (
    <section className="px-4 py-2">
      <CardFrame label={ticket.labels.departureLog} serial={3}>
        <div className="text-center pt-1">
          <p className="font-script text-2xl text-sage-dark">Our moments</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            gallery · 함께 담은 순간
          </p>
        </div>

        {/* 히어로 사진 + 매달린 luggage tag */}
        <div className="mt-6 relative">
          <PhotoOrPlaceholder photo={hero} idx={0} onClick={() => setLightboxIdx(0)} />

          {/* 끈 + 태그 — 우상단에 매달린 작은 종이 */}
          <div className="absolute -top-2 right-3 flex flex-col items-center pointer-events-none">
            <div className="h-5 w-px bg-forest/30" />
            <div className="bg-paper border border-forest/30 px-2 py-1 rotate-[3deg] shadow-sm">
              <p className="font-mono text-[8px] tracking-[0.2em] text-forest/70 uppercase">Tag No. 03</p>
              <p className="font-script text-[13px] text-sage-dark leading-none mt-0.5">
                {groom.nameKo[0]} & {bride.nameKo[0]}
              </p>
            </div>
          </div>
        </div>

        {/* 나머지 사진 grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {rest.map((p, i) => (
            <PhotoOrPlaceholder
              key={i}
              photo={p}
              idx={i + 1}
              onClick={() => setLightboxIdx(i + 1)}
            />
          ))}
        </div>

        <div className="mt-5">
          <FieldLabel en="Total items" ko="수하물" />
          <p className="mt-1 font-mono text-[13px] text-forest">{photos.length} PIECES</p>
        </div>
      </CardFrame>

      {/* 라이트박스 모달 */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          role="dialog"
          aria-label="사진 확대 보기"
        >
          {photos[lightboxIdx]?.src ? (
            <img
              src={photos[lightboxIdx].src}
              alt={photos[lightboxIdx].alt ?? ''}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="bg-paper rounded-sm p-12 text-forest/60 font-mono text-sm">
              사진 {lightboxIdx + 1} · 자료 준비 중
            </div>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 right-4 text-paper/70 text-2xl"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
