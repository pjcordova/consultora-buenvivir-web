import type { ReactNode } from "react";

export type RedId = "instagram" | "linkedin" | "tiktok" | "youtube";

export type Red = { id: RedId; label: string; href: string };

/** Logos de las redes, como trazo único para poder pintarlos con currentColor. */
export const LOGOS_REDES: Record<RedId, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </>
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45Z"
    />
  ),
  youtube: (
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z"
    />
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.6 3h-2.85v12.06a2.57 2.57 0 1 1-2.57-2.57c.24 0 .47.04.69.1v-2.9a5.6 5.6 0 0 0-.69-.05 5.47 5.47 0 1 0 5.47 5.47V9.4a6.55 6.55 0 0 0 3.85 1.24V7.75A3.78 3.78 0 0 1 16.6 3Z"
    />
  ),
};

type RedesSocialesProps = {
  redes: Red[];
  /** "oscuro": sobre el verde del pie. "claro": sobre fondos claros. */
  tono?: "oscuro" | "claro";
  className?: string;
};

/** Fila de íconos de redes: apagados mientras no tengan enlace. */
export default function RedesSociales({
  redes,
  tono = "oscuro",
  className = "",
}: RedesSocialesProps) {
  const base = "flex h-9 w-9 items-center justify-center rounded-full border transition-colors";
  const activo =
    tono === "oscuro"
      ? "border-cream/25 text-cream/80 hover:border-leaf-lime hover:text-leaf-lime"
      : "border-forest-800/20 text-forest-800/70 hover:border-leaf hover:text-leaf";
  const apagado =
    tono === "oscuro" ? "border-cream/10 text-cream/30" : "border-forest-800/10 text-forest-800/25";

  return (
    <ul className={`flex gap-3 ${className}`}>
      {redes.map((red) => {
        const icono = (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            {LOGOS_REDES[red.id]}
          </svg>
        );

        return (
          <li key={red.id}>
            {red.href ? (
              <a
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={red.label}
                className={`${base} ${activo}`}
              >
                {icono}
              </a>
            ) : (
              <span
                aria-label={`${red.label} — pendiente de enlace`}
                title="Pendiente: falta el enlace"
                className={`${base} ${apagado}`}
              >
                {icono}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
