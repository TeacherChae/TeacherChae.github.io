import { useRef, useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { FieldLabel, PrimaryButton, Section } from './_shared.jsx';

const emptyPhone = ['', '', ''];
const PHONE_LIMITS = [3, 4, 4];

function cleanDigits(value) {
  return value.replace(/\D/g, '');
}

function splitPhone(value) {
  const digits = cleanDigits(value).slice(0, 11);
  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)];
}

function ChoiceButton({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={`border py-3 font-sans text-small tracking-widest transition ${
        active ? 'border-ink bg-ink text-paper' : 'border-ink/35 bg-transparent text-ink hover:border-ink'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function PhoneInput({ value, onChange }) {
  const refs = [useRef(null), useRef(null), useRef(null)];

  function setPart(index, raw) {
    const next = [...value];
    next[index] = cleanDigits(raw).slice(0, PHONE_LIMITS[index]);
    onChange(next);
    if (next[index].length === PHONE_LIMITS[index] && index < 2) {
      refs[index + 1].current?.focus();
      refs[index + 1].current?.select();
    }
  }

  function handlePaste(e, index) {
    const text = e.clipboardData.getData('text');
    const digits = cleanDigits(text);
    if (digits.length < 4) return;
    e.preventDefault();
    const next = splitPhone(digits);
    onChange(next);
    const focusIndex = next.findIndex((part, i) => part.length < PHONE_LIMITS[i]);
    refs[focusIndex === -1 ? 2 : focusIndex].current?.focus();
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace' && value[index] === '' && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  return (
    <div className="mt-2 grid grid-cols-[1fr_auto_1.2fr_auto_1.2fr] items-center gap-2">
      {value.map((part, index) => (
        <div key={index} className="contents">
          <input
            ref={refs[index]}
            className="w-full rounded-none border border-ink/35 bg-transparent px-3 py-3 text-center font-sans text-body tracking-wider text-ink outline-none transition focus:border-ink"
            type="tel"
            inputMode="numeric"
            autoComplete={index === 0 ? 'tel' : undefined}
            aria-label={['휴대폰 번호 앞자리', '휴대폰 번호 가운데 자리', '휴대폰 번호 마지막 자리'][index]}
            value={part}
            maxLength={PHONE_LIMITS[index]}
            placeholder={index === 0 ? '010' : '0000'}
            onChange={(e) => setPart(index, e.target.value)}
            onPaste={(e) => handlePaste(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
          {index < 2 && <span className="font-sans text-ink/35">-</span>}
        </div>
      ))}
    </div>
  );
}

function RsvpNotice() {
  const notice = wedding.rsvp?.notice;
  if (!notice) return null;
  return (
    <p className="mx-auto mt-5 max-w-content text-center text-micro leading-relaxed text-ink/70">
      * {notice}
    </p>
  );
}

function CompanionStepper({ value, onChange }) {
  return (
    <div className="mt-2 grid grid-cols-[1fr_1fr_1fr] border border-ink/35 text-center">
      <button type="button" className="py-3 text-xl" onClick={() => onChange(Math.max(1, value - 1))} aria-label="동행 인원 줄이기">−</button>
      <div className="border-x border-ink/20 py-3 font-sans text-small tracking-widest">{value}</div>
      <button type="button" className="py-3 text-xl" onClick={() => onChange(Math.min(30, value + 1))} aria-label="동행 인원 늘리기">+</button>
    </div>
  );
}

export default function RSVP() {
  const [form, setForm] = useState({
    name: '',
    side: '',
    phone: emptyPhone,
    attending: null,
    meal: null,
    companionCount: 1,
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [existing, setExisting] = useState(null);

  const phone = form.phone.join('');
  const attending = form.attending === true;

  function update(key, value) {
    setForm((f) => {
      if (key === 'attending' && value === false) {
        return { ...f, attending: false, meal: false, companionCount: 0 };
      }
      if (key === 'attending' && value === true) {
        return { ...f, attending: true, meal: f.meal === false ? false : f.meal, companionCount: f.companionCount || 1 };
      }
      return { ...f, [key]: value };
    });
  }

  function validate() {
    if (!form.name.trim()) return '성함을 입력해 주세요.';
    if (!form.side) return '신랑 측 또는 신부 측을 선택해 주세요.';
    if (phone.length !== 11) return '연락처를 정확히 입력해 주세요.';
    if (form.attending == null) return '참석 여부를 선택해 주세요.';
    if (form.attending && form.meal == null) return '식사 여부를 선택해 주세요.';
    return '';
  }

  function payload() {
    return {
      name: form.name.trim(),
      phone,
      side: form.side,
      attending: Boolean(form.attending),
      meal: form.attending ? Boolean(form.meal) : false,
      companion_count: form.attending ? Number(form.companionCount) || 1 : 0,
    };
  }

  async function insertEntry(data) {
    const { error: insertError } = await supabase.from('rsvp').insert(data);
    if (insertError) throw insertError;
  }

  async function updateEntry(id, data) {
    const { error: updateError } = await supabase.rpc('update_rsvp_entry', {
      p_id: id,
      p_name: data.name,
      p_phone: data.phone,
      p_side: data.side,
      p_attending: data.attending,
      p_meal: data.meal,
      p_companion_count: data.companion_count,
    });
    if (updateError) throw updateError;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!isSupabaseConfigured) return;

    setStatus('submitting');
    setError('');
    const data = payload();

    const { data: found, error: lookupError } = await supabase.rpc('lookup_rsvp', {
      p_name: data.name,
      p_phone: data.phone,
    });

    if (lookupError) {
      setStatus('idle');
      setError('RSVP 스키마 업데이트가 필요합니다. 관리자에게 문의해 주세요.');
      return;
    }

    if (found?.[0]?.id) {
      setExisting({ id: found[0].id, data });
      setStatus('idle');
      return;
    }

    try {
      await insertEntry(data);
      setStatus('success');
    } catch {
      setStatus('error');
      setError('등록에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  async function confirmUpdate() {
    if (!existing) return;
    setStatus('submitting');
    setError('');
    try {
      await updateEntry(existing.id, existing.data);
      setExisting(null);
      setStatus('success');
    } catch {
      setStatus('error');
      setError('수정에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Section title="참석 여부">
        <div className="mx-auto max-w-content border border-dashed border-ink/25 px-5 py-10 text-center text-small text-ink/45">
          RSVP 준비 중
        </div>
        <RsvpNotice />
      </Section>
    );
  }

  if (status === 'success') {
    return (
      <Section title="참석 여부">
        <div className="mx-auto max-w-content py-8 text-center text-body leading-loose text-ink/75">
          소중한 응답 감사합니다.
        </div>
        <RsvpNotice />
      </Section>
    );
  }

  return (
    <Section title="참석 여부">
      <form onSubmit={handleSubmit} className="mx-auto max-w-content space-y-8 text-left">
        <div>
          <FieldLabel>성함</FieldLabel>
          <input
            className="editorial-input"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="성함을 입력해 주세요"
            maxLength={40}
          />
        </div>

        <div>
          <FieldLabel>신랑 측 / 신부 측</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <ChoiceButton active={form.side === 'groom'} onClick={() => update('side', 'groom')}>신랑 측</ChoiceButton>
            <ChoiceButton active={form.side === 'bride'} onClick={() => update('side', 'bride')}>신부 측</ChoiceButton>
          </div>
        </div>

        <div>
          <FieldLabel>연락처</FieldLabel>
          <PhoneInput value={form.phone} onChange={(value) => update('phone', value)} />
          <p className="mt-2 text-micro leading-relaxed text-ink/42">응답 확인을 위해 연락처를 함께 남겨주세요.</p>
        </div>

        <div>
          <FieldLabel>참석 여부</FieldLabel>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <ChoiceButton active={form.attending === true} onClick={() => update('attending', true)}>O</ChoiceButton>
            <ChoiceButton active={form.attending === false} onClick={() => update('attending', false)}>X</ChoiceButton>
          </div>
        </div>

        {attending && (
          <>
            <div>
              <FieldLabel>식사 여부</FieldLabel>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ChoiceButton active={form.meal === true} onClick={() => update('meal', true)}>O</ChoiceButton>
                <ChoiceButton active={form.meal === false} onClick={() => update('meal', false)}>X</ChoiceButton>
              </div>
            </div>

            <div>
              <FieldLabel>동행 인원</FieldLabel>
              <CompanionStepper value={form.companionCount} onChange={(value) => update('companionCount', value)} />
              <p className="mt-2 text-micro text-ink/42">본인 포함 인원입니다.</p>
            </div>
          </>
        )}

        {error && <p className="text-center text-small leading-relaxed text-ink/65">{error}</p>}

        <PrimaryButton type="submit" className="w-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'SENDING' : 'SEND RSVP'}
        </PrimaryButton>
      </form>

      <RsvpNotice />

      {existing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/35 px-6">
          <div className="w-full max-w-[360px] bg-paper px-6 py-7 text-center shadow-2xl">
            <p className="type-kicker text-ink">RSVP</p>
            <p className="mt-5 type-body text-ink/70">
              기존 응답을 수정하시겠습니까?
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" className="editorial-button-secondary" onClick={() => setExisting(null)}>CANCEL</button>
              <button type="button" className="editorial-button-primary" onClick={confirmUpdate} disabled={status === 'submitting'}>
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
