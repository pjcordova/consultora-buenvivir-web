import * as es from "@/content/home";
import { agendaBelen } from "@/content/enlaces";
import { espacios } from "@/content/en/ecosistema";

/**
 * Contenido de la Home, en inglés.
 * TRADUCCIÓN PRELIMINAR de content/home.ts — a revisar con Belén.
 * Los campos que el sitio no muestra se toman tal cual de la versión en español.
 */

export const hero: typeof es.hero = {
  eyebrow: "Systemic perspective · Human cultivation",
  title: "Organizational regeneration and",
  titleAccent: "personal growth",
  body: "A space for cultivation, pause and transformation for teams and individuals, guided by Belén Vera.",
  note: "Preliminary introduction text — to be confirmed with Belén",
  primaryCta: { label: "Explore practices", href: "/servicios" },
  secondaryCta: { label: "Discover the philosophy", href: "/sobre-belen" },
  scrollTarget: "#regeneracion",
};

export const cosmovision: typeof es.cosmovision = {
  ...es.cosmovision,
  eyebrow: "Living wisdom · Worldview",
  titulo: "The Buen Vivir Worldview",
  bajada:
    "An ancestral and systemic way of seeing that understands human life in constant dialogue and balance with the living world.",
  cita: "A worldview is a way of understanding how life works and what our place within it is.",
  parrafos: [
    [
      "A worldview brings together ideas and values. In a sense, it is the deep map from which a culture interprets existence.",
    ],
    [
      "When I studied this, I felt it and it moved me deeply… not only was it so aligned with my life purpose — this wisdom and way of seeing the world opened up before me and gave words to something I had already been seeking, practicing and feeling.",
    ],
    [
      "That is why I honor this wisdom, which guides and inspires me at every step. ",
      { fuerte: "Did you know it? How does it feel to you?" },
    ],
  ],
  autor: "— Belén Vera",
  etiqueta: "Living wisdom",
};

export const regeneracionOrganizacional: typeof es.regeneracionOrganizacional = {
  eyebrow: "Organizational regeneration · Systemic approach",
  titulo: "A new paradigm for organizations",
  bajada:
    "Where sustainability is not only technical, but emotional, relational and deeply human.",
  cita: "Organizations are not machines, they are living organisms.",
  parrafos: [
    [
      "Made up of people who have their own cycles — of learning, of life and of processes — as they grow within a company or organization. ✨",
    ],
    [
      "And when we recognize it as such, a new path emerges: ",
      { fuerte: "“Organizational Regeneration”" },
      '. An innovative process that combines management, conscious leadership, relational management and deep listening to uncover the organization\'s "pain points", turn tensions into learning and align individual dreams with collective goals.',
    ],
    [
      "Because real change happens when we put people at the center and understand that a healthy, humane and coherent company is capable of generating not only results, but also of moving from the individual to the collective and the ecosystemic.",
    ],
  ],
  pregunta: "Ready to regenerate your organization from the inside out?",
  cta: { label: "Let's talk", href: "/contacto" },
  carrusel: es.regeneracionOrganizacional.carrusel,
};

export const ecosistema: typeof es.ecosistema = {
  ...es.ecosistema,
  nombreProvisional: "Buen Vivir Ecosystem",
  estado: "Launching — the first cycle begins in September",
  eyebrow: "Offerings and spaces · Ecosystem",
  titulo: "Our Services",
  bajada:
    "Living spaces for gathering, learning and cultivation for individuals, communities and organizations.",
  espacios,
};

export const linajes: typeof es.linajes = {
  eyebrow: "Lineages of learning and practice",
  statement:
    "Accompanying the transformation of collectives through deep listening and the living rhythms of human ecosystems.",
  note: "Space reserved for a quote or conceptual text by Belén — to be confirmed whether it references authors such as Maturana, Scharmer or Senge, or her own synthesis of her approach",
  credito: "Nature footage · Southern right whale in Patagonian waters",
  medios: es.linajes.medios,
};

export const ctaFinal: typeof es.ctaFinal = {
  texto: "Book your session and we'll arrange an initial conversation.",
  titulo: "Start a conversation about your organizational or personal moment",
  bajada:
    "Every process begins with a pause to listen to what needs attention. Let's talk, with no preset commitments.",
  nota: "Contact channels and availability to be confirmed with Belén",
  principal: { label: "Write to Belén", href: agendaBelen },
  secundario: { label: "See all services", href: "/servicios" },
};
