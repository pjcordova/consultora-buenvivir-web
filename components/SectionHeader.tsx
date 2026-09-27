type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** "verde": para franjas de fondo verde, con el texto en blanco. */
  tono?: "claro" | "verde";
};

/**
 * Encabezado que se repite en las secciones de la Home (pastilla + título + bajada).
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  tono = "claro",
}: SectionHeaderProps) {
  const sobreVerde = tono === "verde";

  return (
    <header className="mx-auto max-w-2xl text-center">
      <p
        className={`inline-flex items-center gap-2 text-balance rounded-2xl px-4 py-1.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] sm:rounded-full sm:text-[11px] sm:tracking-[0.16em] ${
          sobreVerde
            ? "border border-white/35 bg-white/10 text-white"
            : "border border-leaf/25 bg-cream text-leaf"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${sobreVerde ? "bg-white" : "bg-leaf"}`}
          aria-hidden="true"
        />
        {eyebrow}
      </p>

      <h2
        className={`mt-5 text-3xl leading-tight sm:text-[2.5rem] ${
          sobreVerde ? "text-white" : "text-forest-950"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-pretty text-base leading-relaxed ${
            sobreVerde ? "text-white" : "text-forest-800/80"
          }`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
