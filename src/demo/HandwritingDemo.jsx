import { useEffect, useState } from 'react';
import HandwritingMarried from '../components/handwriting/HandwritingMarried.jsx';

// 손글씨 애니메이션 튜닝/미리보기용 데모 페이지.
// 최종 채택 파라미터를 눈으로 고른 뒤 청첩장 섹션에 그대로 이식한다.
export default function HandwritingDemo() {
  const [pxPerSec, setPxPerSec] = useState(700);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [ink, setInk] = useState('#2b2b2b');
  const [replayKey, setReplayKey] = useState(0);
  const [forceMotion, setForceMotion] = useState(true); // 데모에선 기본 강제 재생
  const [curveDrama, setCurveDrama] = useState(1.0); // 커브 감속 과장
  const [liftDrama, setLiftDrama] = useState(1.0); // 획 간 휴지 배율
  const [inkContrast, setInkContrast] = useState(1); // 획 안 폭 대비 단계 (1|1.5|2)
  const [variant, setVariant] = useState('centerline'); // PRD §5.E 가변 폭 잉크
  const [texture, setTexture] = useState(false); // 거친 잉크 가장자리 필터
  const [systemReduced, setSystemReduced] = useState(false);

  // 브라우저의 prefers-reduced-motion 실제 상태를 읽어 표시(진단용)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const replay = () => setReplayKey((k) => k + 1);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Handwriting demo — “We are getting married”</h1>
        <p style={styles.sub}>
          framer-motion · pathLength 드로잉 · 길이 비례 타이밍 · 진입 1회 재생 · reduced-motion 존중
        </p>
      </header>

      {/* 컨트롤 */}
      <div style={styles.controls}>
        <Field label={`펜 속도 (px/sec): ${pxPerSec}`}>
          <input type="range" min="200" max="1600" step="50" value={pxPerSec}
            onChange={(e) => setPxPerSec(+e.target.value)} />
        </Field>
        <Field label={`선 두께: ${strokeWidth}`}>
          <input type="range" min="1" max="14" step="0.5" value={strokeWidth}
            onChange={(e) => setStrokeWidth(+e.target.value)} />
        </Field>
        <Field label="잉크 색">
          <input type="color" value={ink} onChange={(e) => setInk(e.target.value)} />
        </Field>
        <label style={{ ...styles.field, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={forceMotion}
            onChange={(e) => setForceMotion(e.target.checked)} />
          <span style={styles.fieldLabel}>감속 설정 무시하고 강제 재생</span>
        </label>
        <Field label={`커브 감속: ${curveDrama.toFixed(1)} (직선 빠르게·커브 느리게)`}>
          <input type="range" min="0.4" max="2" step="0.1" value={curveDrama}
            onChange={(e) => setCurveDrama(+e.target.value)} />
        </Field>
        <Field label={`획 간 휴지: ${liftDrama.toFixed(1)} (0=없음, 펜 떼는 멈춤 배율)`}>
          <input type="range" min="0" max="3" step="0.1" value={liftDrama}
            onChange={(e) => setLiftDrama(+e.target.value)} />
        </Field>
        <Field label="폭 대비 (획 안 굵음↔가늚 진폭, 가변 폭 모드 전용)">
          <select value={inkContrast} disabled={variant !== 'inked'}
            onChange={(e) => { setInkContrast(+e.target.value); replay(); }}>
            <option value={1}>기본 (7~30)</option>
            <option value={1.5}>강하게 (×1.5)</option>
            <option value={2}>아주 강하게 (×2)</option>
          </select>
        </Field>
        <label style={{ ...styles.field, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={variant === 'inked'}
            onChange={(e) => {
              setVariant(e.target.checked ? 'inked' : 'centerline');
              replay();
            }} />
          <span style={styles.fieldLabel}>가변 폭 잉크 — 내리긋기 굵게 (PRD §5.E)</span>
        </label>
        <label style={{ ...styles.field, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={texture} disabled={variant !== 'inked'}
            onChange={(e) => { setTexture(e.target.checked); replay(); }} />
          <span style={styles.fieldLabel}>잉크 텍스처 (가변 폭 모드 전용)</span>
        </label>
        <button style={styles.button} onClick={replay}>↻ 다시 재생</button>
      </div>

      {/* 진단 배너: 브라우저가 reduced-motion 이면 알려준다 */}
      <div style={{ ...styles.controls, paddingTop: 12, paddingBottom: 12, marginTop: -12 }}>
        <span style={{ fontSize: 13 }}>
          브라우저 <code>prefers-reduced-motion</code>:{' '}
          <strong style={{ color: systemReduced ? '#c0392b' : '#27ae60' }}>
            {systemReduced ? 'reduce (애니메이션 OFF 상태)' : 'no-preference (정상)'}
          </strong>
          {systemReduced && !forceMotion && ' — 그래서 그려지는 효과가 안 보입니다. 위 체크박스를 켜거나 OS 애니메이션 설정을 켜세요.'}
        </span>
      </div>

      {/* 미리보기 (크림 배경 = 청첩장 톤) */}
      <section style={styles.stage}>
        <HandwritingMarried
          pxPerSec={pxPerSec}
          strokeWidth={strokeWidth}
          ink={ink}
          replayKey={replayKey}
          forceMotion={forceMotion}
          curveDrama={curveDrama}
          liftDrama={liftDrama}
          variant={variant}
          texture={texture}
          inkContrast={inkContrast}
          className="hw-preview"
        />
      </section>

      <p style={styles.note}>
        스크롤 진입 1회 재생을 확인하려면 아래로 충분히 스크롤한 뒤 이 영역으로 올라오세요.
      </p>
      <div style={{ height: '90vh' }} aria-hidden />
      <section style={styles.stage}>
        <HandwritingMarried pxPerSec={pxPerSec} strokeWidth={strokeWidth} ink={ink} forceMotion={forceMotion} curveDrama={curveDrama} liftDrama={liftDrama} variant={variant} texture={texture} inkContrast={inkContrast} />
        <p style={styles.note}>↑ 스크롤로 처음 진입할 때 한 번만 그려진다.</p>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#FAF7F2', color: '#2b2b2b',
    fontFamily: 'Pretendard, system-ui, sans-serif', padding: '32px 20px 120px' },
  header: { maxWidth: 720, margin: '0 auto 24px' },
  title: { fontSize: 20, fontWeight: 600, margin: '0 0 6px' },
  sub: { fontSize: 13, opacity: 0.6, margin: 0 },
  controls: { maxWidth: 720, margin: '0 auto 28px', display: 'flex', flexWrap: 'wrap',
    gap: 18, alignItems: 'flex-end', padding: 16, background: '#fff',
    borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.06)' },
  field: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 },
  fieldLabel: { opacity: 0.7 },
  button: { padding: '8px 14px', border: '1px solid #2b2b2b', background: 'transparent',
    borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  stage: { maxWidth: 720, margin: '0 auto', padding: '48px 24px', background: '#fff',
    borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,.06)' },
  note: { maxWidth: 720, margin: '14px auto 0', fontSize: 12, opacity: 0.55, textAlign: 'center' },
};
