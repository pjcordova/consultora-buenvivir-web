import type { Metadata } from "next";
import Image from "next/image";
import Boton from "@/components/Boton";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import { ctaServicios } from "@/content/servicios";
import { ctaFinal } from "@/content/home";
import { rutaVersionada } from "@/lib/assets";
import { obtenerCaminos, obtenerPaginaServicios } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Servicios | Buen Vivir",
  description:
    "Tres caminos de acompañamiento regenerativo: Revitaliza tu Equipo, Revitaliza tu Trabajo y Revitaliza tu Vida.",
};

export default async function ServiciosPage() {
  const [paginaServicios, caminos] = await Promise.all([
    obtenerPaginaServicios(),
    obtenerCaminos(),
  ]);

  // Las direcciones de los folletos se resuelven una sola vez, antes de dibujar.
  const folletos = new Map(
    await Promise.all(
      caminos
        .flatMap((camino) => camino.ofertas)
        .map(async (oferta) => [oferta.slug, await rutaVersionada(oferta.imagen)] as const)
    )
  );

  return (
    <main>
      <Header />

      <section className="bg-leaf-deep px-[8vw] py-16 sm:py-20">
        <SectionHeader
          eyebrow={paginaServicios.eyebrow}
          title={paginaServicios.titulo}
          subtitle={paginaServicios.bajada}
          tono="verde"
        />
      </section>

      {caminos.map((camino, indiceCamino) => (
        <section
          key={camino.titulo}
          id={`camino-${indiceCamino + 1}`}
          className={`px-[8vw] py-16 sm:py-20 ${indiceCamino % 2 === 0 ? "bg-white" : "bg-cream"}`}
        >
          <header className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl text-forest-950 sm:text-3xl">
              <span aria-hidden="true">{camino.emoji}</span> {camino.titulo}
            </h2>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-forest-800/80">
              {camino.descripcion}
            </p>
          </header>

          <div className="mx-auto mt-12 max-w-5xl space-y-16">
            {camino.ofertas.map((oferta, indiceOferta) => {
              const imagen = folletos.get(oferta.slug) ?? null;
              // Se alterna el lado de la imagen para que la lectura no sea monótona
              const imagenALaDerecha = indiceOferta % 2 === 1;

              return (
                <article
                  key={oferta.slug}
                  id={oferta.slug}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
                >
                  <div className={imagenALaDerecha ? "md:order-2" : ""}>
                    {imagen ? (
                      <Image
                        src={imagen}
                        alt={`Folleto de ${oferta.titulo}`}
                        width={1080}
                        height={1350}
                        sizes="(min-width: 768px) 45vw, 90vw"
                        className="w-full rounded-3xl shadow-[0_18px_45px_-20px_rgba(18,23,15,0.35)]"
                      />
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-3xl border-2 border-dashed border-forest-800/20 bg-cream text-sm text-forest-800/50">
                        Imagen pendiente
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl leading-tight text-forest-950">
                      {oferta.titulo}
                    </h3>

                    <p className="mt-4 text-[0.95rem] leading-relaxed text-forest-800/80">
                      {oferta.descripcion}
                    </p>

                    <p className="mt-4 border-l-2 border-leaf/40 pl-4 text-sm leading-relaxed text-forest-800/70">
                      {oferta.paraQuien}
                    </p>

                    <ul className="mt-6 space-y-2.5">
                      {oferta.incluye.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-forest-800/85">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Boton
                      href={ctaFinal.principal.href}
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-dark"
                    >
                      Reservar mi sesión
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Boton>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <CtaSection
        title="¿Empezamos?"
        subtitle={ctaServicios}
        note={ctaFinal.nota}
        primary={ctaFinal.principal}
        secondary={{ label: "Ver los espacios del Ecosistema", href: "/#servicios" }}
      />
    </main>
  );
}
