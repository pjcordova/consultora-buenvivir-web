import { unstable_cache } from "next/cache";

/**
 * El reproductor de Spotify para el enlace que pega Belén en el panel (el de
 * "Compartir" en Spotify): un podcast, un episodio, una lista, un álbum o un
 * artista.
 *
 * Cómo mostrarlo lo dice Spotify (oEmbed): el podcast del Ecosistema es en
 * video, así que se ve su video; un podcast solo de audio o una lista, con el
 * reproductor de audio. La respuesta se guarda un día; si Spotify no contesta,
 * se muestra el reproductor de audio, que funciona con cualquier enlace.
 */

export type ReproductorSpotify = {
  /** Para el iframe. */
  incrustado: string;
  /** El enlace sin los datos de seguimiento (?si=…), para el botón. */
  enSpotify: string;
  /** Video en 16:9, o reproductor de audio con su alto. */
  video: boolean;
  alto: number;
  /** Nombre del podcast o del episodio, según Spotify. */
  titulo: string;
};

const TIPOS = new Set(["show", "episode", "playlist", "album", "artist", "track"]);

/** Tipo y código del enlace, o null si no es un enlace de Spotify que se pueda mostrar. */
function leerEnlace(enlace: string): { tipo: string; codigo: string } | null {
  let url: URL;
  try {
    url = new URL(enlace.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "open.spotify.com") return null;
  // Algunos enlaces traen el idioma adelante: /intl-es/show/…
  const [tipo, codigo] = url.pathname.split("/").filter((parte) => parte && !parte.startsWith("intl-"));
  return TIPOS.has(tipo) && /^[A-Za-z0-9]{22}$/.test(codigo ?? "") ? { tipo, codigo } : null;
}

type RespuestaOEmbed = { iframe_url?: string; type?: string; height?: number; title?: string };

const preguntarASpotify = unstable_cache(
  async (enlace: string): Promise<RespuestaOEmbed> => {
    const respuesta = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(enlace)}`, {
      signal: AbortSignal.timeout(3000),
    });
    // Un error no se guarda: se vuelve a preguntar en la próxima visita
    if (!respuesta.ok) throw new Error(`Spotify oEmbed respondió ${respuesta.status}`);
    return respuesta.json();
  },
  ["spotify-oembed"],
  { revalidate: 60 * 60 * 24 }
);

export async function reproductorDeSpotify(enlace: string): Promise<ReproductorSpotify | null> {
  const leido = leerEnlace(enlace);
  if (!leido) return null;
  const enSpotify = `https://open.spotify.com/${leido.tipo}/${leido.codigo}`;
  const deAudio: ReproductorSpotify = {
    incrustado: `https://open.spotify.com/embed/${leido.tipo}/${leido.codigo}?utm_source=generator`,
    enSpotify,
    video: false,
    alto: 352,
    titulo: "",
  };
  try {
    const datos = await preguntarASpotify(enSpotify);
    // Tal cual lo da Spotify (con su ?utm_source=oembed), como en su propio código para pegar
    const incrustado = datos.iframe_url?.startsWith("https://open.spotify.com/embed/")
      ? datos.iframe_url
      : deAudio.incrustado;
    return {
      incrustado,
      enSpotify,
      video: datos.type === "video",
      alto: Math.min(Math.max(Number(datos.height) || deAudio.alto, 152), 500),
      titulo: datos.title?.trim() ?? "",
    };
  } catch {
    return deAudio;
  }
}
