import fs from "node:fs";
import path from "node:path";
import { leerMedios, usaBlob } from "@/lib/almacen";

/**
 * ¿Dónde está la imagen de este lugar de la página?
 *
 * Primero se mira el depósito: ahí están las que subió el panel desde el sitio
 * publicado. Si no hay nada, se usa el archivo que viaja con el código.
 * Devuelve null cuando todavía no hay imagen, y la sección muestra un espacio
 * reservado en lugar de una imagen rota.
 *
 * Solo para componentes de servidor.
 */
export async function rutaVersionada(rutaPublica: string): Promise<string | null> {
  if (usaBlob) {
    const subida = (await leerMedios())[rutaPublica];
    // Anotada con url en null = la quitaron desde el panel.
    if (subida) return subida.url;
  }
  return enElDisco(rutaPublica);
}

/**
 * Ruta con la fecha del archivo pegada (?v=…). Si se reemplaza la imagen cambia
 * la dirección, así el navegador la vuelve a pedir en lugar de usar la guardada.
 */
function enElDisco(rutaPublica: string): string | null {
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
export async function imagenesCarrusel(
  prefijo: string,
  total: number,
  alt: (n: number) => string
): Promise<({ src: string; alt: string } | undefined)[]> {
  return Promise.all(
    Array.from({ length: total }, async (_, i) => {
      const ruta = await rutaVersionada(`/images/carrusel/${prefijo}-${i + 1}.jpg`);
      return ruta ? { src: ruta, alt: alt(i + 1) } : undefined;
    })
  );
}
