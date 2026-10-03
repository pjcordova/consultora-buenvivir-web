"use client";

import { usePathname } from "next/navigation";
import {
  COOKIE_IDIOMA,
  enlaceEnIdioma,
  IDIOMAS,
  NOMBRE_DEL_IDIOMA,
  rutaSinIdioma,
  type Idioma,
} from "@/lib/idioma";

type SelectorIdiomaProps = {
  idioma: Idioma;
  /** "Idioma" / "Language", para lectores de pantalla. */
  etiqueta: string;
  className?: string;
};

/** Un año: el sitio recuerda el idioma elegido en las próximas visitas. */
const UN_ANIO = 60 * 60 * 24 * 365;

/**
 * ES · EN. Lleva a la misma página en el otro idioma y lo recuerda en una
 * cookie, así el middleware no lo vuelve a cambiar según el navegador.
 * Es un enlace común (no de Next.js) para que la página se recargue entera en
 * el idioma nuevo.
 */
export default function SelectorIdioma({ idioma, etiqueta, className = "" }: SelectorIdiomaProps) {
  // Sin el /en, la ruta es la misma en los dos idiomas
  const ruta = rutaSinIdioma(usePathname());

  return (
    <div role="group" aria-label={etiqueta} className={`flex items-center gap-1.5 ${className}`}>
      {IDIOMAS.map((opcion, i) => (
        <span key={opcion} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-forest-800/30" aria-hidden="true">
              ·
            </span>
          )}
          <a
            href={enlaceEnIdioma(ruta, opcion)}
            hrefLang={opcion}
            lang={opcion}
            title={NOMBRE_DEL_IDIOMA[opcion]}
            aria-current={opcion === idioma ? "true" : undefined}
            onClick={() => {
              document.cookie = `${COOKIE_IDIOMA}=${opcion}; path=/; max-age=${UN_ANIO}; samesite=lax`;
            }}
            className={
              opcion === idioma
                ? "font-bold text-forest-950"
                : "text-forest-800/60 transition-colors hover:text-forest-950"
            }
          >
            <span aria-hidden="true">{opcion.toUpperCase()}</span>
            <span className="sr-only">{NOMBRE_DEL_IDIOMA[opcion]}</span>
          </a>
        </span>
      ))}
    </div>
  );
}
