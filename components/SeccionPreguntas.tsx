import Boton from "@/components/Boton";
import SectionHeader from "@/components/SectionHeader";
import type { Pregunta } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

type SeccionPreguntasProps = {
  preguntas: Pregunta[];
  idioma: Idioma;
  /** Preguntas de ejemplo (solo en la computadora de desarrollo): se avisa arriba. */
  deEjemplo?: boolean;
  /** Para la última línea: "¿Te quedó otra duda? Escribile por WhatsApp". */
  whatsapp: string;
  /** Fondo de la franja, para alternar con las secciones vecinas. */
  fondo?: "crema" | "blanco";
  /** Solo en una página: la ficha para Google con las preguntas (schema.org FAQPage). */
  conFicha?: boolean;
};

/**
 * Preguntas frecuentes que carga Belén desde el panel, desplegables.
 * Usa <details>: se abren y cierran sin JavaScript y funcionan con teclado y
 * lectores de pantalla. Sin preguntas, la sección no se dibuja.
 */
export default function SeccionPreguntas({
  preguntas,
  idioma,
  deEjemplo = false,
  whatsapp,
  fondo = "crema",
  conFicha = false,
}: SeccionPreguntasProps) {
  if (!preguntas.length) return null;

  const textos = textosDe(idioma).preguntas;
  const ficha = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: { "@type": "Answer", text: item.respuesta },
    })),
  };

  return (
    <section
      id="preguntas"
      className={`px-[8vw] py-16 sm:py-20 ${fondo === "crema" ? "bg-cream" : "bg-white"}`}
    >
      <SectionHeader eyebrow={textos.etiqueta} title={textos.titulo} subtitle={textos.bajada} />

      <div className="mx-auto mt-10 max-w-3xl">
        {deEjemplo && (
          <p className="mb-5 rounded-xl border border-dashed border-honey/60 bg-butter/60 px-4 py-3 text-center text-xs text-forest-800">
            {textos.ejemplo}
          </p>
        )}

        <div className="divide-y divide-forest-800/10 overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_-28px_rgba(18,23,15,0.35)] ring-1 ring-forest-800/10">
          {preguntas.map((item, i) => (
            <details key={item.id} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-cream/60 sm:px-8 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg leading-snug text-forest-950">{item.pregunta}</span>
                {/* Un "+" que gira y queda como "×" cuando la respuesta está abierta */}
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-leaf transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <div className="whitespace-pre-line px-6 pb-6 text-[0.95rem] leading-relaxed text-forest-800/85 sm:px-8">
                {item.respuesta}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-forest-800/75">
          {textos.otraDuda}
          <Boton
            href={whatsapp}
            className="inline-flex items-center gap-2 rounded-full border border-forest-800/20 bg-white px-4 py-2 font-medium text-forest-800 transition-colors hover:border-leaf hover:text-forest-950"
          >
            {textos.escribir}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Boton>
        </p>
      </div>

      {conFicha && !deEjemplo && (
        <script
          type="application/ld+json"
          // Los "<" se escapan para que un texto cargado en el panel no pueda cerrar la etiqueta
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ficha).replace(/</g, "\\u003c") }}
        />
      )}
    </section>
  );
}
