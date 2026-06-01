import { useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { SecondaryButton, Section } from './_shared.jsx';

function AccountRow({ title, account }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(account.number.replace(/\D/g, ''));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border-t border-ink/15 py-6 last:border-b">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 text-left">
          <p className="eyebrow text-ink/55">{title}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/82">
            {account.bank}<br />
            <span className="font-mono text-[13px] tracking-[0.08em]">{account.number}</span><br />
            예금주 {account.holder}
          </p>
        </div>
        <SecondaryButton onClick={copy} className="shrink-0 px-3 py-2">
          {copied ? 'COPIED' : 'COPY'}
        </SecondaryButton>
      </div>
    </div>
  );
}

export default function Account() {
  const { groom, bride } = wedding;
  return (
    <Section title="ACCOUNT">
      <div className="mx-auto max-w-[390px]">
        <p className="mb-8 text-center text-[13px] leading-relaxed text-ink/55">
          참석이 어려운 분들을 위해 계좌번호를 안내드립니다.
        </p>
        <AccountRow title="GROOM" account={groom.bankAccount} />
        <AccountRow title="BRIDE" account={bride.bankAccount} />
      </div>
    </Section>
  );
}
