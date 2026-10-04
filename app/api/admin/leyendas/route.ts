import { NextResponse } from "next/server";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { publicarCambios } from "@/lib/admin/publicar";
import { obtenerSlot } from "@/lib/admin/slots";
import { guardarLeyenda } from "@/lib/contenido";

const LARGO_MAXIMO = 300;

/** Guarda la leyenda de una foto (en español y, opcional, en inglés). */
export async function POST(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { slot, es, en } = (await request.json().catch(() => ({}))) as {
    slot?: unknown;
    es?: unknown;
    en?: unknown;
  };
  const lugar = obtenerSlot(String(slot ?? ""));
  if (!lugar?.leyenda) {
    return NextResponse.json({ error: "Esa imagen no lleva leyenda." }, { status: 400 });
  }

  // Una sola línea: los saltos de línea y espacios de más se juntan
  const limpiar = (valor: unknown) => String(valor ?? "").replace(/\s+/g, " ").trim();
  const texto = { es: limpiar(es), en: limpiar(en) };
  if (texto.es.length > LARGO_MAXIMO || texto.en.length > LARGO_MAXIMO) {
    return NextResponse.json(
      { error: `La leyenda es demasiado larga (máximo ${LARGO_MAXIMO} caracteres).` },
      { status: 400 }
    );
  }

  try {
    await guardarLeyenda(lugar.id, texto);
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar en el depósito. Probá de nuevo en un rato." },
      { status: 502 }
    );
  }

  publicarCambios("contenido");
  return NextResponse.json({ ok: true });
}
