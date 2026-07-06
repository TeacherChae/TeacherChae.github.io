import { useState } from 'react';
import { wedding } from '../../../config/wedding.js';
import { SecondaryButton, Section } from '../ui/_shared.jsx';
import { Reveal } from '../ui/motion.jsx';

function AccountRow({ account }) {
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
    <div className="border-t border-ink/12 py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 text-left">
          {account.role && (
            <p className="font-titleKo text-label tracking-editorial text-ink/45">{account.role}</p>
          )}
          <p className="mt-2 type-body text-ink/82">
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

function AccountGroup({ title, accounts }) {
  return (
    <div className="mb-10 last:mb-0">
      <p className="eyebrow text-ink/55">{title}</p>
      <div className="mt-3 border-t border-ink/15">
        {accounts.map((account, i) => (
          <AccountRow key={i} account={account} />
        ))}
      </div>
    </div>
  );
}

export default function Account() {
  const { groom, bride } = wedding;
  return (
    <Section title="마음 전하실 곳">
      <Reveal className="mx-auto max-w-content">
        <AccountGroup title="신랑 측" accounts={groom.bankAccounts} />
        <AccountGroup title="신부 측" accounts={bride.bankAccounts} />
      </Reveal>
    </Section>
  );
}
