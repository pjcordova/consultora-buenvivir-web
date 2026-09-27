/**
 * En Vercel el disco es de solo lectura: el panel puede mirar, pero no guardar.
 * Cuando conectemos un almacenamiento externo (Vercel Blob) esto se elimina.
 */
export const soloLectura = Boolean(process.env.VERCEL);

export const MENSAJE_SOLO_LECTURA =
  "El sitio publicado todavía no guarda cambios: falta conectar el almacenamiento. Por ahora, editá desde la computadora de desarrollo.";
