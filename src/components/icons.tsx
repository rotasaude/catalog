// SVGs do protótipo (referencia-layout.html). Decorativos: sempre aria-hidden,
// o texto ao lado carrega o significado.

export function StatusIcon({ status }: { status: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", "aria-hidden": true } as const;
  switch (status) {
    case "available":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d="M4.7 8.3l2.2 2.2 4.4-4.8" fill="none" stroke="var(--ok-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "validating":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 1.7a6.3 6.3 0 0 0 0 12.6z" fill="currentColor" />
        </svg>
      );
    case "planned":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.6 12.4l8.8-8.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
}

export function SurfaceIcon({ surface }: { surface: string }) {
  const common = {
    width: 20, height: 20, viewBox: "0 0 22 22", "aria-hidden": true,
    fill: "none", stroke: "currentColor", strokeWidth: 1.8
  } as const;
  switch (surface) {
    case "cidadao":
      return (
        <svg {...common} strokeLinecap="round">
          <circle cx="11" cy="7" r="3.6" />
          <path d="M4 19c.8-3.8 3.6-5.6 7-5.6s6.2 1.8 7 5.6" />
        </svg>
      );
    case "secretaria":
      return (
        <svg {...common} strokeLinejoin="round">
          <rect x="3" y="4" width="16" height="12" rx="2" />
          <path d="M7 12V9M11 12V7M15 12v-2M8 19h6" />
        </svg>
      );
    case "plataforma":
      return (
        <svg {...common} strokeLinejoin="round">
          <path d="M11 2.5l7 3v5c0 4.3-3 7.4-7 9-4-1.6-7-4.7-7-9v-5z" />
        </svg>
      );
    default:
      return (
        <svg {...common} strokeLinecap="round">
          <circle cx="11" cy="11" r="3" />
          <path d="M11 2.5v3M11 16.5v3M2.5 11h3M16.5 11h3M5 5l2.1 2.1M14.9 14.9L17 17M5 17l2.1-2.1M14.9 7.1L17 5" />
        </svg>
      );
  }
}

export function Chevron({ direction = "right", className }: { direction?: "right" | "left" | "down"; className?: string }) {
  const d = { right: "M6 3.5l4.5 4.5L6 12.5", left: "M10 3.5L5.5 8l4.5 4.5", down: "M3.5 6l4.5 4.5L12.5 6" }[direction];
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Brand() {
  return (
    <div className="brand">
      <svg width="28" height="28" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill="var(--accent)" />
        <circle cx="10" cy="24" r="3.2" fill="var(--accent-ink)" />
        <circle cx="24" cy="10" r="3.2" fill="var(--accent-ink)" />
        <path d="M10 24c0-7 14-7 14-14" fill="none" stroke="var(--accent-ink)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      Rota Saúde
    </div>
  );
}
