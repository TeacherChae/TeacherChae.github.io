import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

// 배경 음악 — 브라우저 자동재생 차단을 첫 사용자 제스처로 우회한다.
// Opening 화면의 'tap to enter' 탭이 곧 첫 제스처이므로, 그 탭에서 start()를 호출해
// hero 진입과 동시에 재생을 시작한다(부모가 ref 로 호출).
// 우상단 음소거 토글로 끌 수 있고, 한 번 끄면 다시 탭으로 켜지지 않는다.
const Bgm = forwardRef(function Bgm({ src = '/audio/bgm.mp3', volume = 0.5 }, ref) {
  const audioRef = useRef(null);
  const userMutedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  // 부모(App)가 Opening 탭 제스처 안에서 호출 → 자동재생 정책 통과.
  useImperativeHandle(
    ref,
    () => ({
      start() {
        const audio = audioRef.current;
        if (!audio || userMutedRef.current) return;
        audio.play().catch(() => {}); // 차단되면 조용히 무시
      },
    }),
    [],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    audio.volume = volume;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [volume]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userMutedRef.current = false;
      audio.play().catch(() => {});
    } else {
      userMutedRef.current = true;
      audio.pause();
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? '배경 음악 끄기' : '배경 음악 켜기'}
        aria-pressed={playing}
        className="fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-paper/70 text-ink backdrop-blur transition hover:bg-paper"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* 음표 */}
          <path d="M9 18V6l10-2v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
          {/* 음소거 상태: 사선 */}
          {!playing && <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" />}
        </svg>
      </button>
    </>
  );
});

export default Bgm;
