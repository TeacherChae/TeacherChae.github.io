// 2/3 거듭제곱 법칙(two-thirds power law) 기반 획 속도 모델 (PRD §5.C).
// v(s) = K·κ(s)^(-p): 급커브에서 느려지고 직선/완만한 구간에서 빨라진다.
// 생리학적 지수는 p=1/3 이지만 화면에서는 미묘해서, 시각적 구분을 위해
// 기본 p=0.5 로 과장하고 drama 파라미터로 추가 조절한다.
// 시간 테이블을 framer-motion transition.ease 에 꽂을 수 있는
// (t: 0→1) => 호길이 진행률(= pathLength 값) 함수로 변환해 재생한다.

const SAMPLES = 240; // path당 호길이 등간격 샘플 수
const POWER = 0.5; // 기본 지수 p (drama 1 기준)
const V_MAX = 5.0; // 중앙값 대비 속도 상한 (직선에서 κ→0 으로 발산 방지)
const V_MIN = 0.18; // 중앙값 대비 속도 하한 (급커브에서 크게 기어가도록)
const RAMP = 0.08; // 획 시작/끝 추가 감속 구간(호길이 비율) — 펜이 닿고 떨어지는 순간
const RAMP_MIN = 0.3; // 획 양끝에서의 속도 배율 (구간 안에서 1로 선형 회복)
const AIR_SPEED = 1.5; // 펜 리프트(공중 이동) 속도 = 지면 평균 속도 × 1.5
const MIN_LIFT = 0.05; // 획이 끊길 때마다 드는 최소 휴지(sec) — 펜을 떼는 비용
// 이어쓰기 판별: 이전 획 끝 ↔ 다음 획 시작 간격(viewBox 단위). 이 에셋에서
// 연결 쌍은 ≤14, 펜 떼는 쌍은 ≥36 으로 갈리므로 중간값 20 을 임계로 쓴다.
export const CONNECT_EPS = 20;
// 이보다 짧은 획은 점('i'의 윗점) — 점으로 드나들 땐 거리가 가까워도 펜을 든다.
export const DOT_LEN = 5;

// 연속 3점의 외접원으로 곡률 추정: κ = 4·삼각형면적 / (세 변 길이의 곱)
function curvature(p0, p1, p2) {
  const a = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const b = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const c = Math.hypot(p2.x - p0.x, p2.y - p0.y);
  const denom = a * b * c;
  if (denom < 1e-9) return 0;
  const cross = Math.abs((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
  return (2 * cross) / denom; // cross = 2·면적 → 4·면적/(abc)
}

// path 를 호길이 등간격으로 샘플링해 "호길이 ↔ 시간" 누적 테이블을 만든다.
// K(전체 속도 상수)는 원시 속도의 중앙값으로 정규화 — viewBox 스케일이나
// 폰트 크기와 무관하게 같은 리듬이 나오고, 전체 duration 은 호출부가 정한다.
// power 가 클수록 커브-직선 속도 대비가 커진다(드라마틱). 클램프 범위도
// power 에 비례해 지수적으로 넓혀야 대비 증가가 클램프에 막히지 않는다.
export function buildTimeMap(pathEl, { samples = SAMPLES, power = POWER } = {}) {
  const L = pathEl.getTotalLength();
  if (!L) return null;
  const pts = [];
  for (let i = 0; i <= samples; i++) pts.push(pathEl.getPointAtLength((L * i) / samples));

  const raw = []; // 내부 샘플별 원시 속도 κ^(-power)
  for (let i = 1; i < samples; i++) {
    const k = Math.max(curvature(pts[i - 1], pts[i], pts[i + 1]), 1e-6);
    raw.push(Math.pow(k, -power));
  }
  const med = [...raw].sort((a, b) => a - b)[Math.floor(raw.length / 2)] || 1;
  const vMin = Math.pow(V_MIN, power / POWER); // power(=0.5×drama)에 따라 범위 확장
  const vMax = Math.pow(V_MAX, power / POWER);

  const ds = L / samples;
  const times = [0];
  for (let i = 1; i <= samples; i++) {
    let v = raw[Math.min(Math.max(i - 1, 0), raw.length - 1)] / med;
    v = Math.min(Math.max(v, vMin), vMax);
    const edge = Math.min(i / samples, 1 - i / samples);
    if (edge < RAMP) v *= RAMP_MIN + (1 - RAMP_MIN) * (edge / RAMP);
    times.push(times[i - 1] + ds / v);
  }
  return { times, samples };
}

// 시간 테이블 → ease 함수. times 는 단조증가이므로 이진탐색 + 선형보간.
export function easeFromTimeMap({ times, samples }) {
  const T = times[samples];
  if (!T) return (t) => t;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const target = t * T;
    let lo = 0;
    let hi = samples;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (times[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const f = (target - times[i - 1]) / (times[i] - times[i - 1] || 1);
    return (i - 1 + f) / samples;
  };
}

// 글자 가로 배치 transform("translate(x,0)")에서 x 추출
function translateX(transform) {
  const m = /translate\(\s*(-?[\d.eE+]+)/.exec(transform || '');
  return m ? parseFloat(m[1]) : 0;
}

// 이전 획 끝점 → 다음 획 시작점의 공중 이동 거리(펜 리프트 휴지 계산용).
// 각 path 는 로컬 좌표라 글자 배치 translate 를 보정해 비교한다.
export function airDistance(prevEl, nextEl, prevTransform, nextTransform) {
  const pL = prevEl.getTotalLength();
  if (!pL) return 0;
  const a = prevEl.getPointAtLength(pL);
  const b = nextEl.getPointAtLength(0);
  return Math.hypot(
    b.x + translateX(nextTransform) - (a.x + translateX(prevTransform)),
    b.y - a.y,
  );
}

// 획과 획 사이의 펜 리프트 휴지(sec) = 최소 휴지 + 공중 이동 시간.
// 가까운 글자는 짧게, 단어 사이처럼 먼 이동은 길게 — 획 간 시간차의 원천.
// drama 로 전체를 스케일해 과장 정도를 조절한다. dist 는 airDistance() 값.
export function liftPause(dist, pxPerSec, drama = 1) {
  return drama * (MIN_LIFT + dist / (pxPerSec * AIR_SPEED));
}
