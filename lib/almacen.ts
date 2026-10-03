import { del, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";

/**
 * Depósito del contenido que edita el panel.
 *
 * En la computadora de desarrollo todo vive en el disco (public/ y data/).
 * En el sitio publicado el disco es de solo lectura, así que las fotos y los
 * textos van a Vercel Blob. El resto del sitio no se entera: pide una ruta y
 * recibe una dirección, venga de donde venga.
 *
 * El interruptor es el token: si Vercel lo inyectó, se usa el depósito.
 */
export const usaBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Los dos archivos de datos que guardamos: los textos y el mapa de imágenes. */
type Dato = "contenido" | "medios";

/** Una imagen o video subido desde el panel. url en null = la quitaron. */
export type Medio = { url: string | null; actualizado: number };
export type MapaMedios = Record<string, Medio>;

export const etiqueta = (nombre: Dato) => `dato:${nombre}`;

/*
 * Cada guardado es un archivo nuevo: datos/<nombre>/<marca de tiempo>.json.
 *
 * Sobrescribir siempre el mismo archivo no sirve: la red de Vercel puede
 * seguir entregando la versión anterior un rato, y la página se armaba con el
 * texto viejo. Una dirección que nunca cambia no puede quedar vieja en ninguna
 * caché. La más nueva se encuentra con list(), que le pregunta al depósito y
 * no a la red, y las anteriores se borran al guardar.
 */
const carpeta = (nombre: Dato) => `datos/${nombre}/`;

/** El único archivo que se sobrescribía antes. Se lee hasta el primer guardado nuevo. */
const archivoAnterior = (nombre: Dato) => `datos/${nombre}.json`;

type Version = { url: string; pathname: string };

/** Versiones guardadas, de la más nueva a la más vieja. */
async function versiones(nombre: Dato): Promise<Version[]> {
  const { blobs } = await list({ prefix: `datos/${nombre}` });
  // La marca de tiempo tiene siempre 13 cifras: el orden alfabético es el cronológico.
  const nuevas = blobs
    .filter((blob) => blob.pathname.startsWith(carpeta(nombre)))
    .sort((a, b) => b.pathname.localeCompare(a.pathname));
  const anterior = blobs.filter((blob) => blob.pathname === archivoAnterior(nombre));
  return [...nuevas, ...anterior];
}

/**
 * Lo último guardado, leído del depósito.
 * Si no hay nada guardado devuelve el valor por defecto; si el depósito falla,
 * lanza un error. Nunca confunde "falló" con "vacío": si no, el próximo
 * guardado pisaría todo lo anterior con una sección sola.
 */
export async function bajarDato<T>(nombre: Dato, porDefecto: T): Promise<T> {
  const [ultima] = await versiones(nombre);
  if (!ultima) return porDefecto;

  // Una versión nunca cambia de contenido: se puede guardar en caché sin riesgo.
  const respuesta = await fetch(ultima.url, { cache: "force-cache" });
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer ${ultima.pathname} (${respuesta.status})`);
  }
  return (await respuesta.json()) as T;
}

/**
 * Lo mismo, guardado en memoria: la página no le pide el archivo al depósito
 * en cada visita. Cada vez que el panel guarda, se tira la copia.
 * Si el depósito no responde, esa visita ve los textos originales (sin guardar
 * ese resultado) en lugar de una página con error.
 */
export async function leerDato<T>(nombre: Dato, porDefecto: T): Promise<T> {
  try {
    return await unstable_cache(() => bajarDato(nombre, porDefecto), ["dato", nombre], {
      tags: [etiqueta(nombre)],
    })();
  } catch (error) {
    console.error(`[almacen] No se pudo leer "${nombre}" del depósito:`, error);
    return porDefecto;
  }
}

export async function escribirDato(nombre: Dato, datos: unknown): Promise<void> {
  // La marca de tiempo ordena las versiones; el sufijo al azar (addRandomSuffix)
  // evita que dos guardados en el mismo milisegundo choquen.
  const { pathname } = await put(
    `${carpeta(nombre)}${Date.now()}.json`,
    `${JSON.stringify(datos, null, 2)}\n`,
    { access: "public", contentType: "application/json", addRandomSuffix: true }
  );

  // Se borran solo las versiones más viejas que esta: nunca una más nueva que
  // haya escrito otro guardado al mismo tiempo.
  const viejas = (await versiones(nombre)).filter(
    (version) => version.pathname === archivoAnterior(nombre) || version.pathname < pathname
  );
  if (viejas.length) {
    await del(viejas.map((version) => version.url)).catch(() => undefined);
  }
}

export const leerMedios = () => leerDato<MapaMedios>("medios", {});

/** Borra sin hacer ruido: si el archivo viejo ya no está, no es un problema. */
async function borrarDelDeposito(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch {
    /* el archivo anterior ya no existe */
  }
}

/**
 * Sube una foto o un video y lo anota en el mapa.
 * Cada subida estrena dirección (addRandomSuffix), así nadie ve la versión
 * vieja guardada en la caché del navegador, y se borra la anterior.
 */
export async function subirMedio(
  ruta: string,
  contenido: Buffer,
  contentType: string
): Promise<string> {
  const { url } = await put(`medios${ruta}`, contenido, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });

  const mapa = await bajarDato<MapaMedios>("medios", {});
  const anterior = mapa[ruta];
  mapa[ruta] = { url, actualizado: Date.now() };
  await escribirDato("medios", mapa);

  await borrarDelDeposito(anterior?.url);
  return url;
}

/**
 * Quita la imagen de un lugar de la página. Queda anotada con url en null
 * para que no vuelva a aparecer la que viene con el código.
 */
export async function quitarMedio(ruta: string): Promise<void> {
  const mapa = await bajarDato<MapaMedios>("medios", {});
  const anterior = mapa[ruta];
  mapa[ruta] = { url: null, actualizado: Date.now() };
  await escribirDato("medios", mapa);

  await borrarDelDeposito(anterior?.url);
}
