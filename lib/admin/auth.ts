import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "bv_admin";
const HORAS_DE_SESION = 8;

/** Genera el valor de ADMIN_PASSWORD_HASH. Se usa desde scripts/generar-clave-admin.mjs */
export function hashDeClave(clave: string): string {
  const sal = randomBytes(16).toString("hex");
  const derivada = scryptSync(clave, sal, 64).toString("hex");
  return `scrypt:${sal}:${derivada}`;
}

export function hayConfiguracion(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}

/** Compara la clave recibida contra el hash guardado, sin filtrar tiempos. */
export function credencialesValidas(usuario: string, clave: string): boolean {
  const guardado = process.env.ADMIN_PASSWORD_HASH;
  const usuarioEsperado = process.env.ADMIN_USUARIO ?? "admin";
  if (!guardado) return false;

  const [algoritmo, sal, derivadaHex] = guardado.split(":");
  if (algoritmo !== "scrypt" || !sal || !derivadaHex) return false;

  const esperada = Buffer.from(derivadaHex, "hex");
  const recibida = scryptSync(clave, sal, esperada.length);
  const claveOk = timingSafeEqual(esperada, recibida);

  const a = Buffer.from(usuario.trim().toLowerCase());
  const b = Buffer.from(usuarioEsperado.trim().toLowerCase());
  const usuarioOk = a.length === b.length && timingSafeEqual(a, b);

  return claveOk && usuarioOk;
}

function firmar(valor: string): string {
  const secreto = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secreto).update(valor).digest("hex");
}

/** Cookie firmada: vencimiento + firma. Sin base de datos. */
export function crearSesion() {
  const vence = String(Date.now() + HORAS_DE_SESION * 60 * 60 * 1000);
  cookies().set(COOKIE, `${vence}.${firmar(vence)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: HORAS_DE_SESION * 60 * 60,
  });
}

export function cerrarSesion() {
  cookies().delete(COOKIE);
}

export function sesionActiva(): boolean {
  if (!hayConfiguracion()) return false;

  const valor = cookies().get(COOKIE)?.value;
  if (!valor) return false;

  const [vence, firma] = valor.split(".");
  if (!vence || !firma) return false;
  if (Number(vence) < Date.now()) return false;

  const esperada = Buffer.from(firmar(vence));
  const recibida = Buffer.from(firma);
  return esperada.length === recibida.length && timingSafeEqual(esperada, recibida);
}
