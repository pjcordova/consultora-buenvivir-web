import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { obtenerSlot } from "@/lib/admin/slots";

const LIMITES = {
  imagen: 25 * 1024 * 1024, // 25 MB: se acepta una foto de celular tal cual sale
  video: 12 * 1024 * 1024, // 12 MB
};

/** Lado máximo después de optimizar. Más grande que esto no aporta nada en pantalla. */
const LADO_MAXIMO = 2400;

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

const TIPOS = {
  imagen: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4"],
};

/** Explica en criollo por qué no sirve el archivo elegido. */
function motivoDelRechazo(archivo: File, esperado: "imagen" | "video"): string {
  const tipo = archivo.type.toLowerCase();
  const nombre = archivo.name.toLowerCase();

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

export async function POST(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const formulario = await request.formData();
  const id = String(formulario.get("slot") ?? "");
  const archivo = formulario.get("archivo");

  // Solo se puede escribir en los lugares del catálogo: nada de rutas libres.
  const slot = obtenerSlot(id);
  if (!slot) {
    return NextResponse.json({ error: "Ese lugar no existe." }, { status: 400 });
  }
  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }
  if (!TIPOS[slot.tipo].includes(archivo.type)) {
    return NextResponse.json({ error: motivoDelRechazo(archivo, slot.tipo) }, { status: 400 });
  }
  if (archivo.size > LIMITES[slot.tipo]) {
    const mb = Math.round(LIMITES[slot.tipo] / 1024 / 1024);
    return NextResponse.json({ error: `El archivo supera los ${mb} MB.` }, { status: 400 });
  }

  // La extensión del destino manda: si suben un png para un .jpg, se guarda igual
  // con el nombre que la página espera, en el formato correcto.
  const destino = path.join(process.cwd(), "public", slot.ruta);
  const original = Buffer.from(await archivo.arrayBuffer());

  let contenido: Uint8Array = original;
  if (slot.tipo === "imagen") {
    try {
      contenido = await optimizar(original, slot.ruta);
    } catch {
      return NextResponse.json({ error: "No se pudo leer la imagen." }, { status: 400 });
    }
  }

  await fs.mkdir(path.dirname(destino), { recursive: true });
  await fs.writeFile(destino, contenido);

  return NextResponse.json({
    ok: true,
    ruta: slot.ruta,
    actualizado: Date.now(),
    pesoOriginal: original.length,
    pesoFinal: contenido.length,
  });
}

export async function DELETE(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { slot: id } = (await request.json()) as { slot?: string };
  const slot = obtenerSlot(String(id ?? ""));
  if (!slot) {
    return NextResponse.json({ error: "Ese lugar no existe." }, { status: 400 });
  }

  await fs.rm(path.join(process.cwd(), "public", slot.ruta), { force: true });
  return NextResponse.json({ ok: true });
}
