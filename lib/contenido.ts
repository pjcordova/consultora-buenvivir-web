import fs from "node:fs/promises";
import path from "node:path";
import {
  cosmovision,
  ctaFinal,
  ecosistema,
  hero,
  linajes,
  regeneracionOrganizacional,
} from "@/content/home";
import { belen } from "@/content/belen";
import { contacto } from "@/content/contacto";
import { espacios, type Espacio } from "@/content/ecosistema";
import { caminos, paginaServicios, type Oferta } from "@/content/servicios";
import { footer, whatsapp } from "@/content/site";
import type { Parrafo } from "@/types/content";

/**
 * Textos editados desde el panel.
 *
 * Los textos originales viven en content/*.ts y funcionan como base. Lo que se
 * edita en /admin se guarda en data/contenido.json y pisa solo esos campos, así
 * una sección nunca queda vacía y siempre se puede volver al texto original.
 *
 * Al publicar en Vercel hay que cambiar leerGuardado/guardarSeccion por el
 * almacenamiento definitivo (Vercel Blob): el resto del sitio no se entera.
 */
const ARCHIVO = path.join(process.cwd(), "data", "contenido.json");

export type Guardado = Record<string, Record<string, unknown>>;

export async function leerGuardado(): Promise<Guardado> {
  try {
    return JSON.parse(await fs.readFile(ARCHIVO, "utf8")) as Guardado;
  } catch {
    return {};
  }
}

async function escribir(datos: Guardado): Promise<void> {
  await fs.mkdir(path.dirname(ARCHIVO), { recursive: true });
  await fs.writeFile(ARCHIVO, `${JSON.stringify(datos, null, 2)}\n`, "utf8");
}

export async function guardarSeccion(
  seccion: string,
  valores: Record<string, unknown>
): Promise<void> {
  await escribir({ ...(await leerGuardado()), [seccion]: valores });
}

export async function restaurarSeccion(seccion: string): Promise<void> {
  const actual = await leerGuardado();
  delete actual[seccion];
  await escribir(actual);
}

/* --- Párrafos ---------------------------------------------------------------
 * En el panel se escriben como texto común: un renglón en blanco separa párrafos
 * y lo que va entre **asteriscos dobles** se ve en negrita.
 */

export function parrafosATexto(parrafos: Parrafo[]): string {
  return parrafos
    .map((parrafo) =>
      parrafo
        .map((fragmento) =>
          typeof fragmento === "string" ? fragmento : `**${fragmento.fuerte}**`
        )
        .join("")
    )
    .join("\n\n");
}

export function textoAParrafos(texto: string): Parrafo[] {
  return texto
    .split(/\n\s*\n/)
    .map((bloque) => bloque.trim())
    .filter(Boolean)
    .map((bloque) =>
      bloque
        .split(/\*\*(.+?)\*\*/g)
        .map((trozo, i) => (i % 2 === 1 ? { fuerte: trozo } : trozo))
        .filter((trozo) => trozo !== "")
    );
}

/* --- Listas ------------------------------------------------------------------
 * En el panel se escriben como un renglón por ítem.
 */

export function listaATexto(items: string[]): string {
  return items.join("\n");
}

export function textoALista(texto: string): string[] {
  return texto
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
}

/* --- Lectores por sección --------------------------------------------------- */

async function editado(seccion: string): Promise<Record<string, unknown>> {
  return (await leerGuardado())[seccion] ?? {};
}

/** Si el panel guardó párrafos los convierte; si no, deja los originales. */
function conParrafos<T extends { parrafos: Parrafo[] }>(
  base: T,
  guardado: Record<string, unknown>
): T {
  const parrafos =
    typeof guardado.parrafos === "string"
      ? textoAParrafos(guardado.parrafos)
      : base.parrafos;
  return { ...base, ...guardado, parrafos } as T;
}

export async function obtenerPortada(): Promise<typeof hero> {
  return { ...hero, ...(await editado("portada")) } as typeof hero;
}

export async function obtenerParadigma(): Promise<typeof regeneracionOrganizacional> {
  return conParrafos(regeneracionOrganizacional, await editado("paradigma"));
}

export async function obtenerServicios(): Promise<typeof ecosistema> {
  return { ...ecosistema, ...(await editado("servicios")) } as typeof ecosistema;
}

export async function obtenerCosmovision(): Promise<typeof cosmovision> {
  return conParrafos(cosmovision, await editado("cosmovision"));
}

export async function obtenerLinajes(): Promise<typeof linajes> {
  return { ...linajes, ...(await editado("linajes")) } as typeof linajes;
}

export async function obtenerCierre(): Promise<typeof ctaFinal> {
  return { ...ctaFinal, ...(await editado("cierre")) } as typeof ctaFinal;
}

/** Pie de página: los campos sueltos del panel se reacomodan en su lugar. */
export async function obtenerPie(): Promise<typeof footer> {
  const guardado = await editado("pie");
  const enlaceRed = (id: string, actual: string | undefined) =>
    typeof guardado[id] === "string" ? String(guardado[id]) : (actual ?? "");

  return {
    ...footer,
    descripcion: String(guardado.descripcion ?? footer.descripcion),
    ubicacion: String(guardado.ubicacion ?? footer.ubicacion),
    lema: String(guardado.lema ?? footer.lema),
    contacto: {
      ...footer.contacto,
      intro: String(guardado.introContacto ?? footer.contacto.intro),
      whatsapp: {
        ...footer.contacto.whatsapp,
        label: `WhatsApp: ${String(guardado.whatsappVisible ?? whatsapp.visible)}`,
        href: await urlWhatsapp(),
      },
      instagram: {
        ...footer.contacto.instagram,
        href: enlaceRed("instagram", footer.contacto.instagram.href),
      },
    },
    redes: footer.redes.map((red) => ({ ...red, href: enlaceRed(red.id, red.href) })),
  };
}

export async function obtenerWhatsapp(): Promise<typeof whatsapp> {
  const guardado = await editado("pie");
  return {
    numero: String(guardado.whatsappNumero ?? whatsapp.numero),
    visible: String(guardado.whatsappVisible ?? whatsapp.visible),
    mensaje: String(guardado.whatsappMensaje ?? whatsapp.mensaje),
  };
}

export async function urlWhatsapp(): Promise<string> {
  const datos = await obtenerWhatsapp();
  return `https://wa.me/${datos.numero}?text=${encodeURIComponent(datos.mensaje)}`;
}

/** Página de Servicios: encabezado + los 7 servicios con sus textos. */
export async function obtenerPaginaServicios(): Promise<typeof paginaServicios> {
  return { ...paginaServicios, ...(await editado("pagina-servicios")) } as typeof paginaServicios;
}

export async function obtenerCaminos(): Promise<typeof caminos> {
  const guardado = await leerGuardado();

  return caminos.map((camino) => ({
    ...camino,
    ofertas: camino.ofertas.map((oferta) => {
      const edicion = guardado[`servicio:${oferta.slug}`];
      if (!edicion) return oferta;

      return {
        ...oferta,
        ...edicion,
        incluye:
          typeof edicion.incluye === "string" ? textoALista(edicion.incluye) : oferta.incluye,
      } as Oferta;
    }),
  }));
}

/** Página de un espacio del Ecosistema. */
export async function obtenerEspacioPagina(slug: string): Promise<Espacio | undefined> {
  const base = espacios.find((espacio) => espacio.slug === slug);
  if (!base) return undefined;

  const edicion = await editado(`espacio:${slug}`);
  if (!Object.keys(edicion).length) return base;

  return {
    ...base,
    ...edicion,
    parrafos:
      typeof edicion.parrafos === "string" ? textoALista(edicion.parrafos).map((p) => [p]) : base.parrafos,
    extras: typeof edicion.extras === "string" ? textoALista(edicion.extras) : base.extras,
    ctaPagina: {
      ...base.ctaPagina,
      titulo: String(edicion.ctaTitulo ?? base.ctaPagina.titulo),
      bajada: String(edicion.ctaBajada ?? base.ctaPagina.bajada),
      principal: (edicion.ctaBoton as typeof base.ctaPagina.principal) ?? base.ctaPagina.principal,
    },
  } as Espacio;
}

/** Página Sobre Belén. */
export async function obtenerBelen(): Promise<typeof belen> {
  const edicion = await editado("sobre-belen");

  return {
    ...belen,
    ...edicion,
    titulos: typeof edicion.titulos === "string" ? textoALista(edicion.titulos) : belen.titulos,
    presentacion:
      typeof edicion.presentacion === "string"
        ? textoAParrafos(edicion.presentacion)
        : belen.presentacion,
    camino:
      typeof edicion.camino === "string" ? textoAParrafos(edicion.camino) : belen.camino,
    enfoque:
      typeof edicion.enfoque === "string" ? textoAParrafos(edicion.enfoque) : belen.enfoque,
  } as typeof belen;
}

/** Página de Contacto (las tres vías y el bloque de redes). */
export async function obtenerContacto(): Promise<typeof contacto> {
  const edicion = await editado("contacto");

  return {
    ...contacto,
    ...edicion,
    vias: contacto.vias.map((via) => {
      const titulo = edicion[`via_${via.id}_titulo`];
      const texto = edicion[`via_${via.id}_texto`];
      return {
        ...via,
        titulo: titulo ? String(titulo) : via.titulo,
        texto: texto ? String(texto) : via.texto,
      };
    }),
  } as typeof contacto;
}
