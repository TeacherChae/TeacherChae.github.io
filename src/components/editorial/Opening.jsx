import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const WORDS = ['YOU', 'ARE', 'INVITED'];

// 단어 등장 타이밍(초) — 이 컴포넌트의 단일 소스. 아래 모든 값이 여기서 파생된다.
const WORD_DELAY = 0.75; // 첫 단어가 떠오르기 시작하는 지연
const WORD_STAGGER = 0.55; // 단어 간 간격
const WORD_DURATION = 1.35; // 단어 하나가 다 떠오르는 시간

// 'tap to enter' 힌트 등장 시점 = 마지막 단어가 "떠오르기 시작하는" 순간.
// (전체 완료까지 기다리지 않아 텀이 짧고, 단어 타이밍을 바꾸면 자동으로 따라온다.)
const HINT_DELAY_MS = (WORD_DELAY + (WORDS.length - 1) * WORD_STAGGER) * 1000;

export default function Opening({ onEnter, onComplete }) {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), HINT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // 탭 = 첫 사용자 제스처. 이 제스처 안에서 onEnter()로 BGM을 켜고,
  // 동시에 Opening을 닫아 hero 진입 애니메이션을 시작한다.
  function enter() {
    if (!visible) return;
    onEnter?.();
    setVisible(false);
  }

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
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: WORD_STAGGER, delayChildren: WORD_DELAY },
              },
              hide: {
                opacity: 0,
                transition: { duration: 1.15, ease: 'easeInOut' },
              },
            }}
          >
            {WORDS.map((word) => (
              <motion.p
                key={word}
                variants={{
                  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: WORD_DURATION, ease: [0.22, 1, 0.36, 1] },
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
            animate={ready ? { opacity: [0, 0.7, 0.4, 0.7] } : { opacity: 0 }}
            transition={{ duration: 2.4, times: [0, 0.22, 0.6, 1], ease: 'easeInOut', repeat: Infinity }}
            aria-hidden="true"
          >
            tap to enter
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
