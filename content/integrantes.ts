import type { Idioma } from "@/lib/idioma";

/**
 * Integrantes INVENTADOS para revisar el diseño del directorio mientras la
 * lista del panel está vacía: en la computadora de desarrollo y en las vistas
 * previas de Vercel. Nunca se ven en el sitio publicado (ver obtenerIntegrantes
 * en lib/contenido.ts).
 * Los reales los carga Belén desde el panel, con su autorización.
 */
type IntegranteDeEjemplo = {
  nombre: string;
  pais: string;
  espacio: string;
  especialidad: string;
  proyecto: string;
  descripcion: string;
  web: string;
  instagram: string;
  linkedin: string;
};

const ES: IntegranteDeEjemplo[] = [
  {
    nombre: "Lucía Ferreyra",
    pais: "Argentina",
    espacio: "casita-del-arbol",
    especialidad: "Psicóloga social",
    proyecto: "Círculos de escucha",
    descripcion: "Facilita círculos de conversación para equipos de salud y de educación.",
    web: "",
    instagram: "https://example.com",
    linkedin: "https://example.com",
  },
  {
    nombre: "Martín Sosa",
    pais: "Uruguay",
    espacio: "casita-del-arbol",
    especialidad: "Diseñador gráfico",
    proyecto: "Estudio Raíz",
    descripcion: "Identidad visual para proyectos sostenibles y emprendimientos de triple impacto.",
    web: "https://example.com",
    instagram: "https://example.com",
    linkedin: "",
  },
  {
    nombre: "Camila Rojas",
    pais: "Chile",
    espacio: "regeneracion-personal",
    especialidad: "Coach ontológica",
    proyecto: "Camino Interior",
    descripcion: "Acompaña procesos de transición profesional y cambio de rumbo.",
    web: "",
    instagram: "",
    linkedin: "https://example.com",
  },
  {
    nombre: "Diego Herrera",
    pais: "México",
    espacio: "regeneracion-creatividad",
    especialidad: "Músico y docente",
    proyecto: "Taller de Sonido Vivo",
    descripcion: "Talleres de música y creatividad para escuelas y organizaciones.",
    web: "https://example.com",
    instagram: "",
    linkedin: "",
  },
  {
    nombre: "Ana Beltrán",
    pais: "España",
    espacio: "casita-del-arbol",
    especialidad: "Consultora en sostenibilidad",
    proyecto: "Economía Circular Hoy",
    descripcion: "Ayuda a pymes a medir y reducir su huella ambiental.",
    web: "https://example.com",
    instagram: "",
    linkedin: "https://example.com",
  },
  {
    nombre: "Sofía Paredes",
    pais: "Perú",
    espacio: "regeneracion-creatividad",
    especialidad: "Ilustradora",
    proyecto: "Cuadernos de Campo",
    descripcion: "Ilustración botánica y cuadernos para registrar la naturaleza.",
    web: "",
    instagram: "https://example.com",
    linkedin: "",
  },
];

const EN_TEXTOS: Pick<IntegranteDeEjemplo, "pais" | "especialidad" | "proyecto" | "descripcion">[] = [
  { pais: "Argentina", especialidad: "Social psychologist", proyecto: "Listening Circles", descripcion: "Facilitates conversation circles for health and education teams." },
  { pais: "Uruguay", especialidad: "Graphic designer", proyecto: "Estudio Raíz", descripcion: "Visual identity for sustainable projects and triple-impact ventures." },
  { pais: "Chile", especialidad: "Ontological coach", proyecto: "Inner Path", descripcion: "Supports career transitions and changes of direction." },
  { pais: "Mexico", especialidad: "Musician and teacher", proyecto: "Living Sound Workshop", descripcion: "Music and creativity workshops for schools and organizations." },
  { pais: "Spain", especialidad: "Sustainability consultant", proyecto: "Circular Economy Today", descripcion: "Helps small businesses measure and reduce their environmental footprint." },
  { pais: "Peru", especialidad: "Illustrator", proyecto: "Field Notebooks", descripcion: "Botanical illustration and notebooks to record nature." },
];

export const INTEGRANTES_DE_EJEMPLO: Record<Idioma, IntegranteDeEjemplo[]> = {
  es: ES,
  en: ES.map((integrante, i) => ({ ...integrante, ...EN_TEXTOS[i] })),
};
