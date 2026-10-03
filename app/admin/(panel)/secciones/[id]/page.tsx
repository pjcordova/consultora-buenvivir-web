import Link from "next/link";
import { notFound } from "next/navigation";
import FormularioSeccion from "@/components/admin/FormularioSeccion";
import SlotCard from "@/components/admin/SlotCard";
import { contenidoDe } from "@/content";
import { obtenerSeccion } from "@/lib/admin/secciones";
import { obtenerSlot } from "@/lib/admin/slots";
import { usaBlob } from "@/lib/almacen";
import { rutaVersionada } from "@/lib/assets";
import { claveDeSeccion, leerGuardado } from "@/lib/contenido";
import { enlaceEnIdioma, esIdioma, IDIOMA_DE_BASE, IDIOMAS, type Idioma } from "@/lib/idioma";

export const dynamic = "force-dynamic";

/** Las pestañas del panel, en español. */
const PESTANIAS: Record<Idioma, string> = { es: "Español", en: "English (inglés)" };

type Props = {
  params: { id: string };
  searchParams: { idioma?: string };
};

/**
 * Next 14 entrega el parámetro tal como viene en la dirección, sin decodificar:
 * "espacio%3Acasita-del-arbol" en vez de "espacio:casita-del-arbol". Sin esto,
 * las secciones con ":" (espacios y servicios) daban "página no encontrada".
 */
function idDeLaRuta(id: string): string {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export default async function SeccionPage({ params, searchParams }: Props) {
  const seccion = obtenerSeccion(idDeLaRuta(params.id));
  if (!seccion) notFound();

  const idioma: Idioma = esIdioma(searchParams.idioma) ? searchParams.idioma : IDIOMA_DE_BASE;
  const guardado = await leerGuardado();
  const editadoEn = (otro: Idioma) => Boolean(guardado[claveDeSeccion(seccion.id, otro)]);
  const editado = guardado[claveDeSeccion(seccion.id, idioma)];
  const valores = { ...seccion.porDefecto(contenidoDe(idioma)), ...(editado ?? {}) };

  // Lo compartido (número de WhatsApp, redes) se edita una sola vez, en español
  const campos =
    idioma === IDIOMA_DE_BASE ? seccion.campos : seccion.campos.filter((campo) => !campo.compartido);
  const hayCompartidos = campos.length < seccion.campos.length;

  const slots = seccion.slots.flatMap((id) => obtenerSlot(id) ?? []);
  // Dirección actual de cada imagen (del depósito o del código), o null si falta.
  const vistas = await Promise.all(slots.map((slot) => rutaVersionada(slot.ruta)));

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
            href={enlaceEnIdioma(seccion.vistaPrevia, idioma)}
            target="_blank"
            className="rounded-full border border-forest-800/20 px-4 py-2 text-sm text-forest-800 transition-colors hover:bg-white"
          >
            Ver cómo queda
          </Link>
        </header>

        <h2 className="mt-9 font-display text-xl text-forest-950">Textos</h2>

        {/* Una pestaña por idioma: cada uno se guarda por separado */}
        <nav aria-label="Idioma de los textos" className="mt-4 flex flex-wrap gap-2">
          {IDIOMAS.map((opcion) => (
            <Link
              key={opcion}
              href={`/admin/secciones/${encodeURIComponent(seccion.id)}${
                opcion === IDIOMA_DE_BASE ? "" : `?idioma=${opcion}`
              }`}
              aria-current={opcion === idioma ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                opcion === idioma
                  ? "bg-forest-950 text-white"
                  : "border border-forest-800/20 text-forest-800 hover:bg-white"
              }`}
            >
              {PESTANIAS[opcion]}
              <span className={`ml-2 text-xs ${opcion === idioma ? "text-white/70" : "text-forest-800/50"}`}>
                {editadoEn(opcion) ? "· editado" : "· original"}
              </span>
            </Link>
          ))}
        </nav>

        {idioma !== IDIOMA_DE_BASE && (
          <p className="mt-4 rounded-2xl border border-honey/40 bg-butter px-5 py-4 text-sm text-forest-800">
            Estos textos se ven en la versión en inglés del sitio. Si no los editás, se muestra la
            traducción que viene con la web.
            {hayCompartidos &&
              " El número de WhatsApp y los enlaces a las redes valen para los dos idiomas: se cambian en la pestaña Español."}
          </p>
        )}

        <div className="mt-4">
          <FormularioSeccion
            // Un formulario por idioma: al cambiar de pestaña no arrastra lo escrito en el otro
            key={idioma}
            seccion={seccion.id}
            idioma={idioma}
            campos={campos}
            valores={valores}
            editada={Boolean(editado)}
          />
        </div>

        {slots.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-xl text-forest-950">Imágenes</h2>
            <p className="mt-1 text-xs text-forest-800/60">Las imágenes son las mismas en los dos idiomas.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot, i) => (
                <SlotCard key={slot.id} slot={slot} url={vistas[i]} directo={usaBlob} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
