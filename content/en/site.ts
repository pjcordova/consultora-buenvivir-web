import * as es from "@/content/site";
import { agendaBelen, formularioComunidadEn } from "@/content/enlaces";

/**
 * Pie de página y WhatsApp, en inglés.
 * TRADUCCIÓN PRELIMINAR de content/site.ts — a revisar con Belén.
 * El número de WhatsApp y las redes son los mismos en los dos idiomas.
 */

export const whatsapp: typeof es.whatsapp = {
  numero: es.whatsapp.numero,
  visible: es.whatsapp.visible,
  mensaje:
    "Hi Belén, I'm writing from the Buen Vivir website. I'd like to request a consultation. How can we arrange it?",
};

export const whatsappUrl = `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`;

export const footer: typeof es.footer = {
  descripcion:
    "Buen Vivir — Organizational regeneration and human cultivation from a systemic perspective.",
  ubicacion: "Based in Argentina · Regional presence",
  columnas: [
    {
      titulo: "Services",
      enlaces: [
        { label: "Revitalize your Team", href: "/servicios#camino-1" },
        { label: "Revitalize your Work", href: "/servicios#camino-2" },
        { label: "Revitalize your Life", href: "/servicios#camino-3" },
        { label: "See all services", href: "/servicios" },
      ],
    },
    {
      titulo: "Ecosystem and Philosophy",
      enlaces: [
        { label: "Casita del Árbol", href: "/ecosistema/casita-del-arbol" },
        { label: "Personal Regeneration Group", href: "/ecosistema/regeneracion-personal" },
        { label: "Regeneration and Creativity Group", href: "/ecosistema/regeneracion-creatividad" },
        { label: "The Buen Vivir Worldview", href: "/#cosmovision" },
        { label: "About Belén Vera", href: "/sobre-belen" },
      ],
    },
  ],
  contacto: {
    titulo: "Contact and Dialogue",
    intro: "Open to meaningful conversations about organizational and life moments.",
    agenda: { label: "Book a conversation", href: agendaBelen },
    whatsapp: { label: `WhatsApp: ${whatsapp.visible}`, href: whatsappUrl },
    comunidad: { label: "Join the community", href: formularioComunidadEn },
    novedades: { label: "Get news by email", href: "/#novedades" },
    instagram: es.footer.contacto.instagram,
    email: es.footer.contacto.email,
  },
  redes: es.footer.redes,
  lema: "A space for cultivation, pause and transformation guided by Belén Vera.",
  legales: [
    { label: "Privacy", href: "/privacidad" },
    { label: "Terms", href: "/terminos" },
    { label: "Contact", href: "/contacto" },
  ],
};
