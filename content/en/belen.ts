import * as es from "@/content/belen";

/**
 * Página Sobre Belén, en inglés.
 * TRADUCCIÓN PRELIMINAR del texto que escribió Belén (content/belen.ts) — a
 * revisar con ella, sobre todo los giros personales ("chuncana", Perla del Norte).
 * Los titulares de su perfil ya estaban en inglés y quedan igual.
 */
export const belen: typeof es.belen = {
  eyebrow: "About Belén · Her story",
  saludo: "Hi, I'm Belén Vera",
  rol: "Facilitator of Organizational and Personal Regeneration",
  foto: es.belen.foto,
  cita: "Organizations are not machines, they are living organisms.",
  citaTexto:
    "Made up of people who have their own cycles — of learning, of life and of processes — as they grow within a company or organization.",

  titulos: [
    "Community Enabler",
    "Organizational Transformation Facilitator",
    "Regenerative Facilitator",
    "Systems Thinking",
    "Theory U",
    "Collective Intelligence",
    "Teamwork",
  ],

  presentacion: [
    [
      "I come from Deán Funes, known as the Pearl of Northern Córdoba — a chuncana at heart and a dreamer since childhood, when at the age of 12 I started my first environmental group with my friends.",
    ],
    [
      "Life was not a straight line for me. It was more of a winding path, with pauses, detours and new beginnings. I lived in the city of Córdoba for 13 years, and I have now been living in Freyre for 12.",
    ],
  ],

  caminoTitulo: "My path",
  camino: [
    [
      "Looking back, every stage — every search, every attempt, every venture — was a silent preparation. As if something greater were putting the pieces in place, sowing lessons so that today regeneration could blossom in me with meaning.",
    ],
    [
      "My path began at a very young age, volunteering with ",
      { fuerte: "La Sachetera Córdoba" },
      ", where we made sleeping bags for people experiencing homelessness out of heat-sealed milk pouches, and later in environmental education with ecobricks. All of it driven by a deep curiosity to understand human systems, collective learning and conscious transformation.",
    ],
    [
      "In Freyre I created the first volunteer environmental education group, with wonderful people. That journey led me to create ",
      { fuerte: "Consultora Buen Vivir" },
      " and, later, to discover organizational regeneration as an approach that brought together my story, my purpose and my professional practice.",
    ],
    [
      "Today I am ready to share the services I have been developing as a facilitator of Organizational and Personal Regeneration processes, accompanying people, leaders, teams and organizations through moments of change, transition and cultural evolution.",
    ],
  ],

  enfoqueTitulo: "My approach",
  enfoqueCita:
    "I believe in regeneration as a practice that emerges when we learn to observe our systems, putting life at the center, holding processes of change and building the future from shared meaning.",
  enfoque: [
    [
      "From systems thinking I learned that focusing on people means caring for our closest environment — caring for our mental, physical and emotional health in daily life, including the role we play in our work; seeking personal and professional well-being to strengthen organizations… and from there, the ecosystem.",
    ],
    [
      "My approach seeks to strengthen coherence, adaptive capacity and the creation of more conscious, humane and living organizational cultures.",
    ],
  ],

  freyreTitulo: "Ecoproyectos Freyre",
  freyreTexto:
    "The first volunteer environmental education group in Freyre: 10 years bringing together civil society, schools and public bodies.",
  freyreEnlace: { label: "See more on Facebook", href: es.belen.freyreEnlace.href },

  formacionTitulo: "Training",
  formacion: ["Facilitation in Organizational Regeneration", "Theory U"],
};
