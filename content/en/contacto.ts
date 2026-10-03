import * as es from "@/content/contacto";
import { formularioComunidadEn } from "@/content/enlaces";
import { footer } from "@/content/en/site";

/**
 * Página de Contacto, en inglés.
 * TRADUCCIÓN PRELIMINAR de content/contacto.ts — a revisar con Belén.
 */
export const contacto: typeof es.contacto = {
  eyebrow: "Contact · Let's talk",
  titulo: "Shall we talk?",
  bajada: "Book your session and we'll arrange an initial conversation.",
  nota: "Office hours to be confirmed with Belén",

  vias: [
    {
      id: "agenda",
      icono: "calendario",
      titulo: "Book a conversation",
      texto:
        "Choose the day and time that suit you best in Belén's calendar, and arrange a first meeting with no strings attached.",
      cta: { label: "See available times", href: "#agenda" },
      destacada: true,
    },
    {
      id: "whatsapp",
      icono: "whatsapp",
      titulo: "Message her on WhatsApp",
      texto:
        "Tell her where you are and what you need. It's the most direct way if you'd rather chat before booking.",
      cta: { label: "Open WhatsApp", href: "" }, // se completa con el número del panel
      destacada: false,
    },
    {
      id: "comunidad",
      icono: "comunidad",
      titulo: "Join the community",
      texto:
        "The Buen Vivir Ecosystem meets once a month to listen to each other, learn and explore together what can emerge.",
      cta: { label: "Fill in the form", href: formularioComunidadEn },
      destacada: false,
    },
  ],

  agendaTitulo: "Choose a day and time",
  agendaTexto:
    "These are Belén's available times. Pick the one that suits you best and fill in your details to book the initial conversation.",

  redesTitulo: "You can also follow her here",
  redesTexto: footer.contacto.intro,
  ubicacion: footer.ubicacion,
};
