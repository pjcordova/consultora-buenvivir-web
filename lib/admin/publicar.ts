import { revalidatePath, revalidateTag } from "next/cache";
import { etiqueta } from "@/lib/almacen";

/**
 * Después de guardar, se tiran las copias guardadas de las páginas para que
 * quien entre a la web vea el cambio en la próxima visita, sin esperar.
 */
export function publicarCambios(dato: "contenido" | "medios"): void {
  revalidateTag(etiqueta(dato));
  revalidatePath("/", "layout");
}
