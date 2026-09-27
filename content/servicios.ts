// CONFIRMADO en su totalidad — textos e imágenes de las publicaciones de Belén.
// Las descripciones vienen de la ficha de cada servicio en su perfil profesional;
// los puntos de "incluye", de los folletos.
// PENDIENTE (preguntas 19, 20, 21): costo y duración de la conversación inicial.

export type Oferta = {
  slug: string;
  titulo: string;
  /** Folleto del servicio, en public/images/servicios/. */
  imagen: string;
  /** Presentación corta, la que abre la tarjeta. */
  descripcion: string;
  /** A quién está dirigido. */
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
        slug: "regeneracion-de-equipos",
        titulo: "Regeneración de Equipos",
        imagen: "/images/servicios/regeneracion-equipos.jpg",
        descripcion:
          "Los equipos evolucionan y cambian como las personas que los integran: son un sistema complejo en contextos cambiantes y exigidos. Navegar esa complejidad de forma regenerativa ayuda a atravesar transiciones, tensiones y revitalizar el equipo. Crear un espacio seguro para escucharse mejor, reconstruir vínculos y hacer sentido, para crear nuevas maneras con claridad y bienestar laboral y vincular.",
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
        slug: "liderazgo-regenerativo",
        titulo: "Liderazgo Regenerativo",
        imagen: "/images/servicios/liderazgo-regenerativo.jpg",
        descripcion:
          "Si sentís que este contexto te exige y necesitás evolucionar tu manera de liderar, con mayor presencia, estrategia y sentido.",
        paraQuien:
          "Para líderes, mandos medios, gerencias y jefes que buscan evolucionar su forma de liderar en contextos exigentes y cambiantes.",
        incluye: [
          "Desarrollar estilos de liderazgo más conscientes, efectivos, coherentes y resilientes",
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
        slug: "regeneracion-para-emprendedores",
        titulo: "Regeneración para Emprendedores",
        imagen: "/images/servicios/regeneracion-emprendedores.jpg",
        descripcion:
          "Un espacio de desarrollo integral para emprendedores que desean proyectos con sentido, claridad estratégica y coherencia personal, con mayor equilibrio y sostenibilidad en el tiempo.",
        paraQuien:
          "Para quienes quieren impulsar su emprendimiento desde un enfoque más consciente e integral.",
        incluye: [
          "Ikigai: claridad de propósito y dirección de tu proyecto",
          "Gestión consciente del tiempo, energía y prioridades",
          "Mapa de actores, procesos y organización estratégica",
          "Comunicación regenerativa y vínculos colaborativos",
          "Patrones de creatividad, ritmo y polaridad",
          "Introducción al management consciente",
        ],
      },
      {
        slug: "introduccion-a-la-teoria-u",
        titulo: "Introducción a la Teoría U",
        imagen: "/images/servicios/teoria-u.jpg",
        descripcion:
          "Una experiencia para desarrollar mayor claridad, profundidad y capacidad de transformación en la vida personal y profesional, creando nuevas posibilidades desde el futuro emergente. Para aprender una escucha activa y una comunicación más auténtica, y nuevas formas de percibir y actuar en contextos complejos.",
        paraQuien:
          "Orientado a líderes, docentes, coaches, directivos, mandos medios, comunicadores y asesores, o de manera personal.",
        incluye: [
          "Conectar con la más preciada tecnología humana: el poder de la conversación y los 4 niveles de escucha",
          "Reconocer el entendimiento intuitivo",
          "Del cambio sistémico a la transformación interior",
          "De los sistemas de control a los sistemas vivos",
          "Volver a crear desde un nuevo nivel de consciencia",
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
        slug: "regeneracion-personal",
        titulo: "Regeneración Personal",
        imagen: "/images/servicios/regeneracion-personal-flyer.jpg",
        descripcion:
          "Un espacio cuidado de escucha, reflexión y acción consciente: nutrir tu esencia y comprender tu momento presente para sembrar los cambios que necesitás para tu bienestar y acercarte a tus objetivos. Descubrir tu potencial y reencontrarte.",
        paraQuien:
          "Un espacio uno a uno para personas que desean reconectar con su sentido, su ritmo y su coherencia interna.",
        incluye: [
          "Pensamiento sistémico para reconocer patrones y comprender lo que estás viviendo",
          "Teoría U para aprender a pausar, observar y crear desde nuevas posibilidades",
          "Florecimiento personal: reconectar con propósito, sentido y dirección",
        ],
      },
      {
        slug: "creatividad-y-regeneracion",
        titulo: "Creatividad y Regeneración",
        imagen: "/images/servicios/creatividad-regeneracion.jpg",
        descripcion:
          "Un proceso de autoconocimiento que integra el libro El Camino del Artista, de Julia Cameron, nutrido con regeneración personal, pensamiento sistémico y Teoría U. Para quienes sienten el llamado a conocerse profundamente y recuperar su vitalidad.",
        paraQuien:
          "Para quienes quieren revitalizar su creatividad en la vida cotidiana y descubrir su forma de vivir más auténtica.",
        incluye: [
          "Despertar tu creatividad como fuerza de vida cotidiana",
          "Reconectar con tu esencia y autenticidad",
          "Liberar bloqueos y acercarte a tu niño interior",
          "Crear nuevas posibilidades desde tu propósito",
        ],
      },
      {
        slug: "para-profesionales-diversos",
        titulo: "Para Profesionales diversos",
        imagen: "/images/servicios/profesionales-diversos.jpg",
        descripcion:
          "Te acompaño a nutrir tu trabajo y regenerarte: una transformación para volver a vos, alinearte, volver a tu ritmo saludable y recuperar vitalidad. También para procesos de transición laboral.",
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

// Encabezado de la página (según el estilo de la Home)
export const paginaServicios = {
  eyebrow: "Acompañamientos · Procesos regenerativos",
  titulo: "Servicios",
  bajada:
    "Tres caminos de acompañamiento para equipos, proyectos y personas, según el momento que estés atravesando.",
};

// CONFIRMADO — CTA real
export const ctaServicios = "Reserva tu sesión y coordinamos una conversación inicial.";

// PENDIENTE (preguntas 19, 20, 21): costo/duración de la conversación inicial, tiempo de respuesta
export const conversacionInicial = {
  costo: null as string | null,
  duracionMinutos: null as number | null,
  tiempoRespuesta: null as string | null,
};
