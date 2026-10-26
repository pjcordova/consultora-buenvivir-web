import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import DirectorioComunidad, { type IntegranteConFoto } from "@/components/DirectorioComunidad";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import { rutaDeImagenDeLista } from "@/lib/admin/slots";
import { rutaVersionada } from "@/lib/assets";
import { obtenerIntegrantes, obtenerServicios, obtenerWhatsapp } from "@/lib/contenido";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";

export function generateMetadata(): Metadata {
  const idioma = obtenerIdioma();
  const { titulo, descripcion } = textosDe(idioma).comunidad;
  return metadatosDePagina({ idioma, titulo, descripcion, ruta: "/comunidad", imagen: "ecosistema" });
}

/**
 * Directorio de la comunidad: quienes participan de los espacios del Ecosistema
 * y lo que hacen, para darles visibilidad. Los carga Belén en el panel (lista
 * "Integrantes"), solo con la autorización de cada persona.
 */
export default async function ComunidadPage({ searchParams }: { searchParams: { espacio?: string } }) {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma).comunidad;
  const [{ integrantes, deEjemplo }, ecosistema, whatsapp] = await Promise.all([
    obtenerIntegrantes(idioma),
    obtenerServicios(idioma),
    obtenerWhatsapp(idioma),
  ]);

  // Los espacios con su nombre actual (si Belén lo cambió en el panel, se ve el nuevo)
  const nombreDe = new Map(ecosistema.espacios.map((espacio) => [espacio.slug, espacio.nombre]));
  const conFoto: IntegranteConFoto[] = await Promise.all(
    integrantes.map(async (integrante) => ({
      ...integrante,
      foto: deEjemplo ? null : await rutaVersionada(rutaDeImagenDeLista("integrantes", integrante.id)),
      espacioNombre: nombreDe.get(integrante.espacio) ?? "",
    }))
  );
  // Para filtrar, solo los espacios que tienen a alguien, en el orden del Ecosistema
  const espacios = ecosistema.espacios
    .filter((espacio) => integrantes.some((integrante) => integrante.espacio === espacio.slug))
    .map((espacio) => ({ valor: espacio.slug, etiqueta: espacio.nombre }));
  const espacioInicial = espacios.some((espacio) => espacio.valor === searchParams.espacio)
    ? searchParams.espacio
    : undefined;

  const quieroAparecer = `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(textos.mensajeSumarme)}`;

  return (
    <main>
      <Header />

      <section className="bg-leaf-deep px-[8vw] py-16 sm:py-20 bajo:py-12">
        <SectionHeader
          eyebrow={textos.eyebrow}
          title={textos.encabezado}
          subtitle={textos.bajada}
          tono="verde"
          nivel="h1"
        />
      </section>

      <section className="bg-cream px-[8vw] py-12 sm:py-16 bajo:py-10">
        {deEjemplo && (
          <p className="mx-auto mb-6 max-w-6xl rounded-xl border border-dashed border-honey/60 bg-butter/60 px-4 py-3 text-center text-xs text-forest-800">
            {textos.ejemplo}
          </p>
        )}

        {conFoto.length > 0 ? (
          <DirectorioComunidad
            integrantes={conFoto}
            espacios={espacios}
            espacioInicial={espacioInicial}
            idioma={idioma}
          />
        ) : (
          <p className="mx-auto max-w-2xl rounded-3xl border border-dashed border-forest-800/20 bg-white px-6 py-12 text-center text-[0.95rem] text-forest-800/75">
            {textos.vacio}
          </p>
        )}
      </section>

      <CtaSection
        fondo="blanco"
        title={textos.cierreTitulo}
        subtitle={textos.cierreTexto}
        primary={{ label: textos.cierreBoton, href: quieroAparecer }}
        secondary={{ label: textos.verEcosistema, href: "/#servicios" }}
      />
    </main>
  );
}
