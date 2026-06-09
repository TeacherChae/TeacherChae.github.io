import { wedding } from '../config/wedding.js';

export default function Hero() {
  const { groom, bride, date } = wedding;

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sage-light/25 via-sage/10 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-page flex-col items-center justify-center gap-9">
        <div className="pt-2 text-center">
          <p className="font-script text-5xl text-sage-dark">we are getting married</p>
        </div>

        <div className="w-full">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[30px] border border-sage/25 bg-cream shadow-[0_26px_80px_rgba(47,63,54,0.14)]">
            <video
              className="h-full w-full object-cover"
              src="/videos/calligraphy-hero.webm"
              poster="/images/calligraphy-poster.png"
              autoPlay
              muted
              loop
              playsInline
              aria-label={`${groom.nameEn} and ${bride.nameEn} calligraphy animation`}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/40" />
          </div>
        </div>

        <div className="pb-2 text-center">
          <p className="font-serif text-2xl italic tracking-wide text-forest">
            {groom.nameEn} <span className="mx-2 text-sage">&</span> {bride.nameEn}
          </p>
          <div className="divider-leaf" />
          <p className="text-lg tracking-widest2 text-forest/80">{date.short}</p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-forest/50">
            {date.dayEn}
          </p>
        </div>
      </div>
    </section>
  );
}
