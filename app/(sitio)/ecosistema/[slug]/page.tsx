import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/Header";
import { LOGOS_REDES } from "@/components/RedesSociales";
import { obtenerEspacioPagina } from "@/lib/contenido";
import { rutaVersionada } from "@/lib/assets";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";
import { videoDeYoutube } from "@/lib/youtube";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const idioma = obtenerIdioma();
  const espacio = await obtenerEspacioPagina(params.slug, idioma);
  if (!espacio) return {};

  return metadatosDePagina({
    idioma,
    titulo: `${espacio.titulo} | Buen Vivir`,
    descripcion: espacio.resumen,
    ruta: `/ecosistema/${espacio.slug}`,
    imagen: "ecosistema",
  });
}

export default async function EspacioPage({ params }: Props) {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma);
  const espacio = await obtenerEspacioPagina(params.slug, idioma);
  if (!espacio) notFound();

  const imagen = await rutaVersionada(espacio.imagen);
  const hayImagen = Boolean(imagen);
  const video = videoDeYoutube(espacio.video);
  const incluye = espacio.incluye ?? [];

  return (
    <main>
      <Header />

      <section className="bg-cream px-[8vw] py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <Link
              href={enlaceEnIdioma("/#servicios", idioma)}
              className="inline-flex items-center gap-2 text-sm text-forest-800/70 transition-colors hover:text-forest-950"
            >
              <span aria-hidden="true">←</span> {textos.espacio.volver}
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
                {textos.imagenPendiente}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-[8vw] py-16 sm:py-20">
        {/* Con video: el texto a la izquierda y el video a la derecha, mitad y
            mitad para que se vea grande, acompañando la lectura. En celular el
            video va debajo del texto. */}
        <div
          className={
            video ? "mx-auto grid max-w-7xl gap-12 lg:grid-cols-2" : "mx-auto max-w-2xl"
          }
        >
          <div>
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

            {/* Con título y texto: tarjetas (de a tres o de a dos, para que no quede
                una sola abajo). Si algún ítem no trae texto: lista con tildes. */}
            {incluye.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl text-forest-950">{textos.espacio.queSeLleva}</h2>
                {incluye.every((item) => item.texto) ? (
                  <ul
                    className={`mt-6 grid gap-5 ${
                      incluye.length % 3 === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                    }`}
                  >
                    {incluye.map((item) => (
                      <li key={item.titulo} className="rounded-2xl bg-cream p-5">
                        <h3 className="font-display text-lg text-forest-950">{item.titulo}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-forest-800/80">{item.texto}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {incluye.map((item) => (
                      <li
                        key={item.titulo}
                        className="flex items-start gap-3 rounded-2xl bg-cream px-5 py-4 text-[0.95rem] text-forest-950"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-leaf" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <span>
                          {item.titulo}
                          {item.texto && (
                            <span className="text-forest-800/80">: {item.texto}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Vacío en el panel = el bloque no aparece */}
            {espacio.extras && espacio.extras.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl text-forest-950">{textos.espacio.ademas}</h2>
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

          {video && (
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="overflow-hidden rounded-2xl bg-forest-950 shadow-[0_20px_50px_-25px_rgba(18,23,15,0.5)]">
                <iframe
                  src={video.incrustado}
                  title={textos.espacio.video(espacio.titulo)}
                  className="aspect-video w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <a
                href={video.enYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-forest-800/70 transition-colors hover:text-forest-950"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  {LOGOS_REDES.youtube}
                </svg>
                {textos.espacio.verEnYoutube}
              </a>
            </aside>
          )}
        </div>
      </section>

      <CtaSection
        title={espacio.ctaPagina.titulo}
        subtitle={espacio.ctaPagina.bajada}
        primary={espacio.ctaPagina.principal}
        secondary={{ label: textos.espacio.verTodos, href: "/#servicios" }}
      />
    </main>
  );
}
