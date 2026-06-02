import { useState } from 'react';
import { Section, SecondaryButton } from './_shared.jsx';
import { Reveal } from './motion.jsx';
import { shareKakao, copyLink } from '../../lib/share.js';

export default function Share() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const result = await copyLink();
    if (result === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <Section title="SHARE">
      <Reveal className="mx-auto max-w-[390px]">
        <p className="mb-8 text-center text-[14px] leading-relaxed text-ink/60">
          소중한 분들에게 청첩장을 전해주세요.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <SecondaryButton onClick={() => shareKakao()}>카카오톡으로 공유하기</SecondaryButton>
          <SecondaryButton onClick={handleCopy}>
            {copied ? '링크가 복사되었습니다' : '링크 복사하기'}
          </SecondaryButton>
        </div>
      </Reveal>
    </Section>
  );
}
