/**
 * ObjectSection — "object on a shelf" wrapper.
 * One focal point, vast breathing room, blind-deboss title treatment.
 *
 * Props:
 *   title      {string}  — section label (e.g. "DATE · 일시")
 *   children   {node}    — single focal content element
 *   minHeight  {string}  — CSS min-height, default '70vh'
 */
export default function ObjectSection({ title, children, minHeight = '70vh' }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center bg-bone px-6 py-16"
      style={{ minHeight }}
    >
      {/* Blind-deboss title */}
      <p
        className="
          mb-10
          text-[10px]
          tracking-[0.28em]
          uppercase
          font-sans
          select-none
          text-ink/30
        "
        style={{
          /* Letterpress / blind-deboss CSS effect */
          textShadow:
            '0 1px 0 rgba(255,255,255,0.72), 0 -1px 0 rgba(0,0,0,0.08)',
        }}
        aria-label={title}
      >
        {title}
      </p>

      {/* Single focal content — naturally centered */}
      <div className="flex flex-col items-center text-center">
        {children}
      </div>
    </section>
  );
}
