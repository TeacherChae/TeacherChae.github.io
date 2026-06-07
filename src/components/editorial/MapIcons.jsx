// 지도 서비스 브랜드 아이콘(공식 컬러). 모노톤 버튼 안에서 식별성용으로만 사용.
// Naver/Kakao 는 앱 아이콘 형태(컬러 사각형 + 마크), Google 은 공식 4색 핀.

export function NaverIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="5" fill="#03C75A" />
      {/* simple-icons 의 N 글리프를 중앙에 축소 배치 */}
      <g transform="translate(5.4 5.4) scale(0.55)">
        <path fill="#fff" d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z" />
      </g>
    </svg>
  );
}

export function KakaoIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="5" fill="#FEE500" />
      {/* 카카오톡 말풍선(꼬리 포함) */}
      <path
        fill="#3C1E1E"
        d="M12 6.1c-3.8 0-6.9 2.43-6.9 5.43 0 1.94 1.3 3.64 3.26 4.63-.14.5-.52 1.9-.6 2.2-.1.37.13.36.28.26.12-.08 1.87-1.27 2.63-1.79.42.06.87.1 1.33.1 3.8 0 6.9-2.43 6.9-5.43S15.8 6.1 12 6.1z"
      />
    </svg>
  );
}

export function GoogleMapIcon({ className = '' }) {
  // 공식 Google Maps 핀(2020) — 세로 핀이라 width 는 height 에 비례.
  return (
    <svg viewBox="0 0 92.3 132.3" className={className} aria-hidden="true" focusable="false">
      <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z" />
      <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z" />
      <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3" />
      <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3" />
      <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2" />
    </svg>
  );
}
