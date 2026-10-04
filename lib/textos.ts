import type { Idioma } from "@/lib/idioma";

/**
 * Textos fijos de la interfaz (menú, botones, avisos, títulos de pestaña), en
 * los dos idiomas. Los textos que edita Belén no van acá: viven en content/ y
 * se cambian desde el panel.
 *
 * Lo pueden usar también los componentes del navegador (no depende del servidor).
 */
const ESPANOL = {
  sitio: {
    titulo: "Buen Vivir — Consultora Regenerativa",
    descripcion:
      "Acompañamos a organizaciones, equipos y personas en procesos de regeneración organizacional, inspirados en la cosmovisión del Buen Vivir.",
    logoAlt: "Buen Vivir — consultora regenerativa",
  },
  menu: {
    servicios: "Servicios",
    sobreBelen: "Sobre Belén",
    contacto: "Contacto",
    abrir: "Abrir menú",
    cerrar: "Cerrar menú",
    idioma: "Idioma",
    panel: "Ingresar al panel",
  },
  portada: { descender: "Descender" },
  carrusel: {
    tipo: "carrusel",
    anterior: "Imagen anterior",
    siguiente: "Imagen siguiente",
    irA: (n: number) => `Ir a la imagen ${n}`,
    posicion: (n: number, total: number) => `${n} de ${total}`,
    pendiente: (n: number, total: number) => `Imagen ${n} de ${total} — pendiente`,
  },
  imagenPendiente: "Imagen pendiente",
  fotoBosquePendiente: "Foto del bosque — pendiente",
  inicio: {
    carruselParadigma: "Publicaciones sobre regeneración organizacional",
    publicacionParadigma: (n: number) => `Publicación ${n} sobre regeneración organizacional`,
    carruselCosmovision: "Publicaciones sobre la cosmovisión del Buen Vivir",
    publicacionCosmovision: (n: number) => `Publicación ${n} sobre la cosmovisión del Buen Vivir`,
  },
  servicios: {
    titulo: "Servicios | Buen Vivir",
    descripcion:
      "Tres caminos de acompañamiento regenerativo: Revitaliza tu Equipo, Revitaliza tu Trabajo y Revitaliza tu Vida.",
    folleto: (servicio: string) => `Folleto de ${servicio}`,
    reservar: "Reservar mi sesión",
    cierreTitulo: "¿Empezamos?",
    verEspacios: "Ver los espacios del Ecosistema",
  },
  sobreBelen: {
    titulo: "Sobre Belén | Buen Vivir",
    descripcion:
      "Belén Vera, facilitadora de procesos de Regeneración Organizacional y Personal: su camino desde el voluntariado ambiental hasta la Consultora Buen Vivir.",
    fotoAlt: "Belén Vera, facilitadora en Regeneración Organizacional y Personal",
    fotoPendiente: "Foto pendiente",
    cierreTitulo: "¿Conversamos?",
    verServicios: "Ver los servicios",
  },
  espacio: {
    volver: "Volver a los espacios",
    queSeLleva: "Qué se lleva quien participa",
    ademas: "Además incluye",
    verTodos: "Ver todos los espacios",
    video: (espacio: string) => `Video de ${espacio}`,
    verEnYoutube: "Verlo en YouTube",
  },
  contacto: {
    titulo: "Contacto | Buen Vivir",
    descripcion:
      "Agendá una conversación con Belén Vera, escribile por WhatsApp o sumate al Ecosistema Buen Vivir.",
    agendaTitulo: "Agenda de Belén Vera para reservar una conversación",
    noSeVe: "¿No se ve la agenda?",
    abrirAparte: "Abrila en otra pestaña",
    porCorreo: "O escribile por correo:",
  },
  pie: {
    derechos: "Todos los derechos reservados.",
    preguntas: "Preguntas frecuentes",
    pendiente: "Pendiente de confirmar",
  },
  redes: {
    sinEnlace: (red: string) => `${red} — pendiente de enlace`,
    faltaEnlace: "Pendiente: falta el enlace",
  },
  whatsapp: {
    escribir: (numero: string) => `Escribir por WhatsApp a ${numero}`,
    ayuda: "Solicitar una asesoría por WhatsApp",
  },
  testimonios: {
    etiqueta: "Testimonios · Voces del camino",
    titulo: "Lo que cuentan quienes transitaron el proceso",
  },
  preguntas: {
    etiqueta: "Preguntas frecuentes",
    titulo: "Lo que suelen preguntar",
    bajada: "Las dudas más comunes antes de empezar un proceso con Belén.",
    otraDuda: "¿Te quedó otra duda?",
    escribir: "Escribile por WhatsApp",
    ejemplo:
      "Vista de ejemplo: solo se ve en tu computadora. Las preguntas y respuestas reales las carga Belén desde el panel.",
  },
  talleres: {
    etiqueta: "Agenda · Próximos encuentros",
    titulo: "Próximos talleres y encuentros",
    bajada: "Espacios para encontrarnos, aprender y practicar en comunidad.",
    /** Para escribir las fechas ("jueves 15 de octubre"). */
    formatoFecha: "es-AR",
    horaArgentina: "hora de Argentina",
    inscribirme: "Inscribirme",
  },
  noEncontrada: {
    titulo: "Página no encontrada | Buen Vivir",
    etiqueta: "Error 404",
    encabezado: "Esta página no existe",
    texto:
      "Puede que el enlace esté mal escrito o que la página se haya movido. Te dejamos algunos caminos para seguir.",
    inicio: "Volver al inicio",
    servicios: "Ver los servicios",
    escribir: "Escribirnos",
  },
};

export type Textos = typeof ESPANOL;

const INGLES: Textos = {
  sitio: {
    titulo: "Buen Vivir — Regenerative Consultancy",
    descripcion:
      "We accompany organizations, teams and people through processes of organizational regeneration, inspired by the Buen Vivir worldview.",
    logoAlt: "Buen Vivir — regenerative consultancy",
  },
  menu: {
    servicios: "Services",
    sobreBelen: "About Belén",
    contacto: "Contact",
    abrir: "Open menu",
    cerrar: "Close menu",
    idioma: "Language",
    panel: "Admin login",
  },
  portada: { descender: "Scroll down" },
  carrusel: {
    tipo: "carousel",
    anterior: "Previous image",
    siguiente: "Next image",
    irA: (n: number) => `Go to image ${n}`,
    posicion: (n: number, total: number) => `${n} of ${total}`,
    pendiente: (n: number, total: number) => `Image ${n} of ${total} — pending`,
  },
  imagenPendiente: "Image pending",
  fotoBosquePendiente: "Forest photo — pending",
  inicio: {
    carruselParadigma: "Posts about organizational regeneration",
    publicacionParadigma: (n: number) => `Post ${n} about organizational regeneration`,
    carruselCosmovision: "Posts about the Buen Vivir worldview",
    publicacionCosmovision: (n: number) => `Post ${n} about the Buen Vivir worldview`,
  },
  servicios: {
    titulo: "Services | Buen Vivir",
    descripcion:
      "Three paths of regenerative accompaniment: Revitalize your Team, Revitalize your Work and Revitalize your Life.",
    folleto: (servicio: string) => `Flyer for ${servicio}`,
    reservar: "Book my session",
    cierreTitulo: "Shall we begin?",
    verEspacios: "See the Ecosystem spaces",
  },
  sobreBelen: {
    titulo: "About Belén | Buen Vivir",
    descripcion:
      "Belén Vera, facilitator of Organizational and Personal Regeneration processes: her path from environmental volunteering to Consultora Buen Vivir.",
    fotoAlt: "Belén Vera, facilitator of Organizational and Personal Regeneration",
    fotoPendiente: "Photo pending",
    cierreTitulo: "Shall we talk?",
    verServicios: "See the services",
  },
  espacio: {
    volver: "Back to the spaces",
    queSeLleva: "What participants take away",
    ademas: "Also included",
    verTodos: "See all spaces",
    video: (espacio: string) => `${espacio} video`,
    verEnYoutube: "Watch on YouTube",
  },
  contacto: {
    titulo: "Contact | Buen Vivir",
    descripcion:
      "Book a conversation with Belén Vera, message her on WhatsApp or join the Buen Vivir Ecosystem.",
    agendaTitulo: "Belén Vera's calendar to book a conversation",
    noSeVe: "Can't see the calendar?",
    abrirAparte: "Open it in a new tab",
    porCorreo: "Or send her an email:",
  },
  pie: {
    derechos: "All rights reserved.",
    preguntas: "FAQ",
    pendiente: "To be confirmed",
  },
  redes: {
    sinEnlace: (red: string) => `${red} — link pending`,
    faltaEnlace: "Pending: link missing",
  },
  whatsapp: {
    escribir: (numero: string) => `Message ${numero} on WhatsApp`,
    ayuda: "Request a consultation on WhatsApp",
  },
  testimonios: {
    etiqueta: "Testimonials · Voices along the way",
    titulo: "What people say about the process",
  },
  preguntas: {
    etiqueta: "Frequently asked questions",
    titulo: "What people usually ask",
    bajada: "The most common questions before starting a process with Belén.",
    otraDuda: "Still have a question?",
    escribir: "Message her on WhatsApp",
    ejemplo:
      "Sample view: only visible on your computer. Belén adds the real questions and answers from the panel.",
  },
  talleres: {
    etiqueta: "Agenda · Upcoming gatherings",
    titulo: "Upcoming workshops and gatherings",
    bajada: "Spaces to meet, learn and practice together.",
    formatoFecha: "en-US",
    horaArgentina: "Argentina time",
    inscribirme: "Sign up",
  },
  noEncontrada: {
    titulo: "Page not found | Buen Vivir",
    etiqueta: "Error 404",
    encabezado: "This page doesn't exist",
    texto:
      "The link may be mistyped or the page may have moved. Here are a few ways to continue.",
    inicio: "Back to home",
    servicios: "See the services",
    escribir: "Write to us",
  },
};

const TEXTOS: Record<Idioma, Textos> = { es: ESPANOL, en: INGLES };

export const textosDe = (idioma: Idioma): Textos => TEXTOS[idioma];
