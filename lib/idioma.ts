/**
 * Idiomas del sitio.
 *
 * El español es el idioma de base y no lleva prefijo (/servicios). El inglés
 * va con /en adelante (/en/servicios). El middleware decide qué idioma mostrar
 * según la elección del visitante o el idioma de su navegador.
 *
 * Este archivo no depende del servidor: lo pueden usar también los componentes
 * que corren en el navegador. Para saber el idioma de la página que se está
 * armando, usar obtenerIdioma() de lib/idioma-servidor.ts.
 */
export const IDIOMAS = ["es", "en"] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_DE_BASE: Idioma = "es";

/** Cabecera interna con la que el middleware le avisa a la página su idioma. */
export const CABECERA_IDIOMA = "x-idioma";

/** Cookie donde se recuerda el idioma que eligió el visitante con el selector. */
export const COOKIE_IDIOMA = "idioma";

export const NOMBRE_DEL_IDIOMA: Record<Idioma, string> = {
  es: "Español",
  en: "English",
};

export const esIdioma = (valor: unknown): valor is Idioma =>
  typeof valor === "string" && (IDIOMAS as readonly string[]).includes(valor);

/** "/en/servicios" → "/servicios". Las rutas en español quedan igual. */
export function rutaSinIdioma(ruta: string): string {
  if (ruta === "/en") return "/";
  if (ruta.startsWith("/en/")) return ruta.slice(3);
  if (ruta.startsWith("/en#")) return `/${ruta.slice(3)}`;
  return ruta;
}

/**
 * Lleva un enlace interno al idioma indicado: "/contacto" → "/en/contacto".
 * Los enlaces externos, las anclas de la misma página ("#agenda") y los de
 * correo o teléfono quedan como están.
 */
export function enlaceEnIdioma(href: string, idioma: Idioma): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const base = rutaSinIdioma(href);
  if (idioma === IDIOMA_DE_BASE) return base;
  if (base === "/") return "/en";
  if (base.startsWith("/#")) return `/en${base.slice(1)}`;
  return `/en${base}`;
}
