import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { textosDe } from "@/lib/textos";

export function generateMetadata(): Metadata {
  return { title: textosDe(obtenerIdioma()).noEncontrada.titulo };
}

/**
 * Página para direcciones que no existen. Vive fuera de app/(sitio), así que
 * suma por su cuenta el pie y el botón de WhatsApp.
 */
export default function NoEncontrada() {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma).noEncontrada;

  return (
    <>
      <main>
        <Header />

        <section className="bg-cream px-[8vw] py-24 text-center sm:py-32">
          <SectionHeader eyebrow={textos.etiqueta} title={textos.encabezado} subtitle={textos.texto} />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={enlaceEnIdioma("/", idioma)}
              className="inline-flex items-center gap-2 rounded-md bg-leaf px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-leaf-dark"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
              {textos.inicio}
            </Link>
            <Link
              href={enlaceEnIdioma("/servicios", idioma)}
              className="inline-flex items-center rounded-md border border-butter-border bg-butter px-6 py-3.5 text-sm text-forest-800 transition-colors hover:bg-[#fbf1b8]"
            >
              {textos.servicios}
            </Link>
            <Link
              href={enlaceEnIdioma("/contacto", idioma)}
              className="inline-flex items-center px-4 py-3.5 text-sm text-forest-800 underline decoration-leaf/50 underline-offset-4 transition-colors hover:text-forest-950"
            >
              {textos.escribir}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
