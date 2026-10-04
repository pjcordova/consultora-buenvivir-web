import { espacios } from "@/content/ecosistema";
import { agendaBelen } from "@/content/enlaces";
import type { Parrafo } from "@/types/content";

// Contenido de Home.
// Todo lo marcado como CONFIRMADO viene de publicaciones reales de Belén (Instagram / sitio Canva).
// Todo lo marcado como PENDIENTE espera respuesta del cuestionario.

export const hero = {
  // PENDIENTE — texto de presentación preliminar (mockup de la nueva Home), a confirmar con Belén
  eyebrow: "Perspectiva sistémica · Cultivo humano",
  title: "Regeneración organizacional y",
  titleAccent: "crecimiento personal",
  body: "Espacio de cultivo, pausa y transformación para equipos y personas guiado por Belén Vera.",
  note: "Texto de presentación preliminar — a confirmar con Belén",
  // PENDIENTE: destinos provisorios hasta que existan las secciones "prácticas" y "filosofía" en la Home
  primaryCta: { label: "Explorar prácticas", href: "/servicios" },
  secondaryCta: { label: "Conocer la filosofía", href: "/sobre-belen" },
  scrollTarget: "#regeneracion",
};

// Sección "Cosmovisión del Buen Vivir" de la Home.
export const cosmovision = {
  eyebrow: "Sabiduría viva · Cosmovisión",
  titulo: "Cosmovisión del Buen Vivir",
  // PENDIENTE: bajada del mockup, a confirmar con Belén
  bajada:
    "Una mirada ancestral y sistémica que comprende la vida humana en permanente diálogo y equilibrio con el entorno vivo.",
  // CONFIRMADO — textos de Belén (publicaciones de Instagram)
  cita: "Una cosmovisión es una manera de comprender cómo funciona la vida y cuál es nuestro lugar dentro de ella.",
  parrafos: [
    [
      "Una cosmovisión reúne ideas y valores. Es en cierto sentido, el mapa profundo desde el cual una cultura interpreta la existencia.",
    ],
    [
      "Cuando estudié esto, lo sentí y me atravesó… no solo estaba tan alineado a mi propósito de vida, se abrió ante mi esta sabiduría y forma de mirar el mundo que le puso palabras a algo que ya venía buscando, practicando y sintiendo.",
    ],
    [
      "Por eso honro esta sabiduría que es la que me guía e inspira en cada paso. ",
      { fuerte: "¿La conocías? ¿Cómo la sientes?" },
    ],
  ] satisfies Parrafo[],
  autor: "— Belén Vera",
  etiqueta: "Sabiduría viva",
  // Las imágenes se suben desde el panel: /images/carrusel/cosmovision-1.jpg … -5.jpg
  carrusel: { total: 5, prefijo: "cosmovision" },

  // CONFIRMADO — título del sitio Canva existente (buenvivir.my.canva.site); era el hero anterior.
  tituloCanva: "Honrando la cosmovisión del Buen Vivir",
  resumen: `El concepto de Sumak Kawsay (quechua) y Suma Qamaña (aymara) no habla de bienestar individual. Habla de vivir en equilibrio con: uno mismo, los demás, la comunidad, la naturaleza y las generaciones futuras.`,
  // CONFIRMADO — encontrado en publicaciones reales
  intro: `Traducido habitualmente como "Buen Vivir", considera a las personas como un elemento de la Pachamama o "Madre Tierra" (madre mundo). El buen vivir moderno, inspirado en la tradición indígena, busca el equilibrio con la naturaleza en la satisfacción de las necesidades ("tomar solo lo necesario", con vocación para perdurar), sobre el crecimiento económico.`,
  principios: [
    { termino: "Tucu Yachay", es: "Sin conocimiento o sabiduría no hay vida" },
    { termino: "Pacha Mama", es: "Todos venimos de la madre tierra" },
    { termino: "hambi kawsay", es: "La vida es sana" },
    { termino: "sumak kamaña", es: "La vida es colectiva" },
    { termino: "Hatun Muskuy", es: "Todos tenemos un ideal o sueño" },
  ],
};

// Sección "Un nuevo paradigma para las organizaciones".
// CONFIRMADO — los textos son palabras de Belén publicadas en Instagram.
// PENDIENTE: etiqueta y bajada vienen del mockup; confirmar con ella (pregunta 12 del cuestionario).
export const regeneracionOrganizacional = {
  eyebrow: "Regeneración organizacional · Enfoque sistémico",
  titulo: "Un nuevo paradigma para las organizaciones",
  bajada:
    "Donde la sostenibilidad no es solo técnica, sino emocional, relacional y profundamente humana.",
  cita: "Las organizaciones no son máquinas, son organismos vivos.",
  parrafos: [
    [
      "Compuestos por personas que tienen sus propios ciclos, de aprendizajes, de vida y de procesos mientras se desarrollan en una empresa u organización. ✨",
    ],
    [
      "Y cuando la reconocemos como tal, surge un nuevo camino: la ",
      { fuerte: "“Regeneración Organizacional”" },
      '. Un proceso innovador que combina management, liderazgo consciente, gestión relacional y escucha profunda para descubrir los "dolores" de la organización, transformar tensiones en aprendizajes y alinear los sueños individuales con los objetivos colectivos.',
    ],
    [
      "Porque el verdadero cambio ocurre cuando ponemos a las personas en el centro, y entendemos que una empresa sana, humana y coherente, es capaz de generar no solo resultados, sino también partir de lo individual a lo colectivo y ecosistémico.",
    ],
  ] satisfies Parrafo[],
  pregunta: "¿Listo para regenerar tu organización desde adentro hacia afuera?",
  cta: { label: "Conversemos", href: "/contacto" },
  // Las imágenes se suben desde el panel: /images/carrusel/paradigma-1.jpg … -7.jpg
  carrusel: { total: 7, prefijo: "paradigma" },
};

export const ecosistema = {
  // CONFIRMADO — nombre y estado de lanzamiento
  // PENDIENTE: nombre definitivo (pregunta 13) — hoy aparece como "Casita del Árbol",
  // "Club de Conversaciones Regenerativas" y "Ecosistema Buen Vivir" en distintas publicaciones
  nombreProvisional: "Ecosistema Buen Vivir",
  estado: "En lanzamiento — primer ciclo comienza en septiembre",

  // Sección "Nuestros Servicios" de la Home (según el mockup).
  eyebrow: "Propuestas y espacios · Ecosistema",
  titulo: "Nuestros Servicios",
  bajada:
    "Espacios vivos de encuentro, aprendizaje y cultivo para personas, comunidades y organizaciones.",
  // PENDIENTE: imágenes reales (foto del bosque y logo del ecosistema)
  panel: {
    foto: "/images/ecosistema-bosque.jpg",
    logo: "/images/logo-ecosistema.png",
  },
  // Los espacios (nombre, imagen y destino) se definen en content/ecosistema.ts
  espacios,
  descripcion: `Un lugar para personas curiosas, profesionales, emprendedoras y agentes de cambio. Una vez al mes nos encontramos virtualmente para escucharnos, aprender, conversar y explorar juntos qué puede emerger cuando ponemos en diálogo distintas experiencias, disciplinas y formas de ver el mundo.`,
  beneficios: [
    { titulo: "Perspectiva", texto: "Acceder a miradas diversas sobre los desafíos del presente y el futuro." },
    { titulo: "Pertenencia", texto: "Formar parte de una comunidad de agentes de cambio que aprende y piensa en conjunto." },
    { titulo: "Posibilidades", texto: "Conocer personas, descubrir ideas y abrir colaboraciones." },
  ],
  // PENDIENTE (pregunta 15): confirmar si siguen vigentes
  extras: ["Directorio de Profesionales del Ecosistema", "Bitácora del Mes", "Diploma de Práctica de Inteligencia Colectiva (cada 6 meses)"],
  // PENDIENTE (pregunta 14): ¿inscripción manual (comentar + DM) o formulario propio en el sitio?
  inscripcion: {
    formularioEs: "https://forms.gle/WZyuefbCwUmVL9ZX9",
    formularioEn: "https://forms.gle/ZWLrTYtRZyHwwFmQ7",
  },
};

// Sección "Linajes de aprendizaje y práctica" (franja con video de fondo).
// PENDIENTE: el video y su foto de respaldo. Opciones conversadas: foto con movimiento
// lento, video propio de Belén o uno con licencia comprada.
export const linajes = {
  eyebrow: "Linajes de aprendizaje y práctica",
  // PENDIENTE: frase escrita por Stitch, a validar con Belén
  statement:
    "Acompañar la transformación de colectivos desde la escucha profunda y los ritmos vivos de los ecosistemas humanos.",
  note: "Espacio reservado para cita o texto conceptual propio de Belén — a validar si se referencia a autores de referencia como Maturana, Scharmer o Senge, o bien una síntesis propia de su abordaje",
  credito: "Video ambiental · Ballena Franca Austral en aguas patagónicas",
  medios: {
    video: "/videos/ballenas.mp4",
    poster: "/images/ballenas.jpg",
  },
};

// Franja para suscribirse a las novedades por correo, antes del cierre. Los
// correos quedan en la lista de Substack de Belén (content/enlaces.ts): el sitio
// no guarda ninguno. Textos editables desde el panel ("Novedades por correo").
export const novedades = {
  eyebrow: "Novedades por correo",
  titulo: "Recibí las novedades de Belén",
  bajada:
    "Talleres, encuentros, escritos y recursos sobre regeneración, directo en tu correo.",
  nota: "Te llegan desde Substack y podés darte de baja cuando quieras.",
  campo: "Tu correo electrónico",
  boton: "Suscribirme",
};

export const ctaFinal = {
  // CONFIRMADO — CTA real y consistente en publicaciones de servicios
  texto: "Reserva tu sesión y coordinamos una conversación inicial.",

  // Sección de cierre de la Home. PENDIENTE: textos del mockup, a validar con Belén.
  titulo: "Iniciar una conversación sobre tu momento organizativo o personal",
  bajada:
    "Cada proceso comienza con una pausa para escuchar qué necesita ser atendido. Conversemos sin compromisos preestablecidos.",
  nota: "Canales de contacto y disponibilidad a confirmar con Belén",
  // Agenda de Google de Belén (editable desde el panel, sección "Cierre")
  principal: { label: "Escribir a Belén", href: agendaBelen },
  secundario: { label: "Revisar los servicios completos", href: "/servicios" },
};
