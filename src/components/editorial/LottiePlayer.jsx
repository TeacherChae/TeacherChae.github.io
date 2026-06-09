import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useReducedMotion } from 'framer-motion';

// 무거운 dotLottie 플레이어를 담는 격리 청크(HeroLottie 가 lazy 로 불러온다).
// 이 파일에서만 @lottiefiles/dotlottie-react 를 import 하므로, 해당 의존성 전체가 이 청크로 빠진다.
export default function LottiePlayer({ src, label }) {
  const reduce = useReducedMotion();

  return (
    <div className="w-[min(90vw,520px)]" role="img" aria-label={label}>
      <DotLottieReact
        src={src}
        autoplay={!reduce}
        loop={!reduce}
        // reduced-motion 환경에서는 자동재생/루프 없이 첫 프레임만 정적으로 노출.
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
