import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css'; // Figma 변수 → CSS 변수 (index.css 보다 먼저 로드)
import './styles/type-styles.css'; // 복합 타입 토큰(.type-*) — tokens.css 의 변수를 조합
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
