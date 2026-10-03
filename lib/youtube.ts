/**
 * Videos de YouTube cargados desde el panel: Belén pega el enlace tal como lo
 * copia (de la barra del navegador o del botón "Compartir") y acá se arma la
 * dirección para mostrarlo dentro de la página.
 */

/** Las formas en que YouTube escribe el código del video en sus enlaces. */
const RUTAS_CON_CODIGO = ["/embed/", "/shorts/", "/live/", "/v/"];
const CODIGO_DE_VIDEO = /^[\w-]{11}$/;

/** "384", "384s", "6m24s" o "1h2m3s" → segundos. */
function segundos(valor: string | null): number {
  if (!valor) return 0;
  if (/^\d+s?$/.test(valor)) return parseInt(valor, 10);
  const partes = valor.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!partes) return 0;
  const [, horas = "0", minutos = "0", segs = "0"] = partes;
  return Number(horas) * 3600 + Number(minutos) * 60 + Number(segs);
}

function codigoDelVideo(enlace: URL): string | null {
  const host = enlace.hostname.replace(/^(www\.|m\.)/, "");
  if (host === "youtu.be") return enlace.pathname.slice(1).split("/")[0] || null;
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;

  const ruta = RUTAS_CON_CODIGO.find((prefijo) => enlace.pathname.startsWith(prefijo));
  if (ruta) return enlace.pathname.slice(ruta.length).split("/")[0] || null;
  return enlace.searchParams.get("v");
}

export type VideoDeYoutube = {
  /** Para el iframe. youtube-nocookie.com: YouTube no guarda cookies hasta que se da play. */
  incrustado: string;
  /** Para abrirlo en YouTube, desde el mismo minuto. */
  enYoutube: string;
};

/**
 * Las direcciones del video, o null si el enlace no es de un video de YouTube.
 * Si el enlace marca un minuto (&t=384s), el video arranca ahí.
 */
export function videoDeYoutube(enlace: string | undefined): VideoDeYoutube | null {
  if (!enlace?.trim()) return null;

  let url: URL;
  try {
    url = new URL(enlace.trim());
  } catch {
    return null;
  }

  const codigo = codigoDelVideo(url);
  if (!codigo || !CODIGO_DE_VIDEO.test(codigo)) return null;

  const inicio = segundos(url.searchParams.get("t") ?? url.searchParams.get("start"));
  const opciones = new URLSearchParams({ rel: "0" });
  if (inicio > 0) opciones.set("start", String(inicio));

  return {
    incrustado: `https://www.youtube-nocookie.com/embed/${codigo}?${opciones}`,
    enYoutube: `https://www.youtube.com/watch?v=${codigo}${inicio > 0 ? `&t=${inicio}s` : ""}`,
  };
}
