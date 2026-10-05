import Boton from "@/components/Boton";
import SectionHeader from "@/components/SectionHeader";
import type { Taller } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

type SeccionTalleresProps = { talleres: Taller[]; idioma: Idioma };

/** "2026-10-15" como fecha, al mediodía UTC: así es el mismo día en cualquier zona horaria. */
const comoFecha = (iso: string) => new Date(`${iso}T12:00:00Z`);

/**
 * Próximos talleres y encuentros, cargados desde el panel. Sigue a "Nuestros
 * Servicios" con el mismo fondo, como parte del Ecosistema. Sin talleres por
 * delante, no se dibuja.
 */
export default function SeccionTalleres({ talleres, idioma }: SeccionTalleresProps) {
  if (!talleres.length) return null;

  const textos = textosDe(idioma).talleres;
  const formato = (opciones: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(textos.formatoFecha, { ...opciones, timeZone: "UTC" });
  const dia = formato({ day: "numeric" });
  const mes = formato({ month: "short" });
  const completa = formato({ weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="talleres" className="bg-cream px-[8vw] pb-20 pt-6 sm:pb-24">
      <SectionHeader eyebrow={textos.etiqueta} title={textos.titulo} subtitle={textos.bajada} />

      <ul className="mx-auto mt-12 max-w-4xl space-y-4">
        {talleres.map((taller) => {
          const fecha = comoFecha(taller.fecha);

          return (
            <li
              key={taller.id}
              // Tarjeta ancha: se inclina menos
              data-inclinar="3"
              className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-[0_14px_40px_-28px_rgba(18,23,15,0.35)] sm:flex-row sm:items-center sm:p-7"
            >
              <time
                dateTime={taller.fecha}
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-leaf-deep text-white"
              >
                <span className="font-display text-3xl leading-none">{dia.format(fecha)}</span>
                <span className="mt-1 text-xs uppercase tracking-wider">{mes.format(fecha).replace(".", "")}</span>
              </time>

              <div className="flex-1">
                <h3 className="font-display text-xl leading-snug text-forest-950">{taller.titulo}</h3>
                <p className="mt-1 text-sm text-forest-800/75 first-letter:uppercase">
                  {completa.format(fecha)}
                  {taller.hora && ` · ${taller.hora} (${textos.horaArgentina})`}
                </p>
                {taller.modalidad && <p className="mt-0.5 text-sm text-forest-800/75">{taller.modalidad}</p>}
                {taller.descripcion && (
                  <p className="mt-3 text-sm leading-relaxed text-forest-800/85">{taller.descripcion}</p>
                )}
                {taller.cupo && <p className="mt-2 text-xs font-medium text-leaf-deep">{taller.cupo}</p>}
              </div>

              <Boton
                href={taller.inscripcion || "/contacto"}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-leaf px-5 py-2.5 font-redonda text-sm font-semibold text-white transition-colors hover:bg-leaf-dark sm:self-center"
              >
                {textos.inscribirme}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Boton>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
