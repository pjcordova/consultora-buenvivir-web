import type { Metadata } from "next";
import Carousel from "@/components/Carousel";
import CtaSection from "@/components/CtaSection";
import EcosistemaPanel from "@/components/EcosistemaPanel";
import FichaOrganizacion from "@/components/FichaOrganizacion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InfoCard from "@/components/InfoCard";
import SeccionTalleres from "@/components/SeccionTalleres";
import SeccionTestimonios from "@/components/SeccionTestimonios";
import SectionHeader from "@/components/SectionHeader";
import VideoSection from "@/components/VideoSection";
import { imagenesCarrusel } from "@/lib/assets";
import {
  obtenerCierre,
  obtenerCosmovision,
  obtenerLinajes,
  obtenerParadigma,
  obtenerPortada,
  obtenerServicios,
  obtenerTalleres,
  obtenerTestimonios,
} from "@/lib/contenido";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";

export function generateMetadata(): Metadata {
  const idioma = obtenerIdioma();
  const { sitio } = textosDe(idioma);
  return metadatosDePagina({ idioma, titulo: sitio.titulo, descripcion: sitio.descripcion, ruta: "/" });
}

export default async function HomePage() {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma).inicio;
  const [
    hero,
    regeneracionOrganizacional,
    ecosistema,
    cosmovision,
    linajes,
    ctaFinal,
    talleres,
    testimonios,
  ] = await Promise.all([
    obtenerPortada(idioma),
    obtenerParadigma(idioma),
    obtenerServicios(idioma),
    obtenerCosmovision(idioma),
    obtenerLinajes(idioma),
    obtenerCierre(idioma),
    obtenerTalleres(idioma),
    obtenerTestimonios(idioma),
  ]);

  return (
    <main>
      <FichaOrganizacion />
      <Header />
      <Hero {...hero} />

      <section id="regeneracion" className="bg-white px-[8vw] py-20 sm:py-24">
        <SectionHeader
          eyebrow={regeneracionOrganizacional.eyebrow}
          title={regeneracionOrganizacional.titulo}
          subtitle={regeneracionOrganizacional.bajada}
        />

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-10 md:grid-cols-2 md:gap-14">
          <Carousel
            slides={await imagenesCarrusel(
              regeneracionOrganizacional.carrusel.prefijo,
              regeneracionOrganizacional.carrusel.total,
              textos.publicacionParadigma
            )}
            total={regeneracionOrganizacional.carrusel.total}
            label={textos.carruselParadigma}
            idioma={idioma}
          />
          <InfoCard
            icon="hoja"
            quote={regeneracionOrganizacional.cita}
            paragraphs={regeneracionOrganizacional.parrafos}
            question={regeneracionOrganizacional.pregunta}
            cta={regeneracionOrganizacional.cta}
          />
        </div>
      </section>

      <section id="servicios" className="bg-cream px-[8vw] py-20 sm:py-24">
        <SectionHeader
          eyebrow={ecosistema.eyebrow}
          title={ecosistema.titulo}
          subtitle={ecosistema.bajada}
        />
        <EcosistemaPanel
          foto={ecosistema.panel.foto}
          logo={ecosistema.panel.logo}
          nombre={ecosistema.nombreProvisional}
          espacios={ecosistema.espacios}
        />
      </section>

      {/* Solo aparecen cuando Belén cargó algo en el panel */}
      <SeccionTalleres talleres={talleres} idioma={idioma} />

      <section id="cosmovision" className="bg-white px-[8vw] py-20 sm:py-24">
        <SectionHeader
          eyebrow={cosmovision.eyebrow}
          title={cosmovision.titulo}
          subtitle={cosmovision.bajada}
        />

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-10 md:grid-cols-2 md:gap-14">
          <Carousel
            slides={await imagenesCarrusel(
              cosmovision.carrusel.prefijo,
              cosmovision.carrusel.total,
              textos.publicacionCosmovision
            )}
            total={cosmovision.carrusel.total}
            label={textos.carruselCosmovision}
            idioma={idioma}
          />
          <InfoCard
            icon="brote"
            quote={cosmovision.cita}
            paragraphs={cosmovision.parrafos}
            author={cosmovision.autor}
            tag={cosmovision.etiqueta}
          />
        </div>
      </section>

      <VideoSection
        id="linajes"
        video={linajes.medios.video}
        poster={linajes.medios.poster}
        credito={linajes.credito}
        eyebrow={linajes.eyebrow}
        statement={linajes.statement}
        note={linajes.note}
      />

      <SeccionTestimonios testimonios={testimonios} idioma={idioma} />

      <CtaSection
        title={ctaFinal.titulo}
        subtitle={ctaFinal.bajada}
        note={ctaFinal.nota}
        primary={ctaFinal.principal}
        secondary={ctaFinal.secundario}
      />
    </main>
  );
}
