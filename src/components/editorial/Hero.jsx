import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding.js';

export default function Hero() {
  const { groom, bride, date, images } = wedding;
  return (
    <section className="relative min-h-screen overflow-hidden bg-paper">
      <motion.img
        src={images.hero}
        alt={`${bride.nameKo}와 ${groom.nameKo}`}
        className="absolute inset-0 h-full w-full object-cover object-center"
        initial={{ scale: 1.03, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-paper/20 via-paper/6 to-ink/10" />
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center px-7 pt-[13vh] text-center text-paper"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.9, ease: 'easeOut' }}
      >
        <h1 className="font-display text-[clamp(3.9rem,19vw,7.4rem)] leading-[0.86] tracking-[-0.055em] text-paper drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
          <span className="block">{bride.nameEn}</span>
          <span className="block text-[0.68em] leading-[0.92]">&</span>
          <span className="block">{groom.nameEn}</span>
        </h1>
        <p className="mt-7 font-mono text-[11px] tracking-[0.34em] text-paper/82 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          {date.short}
        </p>
      </motion.div>
    </section>
  );
}
