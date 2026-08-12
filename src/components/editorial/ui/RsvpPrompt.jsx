import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReduceMotion } from '../../../lib/reduceMotion.js';

const DISMISSED_KEY = 'wedding-rsvp-prompt-dismissed';

export default function RsvpPrompt() {
  const reduce = useReduceMotion();
  const [eligible, setEligible] = useState(false);
  const [rsvpVisible, setRsvpVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY) === '1') return undefined;
    const location = document.getElementById('location');
    const rsvp = document.getElementById('rsvp');
    if (!location || !rsvp) return undefined;

    const locationObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setEligible(true),
      { threshold: 0.2 },
    );
    const rsvpObserver = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    locationObserver.observe(location);
    rsvpObserver.observe(rsvp);
    return () => {
      locationObserver.disconnect();
      rsvpObserver.disconnect();
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setEligible(false);
  }

  function goToRsvp() {
    dismiss();
    document.getElementById('rsvp')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <AnimatePresence>
      {eligible && !rsvpVisible && (
        <motion.aside
          className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-[472px] border border-ink/20 bg-paper px-5 py-4 shadow-2xl"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="참석 여부 안내"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="참석 여부 안내 닫기"
            className="absolute right-3 top-2 p-2 text-small text-ink/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink/60"
          >
            ×
          </button>
          <p className="pr-7 font-titleKo text-body tracking-wider text-ink">참석 여부를 알려주세요</p>
          <p className="mt-2 text-small leading-relaxed text-ink/60">원활한 예식 준비에 도움이 됩니다.</p>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <button type="button" className="editorial-button-primary" onClick={goToRsvp}>작성하기</button>
            <button type="button" className="editorial-button-secondary" onClick={dismiss}>나중에</button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
