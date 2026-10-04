import type { Contenido } from "@/content";
import { substackBelen } from "@/content/enlaces";

type SeccionNovedadesProps = { textos: Contenido["novedades"] };

/**
 * Franja para suscribirse a las novedades de Belén por correo.
 *
 * No hace falta servidor ni JavaScript: el formulario abre en otra pestaña la
 * página de suscripción de su Substack con el correo ya escrito, y la persona
 * confirma ahí. El sitio no guarda ningún correo; la lista vive en Substack,
 * desde donde Belén manda sus novedades.
 *
 * data-medir: el envío se cuenta en las estadísticas (components/MedirClics.tsx).
 */
export default function SeccionNovedades({ textos }: SeccionNovedadesProps) {
  return (
    <section id="novedades" className="bg-leaf-deep px-[8vw] py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m2 7 10 6 10-6" />
            </svg>
            {textos.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl leading-tight text-white sm:text-[2.25rem]">{textos.titulo}</h2>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/85">
            {textos.bajada}
          </p>
        </div>

        <div>
          <form
            action={`${substackBelen}/subscribe`}
            method="get"
            target="_blank"
            data-medir="Suscripción"
            className="flex flex-col gap-3 rounded-3xl bg-white/10 p-3 ring-1 ring-white/20 sm:flex-row sm:rounded-full sm:p-2"
          >
            <label htmlFor="correo-novedades" className="sr-only">
              {textos.campo}
            </label>
            <input
              id="correo-novedades"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={textos.campo}
              className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm text-forest-950 outline-none placeholder:text-forest-800/50 focus-visible:ring-2 focus-visible:ring-butter"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-butter px-6 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-[#fbf1b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-butter"
            >
              {textos.boton}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          {textos.nota && (
            <p className="mt-3 px-2 text-xs leading-relaxed text-white/70 sm:px-5">{textos.nota}</p>
          )}
        </div>
      </div>
    </section>
  );
}
