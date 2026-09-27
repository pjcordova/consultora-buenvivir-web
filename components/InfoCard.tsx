import Boton from "@/components/Boton";
import type { Parrafo } from "@/types/content";

type InfoCardProps = {
  icon?: "hoja" | "brote";
  quote: string;
  paragraphs: Parrafo[];
  /** Pie con pregunta + botón (sección "Un nuevo paradigma"). */
  question?: string;
  cta?: { label: string; href: string };
  /** Pie con autoría (sección "Cosmovisión"). */
  author?: string;
  tag?: string;
};

const ICONOS = {
  hoja: <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 12-9 0 7-3 12-8 13.5M4 21c1-4 4-7 8-8.5" />,
  brote: <path d="M12 22V10M12 10C12 6 9 4 5 4c0 4 3 6 7 6ZM12 10c0-4 3-6 7-6 0 4-3 6-7 6Z" />,
};

export default function InfoCard({
  icon = "hoja",
  quote,
  paragraphs,
  question,
  cta,
  author,
  tag,
}: InfoCardProps) {
  return (
    <article className="rounded-3xl bg-cream p-7 sm:p-9">
      <div className="flex gap-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-leaf" aria-hidden="true">
          {ICONOS[icon]}
        </svg>
        <p className="font-display text-xl italic leading-snug text-forest-950 sm:text-[1.4rem]">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {paragraphs.map((parrafo, i) => (
        <p
          key={i}
          className={`text-[0.95rem] leading-relaxed text-forest-800/80 ${
            i === 0 ? "mt-6" : "mt-6 border-t border-forest-800/10 pt-6"
          }`}
        >
          {parrafo.map((fragmento, j) =>
            typeof fragmento === "string" ? (
              fragmento
            ) : (
              <strong key={j} className="font-medium text-forest-950">
                {fragmento.fuerte}
              </strong>
            )
          )}
        </p>
      ))}

      {(question || cta) && (
        <div className="mt-7 flex flex-col items-start gap-4 border-t border-forest-800/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {question && (
            <p className="flex gap-2 text-sm leading-snug text-forest-800/80">
              <span className="text-leaf" aria-hidden="true">
                →
              </span>
              {question}
            </p>
          )}
          {cta && (
            <Boton
              href={cta.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-dark"
            >
              {cta.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
              </svg>
            </Boton>
          )}
        </div>
      )}

      {(author || tag) && (
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-forest-800/10 pt-6">
          {author && (
            <p className="flex items-center gap-2 font-display text-sm italic text-forest-800/80">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
              {author}
            </p>
          )}
          {tag && (
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-forest-800/50">
              {tag}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
