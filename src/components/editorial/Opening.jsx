import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const OPENING_DURATION_MS = 3000;

export default function Opening({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, OPENING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const words = ['YOU', 'ARE', 'INVITED'];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper text-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          aria-label="You are invited"
        >
          <motion.div
            className="text-center type-opening"
            initial="hidden"
            animate="show"
            exit="hide"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
