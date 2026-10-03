import { obtenerPie, obtenerWhatsapp } from "@/lib/contenido";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { URL_DEL_SITIO } from "@/lib/metadatos";
import { textosDe } from "@/lib/textos";

/**
 * Ficha invisible para Google (datos estructurados de schema.org): qué es Buen
 * Vivir, quién la dirige y dónde encontrarla.
 *
 * Solo lleva datos confirmados. La ubicación y los horarios se suman cuando
 * Belén los confirme. Las redes y el WhatsApp salen del panel, así la ficha
 * nunca queda desactualizada.
 */
export default async function FichaOrganizacion() {
  const idioma = obtenerIdioma();
  const { sitio } = textosDe(idioma);
  const [pie, whatsapp] = await Promise.all([obtenerPie(idioma), obtenerWhatsapp(idioma)]);
  const enlace = (id: string) => pie.redes.find((red) => red.id === id)?.href || undefined;

  // LinkedIn es el perfil personal de Belén: va en su ficha, no en la de la consultora.
  const redesDeLaConsultora = ["instagram", "tiktok", "youtube"].map(enlace).filter(Boolean);
  const linkedin = enlace("linkedin");

  const ficha = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: sitio.titulo,
    description: sitio.descripcion,
    url: idioma === "es" ? URL_DEL_SITIO : `${URL_DEL_SITIO}${enlaceEnIdioma("/", idioma)}`,
    logo: `${URL_DEL_SITIO}/images/logo-buen-vivir.png`,
    sameAs: redesDeLaConsultora,
    founder: {
      "@type": "Person",
      name: "Belén Vera",
      url: `${URL_DEL_SITIO}${enlaceEnIdioma("/sobre-belen", idioma)}`,
      ...(linkedin ? { sameAs: [linkedin] } : {}),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${whatsapp.numero}`,
      // Por ahora solo español: sumar "English" cuando Belén confirme que atiende en inglés
      availableLanguage: "Spanish",
    },
  };

  return (
    <script
      type="application/ld+json"
      // Los "<" se escapan para que un texto cargado en el panel no pueda cerrar la etiqueta
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ficha).replace(/</g, "\\u003c") }}
    />
  );
}
