import {
  formularioComunidad,
  preinscripcionCreatividad,
  preinscripcionRegeneracionPersonal,
} from "@/content/enlaces";
import type { Parrafo } from "@/types/content";

/**
 * Espacios del Ecosistema Buen Vivir.
 * Los mismos datos alimentan los círculos de la Home y la página de cada espacio.
 */
export type Espacio = {
  slug: string;
  /** Nombre corto, el que se ve en el círculo de la Home. */
  nombre: string;
  /** Leyenda sobre el círculo ("Próximamente"). */
  estadoCorto?: string;
  imagen: string;
  /** "sello": insignia con fondo propio. "foto": imagen de fondo con el texto encima. */
  estilo: "sello" | "foto";
  /** Imagen que asoma al costado del círculo (tapa del libro). */
  adorno?: string;
  /** Texto del botón del círculo. */
  cta: { label: string; href: string };
  /** Flechita hacia abajo en el botón (el espacio que ya está empezando). */
  flecha?: boolean;

  // --- Página del espacio ---
  titulo: string;
  estado: string;
  resumen: string;
  parrafos: Parrafo[];
  /** Qué se lleva quien participa. Sin texto, el ítem se muestra en una lista simple. */
  incluye?: { titulo: string; texto?: string }[];
  /** Lo que suma el espacio además de los encuentros. */
  extras?: string[];
  /** Enlace de YouTube: el video se ve al costado del texto de la página. */
  video?: string;
  ctaPagina: { titulo: string; bajada: string; principal: { label: string; href: string } };
};

export const espacios: Espacio[] = [
  {
    slug: "casita-del-arbol",
    nombre: "Casita del Árbol",
    imagen: "/images/servicios/casita-del-arbol.png",
    estilo: "sello",
    cta: { label: "Iniciando…", href: "/ecosistema/casita-del-arbol" },
    flecha: true,

    titulo: "Casita del Árbol",
    // CONFIRMADO — textos que Belén cargó en el panel (2026-10-03)
    estado: "En lanzamiento.",
    resumen:
      "Una comunidad internacional de aprendizaje, para regenerarnos, para afrontar la complejidad de nuestro tiempo. A través de la práctica de inteligencia colectiva.",
    parrafos: [
      [
        "Una vez al mes nos encontramos virtualmente para escucharnos, aprender, conversar y explorar juntos qué puede emerger cuando ponemos en diálogo distintas experiencias, disciplinas y formas de ver el mundo.",
      ],
      [
        "Para desarrollar capacidades como: Pensamiento sistémico, Liderazgo regenerativo, Bienestar integral, Colaboración, Innovación social, Escucha profunda, Comunicación integral, Desarrollo personal y profesional.",
      ],
    ],
    // CONFIRMADO — beneficios publicados
    incluye: [
      {
        titulo: "Perspectiva",
        texto: "Acceder a miradas diversas sobre los desafíos del presente y el futuro.",
      },
      {
        titulo: "Pertenencia",
        texto:
          "Formar parte de una comunidad de agentes de cambio que aprende y piensa en conjunto.",
      },
      {
        titulo: "Posibilidades",
        texto: "Conocer personas, descubrir ideas y abrir colaboraciones.",
      },
    ],
    // CONFIRMADO en el panel (2026-10-03)
    extras: [
      "Participación en Directorio de Profesionales del Ecosistema",
      "Bitácora del Mes con material adicional.",
      "Diploma de Práctica de Inteligencia Colectiva (cada 6 meses)",
    ],
    // "ECOSISTEMA Buen Vivir - primera sesión", del canal de la consultora.
    // Arranca desde el principio (pedido de Belén).
    video: "https://www.youtube.com/watch?v=qY4Bm8UWjOU",
    ctaPagina: {
      titulo: "¿Te gustaría sumarte al próximo encuentro?",
      bajada: "Completá el formulario y Belén te escribe para entrar al primer ciclo.",
      // Formulario de inscripción a la comunidad (Google Forms)
      principal: { label: "Quiero sumarme", href: formularioComunidad },
    },
  },
  {
    slug: "regeneracion-personal",
    nombre: "Grupo de Regeneración Personal",
    estadoCorto: "Próximamente",
    imagen: "/images/servicios/regeneracion-personal.jpg",
    estilo: "foto",
    cta: { label: "+ info", href: "/ecosistema/regeneracion-personal" },

    titulo: "Grupo de Regeneración Personal",
    estado: "Próximamente",
    resumen:
      "Un espacio grupal para reconectar con el propio sentido, el ritmo y la coherencia interna.",
    // CONFIRMADO — textos que Belén cargó en el panel (2026-10-03)
    parrafos: [
      [
        "Un espacio cuidado de escucha, reflexión y acción consciente, para nutrir tu esencia y comprender tu momento presente, sembrar los cambios que necesitas para tu bienestar y acercarte a tus objetivos. Descubrir tu potencial y reencontrarte.",
      ],
      [
        "Vas a aprender a incorporar a tu vida el pensamiento sistémico para reconocer patrones, Teoría U para pausar y observar, comunicarte mejor y alcanzar tu florecimiento personal para reconectar con tu propósito y dirección.",
      ],
    ],
    // Belén pidió un botón a su formulario de pre-inscripción
    ctaPagina: {
      titulo: "Ya puedes pre-inscribirte",
      bajada:
        "Completa el formulario de pre-inscripción y Belén te avisa cuándo comienza el primer ciclo.",
      principal: { label: "Pre-inscribirme", href: preinscripcionRegeneracionPersonal },
    },
  },
  {
    slug: "regeneracion-creatividad",
    nombre: "Grupo de Regeneración y Creatividad",
    estadoCorto: "Próximamente",
    imagen: "/images/servicios/regeneracion-creatividad.jpg",
    estilo: "foto",
    // PENDIENTE: la tapa de "El Camino del Artista" es material de terceros, confirmar si se usa
    adorno: "/images/el-camino-del-artista.jpg",
    cta: { label: "+ info", href: "/ecosistema/regeneracion-creatividad" },

    titulo: "Grupo de Regeneración y Creatividad",
    estado: "Próximamente",
    // CONFIRMADO — los textos que Belén cargó para el servicio "Creatividad y
    // Regeneración" en la página de Servicios (2026-10-03), que es este mismo grupo
    resumen:
      "Un proceso de autoconocimiento que integra el libro El Camino del Artista, de Julia Cameron, nutrido con regeneración personal, pensamiento sistémico y Teoría U.",
    parrafos: [
      [
        "Para quienes sienten el llamado a conocerse profundamente y recuperar su vitalidad. Para quienes quieren revitalizar su creatividad en la vida cotidiana y descubrir su forma de vivir más auténtica.",
      ],
    ],
    // Sin descripción: se muestran como lista
    incluye: [
      { titulo: "Despertar tu creatividad como fuerza de vida cotidiana" },
      { titulo: "Reconectar con tu esencia y autenticidad" },
      { titulo: "Liberar bloqueos y acercarte a tu niño interior" },
      { titulo: "Crear nuevas posibilidades desde tu propósito" },
    ],
    ctaPagina: {
      titulo: "Ya puedes pre-inscribirte",
      bajada:
        "Completa el formulario de pre-inscripción y Belén te avisa cuándo comienza el primer ciclo.",
      principal: { label: "Pre-inscribirme", href: preinscripcionCreatividad },
    },
  },
];
