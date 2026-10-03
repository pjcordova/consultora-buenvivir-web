import type { MetadataRoute } from "next";
import { espacios } from "@/content/ecosistema";
import { enlaceEnIdioma, IDIOMA_DE_BASE, IDIOMAS } from "@/lib/idioma";
import { URL_DEL_SITIO } from "@/lib/metadatos";

/**
 * Mapa del sitio: las páginas públicas en los dos idiomas, cada una con la
 * dirección de su versión en el otro idioma, para que Google las relacione.
 */
/** Privacidad y Términos: van en el mapa, pero con menos peso que el resto. */
const LEGALES = ["/privacidad", "/terminos"];

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    "/",
    "/servicios",
    "/sobre-belen",
    "/contacto",
    ...espacios.map((espacio) => `/ecosistema/${espacio.slug}`),
    ...LEGALES,
  ];

  const direccion = (ruta: string, idioma: (typeof IDIOMAS)[number]) => {
    const enIdioma = enlaceEnIdioma(ruta, idioma);
    return enIdioma === "/" ? URL_DEL_SITIO : `${URL_DEL_SITIO}${enIdioma}`;
  };

  return rutas.flatMap((ruta) =>
    IDIOMAS.map((idioma) => ({
      url: direccion(ruta, idioma),
      changeFrequency: "monthly" as const,
      priority:
        ruta === "/" ? (idioma === IDIOMA_DE_BASE ? 1 : 0.9) : LEGALES.includes(ruta) ? 0.3 : 0.7,
      alternates: {
        languages: Object.fromEntries(IDIOMAS.map((otro) => [otro, direccion(ruta, otro)])),
      },
    }))
  );
}
