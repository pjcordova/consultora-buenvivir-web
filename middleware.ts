import { NextResponse, type NextRequest } from "next/server";
import { CABECERA_IDIOMA, COOKIE_IDIOMA, esIdioma, type Idioma } from "@/lib/idioma";

/**
 * Idioma de cada visita.
 *
 * 1. Las direcciones /en/… se sirven con las mismas páginas, en inglés: se le
 *    saca el /en a la dirección por dentro y se avisa el idioma en una cabecera.
 * 2. La primera vez, cada visitante ve el sitio en su idioma: si eligió uno con
 *    el selector (cookie), ese; si no, el de su navegador (español si lo tiene
 *    primero, inglés para el resto).
 *
 * Los buscadores y las vistas previas de WhatsApp, LinkedIn y otras redes no se
 * redirigen: así Google indexa las dos versiones y cada enlace compartido se ve
 * en el idioma en que se compartió.
 */

const NO_REDIRIGIR =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|linkedin|skype|discord|slack|preview|embed|lighthouse|headless/i;

/** "es-AR,es;q=0.9,en;q=0.8" → "es". Cualquier idioma que no sea español → inglés. */
function idiomaDelNavegador(cabecera: string | null): Idioma | null {
  if (!cabecera) return null;

  const preferido = cabecera
    .split(",")
    .map((parte) => {
      const [codigo, ...opciones] = parte.trim().split(";");
      const peso = opciones.find((opcion) => opcion.trim().startsWith("q="));
      return { codigo: codigo.trim().toLowerCase(), peso: peso ? Number(peso.trim().slice(2)) : 1 };
    })
    .filter(({ codigo, peso }) => codigo && codigo !== "*" && peso > 0)
    .sort((a, b) => b.peso - a.peso)[0];

  if (!preferido) return null;
  return preferido.codigo.startsWith("es") ? "es" : "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const enIngles = pathname === "/en" || pathname.startsWith("/en/");
  const idiomaDeLaRuta: Idioma = enIngles ? "en" : "es";
  const rutaBase = enIngles ? pathname.slice(3) || "/" : pathname;

  // Solo se redirige una página pedida por el navegador, no las cargas internas
  // de Next.js (al navegar dentro del sitio) ni a los buscadores.
  const esPaginaPedidaPorElNavegador =
    request.method === "GET" &&
    !request.headers.get("rsc") &&
    !request.headers.get("next-router-prefetch") &&
    !NO_REDIRIGIR.test(request.headers.get("user-agent") ?? "");

  if (esPaginaPedidaPorElNavegador) {
    const elegido = request.cookies.get(COOKIE_IDIOMA)?.value;
    const preferido = esIdioma(elegido)
      ? elegido
      : idiomaDelNavegador(request.headers.get("accept-language"));

    if (preferido && preferido !== idiomaDeLaRuta) {
      const destino = request.nextUrl.clone();
      destino.pathname = preferido === "en" ? (rutaBase === "/" ? "/en" : `/en${rutaBase}`) : rutaBase;
      return NextResponse.redirect(destino);
    }
  }

  const cabeceras = new Headers(request.headers);
  cabeceras.set(CABECERA_IDIOMA, idiomaDeLaRuta);

  if (enIngles) {
    const interna = request.nextUrl.clone();
    interna.pathname = rutaBase;
    return NextResponse.rewrite(interna, { request: { headers: cabeceras } });
  }
  return NextResponse.next({ request: { headers: cabeceras } });
}

// Solo las páginas públicas: el panel, la API, las imágenes y las estadísticas
// no pasan por acá.
export const config = {
  matcher: [
    "/",
    "/servicios",
    "/sobre-belen",
    "/contacto",
    "/ecosistema/:path*",
    "/en",
    "/en/:path*",
  ],
};
