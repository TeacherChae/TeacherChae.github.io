import { useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { CardFrame, FieldLabel } from './_shared.jsx';

function AccountRow({ label, bank, number, holder }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(number.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard 권한 없음 */
    }
  }
  return (
    <div className="flex items-center justify-between border-b border-dashed border-forest/15 py-2.5 text-sm">
      <div className="text-left min-w-0">
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-forest/50">{label}</p>
        <p className="mt-0.5 text-forest">
          <span className="font-mono text-[11px] tracking-widest text-forest/70 mr-2">{bank}</span>
          <span className="font-mono">{number}</span>
        </p>
        <p className="text-forest/55 text-[11px]">{holder}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-sm border border-sage/40 bg-paper px-3 py-1 text-[11px] font-mono tracking-wider text-sage-dark hover:bg-sage/10 transition"
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
    </div>
  );
}

export default function Receipt() {
  const { groom, bride, ticket } = wedding;

  return (
    <section className="px-8 py-2">
      {/* 영수증은 좀 더 좁은 폭 (px-8) — receipt paper 느낌 */}
      <CardFrame label={ticket.labels.receipt} serial={5}>
        <div className="text-center pt-1">
          <p className="font-script text-2xl text-sage-dark">With heart</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-forest/50 mt-1 uppercase">
            account · 마음 전하실 곳
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] text-forest/55 leading-relaxed">
          참석이 어려운 분들을 위해 계좌번호를 안내드립니다.
        </p>

        <div className="mt-5">
          <FieldLabel en="From groom side" ko="신랑측" />
          <div className="mt-1">
            {groom.bankAccounts.map((acc, i) => <AccountRow key={i} {...acc} />)}
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel en="From bride side" ko="신부측" />
          <div className="mt-1">
            {bride.bankAccounts.map((acc, i) => <AccountRow key={i} {...acc} />)}
          </div>
        </div>

        {/* 영수증 끝 — 점선 한 줄로 잘린 느낌 */}
        <div className="mt-5 pt-3 border-t-2 border-dashed border-forest/30 flex items-center justify-between font-mono text-[10px] tracking-widest text-forest/40 uppercase">
          <span>* * * * *</span>
          <span>END OF RECEIPT</span>
          <span>* * * * *</span>
        </div>
      </CardFrame>
    </section>
  );
}
