import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { wedding } from '../../../config/wedding.js';
import { useReduceMotion } from '../../../lib/reduceMotion.js';
import HandwritingMarried from '../../handwriting/HandwritingMarried.jsx';

export default function Hero() {
  const { groom, bride, date, images } = wedding;
  const reduce = useReduceMotion();
  const ref = useRef(null);

  // 손글씨가 다 써지면 부제(이름·날짜)를 등장시킨다. reduced-motion 이면 바로 표시.
  // onComplete 가 어떤 이유로 안 불려도 부제가 묻히지 않도록 안전 타이머도 둔다.
  const [writeDone, setWriteDone] = useState(false);
  useEffect(() => {
    if (reduce) {
      setWriteDone(true);
      return;
    }
    const t = setTimeout(() => setWriteDone(true), 7000);
    return () => clearTimeout(t);
  }, [reduce]);

  // 섹션이 위로 스크롤되는 동안의 진행도(0→1)를 추적해 사진에 패럴럭스를 준다.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const heroAvif = images.hero.replace(/\.jpe?g$/i, '.avif');

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-paper">
      {/* 진입: 살짝 확대된 상태에서 제자리로 + 페이드인 (한 번) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.4, ease: 'easeOut' }}
      >
        {/* 스크롤 패럴럭스는 별도 래퍼에서 처리(진입 애니메이션과 충돌 방지) */}
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
          <picture>
            <source srcSet={heroAvif} type="image/avif" />
            <img
              src={images.hero}
              alt={`${bride.nameKo}와 ${groom.nameKo}`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchpriority="high"
              decoding="async"
              draggable={false}
            />
          </picture>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-paper/20 via-paper/6 to-ink/10" />
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center px-7 pt-[12vh] text-center text-paper"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
      >
        <h1 className="sr-only">
          {bride.nameKo} & {groom.nameKo}
        </h1>

        {/* "We are getting married" 손글씨 — 데모에서 확정한 값 (2026-06):
            가변 폭 잉크 + 폭 대비 ×2, 펜 속도 550, 커브 감속 1.5, 휴지 0.7.
            W·m ×1.2 는 에셋에 베이크됨(생성기 --sizes). */}
        <div className="w-[min(86vw,440px)] text-paper drop-shadow-hero-title">
          <HandwritingMarried
            ink="currentColor"
            variant="inked"
            inkContrast={2}
            pxPerSec={550}
            curveDrama={1.5}
            liftDrama={0.7}
            startDelay={0.6}
            onComplete={() => setWriteDone(true)}
          />
        </div>

        {/* 신랑·신부 영문 이름 — 손글씨 완료 후 등장 */}
        <motion.p
          className="mt-7 text-[0.72rem] uppercase tracking-[0.35em] text-paper/85 drop-shadow-hero-sub"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={writeDone ? { opacity: 1, y: 0 } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
        >
          {bride.fullNameEn} &nbsp;&amp;&nbsp; {groom.fullNameEn}
        </motion.p>

        <motion.p
          className="mt-3 type-meta text-paper/82 drop-shadow-hero-sub"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={writeDone ? { opacity: 1, y: 0 } : undefined}
          transition={reduce ? { duration: 0 } : { delay: 0.25, duration: 0.8, ease: 'easeOut' }}
        >
          {date.short}
        </motion.p>
      </motion.div>
    </section>
  );
}
