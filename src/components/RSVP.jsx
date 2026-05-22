import { useState } from 'react';
import { wedding } from '../config/wedding.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const inputClass =
  'w-full rounded-sm border border-sage/30 bg-white/70 px-3 py-2 text-sm text-forest placeholder-forest/30 focus:border-sage focus:outline-none';

// 선택형 버튼(라디오 대용) 스타일.
function choiceClass(active) {
  return `rounded-sm border py-2 text-sm transition ${
    active
      ? 'border-sage bg-sage/15 text-forest'
      : 'border-sage/30 bg-white/60 text-forest/60 hover:bg-sage/5'
  }`;
}

export default function RSVP() {
  const { groom, bride } = wedding;

  const [form, setForm] = useState({
    side: 'groom', // groom | bride
    name: '',
    attending: 'yes', // yes | no
    partySize: 1,
    meal: 'yes', // yes | no | maybe
    companions: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const attending = form.attending === 'yes';
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('성함을 입력해 주세요.');
      return;
    }
    setStatus('submitting');
    setError('');

    const { error: insertError } = await supabase.from('rsvp').insert({
      side: form.side,
      name: form.name.trim(),
      attending,
      party_size: attending ? Number(form.partySize) || 1 : 0,
      meal: attending ? form.meal : null,
      companions: attending ? form.companions.trim() || null : null,
    });

    if (insertError) {
      setStatus('error');
      setError('전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    setStatus('success');
  }

  // 키 미설정 → 준비 중
  if (!isSupabaseConfigured) {
    return (
      <section className="section text-center">
        <p className="section-label">rsvp</p>
        <p className="section-title">참석 여부 전달</p>
        <div className="divider-leaf" />
        <div className="mt-6 rounded-sm border border-dashed border-sage/40 bg-white/40 px-4 py-8 text-sm text-forest/40">
          (RSVP 준비 중)
        </div>
      </section>
    );
  }

  // 제출 완료
  if (status === 'success') {
    return (
      <section className="section text-center">
        <p className="section-label">rsvp</p>
        <p className="section-title">참석 여부 전달</p>
        <div className="divider-leaf" />
        <p className="mt-6 text-[15px] leading-loose text-forest/80">
          참석 여부를 전해주셔서 감사합니다. 🌿
          <br />
          소중히 준비하겠습니다.
        </p>
        <p className="mt-4 text-xs text-forest/50">
          축하 메시지는 아래 방명록에 남겨주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="section text-center">
      <p className="section-label">rsvp</p>
      <p className="section-title">참석 여부 전달</p>
      <div className="divider-leaf" />
      <p className="mt-4 text-xs text-forest/60">
        참석 여부를 미리 알려주시면 정성껏 준비하겠습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        {/* 구분 (신랑측/신부측) */}
        <div>
          <label className="text-xs text-forest/60">구분</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => update('side', 'groom')} className={choiceClass(form.side === 'groom')}>
              신랑측 ({groom.nameKo})
            </button>
            <button type="button" onClick={() => update('side', 'bride')} className={choiceClass(form.side === 'bride')}>
              신부측 ({bride.nameKo})
            </button>
          </div>
        </div>

        {/* 성함 */}
        <div>
          <label className="text-xs text-forest/60">성함</label>
          <input
            className={`mt-1 ${inputClass}`}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="성함을 입력해 주세요"
            maxLength={40}
          />
        </div>

        {/* 참석 여부 */}
        <div>
          <label className="text-xs text-forest/60">참석 여부</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => update('attending', 'yes')} className={choiceClass(form.attending === 'yes')}>
              참석
            </button>
            <button type="button" onClick={() => update('attending', 'no')} className={choiceClass(form.attending === 'no')}>
              불참
            </button>
          </div>
        </div>

        {/* 참석일 때만: 인원 / 식사 / 동반자 */}
        {attending && (
          <>
            <div>
              <label className="text-xs text-forest/60">총 인원 (본인 포함)</label>
              <input
                type="number"
                min={1}
                max={30}
                className={`mt-1 ${inputClass}`}
                value={form.partySize}
                onChange={(e) => update('partySize', e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-forest/60">식사 여부</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => update('meal', 'yes')} className={choiceClass(form.meal === 'yes')}>예정</button>
                <button type="button" onClick={() => update('meal', 'no')} className={choiceClass(form.meal === 'no')}>안함</button>
                <button type="button" onClick={() => update('meal', 'maybe')} className={choiceClass(form.meal === 'maybe')}>미정</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-forest/60">동반자 이름 (선택)</label>
              <input
                className={`mt-1 ${inputClass}`}
                value={form.companions}
                onChange={(e) => update('companions', e.target.value)}
                placeholder="예: 홍길동, 김영희"
                maxLength={100}
              />
            </div>
          </>
        )}

        {error && <p className="text-xs text-terracotta-dark">{error}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-sm border border-terracotta/50 bg-terracotta/10 py-3 text-sm text-terracotta-dark transition hover:bg-terracotta/20 disabled:opacity-50"
        >
          {status === 'submitting' ? '전송 중…' : '참석 여부 전달하기'}
        </button>
      </form>
    </section>
  );
}
