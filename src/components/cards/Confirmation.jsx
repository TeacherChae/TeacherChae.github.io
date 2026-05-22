import { useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { CardFrame, FieldLabel } from './_shared.jsx';

const inputClass =
  'w-full rounded-sm border border-sage/30 bg-paper px-3 py-2 text-sm text-forest placeholder-forest/30 focus:border-sage focus:outline-none';

function choiceClass(active) {
  return `rounded-sm border py-2 text-[13px] font-mono tracking-wider transition ${
    active
      ? 'border-sage bg-sage/15 text-forest'
      : 'border-sage/30 bg-paper text-forest/60 hover:bg-sage/5'
  }`;
}

export default function Confirmation() {
  const { groom, bride, ticket } = wedding;

  const [form, setForm] = useState({
    side: 'groom', name: '', attending: 'yes', partySize: 1, meal: 'yes', companions: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const attending = form.attending === 'yes';
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError('성함을 입력해 주세요.');
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
      setStatus('idle');
      setError('전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    setStatus('success');
  }

  return (
    <section className="px-6 py-2">
      <CardFrame label={ticket.labels.confirmation} serial={6}>
        <div className="text-center pt-1">
          <p className="font-script text-2xl text-sage-dark">Confirm your boarding</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            rsvp · 참석 여부 전달
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="mt-6 rounded-sm border border-dashed border-sage/40 bg-paper px-4 py-8 text-center text-sm font-mono tracking-widest text-forest/40 uppercase">
            RSVP coming soon
          </div>
        ) : status === 'success' ? (
          // CONFIRMED 도장
          <div className="mt-6 relative py-10 text-center">
            <p className="text-[15px] leading-loose text-forest/80">
              참석 여부를 전해주셔서 감사합니다 🌿<br />
              소중히 준비하겠습니다.
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-[0.25em] text-forest/50 uppercase">
              축하 메시지는 아래 POSTCARD 카드에서
            </p>
            {/* CONFIRMED 도장 — 비스듬한 회전 */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] border-[3px] border-sage rounded-sm px-4 py-1.5 opacity-30">
              <p className="font-mono text-2xl tracking-[0.18em] text-sage font-bold">CONFIRMED ✓</p>
              <p className="font-mono text-[9px] tracking-widest text-sage text-center">FOREVER AIRLINES</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <FieldLabel en="Side" ko="구분" />
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => update('side', 'groom')} className={choiceClass(form.side === 'groom')}>
                  GROOM · {groom.nameKo}
                </button>
                <button type="button" onClick={() => update('side', 'bride')} className={choiceClass(form.side === 'bride')}>
                  BRIDE · {bride.nameKo}
                </button>
              </div>
            </div>

            <div>
              <FieldLabel en="Passenger name" ko="성함" />
              <input
                className={`mt-1.5 ${inputClass}`}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="성함을 입력해 주세요"
                maxLength={40}
              />
            </div>

            <div>
              <FieldLabel en="Attending" ko="참석 여부" />
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => update('attending', 'yes')} className={choiceClass(form.attending === 'yes')}>
                  ATTEND · 참석
                </button>
                <button type="button" onClick={() => update('attending', 'no')} className={choiceClass(form.attending === 'no')}>
                  REGRET · 불참
                </button>
              </div>
            </div>

            {attending && (
              <>
                <div>
                  <FieldLabel en="Party size" ko="총 인원 (본인 포함)" />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    className={`mt-1.5 ${inputClass}`}
                    value={form.partySize}
                    onChange={(e) => update('partySize', e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel en="Meal" ko="식사" />
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => update('meal', 'yes')} className={choiceClass(form.meal === 'yes')}>YES · 예정</button>
                    <button type="button" onClick={() => update('meal', 'no')} className={choiceClass(form.meal === 'no')}>NO · 안함</button>
                    <button type="button" onClick={() => update('meal', 'maybe')} className={choiceClass(form.meal === 'maybe')}>TBD · 미정</button>
                  </div>
                </div>
                <div>
                  <FieldLabel en="Companions" ko="동반자 (선택)" />
                  <input
                    className={`mt-1.5 ${inputClass}`}
                    value={form.companions}
                    onChange={(e) => update('companions', e.target.value)}
                    placeholder="예: 홍길동, 김영희"
                    maxLength={100}
                  />
                </div>
              </>
            )}

            {error && <p className="text-xs text-terracotta-dark font-mono">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-sm border-2 border-sage bg-sage/10 py-3 text-sm font-mono tracking-[0.2em] text-sage-dark uppercase hover:bg-sage/20 transition disabled:opacity-50"
            >
              {status === 'submitting' ? 'SENDING…' : 'Confirm Boarding ✓'}
            </button>
          </form>
        )}
      </CardFrame>
    </section>
  );
}
