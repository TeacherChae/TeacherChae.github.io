import { wedding } from '../config/wedding.js';

export default function Gallery() {
  const { gallery } = wedding;
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="section">
      <div className="text-center">
        <p className="section-label">our moments</p>
        <p className="section-title">함께 담은 순간</p>
        <div className="divider-leaf" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2">
        {(gallery.length > 0 ? gallery : placeholders).map((item, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-sm bg-sage/10 border border-sage/20 overflow-hidden flex items-center justify-center text-xs text-forest/30"
          >
            {item?.src ? (
              <img src={item.src} alt={item.alt ?? ''} className="h-full w-full object-cover" />
            ) : (
              <span>사진 {i + 1}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
