import { defineConfig, devices } from '@playwright/test';

// 청첩장은 모바일(특히 iOS Safari)에서 대부분 열리므로 WebKit을 1급으로 둔다.
// dev 서버는 Playwright가 자동으로 띄우고 내린다(webServer).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 1, // 큰 원본 사진 세트를 로컬 dev server에서 안정적으로 검증
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    reducedMotion: 'reduce', // 진입/스크롤 모션을 끄고 콘텐츠를 즉시 평가
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } }, // WebKit = iOS Safari 엔진 (핵심)
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },   // Chromium
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
