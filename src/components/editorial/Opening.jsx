import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function Opening({ onEnter, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  // 탭 = 첫 사용자 제스처. 이 제스처 안에서 onEnter()로 BGM을 켜고,
  // 동시에 Opening을 닫아 hero 진입 애니메이션을 시작한다.
  function enter() {
    if (!visible) return;
    onEnter?.();
    setVisible(false);
  }

  const words = ['YOU', 'ARE', 'INVITED'];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          role="button"
          tabIndex={0}
          onClick={enter}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              enter();
            }
          }}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-paper text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          aria-label="탭하여 입장하기"
        >
          <motion.div
            className="text-center type-opening"
            initial="hidden"
            animate="show"
            exit="hide"
            onAnimationComplete={(definition) => {
              if (definition === 'show') setReady(true);
            }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.55, delayChildren: 0.75 },
              },
              hide: {
                opacity: 0,
                transition: { duration: 1.15, ease: 'easeInOut' },
              },
            }}
          >
            {words.map((word) => (
              <motion.p
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 1.35, ease: [0.22, 1, 0.36, 1] },
                  },
                  hide: {
                    opacity: 0,
                    y: -10,
                    filter: 'blur(4px)',
                    transition: { duration: 1.0, ease: 'easeInOut' },
                  },
                }}
              >
                {word}
              </motion.p>
            ))}
          </motion.div>

          <motion.span
            className="absolute bottom-[12vh] text-[0.65rem] uppercase tracking-[0.32em] text-ink/45"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: [0.25, 0.7, 0.25] } : { opacity: 0 }}
            transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
            aria-hidden="true"
          >
            tap to enter
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
