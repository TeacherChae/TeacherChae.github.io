import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const inputClass =
  'w-full rounded-sm border border-sage/30 bg-white/70 px-3 py-2 text-sm text-forest placeholder-forest/30 focus:border-sage focus:outline-none';

function formatDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const { data, error: e } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!e) setEntries(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (isSupabaseConfigured) load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('이름과 메시지를 모두 입력해 주세요.');
      return;
    }
    setStatus('submitting');
    setError('');

    const { error: insertError } = await supabase.from('guestbook').insert({
      name: form.name.trim(),
      message: form.message.trim(),
    });

    if (insertError) {
      setStatus('idle');
      setError('등록에 실패했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    setForm({ name: '', message: '' });
    setStatus('idle');
    load();
  }

  // 키 미설정 → 준비 중
  if (!isSupabaseConfigured) {
    return (
      <section className="section text-center">
        <p className="section-label">guestbook</p>
        <p className="section-title">방명록</p>
        <div className="divider-leaf" />
        <div className="mt-6 rounded-sm border border-dashed border-sage/40 bg-white/40 px-4 py-8 text-sm text-forest/40">
          (방명록 준비 중)
        </div>
      </section>
    );
  }

  return (
    <section className="section text-center">
      <p className="section-label">guestbook</p>
      <p className="section-title">방명록</p>
      <div className="divider-leaf" />
      <p className="mt-4 text-xs text-forest/60">축하의 메시지를 남겨주세요.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
        <input
          className={inputClass}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="이름"
          maxLength={20}
        />
        <textarea
          rows={3}
          className={`resize-none ${inputClass}`}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="축하 메시지"
          maxLength={300}
        />
        {error && <p className="text-xs text-terracotta-dark">{error}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-sm border border-terracotta/50 bg-terracotta/10 py-3 text-sm text-terracotta-dark transition hover:bg-terracotta/20 disabled:opacity-50"
        >
          {status === 'submitting' ? '등록 중…' : '메시지 남기기'}
        </button>
      </form>

      <div className="mt-8 space-y-3 text-left">
        {loading ? (
          <p className="text-center text-xs text-forest/40">불러오는 중…</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-xs text-forest/40">첫 메시지를 남겨주세요.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-sm border border-sage/20 bg-white/50 px-4 py-3">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium text-forest">{entry.name}</p>
                <p className="text-[11px] text-forest/40">{formatDate(entry.created_at)}</p>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-forest/80">
                {entry.message}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
