import { obtenerPie, obtenerWhatsapp } from "@/lib/contenido";
import { DESCRIPCION_DEL_SITIO, TITULO_DEL_SITIO, URL_DEL_SITIO } from "@/lib/metadatos";

/**
 * Ficha invisible para Google (datos estructurados de schema.org): qué es Buen
 * Vivir, quién la dirige y dónde encontrarla.
 *
 * Solo lleva datos confirmados. La ubicación y los horarios se suman cuando
 * Belén los confirme. Las redes y el WhatsApp salen del panel, así la ficha
 * nunca queda desactualizada.
 */
export default async function FichaOrganizacion() {
  const [pie, whatsapp] = await Promise.all([obtenerPie(), obtenerWhatsapp()]);
  const enlace = (id: string) => pie.redes.find((red) => red.id === id)?.href || undefined;

  // LinkedIn es el perfil personal de Belén: va en su ficha, no en la de la consultora.
  const redesDeLaConsultora = ["instagram", "tiktok", "youtube"].map(enlace).filter(Boolean);
  const linkedin = enlace("linkedin");

  const ficha = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: TITULO_DEL_SITIO,
    description: DESCRIPCION_DEL_SITIO,
    url: URL_DEL_SITIO,
    logo: `${URL_DEL_SITIO}/images/logo-buen-vivir.png`,
    sameAs: redesDeLaConsultora,
    founder: {
      "@type": "Person",
      name: "Belén Vera",
      url: `${URL_DEL_SITIO}/sobre-belen`,
      ...(linkedin ? { sameAs: [linkedin] } : {}),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${whatsapp.numero}`,
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
