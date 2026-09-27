import { NextResponse } from "next/server";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { obtenerSeccion } from "@/lib/admin/secciones";
import { guardarSeccion, restaurarSeccion } from "@/lib/contenido";

const LARGO_MAXIMO = 8000;

export async function POST(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { seccion: id, valores } = (await request.json()) as {
    seccion?: string;
    valores?: Record<string, unknown>;
  };

  const seccion = obtenerSeccion(String(id ?? ""));
  if (!seccion || !valores) {
    return NextResponse.json({ error: "Esa sección no existe." }, { status: 400 });
  }

  // Solo se guardan los campos declarados en la sección, con el formato esperado.
  const limpios: Record<string, unknown> = {};
  for (const campo of seccion.campos) {
    const valor = valores[campo.id];
    if (valor === undefined) continue;

    if (campo.tipo === "enlace") {
      const enlace = valor as { label?: unknown; href?: unknown };
      const label = String(enlace?.label ?? "").trim();
      const href = String(enlace?.href ?? "").trim();
      if (label.length > 120 || href.length > 300) {
        return NextResponse.json({ error: `"${campo.etiqueta}" es demasiado largo.` }, { status: 400 });
      }
      limpios[campo.id] = { label, href };
      continue;
    }

    const texto = String(valor ?? "").trim();
    if (texto.length > LARGO_MAXIMO) {
      return NextResponse.json({ error: `"${campo.etiqueta}" es demasiado largo.` }, { status: 400 });
    }
    limpios[campo.id] = texto;
  }

  await guardarSeccion(seccion.id, limpios);
  return NextResponse.json({ ok: true });
}

/** Vuelve a los textos originales del código. */
export async function DELETE(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { seccion: id } = (await request.json()) as { seccion?: string };
  const seccion = obtenerSeccion(String(id ?? ""));
  if (!seccion) {
    return NextResponse.json({ error: "Esa sección no existe." }, { status: 400 });
  }

  await restaurarSeccion(seccion.id);
  return NextResponse.json({ ok: true });
}
