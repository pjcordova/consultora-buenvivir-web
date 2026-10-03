import { formularioComunidad } from "@/content/enlaces";
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
  /** Qué se lleva quien participa. */
  incluye?: { titulo: string; texto: string }[];
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
    // CONFIRMADO — estado de lanzamiento
    estado: "En lanzamiento — primer ciclo comienza en septiembre",
    // CONFIRMADO como texto de Belén, PENDIENTE (pregunta 13): confirmar que describe
    // a este espacio y no al Ecosistema en general (hoy aparece con tres nombres distintos).
    resumen:
      "Un lugar para personas curiosas, profesionales, emprendedoras y agentes de cambio.",
    parrafos: [
      [
        "Una vez al mes nos encontramos virtualmente para escucharnos, aprender, conversar y explorar juntos qué puede emerger cuando ponemos en diálogo distintas experiencias, disciplinas y formas de ver el mundo.",
      ],
      [
        "[PENDIENTE — sumar acá cómo se desarrolla un encuentro, duración, día y modalidad, según lo que confirme Belén]",
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
    // PENDIENTE (pregunta 15): confirmar si siguen vigentes
    extras: [
      "Directorio de Profesionales del Ecosistema",
      "Bitácora del Mes",
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
    parrafos: [
      [
        "[PENDIENTE — contenido a definir con Belén: en qué se diferencia del proceso individual de Regeneración Personal, cuántos encuentros son, para quién es y cómo se inscribe]",
      ],
      [
        "Mientras tanto, el trabajo individual de Regeneración Personal ya está disponible: pensamiento sistémico para reconocer patrones, Teoría U para pausar y observar, y florecimiento personal para reconectar con propósito y dirección.",
      ],
    ],
    ctaPagina: {
      titulo: "¿Querés avisos cuando abra el grupo?",
      bajada: "Escribile a Belén y te cuenta cuándo comienza el primer ciclo.",
      principal: { label: "Avisame cuando abra", href: "/contacto" },
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
    resumen:
      "Un proceso de autoconocimiento que integra el libro El Camino del Artista, de Julia Cameron.",
    parrafos: [
      [
        "[PENDIENTE — contenido a definir con Belén: cantidad de encuentros, ritmo de lectura del libro, materiales y forma de inscripción]",
      ],
      [
        "El proceso propone despertar la creatividad como fuerza de vida cotidiana, reconectar con la propia esencia, liberar bloqueos y crear nuevas posibilidades desde el propósito.",
      ],
    ],
    ctaPagina: {
      titulo: "¿Querés avisos cuando abra el grupo?",
      bajada: "Escribile a Belén y te cuenta cuándo comienza el primer ciclo.",
      principal: { label: "Avisame cuando abra", href: "/contacto" },
    },
  },
];
