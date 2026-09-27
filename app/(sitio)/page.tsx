import Carousel from "@/components/Carousel";
import CtaSection from "@/components/CtaSection";
import EcosistemaPanel from "@/components/EcosistemaPanel";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InfoCard from "@/components/InfoCard";
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
} from "@/lib/contenido";

export default async function HomePage() {
  const [hero, regeneracionOrganizacional, ecosistema, cosmovision, linajes, ctaFinal] =
    await Promise.all([
      obtenerPortada(),
      obtenerParadigma(),
      obtenerServicios(),
      obtenerCosmovision(),
      obtenerLinajes(),
      obtenerCierre(),
    ]);

  return (
    <main>
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
            slides={imagenesCarrusel(
              regeneracionOrganizacional.carrusel.prefijo,
              regeneracionOrganizacional.carrusel.total,
              (n) => `Publicación ${n} sobre regeneración organizacional`
            )}
            total={regeneracionOrganizacional.carrusel.total}
            label="Publicaciones sobre regeneración organizacional"
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

      <section id="cosmovision" className="bg-white px-[8vw] py-20 sm:py-24">
        <SectionHeader
          eyebrow={cosmovision.eyebrow}
          title={cosmovision.titulo}
          subtitle={cosmovision.bajada}
        />

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-10 md:grid-cols-2 md:gap-14">
          <Carousel
            slides={imagenesCarrusel(
              cosmovision.carrusel.prefijo,
              cosmovision.carrusel.total,
              (n) => `Publicación ${n} sobre la cosmovisión del Buen Vivir`
            )}
            total={cosmovision.carrusel.total}
            label="Publicaciones sobre la cosmovisión del Buen Vivir"
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
