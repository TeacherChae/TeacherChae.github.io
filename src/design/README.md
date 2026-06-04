# 디자인 토큰 (Figma ⇄ 코드)

이 문서는 **UI/UX 디자이너(Figma)** 와 **프론트엔드(코드)** 가 색·타이포·간격을
어긋남 없이 공유하기 위한 단일 규칙서입니다.

## 큰 그림 — 단방향, 단일 출처

값은 **항상 한 방향으로만** 흐릅니다. 거꾸로(코드→Figma) 편집하지 마세요. 그게 "변수가 애매해지는" 주원인입니다.

```
Figma 변수 ──내보내기──► src/design/tokens.json ──npm run tokens:build──► src/styles/tokens.css ──참조──► tailwind.config.js ──► 컴포넌트
            (디자이너)        (스냅샷, 수정금지)                              (:root CSS 변수, 자동생성)        (var() 참조만)
```

- `tokens.json` — Figma에서 내보낸 스냅샷. **직접 수정 금지.**
- `tokens.css` — 자동 생성물. **직접 수정 금지.**
- `tailwind.config.js` — 값을 들고 있지 않고 **CSS 변수를 가리키기만** 함 (`var(--color-ink)`). 그래서 값은 세상에 딱 한 곳(`tokens.css`)에만 존재.

---

## ⚠️ 가장 중요한 규칙: 무엇을 Figma가 갖고, 무엇을 코드가 갖나

Figma 변수(Variables)는 **숫자·색·문자열**만 표현할 수 있습니다. 자간(letter-spacing)·행간(line-height)·그림자처럼
Figma 변수로 표현 못 하는 건 **코드가 소유**합니다. 이 경계를 지키면 round-trip 불일치가 사라집니다.

| 차원 | 소유 | 정의 위치 | 누가 바꾸나 |
|---|---|---|---|
| 색 (`paper`, `ink`) | **Figma** | tokens.json → tokens.css | 디자이너 |
| 글꼴 (`display`/`sans`/`mono`) | **Figma** | tokens.json → tokens.css | 디자이너 |
| 글자크기 (타이포 스케일) | **Figma** | tokens.json → tokens.css | 디자이너 |
| 간격 (`gutter` 등) | **Figma** | tokens.json → tokens.css | 디자이너 |
| **자간 (tracking)** | **코드** | `tailwind.config.js` | 개발자 |
| **행간 (leading)** | **코드** | `tailwind.config.js` | 개발자 |
| **그림자 (drop-shadow)** | **코드** | `tailwind.config.js` | 개발자 |

> 투명도(opacity)는 토큰을 늘리지 않습니다. 색은 `paper`/`ink` 단일 토큰만 두고, 반투명은 사용처에서
> `text-ink/55` 처럼 alpha 로 조절합니다. (채널 `R G B` 출력 덕분에 이 문법이 동작)

---

## 토큰 인벤토리 (현재 스케일)

**글자크기** — 임의값(`text-[48px]`) 금지. 항상 이름으로:
| 토큰 | 값 | 용도 | 클래스 |
|---|---|---|---|
| `opening` | clamp(…128px) | 오프닝 대문자 | `text-opening` |
| `hero` | clamp(…118px) | Hero 이름 | `text-hero` |
| `day` | 60 | SATURDAY · D-day 숫자 | `text-day` |
| `name` | 48 | 신랑신부 이름 | `text-name` |
| `venue` | 44 | 예식장 이름 | `text-venue` |
| `kicker` | 34 | 섹션 키커 | `text-kicker` |
| `quote` | 20 | 푸터 구절 | `text-quote` |
| `body` | 15 | 본문 | `text-body` |
| `small` | 13 | 보조 본문 | `text-small` |
| `micro` | 11 | 모노 메타 | `text-micro` |
| `label` | 10 | 작은 대문자 라벨 | `text-label` |

`opening`/`hero` 는 화면 폭에 따라 커지는 **반응형**입니다. 코드가 `clamp(min, 뷰포트, 상한)` 으로 처리하고,
**상한값만 Figma 토큰**(`--font-size-opening/hero`)이 정합니다. 디자이너는 "가장 클 때 크기"를 Figma에서 조절.

**자간(코드)**: `tracking-tighter`(-0.05) · `tight`(-0.035) · `wide`(0.08) · `wider`(0.16) · `widest`(0.22) · `ultra`(0.28) · `editorial`(0.32)
**행간(코드)**: `leading-flush`(0.86) · `cozy`(0.92) · `verse`(2.05) · 그 외 Tailwind 기본(`leading-none/relaxed/loose`)
**색**: `bg-paper` `text-ink` `text-ink/55` … · **글꼴**: `font-display` `font-sans` `font-mono` · **간격**: `px-gutter` `w-hairline-width` (`control-height`=44 는 탭타깃용 예비)

---

## 복합 타입 토큰 (type styles) — `.type-*`

위 글자크기·자간·행간을 **용도별로 묶은** 한 단계 위 토큰입니다. 한 토큰이 폰트·크기·행간·자간·케이스를
한 번에 정의합니다. **색은 일부러 제외** — 같은 헤드라인이 본문에선 `text-ink`, Hero에선 사진 위 `text-paper`라서
사용처에서 색을 붙입니다: `<h2 className="type-title text-ink">`, Hero는 `type-display text-paper`.

- 정의: `src/design/type-styles.json` (다중 필드 스펙) → `npm run tokens:build` → `src/styles/type-styles.css` 의 `.type-*` 생성.
- `font`/`size` 는 Figma 토큰 이름을, `leading`/`tracking` 은 코드 스케일 이름을 참조 → 단일 출처 유지.

| 토큰 | 계열 | 쓰임 |
|---|---|---|
| `type-opening` · `type-display` | headline | 오프닝 · Hero 이름 |
| `type-headline` · `type-title` · `type-subtitle` | headline | SATURDAY/D-day · 신랑신부 이름 · 예식장 |
| `type-kicker` · `type-quote` | headline | 섹션 헤더 · 푸터 구절 |
| `type-body` · `type-verse` · `type-scripture` · `type-caption` | text | 본문 · 인사말 · 성구 · 보조 |
| `type-overline` · `type-meta` · `type-data` | utility(mono) | eyebrow · 날짜/카운터 · 계좌번호 |

> 편의 클래스 `.eyebrow`(= `type-overline` + `text-ink/45`) 와 `.section-kicker`(= `type-kicker` + `text-ink`) 는
> 색까지 묶은 단축형으로 `index.css`에 유지됩니다.

**나중에 디자이너 소유로 승급(B):** Figma **Text Styles**(Variables와 달리 폰트·크기·행간·자간을 통째로 담음)를
플러그인이 `type-styles.json` 형식으로 내보내게 하면, 이 구조 그대로 디자이너가 복합 토큰을 소유하게 됩니다.

**Figma 반영 현황 (2026-06):** `type/*` Text Style **14종 전체**를 Figma에 생성했고, 각 스타일의 `font-size`는
Type 컬렉션 변수에 **바인딩**돼 있습니다(크기는 변수가 단일 출처). 행간·자간·케이스는 스타일 안의 값으로 코드와 일치.
- display 7종(Bodoni Moda) + mono 3종(IBM Plex Mono) — 정상.
- ⚠️ **sans 본문 4종**(`type/body`·`verse`·`scripture`·`caption`)은 현재 **Noto Sans KR 임시** 폰트입니다.
  Figma MCP는 클라우드(Google Fonts)에서 실행돼 **Pretendard(로컬 설치 폰트)에 접근 불가**하기 때문.
  → **TODO(디자이너):** 데스크톱 Figma에서 이 4개 Text Style의 폰트를 **Pretendard로 교체**하세요.
  (크기 변수 바인딩·행간·자간은 이미 세팅됨 — 폰트 패밀리만 바꾸면 끝. 각 스타일 description에도 표기.)

---

## 디자이너용: 혼자서 토큰 바꾸기 (self-serve)

### 1회만: Figma 플러그인 설치 (Figma 데스크톱 앱 필요)
1. Figma 데스크톱 앱에서 주경 파일을 엽니다.
2. **Plugins → Development → Import plugin from manifest…** → 이 레포의 `figma-plugin/manifest.json` 선택.

### 매번: 값 바꾸고 반영
1. Figma **Local variables** 패널에서 색/간격/글자크기 변수를 수정.
2. **Plugins → Development → 주경 토큰 내보내기** 실행 → **"tokens.json 다운로드"** → 받은 파일을 `src/design/tokens.json` 에 덮어쓰기.
3. PR 올리기. 끝. (개발자/CI가 `npm run tokens:build` 로 반영)

### 개발자용: 반영 확인
```bash
npm run tokens:build   # tokens.json → tokens.css 재생성 (dev/build 시 자동 실행됨)
npm run dev            # 또는 npm run build
```
`predev`/`prebuild` 훅에 `tokens:build` 가 연결돼 있어 **dev·build 시 항상 최신 tokens.css 가 생성**됩니다.

---

## 🔧 Figma 재동기화 TODO (1회)

2026-06 코드 리팩터에서 글자크기 스케일을 재정의했습니다(본문 `body/small/micro` 추가, `quote`=20, `opening/hero` 상한 조정).
**Figma의 Type 컬렉션을 위 인벤토리 값과 일치하도록 한 번 맞춰주세요.** 그래야 다음 내보내기가 코드와 어긋나지 않습니다.

---

## 변수가 다시 "애매"해지지 않게 — 체크리스트

1. 컴포넌트에 **원시값 금지**: `text-[#111]`·`text-[48px]`·`tracking-[0.2em]` 같은 임의값 대신 토큰 클래스(`text-ink`·`text-name`·`tracking-widest`).
2. `tailwind.config.js` 는 **값을 갖지 않는다** — Figma 소유 차원은 전부 `var(--…)`.
3. 생성물(`tokens.css`)·스냅샷(`tokens.json`) **손으로 수정 금지.** 값 변경은 항상 Figma에서 시작.
4. **안 쓰는 토큰은 만들지 않는다.** (예전 `soft`/forest·terracotta 색처럼 죽은 정의는 제거)
5. 새 디자인 차원이 필요하면 먼저 "Figma가 표현 가능한가?"를 묻고, 아니면 **코드 소유**로 위 표에 추가.

> 글꼴 주의: 토큰은 *이미 로드된 글꼴 간 교체*만 가능. Figma에서 완전히 새 글꼴로 바꾸면 `index.html` 에 그 글꼴을 추가(로딩)해야 화면에 보입니다.
