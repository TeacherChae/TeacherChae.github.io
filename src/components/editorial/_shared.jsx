import { Reveal } from './motion.jsx';

export function Section({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`editorial-section ${className}`}>
      {title && (
        <Reveal className="text-center">
          <p className="section-kicker">{title}</p>
          <div className="hairline" />
        </Reveal>
      )}
      {children}
    </section>
  );
}

export function FieldLabel({ children }) {
  return <label className="eyebrow block">{children}</label>;
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button type="button" className={`editorial-button-primary ${className}`} {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', as: Comp = 'button', ...props }) {
  return (
    <Comp className={`editorial-button-secondary ${className}`} {...props}>
      {children}
    </Comp>
  );
}

export function formatDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}
