import Boton from "@/components/Boton";

type CtaSectionProps = {
  title: string;
  /** Fondo de la sección: "blanco" cuando la sección anterior es crema. */
  fondo?: "crema" | "blanco";
  subtitle?: string;
  note?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export default function CtaSection({
  title,
  fondo = "crema",
  subtitle,
  note,
  primary,
  secondary,
}: CtaSectionProps) {
  return (
    // Línea superior: marca dónde empieza el llamado a la acción
    <section
      id="conversemos"
      className={`border-t border-leaf/30 px-[8vw] py-20 text-center sm:py-24 ${
        fondo === "blanco" ? "bg-white" : "bg-cream"
      }`}
    >
      <span
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-forest-800/15 ${
          fondo === "blanco" ? "bg-cream" : "bg-white"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest-950" aria-hidden="true">
          <path d="M8 10h8M8 14h5" />
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
      </span>

      <h2 className="mx-auto mt-7 max-w-2xl text-pretty text-3xl leading-tight text-forest-950 sm:text-[2.4rem]">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-forest-800/80">
          {subtitle}
        </p>
      )}

      {note && (
        <p className="mx-auto mt-3 max-w-xl text-xs italic text-forest-800/50">({note})</p>
      )}

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Boton
          href={primary.href}
          className="inline-flex items-center gap-2 rounded-md bg-leaf px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-leaf-dark"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
          {primary.label}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 6 10-6" />
          </svg>
        </Boton>

        {secondary && (
          <Boton
            href={secondary.href}
            className="inline-flex items-center rounded-md border border-butter-border bg-butter px-6 py-3.5 text-sm text-forest-800 transition-colors hover:bg-[#fbf1b8]"
          >
            {secondary.label}
          </Boton>
        )}
      </div>
    </section>
  );
}
