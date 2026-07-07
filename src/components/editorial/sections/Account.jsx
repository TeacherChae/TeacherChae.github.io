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

function AccountGroup({ id, title, accounts, isOpen, onToggle }) {
  const panelId = `account-panel-${id}`;

  return (
    <div className="border-t border-ink/15 first:border-t-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/60"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>
          <span className="eyebrow block text-ink/55">{title}</span>
          <span className="mt-2 block type-body text-ink/62">계좌 정보 보기</span>
        </span>
        <span className="font-titleKo text-small tracking-editorial text-ink/45" aria-hidden="true">
          {isOpen ? 'CLOSE' : 'OPEN'}
        </span>
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-label={`${title} 계좌 목록`} className="border-t border-ink/12">
          {accounts.map((account, i) => (
            <AccountRow key={i} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Account() {
  const { groom, bride } = wedding;
  const [openSide, setOpenSide] = useState(null);
  const toggleSide = (side) => setOpenSide((current) => (current === side ? null : side));

  return (
    <Section title="마음 전하실 곳">
      <Reveal className="mx-auto max-w-content">
        <p className="mb-4 text-center type-body text-ink/60">
          계좌 정보는 아래 항목을 눌러 확인하실 수 있습니다.
        </p>
        <div className="border-y border-ink/15">
          <AccountGroup
            id="groom"
            title="신랑 측"
            accounts={groom.bankAccounts}
            isOpen={openSide === 'groom'}
            onToggle={() => toggleSide('groom')}
          />
          <AccountGroup
            id="bride"
            title="신부 측"
            accounts={bride.bankAccounts}
            isOpen={openSide === 'bride'}
            onToggle={() => toggleSide('bride')}
          />
        </div>
      </Reveal>
    </Section>
  );
}
