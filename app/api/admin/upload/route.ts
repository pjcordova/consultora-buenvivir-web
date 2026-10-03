import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { CARPETA_ENTRADA, revisarArchivo } from "@/lib/admin/archivos";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { publicarCambios } from "@/lib/admin/publicar";
import { obtenerSlot, type Slot } from "@/lib/admin/slots";
import { borrarMedio, quitarMedio, subirMedio, usaBlob } from "@/lib/almacen";

// Una foto grande tarda unos segundos en bajarse del depósito y optimizarse.
export const maxDuration = 60;

/** Lado máximo después de optimizar. Más grande que esto no aporta nada en pantalla. */
const LADO_MAXIMO = 2400;

const error = (mensaje: string, status: number) =>
  NextResponse.json({ error: mensaje }, { status });

/**
 * Achica y comprime la imagen antes de guardarla. Evita que una foto de 8 MB
 * haga esperar a quien visita la web, y respeta la rotación de las fotos de celular.
 */
async function optimizar(entrada: Buffer, destino: string): Promise<Buffer> {
  const imagen = sharp(entrada, { failOn: "none" })
    .rotate()
    .resize({ width: LADO_MAXIMO, height: LADO_MAXIMO, fit: "inside", withoutEnlargement: true });

  // Los PNG del sitio son logos e insignias: la paleta reducida los achica mucho
  // y mantiene la transparencia.
  if (destino.endsWith(".png")) {
    return imagen.png({ compressionLevel: 9, palette: true, quality: 85, effort: 8 }).toBuffer();
  }
  if (destino.endsWith(".webp")) return imagen.webp({ quality: 82 }).toBuffer();
  return imagen.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
}

/** Tipo del archivo final: manda la extensión del destino, igual que al optimizar. */
function tipoFinal(destino: string, original: string): string {
  if (destino.endsWith(".png")) return "image/png";
  if (destino.endsWith(".webp")) return "image/webp";
  if (destino.endsWith(".jpg") || destino.endsWith(".jpeg")) return "image/jpeg";
  return original;
}

type Recibido = {
  slot: Slot;
  contenido: Buffer;
  tipo: string;
  nombre: string;
  /** Archivo de paso en el depósito, que se borra al terminar. */
  entrada?: string;
};

/** Solo se aceptan archivos de paso de un depósito de Vercel Blob, nunca otra dirección. */
function esEntradaDelDeposito(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return (
      protocol === "https:" &&
      hostname.endsWith(".public.blob.vercel-storage.com") &&
      pathname.startsWith(`/${CARPETA_ENTRADA}`)
    );
  } catch {
    return false;
  }
}

/**
 * En la computadora de desarrollo el archivo llega dentro del pedido.
 * En el sitio publicado Vercel no acepta pedidos de más de 4,5 MB, así que el
 * navegador lo deja antes en el depósito (ver ./permiso) y acá llega su dirección.
 */
async function recibir(request: Request): Promise<Recibido | NextResponse> {
  if (request.headers.get("content-type")?.includes("application/json")) {
    const { slot: id, entrada } = (await request.json()) as { slot?: string; entrada?: unknown };
    const slot = obtenerSlot(String(id ?? ""));
    if (!slot) return error("Ese lugar no existe.", 400);
    if (!esEntradaDelDeposito(entrada)) return error("La dirección del archivo no es válida.", 400);

    const respuesta = await fetch(entrada, { cache: "no-store" });
    if (!respuesta.ok) return error("No se encontró el archivo subido. Probá de nuevo.", 400);

    return {
      slot,
      contenido: Buffer.from(await respuesta.arrayBuffer()),
      tipo: respuesta.headers.get("content-type") ?? "",
      nombre: new URL(entrada).pathname,
      entrada,
    };
  }

  const formulario = await request.formData();
  const slot = obtenerSlot(String(formulario.get("slot") ?? ""));
  const archivo = formulario.get("archivo");
  // Solo se puede escribir en los lugares del catálogo: nada de rutas libres.
  if (!slot) return error("Ese lugar no existe.", 400);
  if (!(archivo instanceof File)) return error("Falta el archivo.", 400);

  return {
    slot,
    contenido: Buffer.from(await archivo.arrayBuffer()),
    tipo: archivo.type,
    nombre: archivo.name,
  };
}

async function guardar({ slot, contenido: original, tipo, nombre }: Recibido): Promise<NextResponse> {
  const problema = revisarArchivo({ type: tipo, name: nombre, size: original.length }, slot.tipo);
  if (problema) return error(problema, 400);

  // La extensión del destino manda: si suben un png para un .jpg, se guarda igual
  // con el nombre que la página espera, en el formato correcto.
  let contenido: Buffer = original;
  if (slot.tipo === "imagen") {
    try {
      contenido = await optimizar(original, slot.ruta);
    } catch {
      return error("No se pudo leer la imagen.", 400);
    }
  }

  let url: string;
  if (usaBlob) {
    try {
      url = await subirMedio(slot.ruta, contenido, tipoFinal(slot.ruta, tipo));
    } catch {
      return error("No se pudo guardar en el depósito. Probá de nuevo en un rato.", 502);
    }
  } else {
    const destino = path.join(process.cwd(), "public", slot.ruta);
    await fs.mkdir(path.dirname(destino), { recursive: true });
    await fs.writeFile(destino, contenido);
    url = `${slot.ruta}?v=${Date.now()}`;
  }

  publicarCambios("medios");

  return NextResponse.json({
    ok: true,
    ruta: slot.ruta,
    url,
    pesoOriginal: original.length,
    pesoFinal: contenido.length,
  });
}

export async function POST(request: Request) {
  if (soloLectura) return error(MENSAJE_SOLO_LECTURA, 503);
  if (!sesionActiva()) return error("Sesión vencida. Volvé a entrar.", 401);

  let recibido: Recibido | NextResponse;
  try {
    recibido = await recibir(request);
  } catch {
    return error("No se pudo leer el archivo. Probá de nuevo.", 400);
  }
  if (recibido instanceof NextResponse) return recibido;

  try {
    return await guardar(recibido);
  } finally {
    // El archivo de paso ya no hace falta: quedó guardado (optimizado) o se rechazó.
    await borrarMedio(recibido.entrada);
  }
}

export async function DELETE(request: Request) {
  if (soloLectura) return error(MENSAJE_SOLO_LECTURA, 503);
  if (!sesionActiva()) return error("Sesión vencida. Volvé a entrar.", 401);

  const { slot: id } = (await request.json()) as { slot?: string };
  const slot = obtenerSlot(String(id ?? ""));
  if (!slot) return error("Ese lugar no existe.", 400);

  if (usaBlob) {
    try {
      await quitarMedio(slot.ruta);
    } catch {
      return error("No se pudo quitar. Probá de nuevo en un rato.", 502);
    }
  } else {
    await fs.rm(path.join(process.cwd(), "public", slot.ruta), { force: true });
  }

  publicarCambios("medios");
  return NextResponse.json({ ok: true });
}
