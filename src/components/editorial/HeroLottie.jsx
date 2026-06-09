import { Suspense, lazy, useEffect, useState } from 'react';

// 무거운 dotLottie 플레이어(wasm 포함)는 별도 청크로 격리해, 실제 에셋이 존재할 때만 lazy-load 한다.
// → 에셋이 없으면(fallback 만 쓰는 상태) 플레이어 청크를 아예 내려받지 않는다.
const LottiePlayer = lazy(() => import('./LottiePlayer.jsx'));

// Hero 손글씨를 Lottie 애니메이션으로 재생한다.
// 에셋은 public/lottie/ 에 두며(파일명 규칙은 그곳 README 참고), 파일이 아직 없으면
// fallback(현 SVG 손글씨)을 그대로 보여줘서 사이트가 비지 않게 한다.
// .lottie(dotLottie) 와 .json(Bodymovin) 둘 다 지원 — 아래 순서대로 존재하는 첫 파일을 쓴다.
const DEFAULT_SOURCES = ['/lottie/hero.lottie', '/lottie/hero.json'];

// 후보 경로들을 순서대로 HEAD 로 찔러 실제 존재하는 첫 파일을 고른다.
async function resolveSource(sources) {
  for (const src of sources) {
    try {
      const res = await fetch(src, { method: 'HEAD' });
      if (res.ok) return src;
    } catch {
      /* 네트워크 오류는 다음 후보로 */
    }
  }
  return null;
}

export default function HeroLottie({ label, fallback = null, sources = DEFAULT_SOURCES }) {
  const [src, setSrc] = useState(undefined); // undefined=확인중, null=없음, string=존재

  useEffect(() => {
    let active = true;
    resolveSource(sources).then((found) => {
      if (active) setSrc(found);
    });
    return () => {
      active = false;
    };
  }, [sources]);

  // 확인 중 · 에셋 없음 → 플레이어 청크를 건드리지 않고 fallback 만 렌더.
  if (src === undefined || src === null) {
    return fallback;
  }

  // 에셋이 있을 때만 무거운 플레이어 청크를 받아온다. 로딩 동안엔 fallback 으로 자리를 채운다.
  return (
    <Suspense fallback={fallback}>
      <LottiePlayer src={src} label={label} />
    </Suspense>
  );
}
