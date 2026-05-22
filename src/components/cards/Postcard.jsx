import { useEffect, useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { CardFrame, FieldLabel } from './_shared.jsx';

const PAGE_SIZE = 5;

const inputClass =
  'w-full rounded-sm border border-sage/30 bg-paper px-3 py-2 text-sm text-forest placeholder-forest/30 focus:border-sage focus:outline-none';

function formatDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}

// 받은 엽서 한 장 — 우표 + 손글씨 톤 메시지
function ReceivedPostcard({ entry }) {
  return (
    <div className="rounded-sm bg-paper border border-forest/15 shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] gap-3 p-3">
        <div>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-forest/45">
            FROM · 보내는이
          </p>
          <p className="text-sm text-forest font-medium mt-0.5">{entry.name}</p>
          <p className="font-mono text-[9px] text-forest/40 mt-0.5">{formatDate(entry.created_at)}</p>
        </div>
        {/* 우표 자리 — 작은 정사각형 */}
        <div className="h-10 w-10 border border-dashed border-sage/40 flex items-center justify-center text-sage/40 text-[8px] font-mono tracking-widest">
          ✈
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="border-t border-dashed border-forest/15 pt-2">
          <p className="text-[13px] leading-relaxed text-forest/85 whitespace-pre-wrap">
            {entry.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Postcard() {
  const { ticket } = wedding;
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

  return (
    <section className="px-4 py-2">
      <CardFrame label={ticket.labels.postcard} serial={7}>
        <div className="text-center pt-1">
          <p className="font-script text-2xl text-sage-dark">Send a postcard</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            guestbook · 방명록
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="mt-6 rounded-sm border border-dashed border-sage/40 bg-paper px-4 py-8 text-center text-sm font-mono tracking-widest text-forest/40 uppercase">
            Postcards coming soon
          </div>
        ) : (
          <>
            {/* 빈 엽서 — 메시지 작성 폼 */}
            <form onSubmit={handleSubmit} className="mt-5 rounded-sm border border-forest/15 bg-paper shadow-sm overflow-hidden">
              <div className="grid grid-cols-[1fr_auto] gap-3 p-3 border-b border-dashed border-forest/15">
                <div>
                  <FieldLabel en="From" ko="보내는 이" />
                  <input
                    className={`mt-1 ${inputClass}`}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="이름"
                    maxLength={20}
                  />
                </div>
                <div className="h-12 w-12 border-2 border-dashed border-sage/40 flex items-center justify-center text-sage/50 text-xs font-mono tracking-widest mt-3">
                  ✈
                </div>
              </div>
              <div className="p-3">
                <FieldLabel en="Message" ko="축하 메시지" />
                <textarea
                  rows={3}
                  className={`mt-1 resize-none ${inputClass}`}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="축하의 한 줄을 남겨주세요"
                  maxLength={300}
                />
                {error && <p className="text-xs text-terracotta-dark font-mono mt-2">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-3 w-full rounded-sm border-2 border-sage bg-sage/10 py-2.5 text-sm font-mono tracking-[0.2em] text-sage-dark uppercase hover:bg-sage/20 transition disabled:opacity-50"
                >
                  {status === 'submitting' ? 'SENDING…' : 'Send postcard ✉'}
                </button>
              </div>
            </form>

            {/* 받은 엽서 목록 */}
            <div className="mt-6">
              <FieldLabel en="Received" ko="받은 엽서" />
              <div className="mt-3 space-y-2.5">
                {loading ? (
                  <p className="text-center text-xs text-forest/40 font-mono tracking-widest">LOADING…</p>
                ) : entries.length === 0 ? (
                  <p className="text-center text-xs text-forest/40 font-mono tracking-widest uppercase">
                    No postcards yet · 첫 메시지를 남겨주세요
                  </p>
                ) : (
                  <>
                    {entries.map((entry) => <ReceivedPostcard key={entry.id} entry={entry} />)}
                    {hasMore ? (
                      <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="mt-2 w-full rounded-sm border border-sage/40 bg-paper py-2.5 text-xs font-mono tracking-[0.2em] text-forest hover:bg-sage/10 transition disabled:opacity-50 uppercase"
                      >
                        {loadingMore ? 'LOADING…' : 'Load more · 더 보기'}
                      </button>
                    ) : (
                      <p className="text-center text-[10px] font-mono tracking-widest text-forest/30 uppercase pt-2">
                        — End of postcards —
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </CardFrame>
    </section>
  );
}
