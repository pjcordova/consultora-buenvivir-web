import type { Parrafo } from "@/types/content";

// CONFIRMADO — texto escrito por Belén (se corrigieron solo tres erratas:
// "cree" → "creé", "observa" → "observar" y un punto final faltante).
export const belen = {
  eyebrow: "Sobre Belén · Su historia",
  saludo: "Hola, soy Belén Vera",
  rol: "Facilitadora en Regeneración Organizacional y Personal",
  foto: "/images/belen.jpg",
  cita: "Las organizaciones no son máquinas, son organismos vivos.",
  citaTexto:
    "Compuestos por personas que tienen sus propios ciclos, de aprendizajes, de vida y de procesos mientras se desarrollan en una empresa u organización.",

  // CONFIRMADO — titulares de su perfil profesional
  titulos: [
    "Community Enabler",
    "Facilitadora de Transformación Organizacional",
    "Regenerative Facilitator",
    "Systems Thinking",
    "Theory U",
    "Collective Intelligence",
    "Teamwork",
  ],

  presentacion: [
    [
      "Oriunda de Deán Funes, la Perla del Norte cordobés, chuncana y soñadora desde chica, cuando a mis 12 años inicié mi primer grupo ecológico con mis amigos.",
    ],
    [
      "La vida no fue una línea recta para mí. Fue más bien un sendero con curvas, pausas, desvíos y nuevos comienzos. Viví 13 años en Córdoba Capital y ahora vivo en Freyre desde hace 12 años.",
    ],
  ] satisfies Parrafo[],

  caminoTitulo: "Mi camino",
  camino: [
    [
      "Mirando hacia atrás, cada etapa —cada búsqueda, cada intento, cada emprendimiento— fue una preparación silenciosa. Como si algo más grande estuviera ordenando las piezas, sembrando aprendizajes para que hoy la regeneración florezca en mí con sentido.",
    ],
    [
      "Mi camino comenzó desde muy joven en el voluntariado ",
      { fuerte: "La Sachetera Córdoba" },
      ", donde confeccionábamos bolsas de dormir para gente en situación de calle a partir de sachets de leche termosellados, y después con la educación ambiental con ecoladrillos. Todo impulsado por una profunda curiosidad por comprender los sistemas humanos, el aprendizaje colectivo y la transformación consciente.",
    ],
    [
      "En Freyre creé el primer grupo voluntario de educación ambiental, con gente maravillosa. Ese recorrido me llevó a crear la ",
      { fuerte: "Consultora Buen Vivir" },
      " y, posteriormente, a descubrir la regeneración organizacional como un enfoque que integró mi historia, mi propósito y mi práctica profesional.",
    ],
    [
      "Hoy estoy lista para mostrarles los servicios en los que vengo trabajando como facilitadora de procesos de Regeneración Organizacional y Personal, acompañando a personas, líderes, equipos y organizaciones en momentos de cambio, transición y evolución cultural.",
    ],
  ] satisfies Parrafo[],

  enfoqueTitulo: "Mi enfoque",
  enfoqueCita:
    "Creo en la regeneración como una práctica que emerge cuando aprendemos a observar nuestros sistemas, poniendo a la vida en el centro, sosteniendo procesos de cambio y construyendo futuro desde el significado compartido.",
  enfoque: [
    [
      "Del pensamiento sistémico aprendí que hacer foco en las personas es cuidar el ambiente más próximo, es cuidar nuestra salud mental, física y emocional en la vida diaria, incluyendo la función que cumplimos en nuestros trabajos; buscando el bienestar personal y laboral para potenciar las organizaciones… y desde ahí al ecosistema.",
    ],
    [
      "Mi enfoque busca fortalecer la coherencia, la capacidad adaptativa y la creación de culturas organizacionales más conscientes, humanas y vivas.",
    ],
  ] satisfies Parrafo[],

  // Ecoproyectos Freyre: su grupo voluntario de educación ambiental (10 años).
  // Tarjeta con carrusel dentro de "Mi camino", debajo del párrafo que nombra
  // Freyre; las fotos (lugares freyre-1 a
  // freyre-8) y sus leyendas las carga Belén desde el panel, en Sobre Belén.
  freyreTitulo: "Ecoproyectos Freyre",
  freyreTexto:
    "El primer grupo voluntario de educación ambiental de Freyre: 10 años uniendo sociedad civil, escuelas y organismos públicos.",
  freyreEnlace: {
    label: "Ver más en Facebook",
    href: "https://www.facebook.com/profile.php?id=100063968382795",
  },

  // CONFIRMADO por Belén. Se ve al final de "Mi camino". La formación ahora es
  // una lista del panel (con enlace e imagen del certificado): estos renglones
  // son con lo que arranca esa lista si nunca se guardó.
  formacionTitulo: "Formación",
  formacion: ["Facilitación en Regeneración Organizacional", "Teoría U"],
};
