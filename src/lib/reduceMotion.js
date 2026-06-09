import { useReducedMotion } from 'framer-motion';

// prefers-reduced-motion 을 존중하되, "강제 재생" 오버라이드를 더한 공유 훅.
//
// 왜 필요한가: 실제 게스트 중 접근성상 모션을 끈 사람에겐 정적으로 보여야 하지만,
// 개발자가 데스크톱에서 자주 확인할 때는 OS reduced-motion 설정 때문에 애니메이션을
// 못 보는 불편이 있다. 그래서 아래 조건이면 reduced-motion 을 "무시"(=false)한다.
//
//  - 로컬 개발(`npm run dev`) 중: 항상 재생
//  - localStorage `forceMotion === '1'`: 항상 재생 (배포 사이트에서도 유지)
//      → 주소에 `?motion=force` 한 번 붙이면 켜지고, `?motion=user` 로 끈다.
//
// 주의: framer-motion 공개 훅 useReducedMotion() 은 MotionConfig 를 따르지 않고
//       OS matchMedia 만 보므로, 오버라이드를 여기서 직접 합성한다.

// URL ?motion=force|user 를 1회 반영해 localStorage 에 저장한다(앱 시작 시 호출).
export function syncMotionPreferenceFromUrl() {
  try {
    const m = new URLSearchParams(window.location.search).get('motion');
    if (m === 'force') localStorage.setItem('forceMotion', '1');
    if (m === 'user') localStorage.removeItem('forceMotion');
  } catch {
    /* localStorage 접근 불가(시크릿 등) — 무시 */
  }
}

// 강제 재생 여부(개발/미리보기 확인용).
export function isMotionForced() {
  try {
    if (localStorage.getItem('forceMotion') === '1') return true;
  } catch {
    /* 무시 */
  }
  return import.meta.env.DEV;
}

// 컴포넌트용 훅: 강제 재생이면 false, 아니면 OS 의 prefers-reduced-motion.
export function useReduceMotion() {
  const systemReduce = useReducedMotion();
  return isMotionForced() ? false : systemReduce;
}
