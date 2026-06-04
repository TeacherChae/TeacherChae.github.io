import { useState } from 'react';
import { wedding } from '../../config/wedding.js';
import { SecondaryButton, Section } from './_shared.jsx';
import { Reveal } from './motion.jsx';

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
          <p className="mt-3 type-body text-ink/82">
            {account.bank}<br />
            <span className="type-data">{account.number}</span><br />
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
    <Section title={
      <>
        Send Your
        <br />
        Warm Wishes
        </>
    }>
      <Reveal className="mx-auto max-w-content">
        <p className="mb-8 text-center type-caption text-ink/55">
          마음 전하실 곳
        </p>
        <AccountRow title="GROOM" account={groom.bankAccount} />
        <AccountRow title="BRIDE" account={bride.bankAccount} />
      </Reveal>
    </Section>
  );
}
