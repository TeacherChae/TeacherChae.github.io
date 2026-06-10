# PRD — 청첩장 손글씨 캘리그래피 "써지는" 애니메이션

> **2026-06 갱신**: 1차 구현 완료 상태를 반영. 채택 엔진은 **React + framer-motion**
> (사이트 기존 의존성, 추가 설치 0). GSAP 도입 여부 비교는 §5.D에 유지.
> §5.E는 2026-06 프로토타입 검증 결과(가변 폭 생성 규칙·코너 spike 주의점) 반영.

## 1. 배경 / 목적

웨딩 청첩장 웹사이트(GitHub Pages 호스팅)에 **"We are getting married"** 문구가
펜으로 직접 쓰이는 것처럼 한 글자씩 그려지는 애니메이션을 넣는다.

영상(GIF/mp4)이나 Lottie 마켓 애셋은 다음 이유로 배제했다:

- **GIF**: 1비트 투명도라 글자 가장자리 헤일로/계단 현상, 용량 문제.
- **Lottie 마켓 애셋**: 캘리그래피는 글자가 outline 셰이프로 굳어 있어 문구 수정 불가
  (영문→다른 문구 교체 불가).
- **한글 싱글라인 폰트**: 사실상 존재하지 않음 → 문구는 **영문**으로 확정.

결론적으로 **싱글라인/시그니처 폰트 → SVG path 변환 → framer-motion `pathLength`
드로잉** 경로를 택했다. 사이트가 이미 React + framer-motion 스택이므로
**신규 외부 의존성 0**. (초기 "순수 vanilla JS" 원칙은 이 조건으로 대체 — §4 참고)

## 2. 핵심 개념 — 폰트 종류에 따라 애니메이션 기법이 다르다

이번 작업의 가장 중요한 제약. 폰트는 두 종류로 나뉘며, 각각 다른 기법을 써야 한다.

| 폰트 종류 | 글자 구조 | 애니메이션 기법 |
|---|---|---|
| **싱글라인 (centerline)** | 글자가 중심선 1개 패스. `fill:none`+`stroke` | `pathLength` 드로잉 (진짜 펜 드로잉) ✅ |
| **외곽선 (filled outline)** | 글자가 윤곽선을 채운 fill 셰이프 | **마스크/클립 reveal** (왼→오 쓸어 드러내기) |

> ⚠️ 외곽선 폰트에 stroke 드로잉을 쓰면 글자 **테두리만** 따라 그려져
> 부자연스럽다. 반드시 위 표대로 기법을 적용할 것.

### pathLength(=stroke-dashoffset) 드로잉 원리
패스의 dash 한 칸 길이를 패스 전체 길이와 같게 만들고, dashoffset을 그 길이만큼
밀면 선이 사라진다. offset을 0으로 줄이면 시작점→끝점으로 선이 차오른다.
센터라인 폰트라서 "펜이 지나간 길"이 곧 패스이므로 자연스럽게 써진다.
framer-motion은 이를 `motion.path`의 `pathLength` 0→1 prop으로 추상화하며,
SVG `pathLength` 속성 정규화를 쓰므로 `getTotalLength()` 브라우저 편차의 영향도
받지 않는다(우리 코드는 길이를 **타이밍 계산에만** 사용).

### 마스크 reveal 원리
완성된 fill 글자 위에, 왼쪽에서 오른쪽으로 폭이 늘어나는 사각형 마스크(clip)를
씌워 글자를 점진적으로 드러낸다. cursive가 좌→우로 흐르므로 "써지는" 것처럼 읽힌다.
글자별로 마스크 구간을 나누면 글자 단위 순차 reveal도 가능.

## 3. 에셋

### 리포에 커밋된 것 (현재 사용 중)

| 파일 | 용도 |
|---|---|
| `docs/fonts/svg/wearegettingmarried_inked{,_c15,_c20}.svg` | 2레이어(pen+ink) 에셋 3종 — **두 variant 공용 단일 소스**, 폭 대비 단계별 |
| `docs/fonts/ttf/AstutelySingleLine-VGj3l.ttf` | 원본 폰트 (문구 변경 시 §8로 재생성) |
| `docs/fonts/svg/Wearegettingmarried-578431.svg` | 구형 centerline 에셋 — 코드에서 더 이상 사용하지 않음(참고용) |

문구 **"We are getting married"**, 색 `#2b2b2b`, 좌표계 변환 처리 완료.

### 미커밋 (검토 단계 산출물)

외곽선 폰트 4종 SVG(Hey Beauty, Bestfriend Signature, Baked Salmon, Antically)는
폰트 선정 과정에서 생성했으나 Astutely 채택 후 리포에 넣지 않았다.
비교가 다시 필요하면 §8 스크립트로 재생성한다(외곽선 모드).

### SVG 구조 (2레이어 에셋)
- `<g id="ink">` 가변 폭 잉크 폴리곤(fill) + `<g id="pen">` 센터라인(stroke),
  **펜 획 단위 `ink-N`/`pen-N` 1:1 페어**가 필기 순서대로 수록됨.
- 좌표는 y-flip·배치·스케일이 전부 **절대좌표로 베이크**됨(transform 없음,
  높이 150 viewBox). 루트에 `data-mask-width`(마스크 stroke 폭) 등 메타 포함.
- 획 분리('t'=줄기+가로획, 'i'=점+줄기)·필기 순서·방향·retrace 절단은
  생성기가 확정(§5.A) — 런타임은 파싱만 한다.

## 4. 요구사항

### 기능 (✅ = 구현 완료)
1. ✅ 싱글라인 폰트에 `pathLength` 드로잉으로 "써지는" 애니메이션.
2. ✅ **글자 길이에 비례한 타이밍** — `getTotalLength()` 실측 → 긴 글자는 오래,
   짧은 글자는 짧게. (균일 속도 금지)
3. ✅ **이어쓰기**: 이어지는 필기체 글자는 휴지 없이 한 호흡으로, 끊기는 곳은
   펜 리프트 휴지(§5.C 이어쓰기 자동 판별).
4. ✅ 뷰포트 진입 시 **1회만** 재생 (`useInView({ once: true, amount: 0.4 })`).
5. ✅ **완료 콜백**: 마지막 획이 끝나면 `onComplete` 호출 → Hero에서 신랑·신부
   이름과 날짜가 손글씨 완료 후 등장. 콜백 누락 대비 **7초 안전 타이머** 병행.
6. ⬜ (보류) 여러 폰트를 나란히 비교하는 데모 — Astutely 채택으로 우선순위 하락.
   현재 데모는 단일 폰트 + 파라미터 튜닝용.

### 비기능 / 제약
- **신규 외부 의존성 0.** React + framer-motion은 사이트 기존 스택이므로 허용.
  그 외 라이브러리(GSAP 등)는 §5.D의 판단 기준을 통과할 때만 도입하고,
  도입 시 이 조항에 예외를 명시할 것.
- **`prefers-reduced-motion: reduce`** 존중 → 애니메이션 없이 완성 글씨 즉시 표시.
  단, 개발/시연 편의를 위한 **오버라이드** 존재(`src/lib/reduceMotion.js`):
  - 로컬 dev(`npm run dev`)에서는 항상 재생.
  - URL `?motion=force` → localStorage에 저장돼 배포 사이트에서도 강제 재생,
    `?motion=user`로 해제. (게스트 기본 동작은 OS 설정 존중)
- 모바일 대응(반응형 폭, `viewBox` 기반 스케일).
- 접근성: `<svg>`에 `role="img"` + `aria-label="We are getting married"`.
- 조절 파라미터는 상수가 아닌 **컴포넌트 props**로 노출:

  | prop | 기본값 | 의미 |
  |---|---|---|
  | `pxPerSec` | 700 | 펜 속도 (Hero는 기본값 사용) |
  | `strokeWidth` | 5 (Hero 4) | 선 두께, viewBox 단위 |
  | `ink` | `#2b2b2b` (Hero `currentColor`) | 잉크 색 |
  | `startDelay` | 0.2 (Hero 0.6) | 진입 후 첫 획 지연(sec) |
  | `replayKey` | 0 | 변경 시 처음부터 재생(데모용) |
  | `forceMotion` | false | reduced-motion 무시(데모용) |
  | `curveDrama` | 1 | 커브 감속 과장(0.4~2 권장) — 직선 빠르게, 커브 느리게 |
  | `liftDrama` | 1 | 획 간 휴지 배율(0~3) — 0이면 휴지 없음 |
  | `variant` | `'centerline'` | `'inked'`=가변 폭 잉크 + 마스크 reveal(§5.E) |
  | `texture` | false | inked 전용 — feTurbulence 거친 잉크 가장자리 |
  | `inkContrast` | 1 | inked 전용 — 획 안 폭 대비 단계(1·1.5·2, 사전 생성 에셋 전환) |
  | `onComplete` | — | 전체 완료 1회 콜백 |

## 5. 구현

### A. 싱글라인 (Astutely) — framer-motion `pathLength` ✅ 구현 완료

핵심 파일:

- `src/components/handwriting/HandwritingMarried.jsx` — 본체.
- `src/demo/HandwritingDemo.jsx` + `handwriting-demo.html` — 튜닝 데모
  (속도/두께/색/감속/휴지 슬라이더, variant·텍스처 토글, 리플레이, reduced-motion 진단 배너).
- `src/components/editorial/Hero.jsx` — 청첩장 통합.

동작 방식과 주의점(코드에 주석으로도 기록됨):

1. 2레이어 에셋(§3)을 `?raw` import → `DOMParser`로 pen/ink 레이어 파싱.
   글자를 코드에 박지 않으므로 **SVG 파일만 교체하면 문구/폰트 변경 반영**.
   centerline variant는 pen 레이어를 가시 stroke로 직접 그리고, inked는
   같은 pen을 마스크로 쓴다 — **획 분리·필기 순서·방향은 전부 생성기가
   확정**하므로 런타임 휴리스틱이 없다. 생성기의 펜 경로 규칙:
   - **retrace 절단**: TrueType 윤곽은 닫혀 있어 이 폰트의 획은 끝까지 갔다가
     **같은 선을 그대로 되돌아온다**(i 윗점 제외 전 획이 전후 대칭).
     절단하지 않으면 획 후반 절반이 아무것도 안 그리는 죽은 시간이 되고
     끝점이 가짜라 이어쓰기 판별도 불가능하다 → 대칭이면 전반부만 남긴다.
   - 필기 순서: 긴 획(줄기) 먼저, 짧은 획('t' 가로획)은 줄기 뒤.
   - **'i'/'j'**: 줄기 꼭대기보다 완전히 위에 있는 짧은 획(점)을 **먼저** 찍고,
     줄기는 retrace 절단 후 꼭대기에서 끝나므로 **통째로 뒤집어 위→아래**로
     긋는다.
2. `useLayoutEffect`에서 각 path의 `getTotalLength()` 실측 →
   `duration = max(0.12, len / pxPerSec)`, delay는 순차 누적 + 휴지(§5.C).
3. 각 획은 `motion.path`의 `pathLength` 0→1 + 곡률 기반 커스텀 ease(§5.C).
4. **round line-cap 점 문제**: `stroke-linecap: round`는 pathLength 0에서도
   시작점에 점을 찍는다 → 자기 차례 전까지 `opacity: 0`으로 숨겼다가 그릴 때 켠다.
5. **transform 충돌**: 글자 가로 배치 `translate`를 `motion.path`에 직접 주면
   framer-motion이 style transform으로 덮어쓴다 → 일반 `<g>` 래퍼에 둔다.
6. 마지막 path의 `onAnimationComplete`를 전체 완료로 간주 → `onComplete` 1회 호출.

### B. 외곽선 폰트 — 마스크 reveal ⬜ 미구현 (외곽선 폰트 채택 시)

글자별 fill path를 그대로 두고, **클립 사각형의 너비를 0→full로 애니메이션**.
framer-motion이면 `<clipPath>` 안의 `motion.rect`에 `width`를 애니메이션하면 된다.
글자 단위 순차는 각 path의 `getBBox()`로 글자별 clip rect를 만들어
좌→우 확장 + delay 누적 (A의 타이밍 로직 재사용, 길이 대신 bbox 너비 비례).

> reduced-motion일 때: clip rect를 처음부터 full width로 두면 완성 상태로 표시.

### C. 곡률 기반 속도 모델 — 2/3 거듭제곱 법칙 ✅ 구현 완료 (기본 채택)

획 단위 `easeInOut`만으로는 획 시작/끝에서만 가감속하고, 획 **중간의 곡선
변화는 무시**된다. 진짜 사람 손글씨처럼 보이도록 운동제어 연구의
**two-thirds power law**를 적용했다:

> **v(s) = K · κ(s)^(−1/3)**  (v=접선 속도, κ=곡률)
> 급한 커브에서 느려지고 직선/완만한 구간에서 빨라진다. 사람 눈은 이 패턴에
> 민감해서, 균일 속도 모션은 즉시 "기계적"으로 느껴진다.

**구현**: `src/components/handwriting/strokeTiming.js`. rAF 루프 불필요 —
framer-motion의 `transition.ease`가 임의의 JS 함수 `(t: 0→1) => progress`를
받으므로, 시간 테이블을 ease 함수로 변환해 `pathLength` 트랜지션에 그대로 꽂는다.

1. `getPointAtLength()`로 호길이 등간격 샘플 240개 추출.
2. 연속 3점의 외접원으로 곡률 추정: κ = 4·삼각형면적 / (세 변 길이의 곱).
3. 원시 속도 vᵢ = κᵢ^(−p)를 **중앙값으로 정규화**(상수 K의 역할 —
   viewBox 스케일/폰트 크기와 무관하게 같은 리듬) 후 클램프
   (직선에서 κ→0이면 속도가 발산하므로 상한 필수).
   **지수 p**: 생리학적 값은 1/3이지만 화면에서는 차이가 미묘해
   **기본 p = 0.5 × `curveDrama`** 로 과장한다(curveDrama 1 → p 0.5).
   클램프 범위는 [0.18, 5.0]^(curveDrama) — 함께 지수적으로 넓혀야
   대비 증가가 클램프에 막히지 않는다.
4. **획 시작/끝 ramp**: 양끝 8% 구간에 추가 감속(펜이 닿고 떨어지는 순간).
5. 누적 시간 테이블 tᵢ = Σ(Δs / vᵢ) → `easeFromTimeMap()`이 이진탐색+선형보간으로
   ease 함수화. `pathLength`는 전체 길이 대비 비율이라 ease 출력이 곧 그려진 비율.
   기존 `duration`(길이 비례)은 그대로 두고 ease가 **획 안에서 속도만 재분배**한다.
6. **획 간 시간차 — 펜 리프트 휴지** (`liftPause()`): 곡률 모드에서는
   **순차 진행**한다 — 펜은 두 획을 동시에 못 긋기 때문(겹침이 있으면
   휴지가 상쇄되어 화면에 보이지 않는다).
   대신 획이 끊길 때마다 `liftDrama × (최소 휴지 0.05s + 공중 이동 거리 /
   (펜 속도 × 1.5))` 를 delay에 추가한다. 가까운 글자 사이는 짧고 단어
   사이처럼 먼 이동은 길어져, 획 내부뿐 아니라 **획과 획 사이에도** 리듬이
   생긴다.

   **이어쓰기 자동 판별**: 필기체에서 이어지는 글자는 한 호흡으로 그려야
   한다. 이전 획 끝점↔다음 획 시작점 간격이 `CONNECT_EPS`(20 viewBox 단위)
   미만이면 휴지를 아예 넣지 않는다 — retrace 절단 후 이 에셋의 간격 분포는
   연결 쌍 ≤14 vs 펜 떼는 쌍 ≥36으로 깔끔하게 갈려 자동 판별이 신뢰 가능.
   단 점('i' 윗점, 길이 < `DOT_LEN`)으로 드나드는 전이는 거리와 무관하게
   펜을 든다.

커브 감속(`curveDrama`)과 획 간 휴지(`liftDrama`)는 **독립 prop으로 분리**되어
따로 조절한다(데모에 슬라이더 각각).

곡률 모드가 유일한 속도 모델이다 — 비교용 uniform(easeInOut) 모드와 `overlap`
prop은 곡률 모드 확정 채택 후 제거했다(2026-06).

- 외곽선(reveal) 트랙은 곡률 개념이 없으므로 적용 제외. reveal duration은
  글자 bbox 너비 비례 + ease-in-out 유지.

수용 기준: 'e'·'o' 같은 루프 글자에서 감속이 눈에 보여야 한다(충족 — QA로 자동 검증).

### D. 구현 엔진 — framer-motion(채택) vs GSAP

| 항목 | framer-motion (현재 채택) | GSAP (+ DrawSVG, ScrollTrigger) |
|---|---|---|
| 의존성 | **추가 0** (사이트 전역에서 이미 사용) | core+플러그인 ~70KB (gzip ~25KB), 2024년부터 전 플러그인 무료 |
| 드로잉 | `pathLength` prop — SVG pathLength 정규화로 `getTotalLength` 브라우저 버그 회피 | DrawSVG가 내부 처리 |
| 글자 순차 + overlap | delay 누적 직접 계산 (구현 완료) | Timeline 상대 포지셔닝(`"-=0.15"`)으로 더 우아 |
| 일시정지/역재생/전체 속도 | `animate()`/`useAnimate` 컨트롤로 가능하나 선언적 API와는 결이 다름 | `pause/seek/reverse/timeScale` 내장 — 가장 성숙 |
| 곡률 기반 속도 (5.C) | **`transition.ease`에 임의 함수 → 직접 지원** | CustomEase는 베지어 곡선 기반이라 동일 표현 곤란 — 시간 테이블 + `onUpdate`로 별도 구현 필요 |
| 스크롤 scrub (스크롤만큼 써지고 지워짐) | `useScroll`+`useTransform`→`pathLength`. Hero 패럴럭스(`Hero.jsx`)에서 이미 쓰는 패턴 | ScrollTrigger `scrub` + pin/snap 등 부가 연출이 더 풍부 |
| React 통합 | 네이티브 (컴포넌트 모델 그대로) | `useGSAP` 훅으로 우회 — React 생명주기 밖 시스템 |
| 질감(SVG 필터) | 동일 (엔진 무관) | 동일 (엔진 무관) |

**판단 기준**: 1회 재생·완료 콜백·단순 scrub까지는 framer-motion으로 충분하며
추가 의존성이 없다. GSAP이 이기는 지점은 **pin/snap을 동반한 고급 스크롤 연출**과
**타임라인 전체 제어(seek/역재생/배속)** — 이런 연출을 채택하기로 결정하는 시점에만
도입을 검토하고, 도입 시 §4 의존성 조항에 예외를 명시할 것. 5.C의 속도 모델은
엔진과 무관하게 계산은 우리 몫이며, framer-motion에서는 ease로, GSAP에서는
`onUpdate`로 재생부만 달라진다.

### E. 획 폭·텍스처 ✅ 구현 완료 (`variant='inked'`, 기본은 centerline)

**구현**: `scripts/generate_handwriting_svg.py`(오프라인, fonttools+shapely)가
가변 폭 잉크 폴리곤(`#ink`)과 센터라인(`#pen`)을 획 단위 `ink-N`/`pen-N` 페어로
담은 2레이어 SVG(`docs/fonts/svg/wearegettingmarried_inked.svg`)를 생성한다.
획 분리·필기 순서 정렬도 생성 단계에서 확정(런타임 휴리스틱 불필요).
코너 spike는 shapely `buffer(0)` + 끝점 원형 캡 union으로 생성 단계에서 제거.
속도-폭 연동은 `--alpha` 파라미터(기본 0 = 방향 규칙만, §5.C 모델과 혼합).
생성 의존성은 오프라인 전용이라 §4 "신규 외부 의존성 0"과 충돌하지 않는다.

런타임은 `HandwritingMarried`의 `variant='inked'`: 획마다 잉크 폴리곤에
`<mask>`를 걸고, 마스크 속 굵은 흰 센터라인 stroke(폭은 에셋의
`data-mask-width`)에 기존 `pathLength` 애니메이션을 그대로 적용 —
타이밍·곡률 ease·펜 리프트 코드가 두 variant에서 완전히 공유된다.
`texture` prop(inked 전용)은 feTurbulence 거친 잉크 가장자리 필터.
**폭 대비 조절**: 획 안 굵음↔가늚 진폭은 폴리곤에 구워지므로 런타임 무단계
조절이 불가능하다. 생성기 `--contrast`(평균 폭을 고정한 채 진폭만 스케일,
헤어라인 하한 2 font units)로 단계별 에셋을 미리 생성하고(기본·×1.5·×2 커밋됨),
`inkContrast` prop으로 전환한다. 절대 폭 범위는 `--wmin/--wmax`.
폭 규칙은 내리긋기 압력 + **수평획 중간 압력 바닥값**(0.3) — 순수 `-t̂_y`
규칙은 't' 가로획을 보이지 않는 헤어라인으로 만들기 때문. 같은 이유로
contrast 스케일 시 최소 폭 하한은 4 font units. 마스크 폭은 W_MAX×2.0.
**Hero는 아직 `centerline`(기본값) — 데모 비교 후 채택 결정.**

아래는 설계 근거와 프로토타입 검증 기록.

전제: **SVG stroke는 한 path 안에서 폭이 균일하다** (가변 폭 stroke는 SVG 2에서
제안만 되고 구현 브라우저 없음). 그래서 목표별로 방법이 갈린다.

| 원하는 것 | 방법 | 현재 코드와의 호환 |
|---|---|---|
| 폭 일괄 조절 | `strokeWidth` prop | ✅ 이미 구현 |
| 획 안 굵기 변화 | 가변 폭 outline + centerline **마스크 reveal along path** | 타이밍 로직 재사용, 레이어 구조만 변경 |
| 질감(거침/번짐/농담) | SVG 필터·pattern stroke·blend mode | 지금 바로 얹기 가능, 모바일 성능 확인 필요 |

**가변 폭 — "마스크 reveal along path" 기법** (외곽선 폰트의 §5.B 사각형
reveal보다 자연스러움 — 펜 경로를 정확히 따라감):

1. 보이는 레이어: 굵기 변화가 표현된 **outline(채움) 글자** — centerline을
   법선 방향으로 오프셋해 생성하거나 디자인 툴에서 제작.
2. 마스크 레이어: 현재의 centerline path를 글자 최대 폭보다 **굵은 흰색
   stroke**로 `<mask>` 안에 배치.
3. 마스크 path에 기존과 동일한 `pathLength` 드로잉(타이밍·곡률 ease·
   `onComplete` 전부 재사용) → 펜이 지나간 경로를 따라 가변 폭 글자가 드러난다.

**§5.C와의 연동(권장)**: 오프셋 폭을 속도 프로파일과 연결 — 실제 펜은 느린
구간(급커브)에서 잉크가 더 묻어 굵어지므로 **폭 ∝ v^(−α)**. 곡률 샘플링
인프라(`strokeTiming.js`)가 이미 있어 타이밍과 굵기를 같은 모델이 구동하면
물리적으로 일관된 손글씨가 된다.

**텍스처 — centerline stroke 유지한 채 가능**:

- 거친 잉크 가장자리: `feTurbulence` + `feDisplacementMap` 필터.
- 잉크 번짐: `feGaussianBlur` + `feComposite`로 경계를 살짝 먹임.
- 잉크 농담/질감: `stroke="url(#...)"`로 gradient나 `<pattern>`(잉크 텍스처) 지정.
- 종이와의 합성: 글자에 `mix-blend-mode: multiply` — Hero 사진 배경 위에서도 동작.

> ⚠️ 성능: SVG 필터가 걸린 요소에서 `pathLength` 애니메이션이 돌면 매 프레임
> 필터를 재래스터라이즈한다. 모바일 프레임 드랍 가능성 → 필터 강도를 낮게,
> 실기기 테스트 필수. 마스크 reveal 구조는 필터를 **정적 레이어**(outline
> 글자)에만 걸 수 있어 이 부담이 덜하다.

권장 순서: 효과 대비 비용이 좋은 **텍스처(블렌드+가벼운 필터) 먼저**,
가변 폭은 §5.C 속도-폭 연동과 묶어서.

**프로토타입 검증 결과 (2026-06, Python 오프라인 생성으로 확인)** —
"가변 폭 + 텍스처 + 마스크 write-on" 3요소가 한 SVG에서 공존함을 확인했다.
산출물: `docs/prototypes/variable_width_texture_writeon.html` (브라우저에서
바로 열어 확인 가능). 아래 수치들은 **§8 재생성 파이프라인의 font units
(upm 1000) 기준** — 커밋된 648×150 viewBox SVG에 그대로 넣으면 안 된다.
구현 시 그대로 적용할 발견들:

1. **가변 폭 생성은 오프라인(빌드 타임)이 적합** — centerline을 호길이
   등간격 샘플링(~220점/획) → 유한차분 탄젠트 → 법선 오프셋으로 닫힌
   폴리곤 생성. §8 파이프라인의 확장(Python + svgpathtools)으로 두고,
   런타임은 결과 SVG만 소비한다. 곡률 샘플링 코드(§5.C)와 인프라 공유 가능.
2. **방향 기반 폭 규칙(캘리그래피 고전 규칙)이 단순하고 효과적** —
   내리긋는 획 굵게, 올리는 획 가늘게:
   `w = W_MIN + (W_MAX−W_MIN) · clamp(−t̂_y, 0, 1)^1.2`
   (t̂_y = 단위 탄젠트의 y성분. font 좌표 y-up 기준 t̂_y<0 = 화면의 내리긋기).
   프로토타입 값 W_MIN=7, W_MAX=30 (font units, upm 1000)에서 자연스러움.
   §5.C 연동 시 이 규칙을 폭 ∝ v^(−α)로 교체/혼합.
3. **폭 스무딩 필수** — 원시 폭을 그대로 쓰면 방향 전환점에서 굵기가 튄다.
   이동평균(윈도 ~±15샘플)으로 완화.
4. **⚠️ 코너 spike 결함** — 't' 가로획, 'i' 등 급한 코너/방향 반전에서
   법선 오프셋 폴리곤이 자기교차하며 뾰족한 가시가 생긴다(offset curve의
   고전적 문제). 해결: 폭 스무딩 강화 + miter 클리핑, 또는 오프셋 후
   self-intersection 제거(shapely `buffer(0)` 계열). **수용 기준에 포함할 것.**
5. **마스크 stroke 폭 규칙** — 마스크의 흰 stroke-width는 잉크 최대 폭(W_MAX)보다
   충분히 넓게(프로토타입: W_MAX 30 → 마스크 48). 부족하면 굵은 획의
   가장자리가 펜이 지나간 뒤에도 잘려 보인다.
6. **텍스처 필터 강도는 브라우저에서 재조정** — 검증에 쓴 cairosvg 등
   정적 래스터라이저는 `feTurbulence` 마스크 계열을 약하게 렌더한다.
   파라미터(`baseFrequency`, `scale`)는 반드시 실브라우저 기준으로 튜닝.
   프로토타입의 거친 잉크 필터: `feTurbulence(fractalNoise, bf 0.02, oct 2)`
   + `feDisplacementMap(scale 10)`.

## 6. 산출물 (deliverables)

- [x] `HandwritingMarried` 컴포넌트 (SVG 파일 교체만으로 문구/폰트 변경 가능)
- [x] 파라미터 튜닝 데모 (`handwriting-demo.html`, dev 서버에서 `/handwriting-demo.html`)
- [x] Hero 섹션 통합 (손글씨 완료 → 이름·날짜 등장)
- [x] 곡률 기반 속도 모듈 + 데모 토글 (§5.C, `strokeTiming.js`)
- [x] 가변 폭 잉크 생성기 + `variant='inked'` + 텍스처 옵션 + 데모 토글
      (§5.E, `scripts/generate_handwriting_svg.py`)
- [ ] (보류) 외곽선 폰트 포함 다중 폰트 비교 데모
- [ ] (결정 대기) Hero에 inked variant 채택 여부 — 데모 비교 후

## 7. 인수 기준 (acceptance criteria)

### 완료
- [x] Astutely가 펜으로 긋는 stroke 드로잉으로 자연스럽게 써진다.
- [x] 길이 비례 타이밍 + 이어쓰기/펜 리프트 휴지로 손글씨 리듬이 느껴진다.
- [x] 스크롤로 진입 시 1회 재생, 재진입 시 중복 재생 안 함.
- [x] `prefers-reduced-motion`에서 애니메이션 없이 완성 글씨 표시
      (dev/`?motion=force` 오버라이드는 §4에 명시된 의도적 예외).
- [x] 신규 외부 의존성 0, GitHub Pages에서 그대로 동작.
- [x] 모바일 폭에서 깨지지 않음.
- [x] 손글씨 완료 후 부제(이름·날짜) 등장, 콜백 실패 시 7초 안전 타이머.
- [x] 루프 글자('e','o')에서 곡률 기반 감속이 시각적으로 확인됨 (§5.C —
      비교용 easeInOut 토글은 곡률 모드 확정 채택 후 제거).

### 남은 항목 (채택 시)
- [ ] (외곽선 폰트 채택 시) reveal로 좌→우로 자연스럽게 나타남(테두리만 그려지는 현상 없음).
- [ ] (5.E 채택 시) 텍스처/가변 폭이 모바일 실기기에서 프레임 드랍 없이 동작.
- [x] 가변 폭 outline에 코너 spike(자기교차 가시)가 없음 — 생성 단계
      `buffer(0)`+원형 캡 union으로 해결, 래스터 렌더로 육안 확인(2026-06).
- [ ] (GSAP 채택 시) 도입 사유가 5.D 기준(pin/snap급 스크롤 연출 또는 타임라인
      제어 필요)에 부합하고, §4의 의존성 조항에 예외가 명시됨.

## 8. 문구/폰트 변경 시 SVG 재생성 방법

폰트는 글자를 path로 "구워" 넣으므로 문구를 바꾸면 SVG를 다시 생성해야 한다.

- **가변 폭(inked) 에셋**: `python3 scripts/generate_handwriting_svg.py
  [--text "..."] [--alpha 0.3] [--wmin 7 --wmax 30] [--contrast 1.5]
  [--sizes "W=1.3,d=0.9"]  ← 글자별 크기 배율(해당 글자 전 인스턴스).
  골격만 스케일하고 잉크 폭은 유지(같은 펜으로 쓴 느낌), 어드밴스도 함께
  스케일되어 간격이 따라온다. 스케일된 글자가 폰트 메트릭을 벗어나면
  viewBox 세로 범위가 자동 확장된다.`
  (의존성: fonttools, shapely — 오프라인 전용).
  `inkContrast` 단계용으로 기본·`--contrast 1.5`·`--contrast 2.0` 세 에셋을
  모두 재생성할 것. **centerline variant도 같은 에셋의 pen 레이어를 쓰므로
  이것만 재생성하면 끝**이다.
- QA: `node scripts/qa_handwriting.mjs` (dev 서버 + puppeteer 필요) —
  획 수/필기 순서/줄기 방향/휴지/variant 전환을 실브라우저로 검증.
- (참고, 구형) 단일 레이어 centerline SVG가 따로 필요할 때만 아래 스크립트
  사용(`pip install fonttools`) — 현재 코드는 사용하지 않음:

```python
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

TEXT = "We are getting married"   # <- 변경
FONT = "docs/fonts/ttf/AstutelySingleLine-VGj3l.ttf"

f = TTFont(FONT); upm = f["head"].unitsPerEm
gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"]
asc, desc = f["hhea"].ascent, f["hhea"].descent
space = hmtx["space"][0] if "space" in hmtx.metrics else int(upm*0.3)
x, gp = 0, []
for ch in TEXT:
    if ch == " ": x += space; continue
    g = cmap[ord(ch)]; pen = SVGPathPen(gs); gs[g].draw(pen)
    if pen.getCommands(): gp.append((x, pen.getCommands()))
    x += hmtx[g][0]
pad = upm*0.12
vb = f"{-pad} {-pad} {x+pad*2} {asc-desc+pad*2}"
inner = "\n".join(f'<path d="{d}" transform="translate({gx},0)"/>' for gx,d in gp)
# 싱글라인: fill="none" stroke="#2b2b2b"; 외곽선: fill="#2b2b2b"
svg = f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,{asc}) scale(1,-1)" fill="none" stroke="#2b2b2b" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">{inner}</g></svg>'
open("docs/fonts/svg/Wearegettingmarried-578431.svg","w").write(svg)
```

생성 후 별도 코드 수정은 불필요 — `HandwritingMarried.jsx`가 SVG를 raw import해
런타임 파싱하므로 **파일만 교체하면 반영**된다(선 두께·색은 props가 덮어씀).

> 싱글라인이면 `fill="none" stroke=...`, 외곽선 폰트면 `fill="#2b2b2b"`(stroke 제거)로
> `<g>` 속성만 바꿔주면 된다. 새 폰트를 쓸 땐 'o'/'e'의 contour 개수로
> 종류를 먼저 판별할 것(1개=싱글라인, 2개+=외곽선).