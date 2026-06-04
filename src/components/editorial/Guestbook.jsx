import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { PrimaryButton, SecondaryButton, Section } from './_shared.jsx';

const PAGE_SIZE = 5;

function formatDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function loadFirst() {
    setLoading(true);
    const { data, error: e } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .range(0, PAGE_SIZE - 1);
    if (!e) {
      const rows = data ?? [];
      setEntries(rows);
      setHasMore(rows.length === PAGE_SIZE);
    }
    setLoading(false);
  }

  async function loadMore() {
    setLoadingMore(true);
    const from = entries.length;
    const { data, error: e } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (!e) {
      const rows = data ?? [];
      setEntries((prev) => [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
    }
    setLoadingMore(false);
  }

  useEffect(() => {
    if (isSupabaseConfigured) loadFirst();
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
    loadFirst();
  }

  if (!isSupabaseConfigured) {
    return (
      <Section title="GUESTBOOK">
        <div className="mx-auto max-w-content border border-dashed border-ink/25 px-5 py-10 text-center text-small text-ink/45">
          GUESTBOOK 준비 중
        </div>
      </Section>
    );
  }

  return (
    <Section title="GUESTBOOK">
      <div className="mx-auto max-w-content">
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="eyebrow block">성함</label>
            <input
              className="editorial-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="이름"
              maxLength={20}
            />
          </div>
          <div>
            <label className="eyebrow block">축하 메시지</label>
            <textarea
              rows={4}
              className="editorial-input resize-none leading-relaxed"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="축하 메시지를 남겨주세요"
              maxLength={300}
            />
          </div>
          {error && <p className="text-center text-small text-ink/65">{error}</p>}
          <PrimaryButton type="submit" className="w-full" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'SENDING' : 'SEND MESSAGE'}
          </PrimaryButton>
        </form>

        <div className="mt-12 space-y-4 text-left">
          {loading ? (
            <p className="text-center text-small text-ink/40">LOADING</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-small text-ink/40">첫 메시지를 남겨주세요.</p>
          ) : (
            <>
              {entries.map((entry) => (
                <article key={entry.id} className="border-t border-ink/12 py-5 last:border-b">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-body font-medium text-ink">{entry.name}</p>
                    <p className="font-mono text-label text-ink/35">{formatDate(entry.created_at)}</p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap type-body text-ink/72">{entry.message}</p>
                </article>
              ))}
              {hasMore ? (
                <SecondaryButton onClick={loadMore} disabled={loadingMore} className="mt-4 w-full">
                  {loadingMore ? 'LOADING' : 'MORE'}
                </SecondaryButton>
              ) : (
                <p className="pt-2 text-center font-mono text-label tracking-widest text-ink/30">END</p>
              )}
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
