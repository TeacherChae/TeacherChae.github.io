import { test, expect } from '@playwright/test';

// 입장 오버레이를 통과해 본문(Hero)까지 진입시키는 헬퍼.
async function enter(page) {
  await page.goto('/');
  const gate = page.getByRole('button', { name: '탭하여 입장하기' });
  await expect(gate).toBeVisible();
  await gate.click();
  // 오버레이 exit(~1.2s) 후 Hero 손글씨가 떠야 한다.
  await expect(page.getByRole('img', { name: 'We are getting married' })).toBeVisible({ timeout: 15_000 });
}

test.describe('청첩장 스모크', () => {
  test('입장 → Hero 렌더', async ({ page }) => {
    await enter(page);
    // 접근성용 제목 + 영문 이름 + 날짜
    await expect(page.getByRole('heading', { level: 1, name: '이주경 & 채건희' })).toBeAttached();
    await expect(page.getByText('JuGyeong Lee')).toBeVisible();
    await expect(page.getByText('KeonHee Chae')).toBeVisible();
    await expect(page.getByText('2026.09.05').first()).toBeVisible();
  });

  test('주요 섹션이 모두 존재한다', async ({ page }) => {
    await enter(page);
    const expectVisible = async (txt) =>
      expect(page.getByText(txt, { exact: false }).first()).toBeVisible();

    await expectVisible('THE WEDDING OF');          // DateVenue
    await expectVisible('2026년 9월 5일 토요일');     // 날짜 풀텍스트
    await expectVisible('남산 한남 웨딩가든');         // venue
    await expectVisible('MARK 10:7-9');             // Invitation 성구
    await expectVisible('오시는 길');                 // Location
    await expectVisible('셔틀 버스 안내');             // Location 교통 안내
    await expectVisible('대중 교통 안내');             // Location 대중교통
    await expectVisible('공영 주차장 안내');           // Location 주차
    await expectVisible('참석 여부');                 // RSVP 섹션
    await expectVisible('식장이 협소하여 화환은 정중히 사양하오니 양해 부탁드립니다.');
    await expectVisible('방명록');                    // Guestbook
    await expectVisible('마음 전하실 곳');             // Account
    await expect(page.getByText('신랑 측').first()).toBeVisible();
    await expect(page.getByText('신부 측').first()).toBeVisible();
    await expectVisible('COUNTDOWN');                // Dday
    await expect(page.getByText('Arise My Love,').first()).toBeVisible(); // Footer
    await expect(page.getByText('J & K · 2026')).toBeVisible();
  });

  test('지도/캘린더 링크 버튼', async ({ page }) => {
    await enter(page);
    await expect(page.getByRole('link', { name: /NAVER MAP/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /KAKAO MAP/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /GOOGLE MAP/ })).toBeVisible();
    await expect(page.getByText('ADD TO CALENDAR')).toBeVisible();

    const calendarTop = await page.getByText('ADD TO CALENDAR').evaluate((el) => el.getBoundingClientRect().top);
    const accessTop = await page.getByRole('button', { name: /셔틀 버스 안내/ }).evaluate((el) => el.getBoundingClientRect().top);
    expect(calendarTop).toBeLessThan(accessTop);
  });

  test('교통 안내를 선택해서 펼쳐 볼 수 있다', async ({ page }) => {
    await enter(page);
    const shuttle = page.getByRole('button', { name: /셔틀 버스 안내/ });
    const detail = page.getByText('예식 1시간 전부터 10분 간격으로 출발합니다.');

    await expect(shuttle).toBeVisible();
    await expect(shuttle).toHaveAttribute('aria-expanded', 'false');
    await expect(detail).toBeHidden();

    await shuttle.click();
    await expect(shuttle).toHaveAttribute('aria-expanded', 'true');
    await expect(detail).toBeVisible();
  });

  test('갤러리 라이트박스 열고 닫기', async ({ page }) => {
    await enter(page);
    const firstSlide = page.getByRole('button', { name: /사진 크게 보기 \(1\/7\)/ });
    await firstSlide.scrollIntoViewIfNeeded();
    await firstSlide.click();
    await expect(page.getByRole('button', { name: '닫기' })).toBeVisible();
    await page.getByRole('button', { name: '닫기' }).click();
    await expect(page.getByRole('button', { name: '닫기' })).toBeHidden();
  });

  // 실제 Supabase 기록 방지를 위해 SEND RSVP 는 누르지 않는다 — 입력/토글까지만.
  test('RSVP 폼 입력 상호작용 (제출 안 함)', async ({ page }) => {
    await enter(page);
    const placeholder = page.getByText('RSVP 준비 중');
    if (await placeholder.count()) {
      test.info().annotations.push({ type: 'note', text: 'Supabase 미설정 → RSVP 폼 대신 플레이스홀더' });
      await expect(placeholder).toBeVisible();
      return;
    }
    const name = page.getByPlaceholder('성함을 입력해 주세요');
    await name.scrollIntoViewIfNeeded();
    await name.fill('홍길동');
    await expect(name).toHaveValue('홍길동');

    await page.getByRole('button', { name: '신랑 측' }).click();
    // 참석 O → 식사/동행 인원 섹션이 나타난다
    await page.getByRole('button', { name: 'O', exact: true }).first().click();
    await expect(page.getByText('식사 여부')).toBeVisible();
    await expect(page.getByText('동행 인원')).toBeVisible();
    // 제출 버튼은 존재만 확인 (클릭 X)
    await expect(page.getByRole('button', { name: /SEND RSVP/ })).toBeEnabled();
  });
});
