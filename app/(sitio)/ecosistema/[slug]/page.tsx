import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/Header";
import { obtenerEspacio } from "@/content/ecosistema";
import { obtenerEspacioPagina } from "@/lib/contenido";
import { rutaVersionada } from "@/lib/assets";

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const espacio = obtenerEspacio(params.slug);
  if (!espacio) return {};

  return {
    title: `${espacio.titulo} | Buen Vivir`,
    description: espacio.resumen,
  };
}

export default async function EspacioPage({ params }: Props) {
  const espacio = await obtenerEspacioPagina(params.slug);
  if (!espacio) notFound();

  const imagen = await rutaVersionada(espacio.imagen);
  const hayImagen = Boolean(imagen);

  return (
    <main>
      <Header />

      <section className="bg-cream px-[8vw] py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <Link
              href="/#servicios"
              className="inline-flex items-center gap-2 text-sm text-forest-800/70 transition-colors hover:text-forest-950"
            >
              <span aria-hidden="true">←</span> Volver a los espacios
            </Link>

            <p className="mt-6 flex w-fit items-center gap-2 text-balance rounded-2xl border border-leaf/25 bg-white px-4 py-1.5 text-[11px] font-medium uppercase leading-relaxed tracking-[0.14em] text-leaf sm:rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
              {espacio.estado}
            </p>

            <h1 className="mt-5 text-3xl leading-tight text-forest-950 sm:text-[2.6rem]">
              {espacio.titulo}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-forest-800/80">
              {espacio.resumen}
            </p>
          </div>

          {/* Imagen del espacio (la misma del círculo de la Home) */}
          <div
            className={`relative mx-auto flex h-52 w-52 items-center justify-center overflow-hidden rounded-full text-center sm:h-64 sm:w-64 ${
              hayImagen ? "" : "border-2 border-dashed border-forest-800/25 bg-white"
            }`}
          >
            {hayImagen ? (
              <Image
                src={imagen!}
                alt={espacio.titulo}
                fill
                sizes="256px"
                className={espacio.estilo === "sello" ? "object-contain" : "object-cover"}
                priority
              />
            ) : (
              <p className="px-6 text-xs uppercase tracking-[0.14em] text-forest-800/50">
                Imagen pendiente
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-[8vw] py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {espacio.parrafos.map((parrafo, i) => (
            <p key={i} className="mt-5 text-[0.95rem] leading-relaxed text-forest-800/80 first:mt-0">
              {parrafo.map((fragmento, j) =>
                typeof fragmento === "string" ? (
                  fragmento
                ) : (
                  <strong key={j} className="font-medium text-forest-950">
                    {fragmento.fuerte}
                  </strong>
                )
              )}
            </p>
          ))}

          {espacio.incluye && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-forest-950">Qué se lleva quien participa</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-3">
                {espacio.incluye.map((item) => (
                  <li key={item.titulo} className="rounded-2xl bg-cream p-5">
                    <h3 className="font-display text-lg text-forest-950">{item.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-forest-800/80">{item.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {espacio.extras && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-forest-950">Además incluye</h2>
              <ul className="mt-5 space-y-3">
                {espacio.extras.map((extra) => (
                  <li key={extra} className="flex gap-3 text-[0.95rem] text-forest-800/80">
                    <span className="text-leaf" aria-hidden="true">
                      →
                    </span>
                    {extra}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaSection
        title={espacio.ctaPagina.titulo}
        subtitle={espacio.ctaPagina.bajada}
        primary={espacio.ctaPagina.principal}
        secondary={{ label: "Ver todos los espacios", href: "/#servicios" }}
      />
    </main>
  );
}
