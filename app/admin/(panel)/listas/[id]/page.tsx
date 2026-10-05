import Link from "next/link";
import { notFound } from "next/navigation";
import EditorLista from "@/components/admin/EditorLista";
import { obtenerLista } from "@/lib/admin/listas";
import { rutaDelCertificado } from "@/lib/admin/slots";
import { usaBlob } from "@/lib/almacen";
import { rutaVersionada } from "@/lib/assets";
import { leerLista } from "@/lib/contenido";

export const dynamic = "force-dynamic";

export default async function ListaPage({ params }: { params: { id: string } }) {
  const lista = obtenerLista(params.id);
  if (!lista) notFound();

  const items = await leerLista(lista.id);
  // La imagen ya subida de cada elemento (hoy, el certificado de cada formación)
  const imagenes = lista.campos.some((campo) => campo.tipo === "imagen")
    ? Object.fromEntries(
        await Promise.all(
          items.map(async (item) => [item.id, await rutaVersionada(rutaDelCertificado(item.id))] as const)
        )
      )
    : {};

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
            <h1 className="font-display text-3xl text-forest-950">{lista.titulo}</h1>
            <p className="mt-2 max-w-2xl text-sm text-forest-800/70">{lista.descripcion}</p>
          </div>
          <Link
            href={lista.vistaPrevia}
            target="_blank"
            className="rounded-full border border-forest-800/20 px-4 py-2 text-sm text-forest-800 transition-colors hover:bg-white"
          >
            Ver cómo queda
          </Link>
        </header>

        <p className="mt-6 rounded-2xl border border-honey/40 bg-butter px-5 py-4 text-sm text-forest-800">
          Cada texto tiene su versión en español y, opcional, en inglés. Si dejás vacía la del
          inglés, la versión en inglés del sitio muestra el texto en español.
        </p>

        <div className="mt-6">
          <EditorLista lista={lista} items={items} imagenes={imagenes} directo={usaBlob} />
        </div>
      </div>
    </main>
  );
}
