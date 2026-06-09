import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { syncMotionPreferenceFromUrl } from './lib/reduceMotion.js';
import './styles/fonts.css'; // 직접 호스팅 @font-face (MaruBuri) — 변수보다 먼저 등록
import './styles/tokens.css'; // Figma 변수 → CSS 변수 (index.css 보다 먼저 로드)
import './styles/type-styles.css'; // 복합 타입 토큰(.type-*) — tokens.css 의 변수를 조합
import './index.css';

// 첫 렌더 전에 ?motion=force|user 를 localStorage 에 반영(데스크톱 확인용 강제 재생 토글).
syncMotionPreferenceFromUrl();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
