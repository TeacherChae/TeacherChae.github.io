# Wedding Invitation

`teacherchae.github.io`에 배포되는 모바일 청첩장.

---

## 스택

- **Vite 6** — 개발 서버 + 빌드 도구
- **React 18** — UI 컴포넌트
- **Tailwind CSS 3** — 스타일링
- **Supabase** — RSVP / 방명록 백엔드 (아직 미연결)
- **GitHub Pages + Actions** — 호스팅 + 자동 배포

## 디자인 톤

내추럴 로맨틱.

| 토큰 | 값 |
|---|---|
| 배경 | `#FAF7F2` (cream) |
| 본문 텍스트 | `#2F3F36` (forest) |
| 포인트 1 | `#8B9D7A` (sage) |
| 포인트 2 | `#C97D60` (terracotta) |
| 한글 폰트 | Pretendard |
| 영문 스크립트 | Italianno |
| 영문 세리프 | Cormorant Garamond |

`tailwind.config.js`에 컬러/폰트 등록되어 있어서 `bg-cream`, `text-forest`, `text-sage-dark`, `font-script` 같은 유틸리티로 사용.

## 디렉터리 구조

```
wedding-invitation/
├── .github/workflows/deploy.yml   # GitHub Actions → Pages 자동 배포
├── index.html                      # 진입 HTML + 폰트 CDN 로드
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                    # React 진입점
    ├── App.jsx                     # 7개 섹션을 한 페이지에 배치
    ├── index.css                   # Tailwind directives + 공통 컴포넌트 클래스
    ├── config/
    │   └── wedding.js              # ★ 모든 청첩장 데이터의 single source of truth
    └── components/
        ├── Hero.jsx                # 메인 (사진 + 신랑/신부 이름 + 날짜)
        ├── Greeting.jsx            # 인사말 + 양가 가족
        ├── Gallery.jsx             # 사진첩 (2열 그리드, 자리는 6칸 placeholder)
        ├── Location.jsx            # 식장 정보 + 지도 + 길찾기 + 교통/주차
        ├── Account.jsx             # 양가 계좌 + 복사 버튼
        ├── RSVP.jsx                # (Supabase 연동 예정 placeholder)
        └── Guestbook.jsx           # (Supabase 연동 예정 placeholder)
```

**기억할 한 가지**: 청첩장에 들어가는 모든 텍스트/숫자(이름, 날짜, 식장, 계좌, 인사말 등)는 **`src/config/wedding.js` 한 파일에만 있습니다**. 다른 곳 안 고쳐도 됨.

## 로컬 셋업 (다른 컴퓨터에서 이어서 작업하기)

```bash
# 1. 클론
git clone https://github.com/teacherchae/teacherchae.github.io.git wedding-invitation
cd wedding-invitation

# 2. Node 20 이상 필요 (nvm 권장)
node --version   # v20+ 확인

# 3. 의존성 설치
npm install

# 4. 개발 서버
npm run dev      # http://localhost:5173

# 5. 프로덕션 빌드 미리보기 (선택)
npm run build
npm run preview
```

## 배포 흐름

push 한 번이면 자동 배포.

```
git push origin main
   │
   ▼
.github/workflows/deploy.yml 트리거
   │
   ▼
npm ci → npm run build → dist/
   │
   ▼
actions/deploy-pages → https://teacherchae.github.io
```

- **수동 트리거 가능**: Actions 탭에서 `Deploy to GitHub Pages` → `Run workflow` (또는 `gh workflow run deploy.yml`)
- **PAT 불필요**: 같은 리포 안에서 배포하므로 기본 `GITHUB_TOKEN` 사용
- **선행 조건 (✅ 완료)**: Settings → Pages → Source = **GitHub Actions** — 이미 설정됨
- **리포는 public 이어야 함**: 무료 플랜에서 private 리포는 Pages 불가(`422`). 그래서 public으로 전환함

배포 상태: https://github.com/teacherchae/teacherchae.github.io/actions

## 진행 상태 (2026-05-22 기준)

| # | 작업 | 상태 |
|---|---|---|
| 1 | 디자인 톤 결정 (내추럴 로맨틱) | ✅ |
| 2 | Vite + React + Tailwind 셋업 | ✅ |
| 3 | 7개 섹션 컴포넌트 스캐폴드 (placeholder 콘텐츠) | ✅ (콘텐츠 채우기는 별도) |
| 4 | GitHub Actions 자동 배포 워크플로 | ✅ 배포 성공 |
| 5 | 첫 배포 + 모바일 실기기 확인 | 🟡 배포 ✅ · 실기기 확인 대기 |
| 6 | Supabase 프로젝트 생성 + 스키마 설계 | ⬜ |
| 7 | RSVP / 방명록 Supabase 연동 | ⬜ |
| 8 | 카카오톡 공유 + 메타태그 + 마무리 | ⬜ |

🌐 **라이브: https://teacherchae.github.io** (2026-05-22 배포·HTTP 200 확인)

## 다음에 이어서 할 일

### 배포 (✅ 완료 — 2026-05-22)
- 코드 push 완료 → 리포 **public** 전환 → Pages 소스 **GitHub Actions** 활성화 → 워크플로 배포 성공.
- 라이브 확인: https://teacherchae.github.io (HTTP 200, JS 번들 200, HTTPS 강제).
- ⏳ 남은 1건: **실제 휴대폰**에서 폰트(Pretendard/Italianno)·레이아웃·계좌 복사 버튼 확인.

> gh 계정 메모: 이 머신엔 `Keon2Chae`(기본)와 `TeacherChae`(리포 소유) 두 계정이 로그인돼 있음.
> 리포에 `gh api`/`gh run`/`gh workflow` 쓰려면 `gh auth switch`로 **TeacherChae** 활성화 필요.
> `git push`는 SSH alias(`github-teacherchae`)라 계정과 무관하게 동작.

### 콘텐츠 채우기
`src/config/wedding.js`의 placeholder(`○○`, `TBD`)를 실제 데이터로:
- 신랑/신부 한글·영문 이름
- 양가 부모님 성함
- 정확한 식장 이름, 주소, 홀, 연락처
- 양가 계좌 (은행/계좌번호/예금주)
- 인사말 본문
- 식 날짜·시간 (이미 입력됨: 2026-06-14 13:00, 필요하면 수정)
- 네이버/카카오 지도 URL (좌표 또는 검색 결과 링크)

`public/images/` 폴더 만들고 사진 추가 후, `wedding.js`의 `gallery` 배열에 경로 등록:
```js
gallery: [
  { src: '/images/01.jpg', alt: '본식 사진 1' },
  { src: '/images/02.jpg', alt: '본식 사진 2' },
  // ...
],
```

### Supabase 연동 (RSVP + 방명록)
1. https://supabase.com 가입, 새 프로젝트 생성
2. 테이블 2개 — `rsvp`, `guestbook`
3. Row Level Security 정책 설정 (anon에게 insert만 허용)
4. `.env.local` 에 URL/key 저장:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. `npm i @supabase/supabase-js`
6. `src/lib/supabase.js` 클라이언트 생성
7. RSVP, Guestbook 컴포넌트 폼 구현
8. GitHub repo Settings → Secrets에도 같은 env 추가 (Actions가 빌드 시 사용)

### 마무리
- Kakao SDK로 친구톡 공유 카드 (Kakao Developers에서 JS Key 발급)
- `index.html`에 `og:image`, `og:title`, `og:description` 추가 (카톡 미리보기용)
- 폰트 최적화 (Pretendard 서브셋), 이미지 lazy-load, Lighthouse 점수 점검

## 메모

- 모바일 우선 디자인. 데스크톱은 좌우에 여백 두고 가운데 460px로 표시.
- 모든 사용자 입력은 Supabase RLS로 보호. 욕설/스팸 방어는 클라이언트에서 1차, 필요하면 edge function 추가.
- `dist/`, `node_modules`, `.omc`, `.claude/settings.local.json`은 `.gitignore` 처리됨.
