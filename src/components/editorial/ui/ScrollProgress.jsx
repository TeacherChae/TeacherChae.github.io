import { motion, useScroll, useSpring } from 'framer-motion';

// 페이지 상단의 가느다란 스크롤 진행 표시줄. 이 디자인의 헤어라인 모티프와 결을 맞춘 1px 라인.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[90] h-px w-full origin-left bg-ink/30"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
