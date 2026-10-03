import type { Metadata } from "next";
import Boton from "@/components/Boton";
import Header from "@/components/Header";
import RedesSociales from "@/components/RedesSociales";
import SectionHeader from "@/components/SectionHeader";
import { agendaBelen, agendaBelenIncrustada } from "@/content/enlaces";
import { obtenerContacto, obtenerPie, obtenerWhatsapp, urlWhatsapp } from "@/lib/contenido";
import { metadatosDePagina } from "@/lib/metadatos";

export const metadata: Metadata = metadatosDePagina({
  titulo: "Contacto | Buen Vivir",
  descripcion:
    "Agendá una conversación con Belén Vera, escribile por WhatsApp o sumate al Ecosistema Buen Vivir.",
  ruta: "/contacto",
});

const ICONOS = {
  calendario: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 10h18" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 9.2c.3 1.6 2.4 3.7 4 4l.9-1.2 1.7.7c-.2.9-1 1.4-1.8 1.3-2.5-.4-4.9-2.8-5.3-5.3-.1-.8.4-1.6 1.3-1.8l.7 1.7-1.5.6Z" />
    </>
  ),
  comunidad: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </>
  ),
};

export default async function ContactoPage() {
  const [contacto, pie, whatsapp, enlaceWhatsapp] = await Promise.all([
    obtenerContacto(),
    obtenerPie(),
    obtenerWhatsapp(),
    urlWhatsapp(),
  ]);

  // El WhatsApp sale del panel, así el número y el mensaje se editan en un solo lugar
  const vias = contacto.vias.map((via) =>
    via.id === "whatsapp"
      ? { ...via, cta: { label: whatsapp.visible, href: enlaceWhatsapp } }
      : via
  );

  return (
    <main>
      <Header />

      <section className="bg-leaf-deep px-[8vw] py-16 sm:py-20">
        <SectionHeader
          eyebrow={contacto.eyebrow}
          title={contacto.titulo}
          subtitle={contacto.bajada}
          tono="verde"
        />
        {contacto.nota && (
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs italic text-white/70">
            ({contacto.nota})
          </p>
        )}
      </section>

      <section className="bg-white px-[8vw] py-16 sm:py-20">
        <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {vias.map((via) => (
            <li
              key={via.id}
              className={`flex flex-col rounded-3xl p-7 ${
                via.destacada ? "bg-cream ring-1 ring-leaf/25" : "bg-cream"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-leaf" aria-hidden="true">
                  {ICONOS[via.icono]}
                </svg>
              </span>

              <h2 className="mt-5 font-display text-xl leading-snug text-forest-950">
                {via.titulo}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-forest-800/80">{via.texto}</p>

              <Boton
                href={via.cta.href}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  via.destacada
                    ? "bg-leaf text-white hover:bg-leaf-dark"
                    : "border border-forest-800/20 text-forest-800 hover:bg-white"
                }`}
              >
                {via.cta.label}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Boton>
            </li>
          ))}
        </ul>
      </section>

      {/* La agenda de Google de Belén, para reservar sin salir del sitio */}
      <section id="agenda" className="bg-cream px-[8vw] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl text-forest-950 sm:text-3xl">
            {contacto.agendaTitulo}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-800/80">
            {contacto.agendaTexto}
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-[0_18px_45px_-24px_rgba(18,23,15,0.35)] ring-1 ring-forest-800/10">
            <iframe
              src={agendaBelenIncrustada}
              title="Agenda de Belén Vera para reservar una conversación"
              loading="lazy"
              className="block h-[56rem] w-full border-0 md:h-[50rem]"
            />
          </div>

          <p className="mt-4 text-xs text-forest-800/60">
            ¿No se ve la agenda?{" "}
            <a
              href={agendaBelen}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-800 underline decoration-leaf/50 underline-offset-4 hover:text-forest-950"
            >
              Abrila en otra pestaña
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-forest-800/10 bg-white px-[8vw] py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-forest-950">{contacto.redesTitulo}</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-800/80">
              {contacto.redesTexto}
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-forest-800/60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-leaf" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {contacto.ubicacion}
            </p>
          </div>

          <RedesSociales redes={pie.redes} tono="claro" />
        </div>
      </section>
    </main>
  );
}
