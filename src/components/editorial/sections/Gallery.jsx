import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../../config/wedding.js';
import { useReduceMotion } from '../../../lib/reduceMotion.js';
import { Section } from '../ui/_shared.jsx';
import { Reveal } from '../ui/motion.jsx';
import SmartImage from '../ui/SmartImage.jsx';

export default function Gallery() {
  const { gallery } = wedding;
  const reduce = useReduceMotion();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null); // 라이트박스 스와이프용
  const scrollerRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const total = gallery.length;
  const current = gallery[index];

  const padded = String(index + 1).padStart(2, '0');
  const totalPadded = String(total).padStart(2, '0');

  const move = useCallback(
    (delta) => setIndex((i) => (i + delta + total) % total),
    [total],
  );
  const closeLightbox = useCallback(() => {
    setOpen(false);
    lastFocusedRef.current?.focus();
  }, []);

  function handleTouchEnd(e) {
    if (touchStart == null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 42) move(diff > 0 ? 1 : -1);
    setTouchStart(null);
  }

  // 섹션 캐러셀: 스냅 스크롤 위치 → 인덱스. (손가락을 따라 앞뒤 사진이 이어져 넘어간다)
  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index && i >= 0 && i < total) setIndex(i);
  }

  // 라이트박스(키보드/스와이프/버튼)에서 이동하면 뒤의 캐러셀도 같은 사진으로 맞춘다.
  // 닫혀 있을 때는 스크롤이 인덱스의 단일 출처이므로 건드리지 않는다(드래그와 충돌 방지).
  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: 'auto' });
  }, [open, index]);

  // 라이트박스 열림 동안: 바디 스크롤 잠금 + 키보드(←/→/Esc) 조작.
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        move(1);
      } else if (e.key === 'ArrowLeft') {
        move(-1);
      } else if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeLightbox, move]);

  if (!current) return null;

  return (
    <Section divider className="pt-8 pb-16">
      <Reveal className="mx-auto max-w-content">
        <div className="mb-5 flex items-center justify-between font-titleKo text-label tracking-ultra text-ink/50">
          <span>{padded}</span>
          <span>/</span>
          <span>{totalPadded}</span>
        </div>
      </Reveal>
      {/* 사진 캐러셀은 섹션 거터를 상쇄해 페이지를 가득(엣지 투 엣지) 채운다. */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar -mx-gutter flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-ink/5"
        aria-label="갤러리 사진 슬라이드"
      >
        {gallery.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => {
              setIndex(i);
              lastFocusedRef.current = document.activeElement;
              setOpen(true);
            }}
            aria-label={`사진 크게 보기 (${i + 1}/${total})`}
            className="h-full w-full shrink-0 snap-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-paper"
          >
            <SmartImage
              src={item.src}
              alt={item.alt}
              className={`h-full w-full ${item.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
              eager={i === 0}
            />
          </button>
        ))}
      </div>
      <Reveal className="mx-auto mt-5 max-w-content">
        <p className="text-center font-titleKo text-micro tracking-editorial text-ink/40">← SWIPE →</p>
      </Reveal>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            className="fixed inset-0 z-[120] flex flex-col bg-ink/95"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="갤러리 사진 크게 보기"
            onClick={closeLightbox}
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between px-6 py-5 font-titleKo text-label tracking-ultra text-paper/70">
              <span>
                {padded} / {totalPadded}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                aria-label="닫기"
                className="px-2 py-1 tracking-ultra focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper/70"
              >
                CLOSE
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 pb-4">
              <SmartImage
                key={current.src}
                src={current.src}
                alt={current.alt}
                className="max-h-full max-w-full object-contain"
                eager
              />
            </div>

            <div className="grid grid-cols-2 gap-3 px-6 pb-8" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => move(-1)}
                className="border border-paper/40 py-3 font-titleKo text-label uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper/70"
              >
                PREV
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="border border-paper/40 py-3 font-titleKo text-label uppercase tracking-widest text-paper transition hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper/70"
              >
                NEXT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
