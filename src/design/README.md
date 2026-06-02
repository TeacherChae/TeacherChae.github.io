# 디자인 토큰 (Figma → 코드)

**Figma 변수가 source of truth**입니다. 색·간격·글자크기를 Figma의 Local Variables에서 바꾸고,
그 값을 이 레포로 가져와 사이트 전체에 반영합니다.

```
Figma 변수  ──(내보내기)──►  src/design/tokens.json  ──(빌드)──►  src/styles/tokens.css  ──►  Tailwind/사이트
```

- `tokens.json` — Figma에서 내보낸 스냅샷. **직접 수정하지 마세요.**
- `scripts/figma-tokens-to-css.mjs` — `tokens.json` → `tokens.css` 변환기 (`npm run tokens:build`)
- `src/styles/tokens.css` — 자동 생성물. `tailwind.config.js`의 `paper`/`ink`가 이 CSS 변수를 참조.

---

## 혼자서 토큰 바꾸는 법 (self-serve)

### 1회만: Figma 플러그인 설치 (Figma 데스크톱 앱 필요)
1. Figma 데스크톱 앱에서 주경 파일을 엽니다.
2. 상단 메뉴 **Plugins → Development → Import plugin from manifest…**
3. 이 레포의 **`figma-plugin/manifest.json`** 을 선택합니다.
   → 이제 플러그인 목록에 "주경 토큰 내보내기"가 생깁니다.

### 매번: 값 바꾸고 반영하기
1. Figma에서 **Local variables** 패널을 열어 색/간격/글자크기 변수를 수정합니다.
   (Dev Mode면 `Shift+D`로 편집 모드 전환 후, Default 열의 스와치 클릭 → HEX 입력)
2. **Plugins → Development → 주경 토큰 내보내기** 실행.
3. 뜬 창에서 **"tokens.json 다운로드"** 클릭 → 받은 파일을 **`src/design/tokens.json`** 위치에 덮어씁니다.
   (또는 "클립보드에 복사" 후 파일에 붙여넣기)
4. 터미널에서:
   ```bash
   npm run tokens:build
   npm run build      # 또는 npm run dev 로 확인
   ```
5. 변경분 커밋 → push.

---

## 어떤 토큰이 있나
| 컬렉션(Figma) | 토큰 | 코드에서 |
|---|---|---|
| Color | `paper`, `ink` | `bg-paper`, `text-ink`, `text-ink/55`, `bg-ink/20` … |
| Font | `display`, `sans`, `mono` | `font-display`, `font-sans`, `font-mono` |
| Type | `hero`, `name`, `kicker`, `label` | `text-hero`, `text-name`, `text-kicker`, `text-label` |
| Spacing | `gutter`(24), `control-height`(44), `hairline-width`(48) | `px-gutter`, `h-control-height`, `w-hairline-width` |

연결된 곳(공용 클래스): `.section-kicker`(text-kicker), `.eyebrow`(text-label), `.editorial-section`(px-gutter), `.hairline`(w-hairline-width), 그리고 body 전체 글꼴(font-sans).

**투명도 원칙**: 색은 `paper`/`ink` **단일 토큰**만 둔다. 반투명이 필요하면 토큰을 더 만들지 말고
사용처에서 alpha 를 조절한다 — 코드는 `text-ink/55`, Figma는 `ink`에 연결 후 레이어 opacity 조절.

> ⚠️ **글꼴 종류 주의**: 토큰은 *이미 로드된 글꼴들 사이의 교체*만 가능합니다. Figma에서 `font/display`를
> 완전히 새로운 글꼴로 바꾸면, 그 글꼴을 `index.html`에 추가(로딩)하지 않는 한 화면엔 안 보입니다.
>
> 참고: 개별 컴포넌트의 `text-[48px]` 같은 일부 고정값은 아직 토큰화 안 됨(원하면 더 연결 가능).
