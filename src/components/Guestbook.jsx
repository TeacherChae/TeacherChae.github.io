import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

// ★ 한 페이지에 보여줄 메시지 개수.
// "더 보기" 버튼을 누를 때마다 추가로 불러오는 수와 동일.
// 늘리고 싶으면 이 숫자만 바꾸면 됨. (예: 10, 20)
const PAGE_SIZE = 5;

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting
  const [error, setError] = useState('');

  // 첫 페이지 로드 — 마운트 시 + 새 메시지 등록 후 호출.
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
      // 가득 차서 왔으면 더 있을 가능성. 덜 차면 끝.
      setHasMore(rows.length === PAGE_SIZE);
    }
    setLoading(false);
  }

  // "더 보기" — 이미 받은 항목 뒤에 PAGE_SIZE 개 이어붙이기.
  async function loadMore() {
    setLoadingMore(true);
    const from = entries.length;
    const to = from + PAGE_SIZE - 1;
    const { data, error: e } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .range(from, to);
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
    loadFirst(); // 새 메시지가 맨 위에 오도록 첫 페이지 다시 받아옴.
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
          <>
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-sm border border-sage/20 bg-white/50 px-4 py-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-forest">{entry.name}</p>
                  <p className="text-[11px] text-forest/40">{formatDate(entry.created_at)}</p>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-forest/80">
                  {entry.message}
                </p>
              </div>
            ))}

            {hasMore ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="mt-2 w-full rounded-sm border border-sage/40 bg-white/60 py-3 text-sm text-forest hover:bg-sage/10 transition disabled:opacity-50"
              >
                {loadingMore ? '불러오는 중…' : '더 보기'}
              </button>
            ) : (
              <p className="pt-2 text-center text-xs text-forest/30">— 마지막 메시지입니다 —</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
