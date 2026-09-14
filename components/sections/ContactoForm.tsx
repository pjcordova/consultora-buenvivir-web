import siteContent from "@/content/site.json";

/**
 * Para la v1 no hay backend/CMS: el "formulario" de contacto enlaza al
 * Google Form ya existente de la comunidad de Buen Vivir.
 * TODO: confirmar con Belén si se reemplaza por un formulario propio más adelante.
 */
export default function ContactoForm() {
  return (
    <a
      href={siteContent.googleFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-block rounded-full bg-bv-verde px-6 py-3 font-semibold text-bv-crema hover:bg-bv-verde-oscuro"
    >
      Ir al formulario
    </a>
  );
}
