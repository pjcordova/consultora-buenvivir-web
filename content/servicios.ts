// CONFIRMADO en su totalidad — encontrado en publicaciones reales de Instagram.
// PENDIENTE (pregunta 17 del cuestionario): confirmar que esta estructura sigue vigente
// y si hay alguna oferta nueva que todavía no vimos.

export type Oferta = {
  titulo: string;
  paraQuien: string;
  incluye: string[];
};

export type Camino = {
  emoji: string;
  titulo: string;
  descripcion: string;
  ofertas: Oferta[];
};

export const caminos: Camino[] = [
  {
    emoji: "🌿",
    titulo: "Revitaliza tu Equipo",
    descripcion:
      "Procesos de regeneración para equipos que necesitan recomponer comunicación, confianza y dirección compartida.",
    ofertas: [
      {
        titulo: "Regeneración de Equipos",
        paraQuien:
          "Para desarrollar capacidad de aprendizaje colectivo, manejo de tensiones, toma de decisiones y coherencia cultural en contextos complejos, cambiantes y exigentes.",
        incluye: [
          "Mejorar vínculos y comunicación",
          "Fortalecer liderazgo consciente",
          "Mejorar la toma de decisiones",
          "Acercar y nutrir la brecha generacional",
          "Alinear propósito, personas y resultados",
        ],
      },
      {
        titulo: "Liderazgo Regenerativo",
        paraQuien:
          "Para líderes, mandos medios, gerencias y jefes que buscan evolucionar su forma de liderar en contextos exigentes y cambiantes.",
        incluye: [
          "Desarrollar estilos de liderazgo más conscientes y efectivos",
          "Fortalecer la comunicación y gestión de personas",
          "Incorporar pensamiento sistémico y marcos innovadores de gestión",
        ],
      },
    ],
  },
  {
    emoji: "🧭",
    titulo: "Revitaliza tu Trabajo",
    descripcion:
      "Para emprendedores, líderes y profesionales que buscan nuevas formas de liderar, organizar su trabajo y tomar decisiones en contextos complejos.",
    ofertas: [
      {
        titulo: "Regeneración para Emprendedores",
        paraQuien:
          "Un acompañamiento para crear proyectos más alineados con tu esencia, con mayor claridad, equilibrio y sostenibilidad en el tiempo.",
        incluye: [
          "Ikigai: claridad de propósito y dirección del proyecto",
          "Gestión consciente del tiempo, energía y prioridades",
          "Mapa de actores, procesos y organización estratégica",
          "Comunicación regenerativa y vínculos colaborativos",
          "Patrones de creatividad, ritmo y polaridad",
          "Introducción al management consciente",
        ],
      },
      {
        titulo: "Introducción a la Teoría U",
        paraQuien:
          "Para quienes desean desarrollar mayor claridad, profundidad y capacidad de transformación en su vida personal y profesional.",
        incluye: [
          "Conectar con el poder de la conversación y los 4 niveles de escucha",
          "Reconocer el entendimiento intuitivo",
          "Del cambio sistémico a la transformación interior",
          "De los sistemas de control a los sistemas vivos",
        ],
      },
    ],
  },
  {
    emoji: "✨",
    titulo: "Revitaliza tu Vida",
    descripcion:
      "Espacios individuales para momentos de transición, búsqueda o reconexión con propósito, creatividad y coherencia personal.",
    ofertas: [
      {
        titulo: "Regeneración Personal",
        paraQuien:
          "Un espacio uno a uno para personas que desean reconectar con su sentido, su ritmo y su coherencia interna.",
        incluye: [
          "Pensamiento sistémico para reconocer patrones",
          "Teoría U para aprender a pausar, observar y crear desde nuevas posibilidades",
          "Florecimiento personal: reconectar con propósito, sentido y dirección",
        ],
      },
      {
        titulo: "Creatividad y Regeneración",
        paraQuien:
          "Un proceso de autoconocimiento que integra el libro El Camino del Artista de Julia Cameron.",
        incluye: [
          "Despertar tu creatividad como fuerza de vida cotidiana",
          "Reconectar con tu esencia y autenticidad",
          "Liberar bloqueos y acercarte a tu niño interior",
          "Crear nuevas posibilidades desde tu propósito",
        ],
      },
      {
        titulo: "Para Profesionales diversos",
        paraQuien:
          "Sesiones personalizadas si estás atravesando estrés laboral, burnout, una transición profesional o necesitás redireccionar tu camino.",
        incluye: [
          "Ordenar lo que estás viviendo y tu experiencia",
          "Reconectar con tu propósito, creatividad y motivación",
          "Recuperar tus ritmos, energía y bienestar personal",
          "Tomar decisiones con mayor claridad y coherencia",
        ],
      },
    ],
  },
];

// CONFIRMADO — CTA real
export const ctaServicios = "Reserva tu sesión y coordinamos una conversación inicial.";

// PENDIENTE (preguntas 19, 20, 21): costo/duración de la conversación inicial, tiempo de respuesta
export const conversacionInicial = {
  costo: null as string | null, // "Gratuita" | "Con costo: $X" — pendiente
  duracionMinutos: null as number | null, // pendiente
  tiempoRespuesta: null as string | null, // pendiente
};
