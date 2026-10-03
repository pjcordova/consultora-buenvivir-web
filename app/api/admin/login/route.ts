import { NextResponse } from "next/server";
import { credencialesValidas, crearSesion, hayConfiguracion } from "@/lib/admin/auth";

/**
 * Pausa ante cada intento fallido. Quien se equivoca una vez ni la nota, pero
 * vuelve muy lento probar miles de contraseñas: el botón de ingreso está a la
 * vista de todos en el encabezado.
 */
const PAUSA_TRAS_UN_ERROR_MS = 1000;

export async function POST(request: Request) {
  if (!hayConfiguracion()) {
    return NextResponse.json(
      { error: "Falta configurar el panel. Ver .env.example en el proyecto." },
      { status: 500 }
    );
  }

  const { usuario, clave } = (await request.json()) as {
    usuario?: string;
    clave?: string;
  };

  if (!usuario || !clave || !credencialesValidas(usuario, clave)) {
    await new Promise((resolver) => setTimeout(resolver, PAUSA_TRAS_UN_ERROR_MS));
    // Mismo mensaje para usuario y clave: no conviene decir cuál falló.
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  crearSesion();
  return NextResponse.json({ ok: true });
}
