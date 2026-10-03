import { NextResponse } from "next/server";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { publicarCambios } from "@/lib/admin/publicar";
import { obtenerSeccion } from "@/lib/admin/secciones";
import { claveDeSeccion, guardarSeccion, restaurarSeccion } from "@/lib/contenido";
import { esIdioma, IDIOMA_DE_BASE, type Idioma } from "@/lib/idioma";

const LARGO_MAXIMO = 8000;

/** El idioma de la pestaña del panel; si no viene, español (como antes). */
const idiomaDe = (valor: unknown): Idioma => (esIdioma(valor) ? valor : IDIOMA_DE_BASE);

// Una respuesta nueva cada vez: el cuerpo de una respuesta se puede leer una sola vez.
const noSePudoGuardar = () =>
  NextResponse.json(
    { error: "No se pudo guardar en el depósito. Probá de nuevo en un rato." },
    { status: 502 }
  );

export async function POST(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { seccion: id, valores, idioma: pedido } = (await request.json()) as {
    seccion?: string;
    valores?: Record<string, unknown>;
    idioma?: unknown;
  };
  const idioma = idiomaDe(pedido);

  const seccion = obtenerSeccion(String(id ?? ""));
  if (!seccion || !valores) {
    return NextResponse.json({ error: "Esa sección no existe." }, { status: 400 });
  }

  // Solo se guardan los campos declarados en la sección, con el formato esperado.
  const limpios: Record<string, unknown> = {};
  for (const campo of seccion.campos) {
    // Los datos compartidos (número de WhatsApp, redes) se guardan solo en español
    if (campo.compartido && idioma !== IDIOMA_DE_BASE) continue;
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

  try {
    await guardarSeccion(claveDeSeccion(seccion.id, idioma), limpios);
  } catch {
    return noSePudoGuardar();
  }

  publicarCambios("contenido");
  return NextResponse.json({ ok: true });
}

/** Vuelve a los textos originales del código, en el idioma de la pestaña. */
export async function DELETE(request: Request) {
  if (soloLectura) {
    return NextResponse.json({ error: MENSAJE_SOLO_LECTURA }, { status: 503 });
  }
  if (!sesionActiva()) {
    return NextResponse.json({ error: "Sesión vencida. Volvé a entrar." }, { status: 401 });
  }

  const { seccion: id, idioma: pedido } = (await request.json()) as {
    seccion?: string;
    idioma?: unknown;
  };
  const seccion = obtenerSeccion(String(id ?? ""));
  if (!seccion) {
    return NextResponse.json({ error: "Esa sección no existe." }, { status: 400 });
  }

  try {
    await restaurarSeccion(claveDeSeccion(seccion.id, idiomaDe(pedido)));
  } catch {
    return noSePudoGuardar();
  }

  publicarCambios("contenido");
  return NextResponse.json({ ok: true });
}
