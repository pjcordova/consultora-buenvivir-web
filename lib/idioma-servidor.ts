import { headers } from "next/headers";
import { CABECERA_IDIOMA, IDIOMA_DE_BASE, type Idioma } from "@/lib/idioma";

/**
 * Idioma de la página que se está armando. Lo decide el middleware a partir de
 * la dirección (/en/… es inglés) y lo pasa en una cabecera interna.
 * Solo para componentes de servidor.
 */
export function obtenerIdioma(): Idioma {
  return headers().get(CABECERA_IDIOMA) === "en" ? "en" : IDIOMA_DE_BASE;
}
