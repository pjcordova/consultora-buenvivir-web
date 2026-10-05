import SectionHeader from "@/components/SectionHeader";
import type { Testimonio } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

type SeccionTestimoniosProps = { testimonios: Testimonio[]; idioma: Idioma };

/**
 * Testimonios cargados desde el panel, en tarjetas. Sin testimonios
 * visibles, la sección no se dibuja.
 */
export default function SeccionTestimonios({ testimonios, idioma }: SeccionTestimoniosProps) {
  if (!testimonios.length) return null;

  const textos = textosDe(idioma).testimonios;

  return (
    <section id="testimonios" className="bg-white px-[8vw] py-20 sm:py-24">
      <SectionHeader eyebrow={textos.etiqueta} title={textos.titulo} />

      {/* Uno solo va centrado y angosto; dos, en dos columnas; tres o más, en tres */}
      <ul
        className={`mx-auto mt-14 grid gap-6 ${
          testimonios.length === 1
            ? "max-w-2xl"
            : `max-w-5xl md:grid-cols-2 ${testimonios.length >= 3 ? "lg:grid-cols-3" : ""}`
        }`}
      >
        {testimonios.map((testimonio) => (
          <li key={testimonio.id}>
            <figure data-inclinar className="flex h-full flex-col rounded-3xl bg-cream p-7">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-leaf/60" aria-hidden="true">
                <path d="M9.5 6C6.5 6.8 4.5 9.4 4.5 12.6V18h5.5v-5.5H7.3c.1-2 1.2-3.5 3-4.1L9.5 6Zm9 0c-3 .8-5 3.4-5 6.6V18H19v-5.5h-2.7c.1-2 1.2-3.5 3-4.1L18.5 6Z" />
              </svg>
              <blockquote className="mt-4 flex-1 font-display text-lg italic leading-snug text-forest-950">
                {testimonio.texto}
              </blockquote>
              <figcaption className="mt-6 border-t border-forest-800/10 pt-4 text-sm">
                <span className="font-medium text-forest-950">{testimonio.nombre}</span>
                {testimonio.rol && (
                  <span className="mt-0.5 block text-xs text-forest-800/65">{testimonio.rol}</span>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
