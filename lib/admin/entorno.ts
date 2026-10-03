import { usaBlob } from "@/lib/almacen";

/**
 * En Vercel el disco es de solo lectura: sin el depósito conectado, el panel
 * puede mirar pero no guardar. Con el depósito (lib/almacen.ts) guarda normal.
 */
export const soloLectura = Boolean(process.env.VERCEL) && !usaBlob;

export const MENSAJE_SOLO_LECTURA =
  "El sitio publicado todavía no guarda cambios: falta conectar el almacenamiento. Por ahora, editá desde la computadora de desarrollo.";

/**
 * En la computadora de desarrollo con el depósito conectado, lo que se cambie
 * en el panel se ve en el sitio publicado. Conviene que quede a la vista.
 */
export const editaElSitioPublicado = usaBlob && !process.env.VERCEL;

export const MENSAJE_SITIO_PUBLICADO =
  "Este panel está conectado al sitio publicado: lo que cambies acá se ve enseguida en la web.";
