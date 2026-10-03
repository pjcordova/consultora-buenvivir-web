import { formularioComunidadEn } from "@/content/enlaces";
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
    estado: "Launching — the first cycle begins in September",
    resumen: "A place for curious people, professionals, entrepreneurs and changemakers.",
    parrafos: [
      [
        "Once a month we meet online to listen to each other, learn, talk and explore together what can emerge when we bring different experiences, disciplines and ways of seeing the world into dialogue.",
      ],
      [
        "[PENDING — add here how a gathering unfolds: length, day and format, as confirmed by Belén]",
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
      "Directory of Ecosystem Professionals",
      "Monthly Logbook",
      "Collective Intelligence Practice Diploma (every 6 months)",
    ],
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
        "[PENDING — content to be defined with Belén: how it differs from the individual Personal Regeneration process, how many sessions there are, who it is for and how to sign up]",
      ],
      [
        "Meanwhile, individual Personal Regeneration work is already available: systems thinking to recognize patterns, Theory U to pause and observe, and personal flourishing to reconnect with purpose and direction.",
      ],
    ],
    ctaPagina: {
      titulo: "Want to hear when the group opens?",
      bajada: "Write to Belén and she will let you know when the first cycle begins.",
      principal: { label: "Let me know when it opens", href: "/contacto" },
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
    resumen: "A self-discovery process built around Julia Cameron's book The Artist's Way.",
    parrafos: [
      [
        "[PENDING — content to be defined with Belén: number of sessions, reading pace for the book, materials and how to sign up]",
      ],
      [
        "The process invites you to awaken creativity as an everyday life force, reconnect with your own essence, release blocks and create new possibilities from your purpose.",
      ],
    ],
    ctaPagina: {
      titulo: "Want to hear when the group opens?",
      bajada: "Write to Belén and she will let you know when the first cycle begins.",
      principal: { label: "Let me know when it opens", href: "/contacto" },
    },
  },
];
