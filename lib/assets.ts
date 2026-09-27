import fs from "node:fs";
import path from "node:path";

/**
 * ¿La imagen ya está en public/? Mientras no esté, las secciones muestran un
 * espacio reservado en lugar de una imagen rota.
 * Solo para componentes de servidor (lee el disco en cada render).
 */
export function existeImagen(rutaPublica: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", rutaPublica));
}

/**
 * Ruta con la fecha del archivo pegada (?v=…). Si se reemplaza la imagen cambia
 * la dirección, así el navegador la vuelve a pedir en lugar de usar la guardada.
 * Devuelve null si el archivo todavía no existe.
 */
export function rutaVersionada(rutaPublica: string): string | null {
  try {
    const { mtimeMs } = fs.statSync(path.join(process.cwd(), "public", rutaPublica));
    return `${rutaPublica}?v=${Math.round(mtimeMs)}`;
  } catch {
    return null;
  }
}

/**
 * Imágenes de un carrusel (las sube el panel a /images/carrusel/<prefijo>-<n>.jpg).
 * Devuelve un lugar por cada imagen esperada: las que faltan quedan vacías y la
 * página muestra el espacio reservado.
 */
export function imagenesCarrusel(
  prefijo: string,
  total: number,
  alt: (n: number) => string
): ({ src: string; alt: string } | undefined)[] {
  return Array.from({ length: total }, (_, i) => {
    const ruta = rutaVersionada(`/images/carrusel/${prefijo}-${i + 1}.jpg`);
    return ruta ? { src: ruta, alt: alt(i + 1) } : undefined;
  });
}
