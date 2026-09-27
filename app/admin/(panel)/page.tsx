import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import SlotCard from "@/components/admin/SlotCard";
import CerrarSesion from "@/components/admin/CerrarSesion";
import { SECCIONES } from "@/lib/admin/secciones";
import { SLOTS, slotsPorSeccion } from "@/lib/admin/slots";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { leerGuardado } from "@/lib/contenido";

export const dynamic = "force-dynamic";

/** Fecha del archivo, o null si todavía no existe. */
function version(ruta: string): number | null {
  try {
    return fs.statSync(path.join(process.cwd(), "public", ruta)).mtimeMs;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const secciones = slotsPorSeccion();
  const guardado = await leerGuardado();

  // Secciones agrupadas (Inicio, Página de Servicios, Espacios…), en orden de aparición
  const grupos = SECCIONES.reduce<[string, typeof SECCIONES][]>((acumulado, seccion) => {
    const grupo = acumulado.find(([nombre]) => nombre === seccion.grupo);
    if (grupo) grupo[1].push(seccion);
    else acumulado.push([seccion.grupo, [seccion]]);
    return acumulado;
  }, []);
  const cargadas = SLOTS.filter((slot) => version(slot.ruta) !== null).length;

  return (
    <main className="min-h-screen bg-cream px-[5vw] py-10">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-forest-950">Contenido del sitio</h1>
          <p className="mt-2 text-sm text-forest-800/70">
            {SECCIONES.length} secciones de texto y {cargadas} de {SLOTS.length} imágenes
            cargadas. Los cambios se ven en la web al recargar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-forest-800/20 px-4 py-2 text-sm text-forest-800 transition-colors hover:bg-white"
          >
            Ver la web
          </Link>
          <CerrarSesion />
        </div>
      </header>

      {soloLectura && (
        <p className="mx-auto mt-6 max-w-6xl rounded-2xl border border-honey/40 bg-butter px-5 py-4 text-sm text-forest-800">
          {MENSAJE_SOLO_LECTURA}
        </p>
      )}

      {grupos.map(([grupo, secciones]) => (
        <section key={grupo} className="mx-auto mt-10 max-w-6xl">
          <h2 className="font-display text-xl text-forest-950">Textos · {grupo}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secciones.map((seccion) => (
              <Link
                key={seccion.id}
                href={`/admin/secciones/${encodeURIComponent(seccion.id)}`}
                className="rounded-2xl border border-forest-800/10 bg-white p-5 transition-colors hover:border-leaf"
              >
                <h3 className="font-display text-lg text-forest-950">{seccion.titulo}</h3>
                <p className="mt-1 text-xs leading-relaxed text-forest-800/60">
                  {seccion.descripcion}
                </p>
                <p className="mt-3 text-xs text-leaf">
                  {guardado[seccion.id] ? "Con textos editados" : "Textos originales"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="font-display text-xl text-forest-950">Todas las imágenes</h2>
      </section>

      {secciones.map(({ seccion, slots }) => (
        <section key={seccion} className="mx-auto mt-10 max-w-6xl">
          <h2 className="font-display text-xl text-forest-950">{seccion}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} version={version(slot.ruta)} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
