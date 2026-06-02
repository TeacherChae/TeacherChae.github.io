import { motion, useReducedMotion } from 'framer-motion';

// 에디토리얼 톤에 맞춘 "은은한" 진입 모션 프리미티브.
// - 스크롤로 화면에 들어올 때 한 번만 재생 (once: true)
// - prefers-reduced-motion 사용자는 모션 없이 즉시 표시
// - margin 으로 완전히 보이기 살짝 전에 트리거

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

// 단일 블록을 아래에서 떠오르며 블러가 풀리듯 페이드인.
export function Reveal({ children, className = '', delay = 0, y = 36, as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.15, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.95, ease: EASE } },
};

// 자식 요소들을 한 줄씩 순차로 등장시키는 컨테이너.
export function Stagger({ children, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

// Stagger 의 자식. 부모 타이밍에 맞춰 떠오름.
export function StaggerItem({ children, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
