// Genera las líneas del panel para .env.local
//   node scripts/generar-clave-admin.mjs "MiClaveSegura"
import { randomBytes, scryptSync } from "node:crypto";

const clave = process.argv[2];

if (!clave || clave.length < 8) {
  console.error("Uso: node scripts/generar-clave-admin.mjs \"tu-clave\" (mínimo 8 caracteres)");
  process.exit(1);
}

const sal = randomBytes(16).toString("hex");
const derivada = scryptSync(clave, sal, 64).toString("hex");

console.log("\nPegá estas líneas en .env.local (no se suben a GitHub):\n");
console.log(`ADMIN_USUARIO=admin`);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${sal}:${derivada}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log("\nDespués reiniciá el servidor (npm run dev).\n");
