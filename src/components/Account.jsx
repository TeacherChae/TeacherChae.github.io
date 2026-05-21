import { useState } from 'react';
import { wedding } from '../config/wedding.js';

function AccountRow({ label, bank, number, holder }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(number.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 권한이 없을 수도 있음 — 그냥 무시
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-sage/20 py-3 text-sm">
      <div className="text-left">
        <p className="text-forest/70 text-xs">{label}</p>
        <p className="mt-0.5 text-forest">
          {bank} <span className="text-forest/80">{number}</span>
        </p>
        <p className="text-forest/60 text-xs">{holder}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-sm border border-terracotta/40 bg-white/60 px-3 py-1.5 text-xs text-terracotta-dark hover:bg-terracotta/10 transition"
      >
        {copied ? '복사됨' : '복사'}
      </button>
    </div>
  );
}

export default function Account() {
  const { groom, bride } = wedding;
  return (
    <section className="section">
      <div className="text-center">
        <p className="section-label">with heart</p>
        <p className="section-title">마음 전하실 곳</p>
        <div className="divider-leaf" />
        <p className="mt-3 text-xs text-forest/60 leading-relaxed">
          참석이 어려운 분들을 위해 계좌번호를 안내드립니다.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-sage-dark">신랑측</p>
          <div className="mt-2">
            {groom.bankAccounts.map((acc, i) => (
              <AccountRow key={i} {...acc} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-sage-dark">신부측</p>
          <div className="mt-2">
            {bride.bankAccounts.map((acc, i) => (
              <AccountRow key={i} {...acc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
