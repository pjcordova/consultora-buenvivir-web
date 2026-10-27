import { obtenerCorreo, obtenerPie, obtenerWhatsapp } from "@/lib/contenido";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { NOMBRE_DEL_SITIO, URL_DEL_SITIO } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";

/**
 * Ficha invisible para Google (datos estructurados de schema.org): cómo se
 * llama el sitio, qué es Buen Vivir, quién la dirige y dónde encontrarla.
 *
 * Solo lleva datos confirmados. La ubicación y los horarios se suman cuando
 * Belén los confirme. Las redes, el WhatsApp y el correo salen del panel, así
 * la ficha nunca queda desactualizada.
 */
export default async function FichaOrganizacion() {
  const idioma = obtenerIdioma();
  const { sitio } = textosDe(idioma);
  const [pie, whatsapp, correo] = await Promise.all([
    obtenerPie(idioma),
    obtenerWhatsapp(idioma),
    obtenerCorreo(),
  ]);
  const enlace = (id: string) => pie.redes.find((red) => red.id === id)?.href || undefined;

  // LinkedIn y Substack son perfiles personales de Belén: van en su ficha, no en la de la consultora.
  const redesDeLaConsultora = ["instagram", "tiktok", "youtube", "spotify"].map(enlace).filter(Boolean);
  const redesDeBelen = ["linkedin", "substack"].map(enlace).filter(Boolean);

  // Cómo se llama el sitio en los resultados de Google (arriba de cada resultado).
  // Sin esto Google muestra solo el dominio.
  const sitioWeb = {
    "@type": "WebSite",
    name: NOMBRE_DEL_SITIO,
    alternateName: ["Consultora Buen Vivir", sitio.titulo],
    url: `${URL_DEL_SITIO}/`,
    inLanguage: ["es", "en"],
  };

  const ficha = {
    "@type": "Organization",
    name: NOMBRE_DEL_SITIO,
    alternateName: ["Consultora Buen Vivir", sitio.titulo],
    description: sitio.descripcion,
    url: idioma === "es" ? URL_DEL_SITIO : `${URL_DEL_SITIO}${enlaceEnIdioma("/", idioma)}`,
    logo: `${URL_DEL_SITIO}/images/logo-buen-vivir.png`,
    sameAs: redesDeLaConsultora,
    founder: {
      "@type": "Person",
      name: "Belén Vera",
      url: `${URL_DEL_SITIO}${enlaceEnIdioma("/sobre-belen", idioma)}`,
      ...(redesDeBelen.length ? { sameAs: redesDeBelen } : {}),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${whatsapp.numero}`,
      ...(correo ? { email: correo } : {}),
      // CONFIRMADO (2026-10-04): Belén atiende en español y en inglés
      availableLanguage: ["Spanish", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      // Los "<" se escapan para que un texto cargado en el panel no pueda cerrar la etiqueta
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [sitioWeb, ficha] }).replace(
          /</g,
          "\\u003c"
        ),
      }}
    />
  );
}
