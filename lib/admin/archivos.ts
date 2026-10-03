/**
 * Qué archivos acepta cada casillero del panel. Lo usan el navegador (para
 * avisar antes de subir) y el servidor (para no confiar en el navegador).
 */
export const LIMITES = {
  imagen: 25 * 1024 * 1024, // 25 MB: se acepta una foto de celular tal cual sale
  video: 12 * 1024 * 1024, // 12 MB
};

export const TIPOS = {
  imagen: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4"],
};

type Tipo = keyof typeof TIPOS;

/**
 * Carpeta del depósito donde el navegador deja el archivo antes de que el
 * servidor lo optimice y lo ponga en su lugar.
 */
export const CARPETA_ENTRADA = "medios/entrada/";

/** Explica en criollo por qué no sirve el archivo elegido. */
function motivoDelRechazo(tipoArchivo: string, nombreArchivo: string, esperado: Tipo): string {
  const tipo = tipoArchivo.toLowerCase();
  const nombre = nombreArchivo.toLowerCase();

  if (tipo === "image/heic" || tipo === "image/heif" || nombre.endsWith(".heic") || nombre.endsWith(".heif")) {
    return "Las fotos de iPhone (HEIC) no se pueden usar en la web. Guardala como JPG y volvé a intentar.";
  }
  if (esperado === "imagen" && tipo.startsWith("video/")) {
    return "Eso es un video. Para el video usá el casillero de video, acá va una foto (jpg, png o webp).";
  }
  if (esperado === "video" && tipo.startsWith("image/")) {
    return "Eso es una foto. Para la foto usá el casillero de foto, acá va un video mp4.";
  }
  if (esperado === "video") return "El video tiene que ser mp4.";
  return "La imagen tiene que ser jpg, png o webp.";
}

/** null si el archivo sirve; si no, el motivo para mostrarle a quien lo sube. */
export function revisarArchivo(
  archivo: { type: string; name: string; size: number },
  esperado: Tipo
): string | null {
  if (!TIPOS[esperado].includes(archivo.type)) {
    return motivoDelRechazo(archivo.type, archivo.name, esperado);
  }
  if (archivo.size > LIMITES[esperado]) {
    return `El archivo supera los ${Math.round(LIMITES[esperado] / 1024 / 1024)} MB.`;
  }
  return null;
}
