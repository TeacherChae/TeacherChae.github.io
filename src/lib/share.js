// 공유 유틸 — 카카오톡 공유 + 링크 복사 + 네이티브 공유 폴백.
// 카카오 공유는 VITE_KAKAO_JS_KEY 가 설정된 경우에만 동작하고,
// 키가 없으면 모바일 네이티브 공유 시트(카카오톡 포함) 또는 클립보드 복사로 자연스럽게 폴백한다.
import { wedding } from '../config/wedding.js';

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const DEPLOY_ORIGIN = 'https://teacherchae.github.io';

function siteUrl() {
  if (typeof window !== 'undefined') return window.location.href.split('#')[0];
  return `${DEPLOY_ORIGIN}/`;
}

// 카카오는 절대 URL 의 이미지가 필요하다. 배포 도메인 기준으로 만든다.
function imageUrl() {
  const img = wedding.share.image;
  return img.startsWith('http') ? img : DEPLOY_ORIGIN + img;
}

let kakaoReady = null;
function loadKakao() {
  if (!KAKAO_KEY || typeof window === 'undefined') return Promise.resolve(false);
  if (kakaoReady) return kakaoReady;
  kakaoReady = new Promise((resolve) => {
    if (window.Kakao) {
      ensureInit();
      return resolve(true);
    }
    const s = document.createElement('script');
    s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      ensureInit();
      resolve(true);
    };
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  return kakaoReady;
}

function ensureInit() {
  if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(KAKAO_KEY);
}

export function hasKakaoKey() {
  return Boolean(KAKAO_KEY);
}

// 카카오 공유 시도 → 불가하면 네이티브 공유/복사로 폴백.
export async function shareKakao() {
  const ok = await loadKakao();
  if (!ok || !window.Kakao?.Share) return shareNative();
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: wedding.share.title,
      description: wedding.share.description,
      imageUrl: imageUrl(),
      link: { mobileWebUrl: siteUrl(), webUrl: siteUrl() },
    },
    buttons: [
      { title: '청첩장 보기', link: { mobileWebUrl: siteUrl(), webUrl: siteUrl() } },
    ],
  });
  return 'shared';
}

// 모바일 네이티브 공유 시트(가능 시) → 실패/미지원 시 링크 복사.
export async function shareNative() {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: wedding.share.title,
        text: wedding.share.description,
        url: siteUrl(),
      });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  return copyLink();
}

export async function copyLink() {
  try {
    await navigator.clipboard.writeText(siteUrl());
    return 'copied';
  } catch {
    return 'error';
  }
}
