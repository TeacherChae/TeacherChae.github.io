import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // 손글씨 애니메이션 데모 (메인 청첩장과 분리된 미리보기 페이지)
        handwriting: resolve(__dirname, 'handwriting-demo.html'),
      },
    },
  },
});
