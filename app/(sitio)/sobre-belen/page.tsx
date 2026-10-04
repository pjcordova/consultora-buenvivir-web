import type { Metadata } from "next";
import Image from "next/image";
import Boton from "@/components/Boton";
import Carousel from "@/components/Carousel";
import CtaSection from "@/components/CtaSection";
import Header from "@/components/Header";
import Parrafos from "@/components/Parrafos";
import { imagenesCarrusel, rutaVersionada } from "@/lib/assets";
import { obtenerBelen, obtenerCierre, obtenerLeyendas } from "@/lib/contenido";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";

export function generateMetadata(): Metadata {
  const idioma = obtenerIdioma();
  const { titulo, descripcion } = textosDe(idioma).sobreBelen;
  return metadatosDePagina({ idioma, titulo, descripcion, ruta: "/sobre-belen", imagen: "belen" });
}

export default async function SobreBelenPage() {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma).sobreBelen;
  const [belen, ctaFinal, leyendas] = await Promise.all([
    obtenerBelen(idioma),
    obtenerCierre(idioma),
    obtenerLeyendas(idioma),
  ]);
  /**
   * Las fotos cargadas de un carrusel, cada una con la leyenda que Belén le puso
   * en el panel. La leyenda también describe la foto para los lectores de pantalla.
   */
  const fotosCon = async (prefijo: string, total: number, alt: (n: number) => string) =>
    (await imagenesCarrusel(prefijo, total, alt)).flatMap((slide, i) => {
      const leyenda = leyendas[`${prefijo}-${i + 1}`] || undefined;
      return slide ? [{ ...slide, alt: leyenda ?? slide.alt, leyenda }] : [];
    });

  const [foto, fotosFreyre, fotosEnfoque] = await Promise.all([
    rutaVersionada(belen.foto),
    fotosCon("freyre", 8, (n) => textos.fotoFreyre(belen.freyreTitulo, n)),
    fotosCon("enfoque", 3, textos.fotoEnfoque),
  ]);
  // En el sitio publicado, el carrusel de "Mi enfoque" existe solo si Belén subió alguna foto
  const hayLugarFotoEnfoque = fotosEnfoque.length > 0 || process.env.NODE_ENV === "development";

  return (
    <main>
      <Header />

      <section className="bg-leaf-deep px-[8vw] py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-14">
          {foto ? (
            <Image
              src={foto}
              alt={textos.fotoAlt}
              width={588}
              height={734}
              priority
              sizes="(min-width: 768px) 22rem, 90vw"
              className="w-full rounded-3xl shadow-[0_20px_50px_-25px_rgba(18,23,15,0.45)]"
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center rounded-3xl border-2 border-dashed border-white/40 text-sm text-white/70">
              {textos.fotoPendiente}
            </div>
          )}

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
              {belen.eyebrow}
            </p>

            <h1 className="mt-5 text-3xl leading-tight text-white sm:text-[2.6rem]">
              {belen.saludo}
            </h1>
            {/* Crema sobre verde: el dorado no contrasta lo suficiente */}
            <p className="mt-3 font-display text-lg italic text-butter">{belen.rol}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {belen.titulos.map((titulo) => (
                <li
                  key={titulo}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-white"
                >
                  {titulo}
                </li>
              ))}
            </ul>

            <div className="mt-6 text-[0.95rem]">
              <Parrafos parrafos={belen.presentacion} tono="blanco" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-[8vw] py-14 sm:py-16">
        <figure className="mx-auto max-w-3xl text-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-leaf" aria-hidden="true">
            <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 12-9 0 7-3 12-8 13.5M4 21c1-4 4-7 8-8.5" />
          </svg>

          <blockquote className="mt-5 font-display text-2xl italic leading-snug text-forest-950 sm:text-[1.9rem]">
            &ldquo;{belen.cita}&rdquo;
          </blockquote>

          <figcaption className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-forest-800/80">
            {belen.citaTexto}
          </figcaption>
        </figure>
      </section>

      <section className="bg-white px-[8vw] py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl text-forest-950 sm:text-3xl">
            {belen.caminoTitulo}
          </h2>
          <div className="mt-6 text-[0.95rem]">
            <Parrafos parrafos={belen.camino} />
          </div>
        </div>

        {/* Ecoproyectos Freyre: su trayectoria en fotos, más ancho que el texto.
            Aparece cuando Belén sube al menos una foto (en la computadora de
            desarrollo se ve siempre, con los lugares vacíos marcados). */}
        {(fotosFreyre.length > 0 || process.env.NODE_ENV === "development") && (
          <div className="mx-auto mt-12 grid max-w-5xl items-center gap-10 rounded-3xl bg-cream p-6 sm:p-10 md:grid-cols-2 md:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-leaf/25 bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-leaf">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
                {textos.trayectoria}
              </p>
              <h2 className="mt-5 font-display text-2xl text-forest-950 sm:text-3xl">
                {belen.freyreTitulo}
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-forest-800/80">{belen.freyreTexto}</p>
              {belen.freyreEnlace?.label && belen.freyreEnlace.href && (
                <Boton
                  href={belen.freyreEnlace.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest-800/20 bg-white px-5 py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-leaf hover:text-forest-950"
                >
                  {belen.freyreEnlace.label}
                  {/* Flecha hacia afuera: se abre en otra pestaña */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </Boton>
              )}
            </div>
            <Carousel
              slides={fotosFreyre.length ? fotosFreyre : undefined}
              total={8}
              label={belen.freyreTitulo}
              idioma={idioma}
            />
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          {belen.formacion.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-forest-950 sm:text-3xl">
                {belen.formacionTitulo}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {belen.formacion.map((item) => (
                  <li key={item} className="flex items-center gap-4 rounded-2xl bg-cream p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-leaf">
                      {/* Birrete */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 9 12 4 2 9l10 5 10-5Z" />
                        <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
                        <path d="M22 9v6" />
                      </svg>
                    </span>
                    <span className="font-display text-lg leading-snug text-forest-950">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Mi enfoque: con la foto de Belén facilitando, el texto a la izquierda y
          la foto a la derecha (en celular, la foto arriba). Sin foto, una sola
          columna como antes; en la computadora de desarrollo se marca el lugar. */}
      <section className="bg-cream px-[8vw] py-16 sm:py-20">
        <div
          className={
            hayLugarFotoEnfoque
              ? "mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-14"
              : "mx-auto max-w-2xl"
          }
        >
          <div>
            <h2 className="font-display text-2xl text-forest-950 sm:text-3xl">
              {belen.enfoqueTitulo}
            </h2>

            <blockquote className="mt-6 rounded-3xl bg-white p-7 sm:p-9">
              <p className="font-display text-xl italic leading-snug text-forest-950">
                &ldquo;{belen.enfoqueCita}&rdquo;
              </p>
              <footer className="mt-4 flex items-center gap-2 text-sm text-forest-800/70">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
                Belén Vera
              </footer>
            </blockquote>

            <div className="mt-8 text-[0.95rem]">
              <Parrafos parrafos={belen.enfoque} />
            </div>
          </div>

          {hayLugarFotoEnfoque && (
            <div className="order-first md:sticky md:top-32 md:order-last md:mt-14">
              <Carousel
                slides={fotosEnfoque.length ? fotosEnfoque : undefined}
                total={3}
                label={textos.enfoqueCarrusel}
                idioma={idioma}
              />
            </div>
          )}
        </div>
      </section>

      <CtaSection
        fondo="blanco"
        title={textos.cierreTitulo}
        subtitle={ctaFinal.bajada}
        note={ctaFinal.nota}
        primary={ctaFinal.principal}
        secondary={{ label: textos.verServicios, href: "/servicios" }}
      />
    </main>
  );
}
