import type { MetadataRoute } from "next";
import { espacios } from "@/content/ecosistema";
import { URL_DEL_SITIO } from "@/lib/metadatos";

/** Mapa del sitio: la lista de páginas públicas, para que Google las encuentre todas. */
export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    "/",
    "/servicios",
    "/sobre-belen",
    "/contacto",
    ...espacios.map((espacio) => `/ecosistema/${espacio.slug}`),
  ];

  return rutas.map((ruta) => ({
    url: ruta === "/" ? URL_DEL_SITIO : `${URL_DEL_SITIO}${ruta}`,
    changeFrequency: "monthly",
    priority: ruta === "/" ? 1 : 0.7,
  }));
}
