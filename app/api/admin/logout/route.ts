import { NextResponse } from "next/server";
import { cerrarSesion } from "@/lib/admin/auth";

export async function POST() {
  cerrarSesion();
  return NextResponse.json({ ok: true });
}
