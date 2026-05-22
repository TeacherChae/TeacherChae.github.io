// 모든 ticket 카드가 공유하는 작은 컴포넌트들.
// 시각 family DNA: 모노 라벨 + 일련번호 + 좌하 ✈ + 우하 ISSUED.

import { wedding } from '../../config/wedding.js';

// 우상단 카드 종류 라벨 (예: BOARDING PASS)
export function CardTypeLabel({ children }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-forest/65">
      {children}
    </p>
  );
}

// 우상단 일련번호 (라벨 아래)
export function CardSerial({ no }) {
  return (
    <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-forest/35">
      WED 2609 · {String(no).padStart(4, '0')}
    </p>
  );
}

// 필드 라벨: 영문 (주) + 한글 (보조). 영문 모노 / 한글은 옅게.
export function FieldLabel({ en, ko, align = 'left' }) {
  return (
    <div className={`flex items-baseline gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-forest/60">{en}</span>
      {ko && <span className="text-[10px] text-forest/35">{ko}</span>}
    </div>
  );
}

// 한 셀: 라벨 + 값. 값은 모노 / 또는 자유.
export function Field({ en, ko, value, sub, mono = true, align = 'left' }) {
  return (
    <div className={`flex-1 min-w-0 ${align === 'right' ? 'text-right' : ''}`}>
      <FieldLabel en={en} ko={ko} align={align} />
      <p className={`mt-1 ${mono ? 'font-mono' : ''} text-[15px] text-forest leading-tight truncate`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[10px] text-forest/45">{sub}</p>}
    </div>
  );
}

// 카드 좌하 ✈ + 우하 ISSUED — 모든 카드 공통 푸터
export function CardFooterMarks() {
  const { issued } = wedding.ticket;
  return (
    <div className="flex items-end justify-between mt-6 pt-3 border-t border-forest/5 text-forest/30">
      <span className="text-sm">✈</span>
      <p className="font-mono text-[9px] tracking-[0.2em]">ISSUED {issued}</p>
    </div>
  );
}

// 카드 공통 프레임. 우상단 라벨/시리얼 + 본문 + 푸터.
// notch=true 면 ticket-card mask (양쪽 노치) 적용.
export function CardFrame({ label, serial, children, notch = false, padded = true, className = '' }) {
  return (
    <article
      className={`bg-paper border border-forest/10 shadow-sm relative ${notch ? 'ticket-card' : 'rounded-sm'} ${className}`}
    >
      <header className="flex items-start justify-between px-5 pt-4">
        <span aria-hidden className="h-px" />
        <div className="text-right">
          <CardTypeLabel>{label}</CardTypeLabel>
          <CardSerial no={serial} />
        </div>
      </header>
      <div className={padded ? 'px-5 pb-3' : ''}>{children}</div>
      <div className="px-5 pb-4">
        <CardFooterMarks />
      </div>
    </article>
  );
}

// 카드 사이 여정 마커 — 세로 점선 + (옵션) 작은 ✈
export function JourneyMarker({ withPlane = false }) {
  return (
    <div className="relative flex justify-center py-3" aria-hidden>
      <div className="h-10 w-px border-l border-dashed border-sage/40" />
      {withPlane && (
        <span className="absolute top-1/2 -translate-y-1/2 bg-cream px-1.5 text-xs text-sage/70">
          ✈
        </span>
      )}
    </div>
  );
}

// "VALID ONLY ON [날짜]" 같은 부수 텍스트용 작은 라벨
export function TinyMono({ children, className = '' }) {
  return (
    <span className={`font-mono text-[9px] tracking-[0.2em] uppercase ${className}`}>
      {children}
    </span>
  );
}
