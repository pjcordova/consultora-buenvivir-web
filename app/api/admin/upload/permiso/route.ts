import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { CARPETA_ENTRADA, LIMITES, TIPOS } from "@/lib/admin/archivos";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { obtenerSlot } from "@/lib/admin/slots";
import { claveDelDepositoDeMedios } from "@/lib/almacen";

/**
 * Permiso para que el navegador suba un archivo directo al depósito.
 *
 * Vercel no acepta pedidos de más de 4,5 MB y una foto de celular suele pesar
 * más, así que el archivo no pasa por el servidor: el navegador lo deja en
 * medios/entrada/ y después /api/admin/upload lo optimiza y lo pone en su lugar.
 */
export async function POST(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const cuerpo = (await request.json()) as HandleUploadBody;

  try {
    const respuesta = await handleUpload({
      // El permiso es para el depósito público de las fotos, no para el de los datos
      token: claveDelDepositoDeMedios(),
      body: cuerpo,
      request,
      onBeforeGenerateToken: async (ruta, idDelSlot) => {
        // Solo se puede dejar el archivo en la carpeta de entrada, para un lugar del catálogo.
        const slot = obtenerSlot(idDelSlot ?? "");
        if (!slot) throw new Error("Ese lugar no existe.");
        if (!ruta.startsWith(CARPETA_ENTRADA)) throw new Error("Esa carpeta no está permitida.");

        return {
          allowedContentTypes: TIPOS[slot.tipo],
          maximumSizeInBytes: LIMITES[slot.tipo],
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(respuesta);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "No se pudo dar permiso para subir.";
    return NextResponse.json({ error: mensaje }, { status: 400 });
  }
}
