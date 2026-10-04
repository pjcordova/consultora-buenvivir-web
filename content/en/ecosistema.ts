import {
  formularioComunidadEn,
  preinscripcionCreatividad,
  preinscripcionRegeneracionPersonal,
} from "@/content/enlaces";
import type { Espacio } from "@/content/ecosistema";

/**
 * Espacios del Ecosistema Buen Vivir, en inglés.
 * TRADUCCIÓN PRELIMINAR de content/ecosistema.ts — a revisar con Belén.
 * Los nombres propios ("Casita del Árbol") quedan en español, como en su insignia.
 */
export const espacios: Espacio[] = [
  {
    slug: "casita-del-arbol",
    nombre: "Casita del Árbol",
    imagen: "/images/servicios/casita-del-arbol.png",
    estilo: "sello",
    cta: { label: "Starting…", href: "/ecosistema/casita-del-arbol" },
    flecha: true,

    titulo: "Casita del Árbol",
    estado: "Launching.",
    resumen:
      "An international learning community to regenerate ourselves and face the complexity of our time, through the practice of collective intelligence.",
    parrafos: [
      [
        "Once a month we meet online to listen to each other, learn, talk and explore together what can emerge when we bring different experiences, disciplines and ways of seeing the world into dialogue.",
      ],
      [
        "To develop capacities such as: systems thinking, regenerative leadership, holistic well-being, collaboration, social innovation, deep listening, integral communication, and personal and professional development.",
      ],
    ],
    incluye: [
      {
        titulo: "Perspective",
        texto: "Access diverse views on the challenges of the present and the future.",
      },
      {
        titulo: "Belonging",
        texto: "Be part of a community of changemakers who learn and think together.",
      },
      {
        titulo: "Possibilities",
        texto: "Meet people, discover ideas and open up collaborations.",
      },
    ],
    extras: [
      "A place in the Directory of Ecosystem Professionals",
      "Monthly Logbook with additional material",
      "Collective Intelligence Practice Diploma (every 6 months)",
    ],
    // El mismo video que en español (la sesión es en castellano)
    video: "https://www.youtube.com/watch?v=qY4Bm8UWjOU",
    ctaPagina: {
      titulo: "Would you like to join the next gathering?",
      bajada: "Fill in the form and Belén will write to you to join the first cycle.",
      principal: { label: "I want to join", href: formularioComunidadEn },
    },
  },
  {
    slug: "regeneracion-personal",
    nombre: "Personal Regeneration Group",
    estadoCorto: "Coming soon",
    imagen: "/images/servicios/regeneracion-personal.jpg",
    estilo: "foto",
    cta: { label: "+ info", href: "/ecosistema/regeneracion-personal" },

    titulo: "Personal Regeneration Group",
    estado: "Coming soon",
    resumen: "A group space to reconnect with your own sense of meaning, rhythm and inner coherence.",
    parrafos: [
      [
        "A caring space for listening, reflection and conscious action, to nurture your essence and understand your present moment, plant the changes you need for your well-being and move closer to your goals. To discover your potential and find yourself again.",
      ],
      [
        "You will learn to bring into your life systems thinking to recognize patterns, Theory U to pause and observe, better communication, and your personal flourishing to reconnect with your purpose and direction.",
      ],
    ],
    // El formulario de pre-inscripción está en español
    ctaPagina: {
      titulo: "Pre-registration is open",
      bajada:
        "Fill in the pre-registration form (in Spanish) and Belén will let you know when the first cycle begins.",
      principal: { label: "Pre-register", href: preinscripcionRegeneracionPersonal },
    },
  },
  {
    slug: "regeneracion-creatividad",
    nombre: "Regeneration and Creativity Group",
    estadoCorto: "Coming soon",
    imagen: "/images/servicios/regeneracion-creatividad.jpg",
    estilo: "foto",
    adorno: "/images/el-camino-del-artista.jpg",
    cta: { label: "+ info", href: "/ecosistema/regeneracion-creatividad" },

    titulo: "Regeneration and Creativity Group",
    estado: "Coming soon",
    resumen:
      "A self-discovery process built around Julia Cameron's book The Artist's Way, enriched with personal regeneration, systems thinking and Theory U.",
    parrafos: [
      [
        "For those who feel the call to know themselves deeply and recover their vitality. For those who want to revitalize their creativity in everyday life and discover their most authentic way of living.",
      ],
    ],
    incluye: [
      { titulo: "Awaken your creativity as an everyday life force" },
      { titulo: "Reconnect with your essence and authenticity" },
      { titulo: "Release blocks and get closer to your inner child" },
      { titulo: "Create new possibilities from your purpose" },
    ],
    // El formulario de pre-inscripción está en español
    ctaPagina: {
      titulo: "Pre-registration is open",
      bajada:
        "Fill in the pre-registration form (in Spanish) and Belén will let you know when the first cycle begins.",
      principal: { label: "Pre-register", href: preinscripcionCreatividad },
    },
  },
];
