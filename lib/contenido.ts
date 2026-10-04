import fs from "node:fs/promises";
import path from "node:path";
import { contenidoDe, type Contenido } from "@/content";
import type { Espacio } from "@/content/ecosistema";
import { PREGUNTAS_DE_EJEMPLO } from "@/content/preguntas";
import type { Oferta } from "@/content/servicios";
import { correo as correoPorDefecto } from "@/content/site";
import { bajarDato, escribirDato, leerDato, usaBlob } from "@/lib/almacen";
import type { ElementoGuardado, IdLista, TextoBilingue } from "@/lib/admin/listas";
import { IDIOMA_DE_BASE, type Idioma } from "@/lib/idioma";
import type { Parrafo } from "@/types/content";

/**
 * Textos editados desde el panel.
 *
 * Los textos originales viven en content/*.ts y funcionan como base. Lo que se
 * edita en /admin se guarda en data/contenido.json y pisa solo esos campos, así
 * una sección nunca queda vacía y siempre se puede volver al texto original.
 *
 * En la computadora de desarrollo esto es un archivo; en el sitio publicado
 * vive en el depósito (lib/almacen.ts). El resto del sitio no se entera.
 */
const ARCHIVO = path.join(process.cwd(), "data", "contenido.json");

export type Guardado = Record<string, Record<string, unknown>>;

export async function leerGuardado(): Promise<Guardado> {
  if (usaBlob) return leerDato<Guardado>("contenido", {});

  try {
    return JSON.parse(await fs.readFile(ARCHIVO, "utf8")) as Guardado;
  } catch {
    return {};
  }
}

/**
 * Lo último guardado, sin la copia en memoria. Antes de modificar hay que
 * partir de lo que está realmente guardado, no de lo que se mostró recién.
 */
async function leerParaModificar(): Promise<Guardado> {
  if (usaBlob) return bajarDato<Guardado>("contenido", {});
  return leerGuardado();
}

async function escribir(datos: Guardado): Promise<void> {
  if (usaBlob) {
    await escribirDato("contenido", datos);
    return;
  }

  await fs.mkdir(path.dirname(ARCHIVO), { recursive: true });
  await fs.writeFile(ARCHIVO, `${JSON.stringify(datos, null, 2)}\n`, "utf8");
}

export async function guardarSeccion(
  seccion: string,
  valores: Record<string, unknown>
): Promise<void> {
  await escribir({ ...(await leerParaModificar()), [seccion]: valores });
}

export async function restaurarSeccion(seccion: string): Promise<void> {
  const actual = await leerParaModificar();
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

/** "Qué se lleva quien participa": un renglón por ítem, "Título: texto" (el texto es opcional). */
type ItemIncluye = { titulo: string; texto?: string };

export function incluyeATexto(items: ItemIncluye[]): string {
  return items.map((item) => (item.texto ? `${item.titulo}: ${item.texto}` : item.titulo)).join("\n");
}

export function textoAIncluye(texto: string): ItemIncluye[] {
  return textoALista(texto).map((linea) => {
    const dosPuntos = linea.indexOf(":");
    if (dosPuntos <= 0) return { titulo: linea };
    const titulo = linea.slice(0, dosPuntos).trim();
    const resto = linea.slice(dosPuntos + 1).trim();
    return resto ? { titulo, texto: resto } : { titulo };
  });
}

/* --- Idioma de lo guardado ----------------------------------------------------
 * Lo editado en español se guarda con el nombre de la sección ("portada"), como
 * siempre; lo editado en inglés, con el idioma al final ("portada@en").
 */

export const claveDeSeccion = (seccion: string, idioma: Idioma): string =>
  idioma === IDIOMA_DE_BASE ? seccion : `${seccion}@${idioma}`;

/**
 * Campos del pie que valen para los dos idiomas (el número de WhatsApp y las
 * redes). Se cargan una sola vez, en la versión en español.
 */
export const CAMPOS_COMPARTIDOS_DEL_PIE = [
  "correo",
  "whatsappNumero",
  "whatsappVisible",
  "instagram",
  "linkedin",
  "tiktok",
  "youtube",
  "substack",
];

/* --- Lectores por sección --------------------------------------------------- */

async function editado(seccion: string, idioma: Idioma): Promise<Record<string, unknown>> {
  return (await leerGuardado())[claveDeSeccion(seccion, idioma)] ?? {};
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

export async function obtenerPortada(idioma: Idioma): Promise<Contenido["hero"]> {
  const { hero } = contenidoDe(idioma);
  return { ...hero, ...(await editado("portada", idioma)) } as typeof hero;
}

export async function obtenerParadigma(
  idioma: Idioma
): Promise<Contenido["regeneracionOrganizacional"]> {
  return conParrafos(contenidoDe(idioma).regeneracionOrganizacional, await editado("paradigma", idioma));
}

export async function obtenerServicios(idioma: Idioma): Promise<Contenido["ecosistema"]> {
  const { ecosistema } = contenidoDe(idioma);
  // Los círculos muestran lo editado en la sección de cada espacio
  const espacios = await Promise.all(
    ecosistema.espacios.map(
      async (espacio) => (await obtenerEspacioPagina(espacio.slug, idioma)) ?? espacio
    )
  );
  return { ...ecosistema, ...(await editado("servicios", idioma)), espacios } as typeof ecosistema;
}

export async function obtenerCosmovision(idioma: Idioma): Promise<Contenido["cosmovision"]> {
  return conParrafos(contenidoDe(idioma).cosmovision, await editado("cosmovision", idioma));
}

export async function obtenerLinajes(idioma: Idioma): Promise<Contenido["linajes"]> {
  const { linajes } = contenidoDe(idioma);
  return { ...linajes, ...(await editado("linajes", idioma)) } as typeof linajes;
}

export async function obtenerNovedades(idioma: Idioma): Promise<Contenido["novedades"]> {
  const { novedades } = contenidoDe(idioma);
  return { ...novedades, ...(await editado("novedades", idioma)) } as typeof novedades;
}

export async function obtenerCierre(idioma: Idioma): Promise<Contenido["ctaFinal"]> {
  const { ctaFinal } = contenidoDe(idioma);
  return { ...ctaFinal, ...(await editado("cierre", idioma)) } as typeof ctaFinal;
}

/**
 * Lo editado en el pie para un idioma, con los campos compartidos tomados
 * siempre de la versión en español.
 */
async function editadoPie(idioma: Idioma): Promise<Record<string, unknown>> {
  const guardado = await leerGuardado();
  const enEspanol = guardado[claveDeSeccion("pie", IDIOMA_DE_BASE)] ?? {};
  const propio = { ...(guardado[claveDeSeccion("pie", idioma)] ?? {}) };
  for (const campo of CAMPOS_COMPARTIDOS_DEL_PIE) {
    if (campo in enEspanol) propio[campo] = enEspanol[campo];
    else delete propio[campo];
  }
  return propio;
}

/** Campos del panel con el título de cada columna de enlaces del pie, en orden. */
const CAMPOS_TITULO_DE_COLUMNA = ["columnaServicios", "columnaEcosistema"];

/**
 * El nombre actual de un camino o de un espacio a partir de su enlace
 * ("/servicios#camino-2", "/ecosistema/casita-del-arbol"): si Belén lo renombra
 * en el panel, el pie lo muestra con el nombre nuevo.
 */
async function nombresDeEnlaces(idioma: Idioma): Promise<(href: string) => string | undefined> {
  const [caminos, espacios] = await Promise.all([
    obtenerCaminos(idioma),
    Promise.all(
      contenidoDe(idioma).espacios.map((espacio) => obtenerEspacioPagina(espacio.slug, idioma))
    ),
  ]);
  const CAMINO = "/servicios#camino-";
  const ESPACIO = "/ecosistema/";

  return (href) => {
    if (href.startsWith(CAMINO)) return caminos[Number(href.slice(CAMINO.length)) - 1]?.titulo;
    if (href.startsWith(ESPACIO)) {
      return espacios.find((espacio) => espacio?.slug === href.slice(ESPACIO.length))?.titulo;
    }
    return undefined;
  };
}

/** Pie de página: los campos sueltos del panel se reacomodan en su lugar. */
export async function obtenerPie(idioma: Idioma): Promise<Contenido["footer"]> {
  const { footer } = contenidoDe(idioma);
  const guardado = await editadoPie(idioma);
  const enlaceRed = (id: string, actual: string | undefined) =>
    typeof guardado[id] === "string" ? String(guardado[id]) : (actual ?? "");
  const [whatsapp, nombreActual] = await Promise.all([
    obtenerWhatsapp(idioma),
    nombresDeEnlaces(idioma),
  ]);

  return {
    ...footer,
    descripcion: String(guardado.descripcion ?? footer.descripcion),
    ubicacion: String(guardado.ubicacion ?? footer.ubicacion),
    lema: String(guardado.lema ?? footer.lema),
    columnas: footer.columnas.map((columna, i) => ({
      ...columna,
      titulo: String(guardado[CAMPOS_TITULO_DE_COLUMNA[i]] ?? columna.titulo),
      // Los enlaces a un camino o a un espacio llevan su nombre actual (editado o no)
      enlaces: columna.enlaces.map((enlace) => ({
        ...enlace,
        label: (enlace.href && nombreActual(enlace.href)) || enlace.label,
      })),
    })),
    contacto: {
      ...footer.contacto,
      titulo: String(guardado.columnaContacto ?? footer.contacto.titulo),
      intro: String(guardado.introContacto ?? footer.contacto.intro),
      whatsapp: {
        ...footer.contacto.whatsapp,
        label: `WhatsApp: ${whatsapp.visible}`,
        href: await urlWhatsapp(idioma),
      },
      instagram: {
        ...footer.contacto.instagram,
        href: enlaceRed("instagram", footer.contacto.instagram.href),
      },
      email: await enlaceDeCorreo(),
    },
    redes: footer.redes.map((red) => ({ ...red, href: enlaceRed(red.id, red.href) })),
  };
}

/** Correo de contacto: uno solo para los dos idiomas, cargado en el pie (en español). */
export async function obtenerCorreo(): Promise<string> {
  const guardado = await editadoPie(IDIOMA_DE_BASE);
  return typeof guardado.correo === "string" ? guardado.correo.trim() : correoPorDefecto;
}

/** El correo listo para el pie; sin correo cargado (href vacío) se muestra apagado. */
async function enlaceDeCorreo(): Promise<{ label: string; href: string }> {
  const direccion = await obtenerCorreo();
  return direccion ? { label: direccion, href: `mailto:${direccion}` } : { label: "—", href: "" };
}

export async function obtenerWhatsapp(idioma: Idioma): Promise<Contenido["whatsapp"]> {
  const { whatsapp } = contenidoDe(idioma);
  const guardado = await editadoPie(idioma);
  return {
    numero: String(guardado.whatsappNumero ?? whatsapp.numero),
    visible: String(guardado.whatsappVisible ?? whatsapp.visible),
    mensaje: String(guardado.whatsappMensaje ?? whatsapp.mensaje),
  };
}

export async function urlWhatsapp(idioma: Idioma): Promise<string> {
  const datos = await obtenerWhatsapp(idioma);
  return `https://wa.me/${datos.numero}?text=${encodeURIComponent(datos.mensaje)}`;
}

/** Página de Servicios: encabezado + los 7 servicios con sus textos. */
export async function obtenerPaginaServicios(
  idioma: Idioma
): Promise<Contenido["paginaServicios"]> {
  const { paginaServicios } = contenidoDe(idioma);
  return {
    ...paginaServicios,
    ...(await editado("pagina-servicios", idioma)),
  } as typeof paginaServicios;
}

/** Los tres caminos con sus servicios. El nombre y la descripción de cada camino
 * se editan en el encabezado de la página de Servicios. */
export async function obtenerCaminos(idioma: Idioma): Promise<Contenido["caminos"]> {
  const { caminos } = contenidoDe(idioma);
  const guardado = await leerGuardado();
  const encabezado = guardado[claveDeSeccion("pagina-servicios", idioma)] ?? {};
  const editadoDelCamino = (numero: number, campo: "titulo" | "descripcion") => {
    const valor = encabezado[`camino_${numero}_${campo}`];
    return typeof valor === "string" && valor.trim() ? valor : undefined;
  };

  return caminos.map((camino, i) => ({
    ...camino,
    titulo: editadoDelCamino(i + 1, "titulo") ?? camino.titulo,
    descripcion: editadoDelCamino(i + 1, "descripcion") ?? camino.descripcion,
    ofertas: camino.ofertas.map((oferta) => {
      const edicion = guardado[claveDeSeccion(`servicio:${oferta.slug}`, idioma)];
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
export async function obtenerEspacioPagina(
  slug: string,
  idioma: Idioma
): Promise<Espacio | undefined> {
  const base = contenidoDe(idioma).espacios.find((espacio) => espacio.slug === slug);
  if (!base) return undefined;

  const edicion = await editado(`espacio:${slug}`, idioma);

  // El video vale para los dos idiomas: en inglés se usa el cargado en español
  // mientras no se cargue uno propio en la pestaña de inglés.
  const enEspanol =
    idioma === IDIOMA_DE_BASE ? edicion : await editado(`espacio:${slug}`, IDIOMA_DE_BASE);
  const video =
    [edicion.video, enEspanol.video].find((valor): valor is string => typeof valor === "string") ??
    base.video;
  if (!Object.keys(edicion).length) return { ...base, video };

  // El círculo de la Home lleva el nombre y el botón que Belén cargó en el panel
  const conTexto = (valor: unknown) =>
    typeof valor === "string" && valor.trim() ? valor : undefined;

  return {
    ...base,
    ...edicion,
    nombre: conTexto(edicion.titulo) ?? base.nombre,
    cta: { ...base.cta, label: conTexto(edicion.botonCirculo) ?? base.cta.label },
    video,
    parrafos:
      typeof edicion.parrafos === "string" ? textoALista(edicion.parrafos).map((p) => [p]) : base.parrafos,
    extras: typeof edicion.extras === "string" ? textoALista(edicion.extras) : base.extras,
    incluye: typeof edicion.incluye === "string" ? textoAIncluye(edicion.incluye) : base.incluye,
    ctaPagina: {
      ...base.ctaPagina,
      titulo: String(edicion.ctaTitulo ?? base.ctaPagina.titulo),
      bajada: String(edicion.ctaBajada ?? base.ctaPagina.bajada),
      principal: (edicion.ctaBoton as typeof base.ctaPagina.principal) ?? base.ctaPagina.principal,
    },
  } as Espacio;
}

/** Página Sobre Belén. */
export async function obtenerBelen(idioma: Idioma): Promise<Contenido["belen"]> {
  const { belen } = contenidoDe(idioma);
  const edicion = await editado("sobre-belen", idioma);

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
    formacion:
      typeof edicion.formacion === "string" ? textoALista(edicion.formacion) : belen.formacion,
  } as typeof belen;
}

/** Página de Contacto (las tres vías, la agenda y el bloque de redes). */
export async function obtenerContacto(idioma: Idioma): Promise<Contenido["contacto"]> {
  const { contacto } = contenidoDe(idioma);
  const edicion = await editado("contacto", idioma);

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

/* --- Listas: testimonios, talleres y preguntas frecuentes ---------------------
 * Se guardan una sola vez para los dos idiomas (lib/admin/listas.ts).
 */

const claveDeLista = (id: IdLista) => `lista:${id}`;

export async function leerLista(id: IdLista): Promise<ElementoGuardado[]> {
  const guardado = (await leerGuardado())[claveDeLista(id)];
  return Array.isArray(guardado?.items) ? (guardado.items as ElementoGuardado[]) : [];
}

export async function guardarLista(id: IdLista, items: ElementoGuardado[]): Promise<void> {
  await guardarSeccion(claveDeLista(id), { items });
}

/** El texto en el idioma pedido; si falta la versión en inglés, la de español. */
function textoEn(valor: unknown, idioma: Idioma): string {
  if (typeof valor === "string") return valor.trim();
  if (valor && typeof valor === "object") {
    const { es, en } = valor as Partial<TextoBilingue>;
    return ((idioma !== IDIOMA_DE_BASE && en?.trim()) || es?.trim() || "").trim();
  }
  return "";
}

export type Testimonio = { id: string; texto: string; nombre: string; rol: string };

/** Los testimonios marcados para mostrar, en el orden que les dio Belén. */
export async function obtenerTestimonios(idioma: Idioma): Promise<Testimonio[]> {
  return (await leerLista("testimonios"))
    .filter((item) => item.visible !== false)
    .map((item) => ({
      id: item.id,
      texto: textoEn(item.texto, idioma),
      nombre: textoEn(item.nombre, idioma),
      rol: textoEn(item.rol, idioma),
    }))
    .filter((testimonio) => testimonio.texto && testimonio.nombre);
}

export type Taller = {
  id: string;
  titulo: string;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM, hora de Argentina. Puede venir vacía. */
  hora: string;
  modalidad: string;
  descripcion: string;
  cupo: string;
  inscripcion: string;
};

/** Hoy en Argentina, como AAAA-MM-DD (el formato de Canadá en inglés es justo ese). */
const hoyEnArgentina = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());

/** Los talleres de hoy en adelante, del más próximo al más lejano. */
export async function obtenerTalleres(idioma: Idioma): Promise<Taller[]> {
  const hoy = hoyEnArgentina();

  return (await leerLista("talleres"))
    .map((item) => ({
      id: item.id,
      titulo: textoEn(item.titulo, idioma),
      fecha: textoEn(item.fecha, idioma),
      hora: textoEn(item.hora, idioma),
      modalidad: textoEn(item.modalidad, idioma),
      descripcion: textoEn(item.descripcion, idioma),
      cupo: textoEn(item.cupo, idioma),
      inscripcion: textoEn(item.inscripcion, idioma),
    }))
    .filter((taller) => taller.titulo && taller.fecha >= hoy)
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
}

export type Pregunta = { id: string; pregunta: string; respuesta: string };

/**
 * Las preguntas frecuentes, en el orden que les dio Belén.
 * Mientras la lista del panel está vacía, en la computadora de desarrollo se
 * ven preguntas de ejemplo (marcadas como tales) para poder revisar el diseño;
 * en el sitio publicado, sin preguntas la sección no aparece.
 */
export async function obtenerPreguntas(
  idioma: Idioma
): Promise<{ preguntas: Pregunta[]; deEjemplo: boolean }> {
  const preguntas = (await leerLista("preguntas"))
    .map((item) => ({
      id: item.id,
      pregunta: textoEn(item.pregunta, idioma),
      respuesta: textoEn(item.respuesta, idioma),
    }))
    .filter((item) => item.pregunta && item.respuesta);

  if (preguntas.length || process.env.NODE_ENV !== "development") {
    return { preguntas, deEjemplo: false };
  }
  return {
    preguntas: PREGUNTAS_DE_EJEMPLO[idioma].map((item, i) => ({ id: `ejemplo-${i}`, ...item })),
    deEjemplo: true,
  };
}

/* --- Leyendas de las fotos ---------------------------------------------------
 * Algunas fotos (las de Sobre Belén) llevan una leyenda corta debajo, en los dos
 * idiomas. Se cargan en el panel junto a cada foto y se guardan todas juntas:
 * "leyendas" → { lugar de la foto: { es, en } }.
 */

const CLAVE_LEYENDAS = "leyendas";

/** Las leyendas tal como están guardadas, para mostrarlas en el panel. */
export async function leerLeyendasGuardadas(): Promise<Record<string, TextoBilingue>> {
  return ((await leerGuardado())[CLAVE_LEYENDAS] ?? {}) as Record<string, TextoBilingue>;
}

/** La leyenda de cada foto en el idioma pedido (sin la de inglés, la de español). */
export async function obtenerLeyendas(idioma: Idioma): Promise<Record<string, string>> {
  const guardadas = await leerLeyendasGuardadas();
  return Object.fromEntries(
    Object.entries(guardadas).map(([lugar, texto]) => [lugar, textoEn(texto, idioma)])
  );
}

export async function guardarLeyenda(lugar: string, texto: TextoBilingue): Promise<void> {
  const actual = await leerParaModificar();
  const leyendas = { ...(actual[CLAVE_LEYENDAS] ?? {}), [lugar]: texto };
  await escribir({ ...actual, [CLAVE_LEYENDAS]: leyendas });
}
