import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormularioSeccion from "@/components/admin/FormularioSeccion";
import SlotCard from "@/components/admin/SlotCard";
import { obtenerSeccion, SECCIONES } from "@/lib/admin/secciones";
import { obtenerSlot } from "@/lib/admin/slots";
import { leerGuardado } from "@/lib/contenido";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SECCIONES.map((seccion) => ({ id: seccion.id }));
}

function version(ruta: string): number | null {
  try {
    return fs.statSync(path.join(process.cwd(), "public", ruta)).mtimeMs;
  } catch {
    return null;
  }
}

export default async function SeccionPage({ params }: { params: { id: string } }) {
  const seccion = obtenerSeccion(params.id);
  if (!seccion) notFound();

  const guardado = await leerGuardado();
  const editado = guardado[seccion.id];
  const valores = { ...seccion.porDefecto, ...(editado ?? {}) };
  const slots = seccion.slots.map(obtenerSlot).filter(Boolean);

  return (
    <main className="min-h-screen bg-cream px-[5vw] py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-forest-800/70 transition-colors hover:text-forest-950"
        >
          <span aria-hidden="true">←</span> Volver al panel
        </Link>

        <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-forest-950">{seccion.titulo}</h1>
            <p className="mt-2 text-sm text-forest-800/70">{seccion.descripcion}</p>
          </div>
          <Link
            href={seccion.vistaPrevia}
            target="_blank"
            className="rounded-full border border-forest-800/20 px-4 py-2 text-sm text-forest-800 transition-colors hover:bg-white"
          >
            Ver cómo queda
          </Link>
        </header>

        <h2 className="mt-9 font-display text-xl text-forest-950">Textos</h2>
        <div className="mt-4">
          <FormularioSeccion
            seccion={seccion.id}
            campos={seccion.campos}
            valores={valores}
            editada={Boolean(editado)}
          />
        </div>

        {slots.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-xl text-forest-950">Imágenes</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map(
                (slot) =>
                  slot && <SlotCard key={slot.id} slot={slot} version={version(slot.ruta)} />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
