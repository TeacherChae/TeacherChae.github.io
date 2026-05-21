import { wedding } from '../config/wedding.js';

export default function Hero() {
  const { groom, bride, date } = wedding;
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between pt-16 pb-12 px-6">
      <div className="text-center">
        <p className="font-script text-5xl text-sage-dark">we are getting married</p>
      </div>

      <div className="my-8 w-full">
        <div className="aspect-[3/4] w-full rounded-sm bg-sage/10 border border-sage/20 flex items-center justify-center text-forest/30 text-sm">
          메인 사진 (예: /public/images/hero.jpg)
        </div>
      </div>

      <div className="text-center">
        <p className="font-serif italic text-2xl text-forest tracking-wide">
          {groom.nameEn} <span className="mx-2 text-sage">&</span> {bride.nameEn}
        </p>
        <div className="divider-leaf" />
        <p className="text-lg tracking-widest2 text-forest/80">{date.short}</p>
        <p className="mt-1 text-xs tracking-widest2 text-forest/50 uppercase">
          {date.dayEn}
        </p>
      </div>
    </section>
  );
}
