import { countries } from "country-flag-icons";
import * as BANDERAS from "country-flag-icons/string/3x2";

/**
 * La bandera de un país a partir de su nombre tal como lo escribe Belén en el
 * panel ("Argentina", "Perú", "Estados Unidos", "Brasil"…), en español, inglés
 * o portugués, con o sin tildes. Se arma en el servidor: el navegador recibe
 * solo la bandera de cada integrante, como imagen SVG.
 *
 * Banderas en SVG y no emojis: Windows no dibuja las banderas emoji (muestra
 * "AR" en lugar de 🇦🇷).
 */

const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();

/** Formas comunes de escribir un país que los nombres oficiales no cubren. */
const OTROS_NOMBRES: Record<string, string> = {
  eeuu: "US",
  "ee uu": "US",
  usa: "US",
  "estados unidos de america": "US",
  inglaterra: "GB",
  escocia: "GB",
  gales: "GB",
  "gran bretana": "GB",
  holanda: "NL",
  "republica checa": "CZ",
  "corea del sur": "KR",
};

let indice: Map<string, string> | null = null;

function indiceDeNombres(): Map<string, string> {
  if (indice) return indice;
  const nuevo = new Map<string, string>();
  for (const idioma of ["es", "en", "pt"]) {
    const nombres = new Intl.DisplayNames([idioma], { type: "region" });
    for (const codigo of countries) {
      try {
        const nombre = nombres.of(codigo);
        if (nombre && nombre !== codigo && !nuevo.has(normalizar(nombre))) nuevo.set(normalizar(nombre), codigo);
      } catch {
        /* código que el navegador no conoce como región */
      }
    }
  }
  for (const [nombre, codigo] of Object.entries(OTROS_NOMBRES)) nuevo.set(nombre, codigo);
  indice = nuevo;
  return nuevo;
}

/** Código de dos letras del país (AR, PE…), o null si no se reconoce el nombre. */
export function codigoDePais(pais: string): string | null {
  const limpio = normalizar(pais);
  if (!limpio) return null;
  return indiceDeNombres().get(limpio) ?? null;
}

/** La bandera como imagen lista para usar (data:image/svg+xml), o null. */
export function banderaDePais(pais: string): string | null {
  const codigo = codigoDePais(pais);
  const svg = codigo ? (BANDERAS as Record<string, string>)[codigo] : undefined;
  return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : null;
}
