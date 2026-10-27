import type { Metadata } from "next";
import Image from "next/image";
import CtaSection from "@/components/CtaSection";
import HojasCayendo from "@/components/HojasCayendo";
import DirectorioComunidad, { type IntegranteConFoto } from "@/components/DirectorioComunidad";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import { rutaDeImagenDeLista } from "@/lib/admin/slots";
import { rutaVersionada } from "@/lib/assets";
import { obtenerIntegrantes, obtenerServicios, obtenerWhatsapp } from "@/lib/contenido";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";
import { banderaDePais } from "@/lib/paises";
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
      bandera: banderaDePais(integrante.pais),
    }))
  );
  // Para filtrar, solo los espacios que tienen a alguien, en el orden del Ecosistema
  const espacios = ecosistema.espacios
    .filter((espacio) => integrantes.some((integrante) => integrante.espacio === espacio.slug))
    .map((espacio) => ({ valor: espacio.slug, etiqueta: espacio.nombre }));
  const espacioInicial = espacios.some((espacio) => espacio.valor === searchParams.espacio)
    ? searchParams.espacio
    : undefined;

  const fotoBosque = await rutaVersionada(ecosistema.panel.foto);
  const quieroAparecer =`https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(textos.mensajeSumarme)}`;

  return (
    <main>
      <Header />

      {/* Un bosque (pedido de Belén: la comunidad es un bosque donde todos se
          ayudan): la foto del bosque del Ecosistema, oscurecida para leer bien,
          con hojas que caen. */}
      <section className="relative isolate overflow-hidden bg-forest-950 px-[8vw] py-20 sm:py-28 bajo:py-14">
        {fotoBosque && (
          <Image src={fotoBosque} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-b from-forest-950/75 via-forest-950/55 to-forest-950/80"
          aria-hidden="true"
        />
        <HojasCayendo />
        {/* Abajo se funde con el bosque oscuro del directorio */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-forest-950 sm:h-24" aria-hidden="true" />
        <div className="relative">
          <SectionHeader
            eyebrow={textos.eyebrow}
            title={textos.encabezado}
            subtitle={textos.bajada}
            tono="verde"
            nivel="h1"
          />
        </div>
      </section>

      {/* El directorio sigue dentro del bosque: fondo oscuro con luces suaves,
          hojas que caen y luciérnagas por detrás de las tarjetas (en una capa
          del alto de la pantalla que acompaña al bajar, así no pesa aunque
          haya muchos integrantes). overflow-x-clip: las raíces de los costados
          no agregan desplazamiento lateral en celular. */}
      <section className="relative isolate overflow-x-clip bg-forest-950 px-[8vw] py-12 sm:py-16 bajo:py-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_30%_at_50%_0%,rgba(39,164,126,0.14),transparent),radial-gradient(40%_25%_at_10%_60%,rgba(130,173,69,0.07),transparent),radial-gradient(40%_25%_at_90%_35%,rgba(201,162,74,0.06),transparent)]"
          aria-hidden="true"
        />
        {/* overflow-clip y no hidden: con hidden la capa dejaría de acompañar al bajar */}
        <div className="pointer-events-none absolute inset-0 overflow-clip" aria-hidden="true">
          <div className="sticky top-0 h-screen">
            <HojasCayendo densidad={0.55} luciernagas />
          </div>
        </div>

        <div className="relative">
        {deEjemplo && (
          <p className="mx-auto mb-6 max-w-6xl rounded-xl border border-dashed border-honey/50 bg-honey/10 px-4 py-3 text-center text-xs text-butter/90">
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
        </div>
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
