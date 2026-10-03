import * as es from "@/content/servicios";
import type { Camino } from "@/content/servicios";

/**
 * Servicios, en inglés.
 * TRADUCCIÓN PRELIMINAR de content/servicios.ts — a revisar con Belén.
 * Los slugs y las imágenes son los mismos: las direcciones no cambian.
 */
export const caminos: Camino[] = [
  {
    emoji: "🌿",
    titulo: "Revitalize your Team",
    descripcion:
      "Regeneration processes for teams that need to rebuild communication, trust and shared direction.",
    ofertas: [
      {
        slug: "regeneracion-de-equipos",
        titulo: "Team Regeneration",
        imagen: "/images/servicios/regeneracion-equipos.jpg",
        descripcion:
          "Teams evolve and change just like the people in them: they are a complex system in changing, demanding contexts. Navigating that complexity regeneratively helps teams move through transitions and tensions, and revitalizes them. Creating a safe space to listen to each other better, rebuild relationships and make sense together, so new ways of working can emerge with clarity and well-being, both at work and in relationships.",
        paraQuien:
          "To develop collective learning capacity, the handling of tensions, decision-making and cultural coherence in complex, changing and demanding contexts.",
        incluye: [
          "Improve relationships and communication",
          "Strengthen conscious leadership",
          "Improve decision-making",
          "Bridge and nurture the generational gap",
          "Align purpose, people and results",
        ],
      },
      {
        slug: "liderazgo-regenerativo",
        titulo: "Regenerative Leadership",
        imagen: "/images/servicios/liderazgo-regenerativo.jpg",
        descripcion:
          "If you feel this context is demanding more of you and you need to evolve the way you lead — with greater presence, strategy and meaning.",
        paraQuien:
          "For leaders, middle managers, managers and team heads who want to evolve the way they lead in demanding, changing contexts.",
        incluye: [
          "Develop more conscious, effective, coherent and resilient leadership styles",
          "Strengthen communication and people management",
          "Bring in systems thinking and innovative management frameworks",
        ],
      },
    ],
  },
  {
    emoji: "🧭",
    titulo: "Revitalize your Work",
    descripcion:
      "For entrepreneurs, leaders and professionals looking for new ways to lead, organize their work and make decisions in complex contexts.",
    ofertas: [
      {
        slug: "regeneracion-para-emprendedores",
        titulo: "Regeneration for Entrepreneurs",
        imagen: "/images/servicios/regeneracion-emprendedores.jpg",
        descripcion:
          "A holistic development space for entrepreneurs who want meaningful projects, strategic clarity and personal coherence, with greater balance and long-term sustainability.",
        paraQuien:
          "For those who want to grow their venture from a more conscious and holistic approach.",
        incluye: [
          "Ikigai: clarity of purpose and direction for your project",
          "Conscious management of time, energy and priorities",
          "Stakeholder map, processes and strategic organization",
          "Regenerative communication and collaborative relationships",
          "Patterns of creativity, rhythm and polarity",
          "Introduction to conscious management",
        ],
      },
      {
        slug: "introduccion-a-la-teoria-u",
        titulo: "Introduction to Theory U",
        imagen: "/images/servicios/teoria-u.jpg",
        descripcion:
          "An experience to develop greater clarity, depth and capacity for transformation in your personal and professional life, creating new possibilities from the emerging future. To learn active listening, more authentic communication, and new ways of perceiving and acting in complex contexts.",
        paraQuien:
          "Aimed at leaders, teachers, coaches, executives, middle managers, communicators and advisors — or for your own personal growth.",
        incluye: [
          "Connect with the most precious human technology: the power of conversation and the 4 levels of listening",
          "Recognize intuitive understanding",
          "From systemic change to inner transformation",
          "From systems of control to living systems",
          "Create anew from a new level of consciousness",
        ],
      },
    ],
  },
  {
    emoji: "✨",
    titulo: "Revitalize your Life",
    descripcion:
      "One-to-one spaces for moments of transition, searching or reconnection with purpose, creativity and personal coherence.",
    ofertas: [
      {
        slug: "regeneracion-personal",
        titulo: "Personal Regeneration",
        imagen: "/images/servicios/regeneracion-personal-flyer.jpg",
        descripcion:
          "A caring space for listening, reflection and conscious action: nourish your essence and understand your present moment, to plant the changes you need for your well-being and move closer to your goals. Discover your potential and find yourself again.",
        paraQuien:
          "A one-to-one space for people who want to reconnect with their sense of meaning, their rhythm and their inner coherence.",
        incluye: [
          "Systems thinking to recognize patterns and understand what you are going through",
          "Theory U to learn to pause, observe and create from new possibilities",
          "Personal flourishing: reconnecting with purpose, meaning and direction",
        ],
      },
      {
        slug: "creatividad-y-regeneracion",
        titulo: "Creativity and Regeneration",
        imagen: "/images/servicios/creatividad-regeneracion.jpg",
        descripcion:
          "A self-discovery process built around Julia Cameron's book The Artist's Way, enriched with personal regeneration, systems thinking and Theory U. For those who feel the call to know themselves deeply and recover their vitality.",
        paraQuien:
          "For those who want to revitalize their creativity in everyday life and discover their most authentic way of living.",
        incluye: [
          "Awaken your creativity as an everyday life force",
          "Reconnect with your essence and authenticity",
          "Release blocks and get closer to your inner child",
          "Create new possibilities from your purpose",
        ],
      },
      {
        slug: "para-profesionales-diversos",
        titulo: "For Professionals of All Fields",
        imagen: "/images/servicios/profesionales-diversos.jpg",
        descripcion:
          "I accompany you to nourish your work and regenerate: a transformation to come back to yourself, realign, return to a healthy rhythm and recover your vitality. Also for career transition processes.",
        paraQuien:
          "Personalized sessions if you are going through work stress, burnout or a career transition, or need to redirect your path.",
        incluye: [
          "Make sense of what you are going through",
          "Reconnect with your purpose, creativity and motivation",
          "Recover your rhythms, energy and personal well-being",
          "Make decisions with greater clarity and coherence",
        ],
      },
    ],
  },
];

export const paginaServicios: typeof es.paginaServicios = {
  eyebrow: "Accompaniment · Regenerative processes",
  titulo: "Services",
  bajada:
    "Three paths of accompaniment for teams, projects and people, depending on the moment you are going through.",
};

export const ctaServicios = "Book your session and we'll arrange an initial conversation.";
