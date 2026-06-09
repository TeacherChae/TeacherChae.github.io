import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { wedding } from '../../config/wedding.js';
import HeroCalligraphy, { HERO_WRITE_DURATION } from './HeroCalligraphy.jsx';
import HeroLottie from './HeroLottie.jsx';

export default function Hero() {
  const { groom, bride, date, images } = wedding;
  const reduce = useReducedMotion();
  const ref = useRef(null);

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
        <div className="text-paper drop-shadow-hero-title">
          {/* Lottie 손글씨 애니메이션(public/lottie/hero.lottie|json). 파일이 없으면 기존 SVG 손글씨로 자동 fallback. */}
          <HeroLottie
            label={`${bride.fullNameEn} & ${groom.fullNameEn}`}
            fallback={<HeroCalligraphy label={`${bride.fullNameEn} & ${groom.fullNameEn}`} />}
          />
        </div>
        <motion.p
          className="mt-6 type-meta text-paper/82 drop-shadow-hero-sub"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { delay: HERO_WRITE_DURATION - 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          {date.short}
        </motion.p>
      </motion.div>
    </section>
  );
}
