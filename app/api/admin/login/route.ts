import { NextResponse } from "next/server";
import { credencialesValidas, crearSesion, hayConfiguracion } from "@/lib/admin/auth";

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
    // Mismo mensaje para usuario y clave: no conviene decir cuál falló.
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  crearSesion();
  return NextResponse.json({ ok: true });
}
