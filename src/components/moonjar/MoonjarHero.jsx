import { wedding } from '../../config/wedding.js';

export default function MoonjarHero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[95vh] bg-bone px-6"
      aria-label="달항아리 표지"
    >
      {/* Moon Jar SVG — asymmetric handmade pottery silhouette */}
      <div className="relative mb-10">
        <svg
          width="320"
          height="340"
          viewBox="0 0 320 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
        >
          <defs>
            {/* Radial gradient: inner glow milky-white to warm off-white */}
            <radialGradient
              id="moonjar-fill"
              cx="47%"
              cy="42%"
              r="54%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#FAF8F4" />
              <stop offset="55%" stopColor="#F2EDE4" />
              <stop offset="100%" stopColor="#ECE7DF" />
            </radialGradient>

            {/* Drop shadow filter for floating-object feel */}
            <filter id="moonjar-shadow" x="-18%" y="-10%" width="136%" height="128%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
              <feOffset dx="0" dy="14" result="offsetBlur" />
              <feFlood floodColor="#C4B49A" floodOpacity="0.28" result="color" />
              <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle base shadow ellipse */}
            <radialGradient id="base-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B89C7D" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#B89C7D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base shadow ellipse on ground */}
          <ellipse cx="160" cy="326" rx="88" ry="10" fill="url(#base-shadow)" />

          {/*
            Moon jar body — asymmetric path.
            Left side bulges slightly more than right; top shoulder
            is a touch higher on the left. Evokes 달항아리 imperfection.
          */}
          <path
            d="
              M 160 28
              C 210 26, 268 62, 284 118
              C 298 168, 296 220, 280 262
              C 265 300, 222 316, 160 318
              C 98 316, 58 300, 44 262
              C 28 220, 26 162, 42 112
              C 58 62, 110 30, 160 28
              Z
            "
            fill="url(#moonjar-fill)"
            stroke="#D8CFC4"
            strokeWidth="1.2"
            filter="url(#moonjar-shadow)"
          />

          {/*
            Subtle horizontal seam — the join line of a real 달항아리
            (top and bottom halves fired separately, joined at mid-body)
          */}
          <path
            d="M 48 178 Q 100 188, 160 186 Q 220 184, 272 176"
            stroke="#D0C5B8"
            strokeWidth="0.8"
            fill="none"
            opacity="0.55"
          />

          {/*
            Thin inner highlight arc — suggests the glaze sheen
            catching light from upper-left
          */}
          <path
            d="M 88 74 Q 120 56, 168 60"
            stroke="#FDFAF7"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Couple names in Noto Serif KR */}
      <p className="font-serif-ko text-[28px] font-medium text-ink tracking-[0.06em] text-center leading-relaxed">
        {wedding.groom.nameKo}
        <span className="inline-block mx-3 text-clay text-[22px] align-middle">·</span>
        {wedding.bride.nameKo}
      </p>

      {/* Hairline rule */}
      <div className="mt-5 mb-4 w-16 border-t border-ink/20" />

      {/* Wedding date — small caps restrained */}
      <p className="text-[11px] tracking-[0.22em] text-ink/55 uppercase font-sans text-center leading-loose">
        {wedding.date.short}
        <span className="mx-2 text-ink/30">·</span>
        Saturday
        <span className="mx-2 text-ink/30">·</span>
        11:00
      </p>

      {/* Venue line */}
      <p className="mt-1.5 text-[11px] tracking-[0.15em] text-ink/40 font-sans text-center">
        {wedding.venue.name}
      </p>

      {/* Subtle scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
        <div className="w-px h-8 bg-ink/40" />
      </div>
    </section>
  );
}
