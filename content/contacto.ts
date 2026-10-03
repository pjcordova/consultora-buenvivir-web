import { formularioComunidad } from "@/content/enlaces";
import { footer } from "@/content/site";

/**
 * Página de Contacto. Las tres vías son las reales y confirmadas:
 * la agenda de Google de Belén, su WhatsApp y el formulario de la comunidad.
 */
export const contacto = {
  eyebrow: "Contacto · Conversemos",
  titulo: "¿Conversamos?",
  // CONFIRMADO — CTA que Belén usa en sus publicaciones
  bajada: "Reserva tu sesión y coordinamos una conversación inicial.",
  // PENDIENTE (preguntas 1, 2, 30 y 31): correo, horarios y tiempo de respuesta
  nota: "Correo y horarios de atención a confirmar con Belén",

  vias: [
    {
      id: "agenda",
      icono: "calendario" as const,
      titulo: "Agendá una conversación",
      texto:
        "Elegí el día y la hora que mejor te queden en la agenda de Belén, y coordinan el primer encuentro sin compromisos.",
      // Baja hasta la agenda, que está en la misma página
      cta: { label: "Ver horarios disponibles", href: "#agenda" },
      destacada: true,
    },
    {
      id: "whatsapp",
      icono: "whatsapp" as const,
      titulo: "Escribile por WhatsApp",
      texto:
        "Contale en qué momento estás y qué necesitás. Es la vía más directa si preferís una charla antes de agendar.",
      cta: { label: "Abrir WhatsApp", href: "" }, // se completa con el número del panel
      destacada: false,
    },
    {
      id: "comunidad",
      icono: "comunidad" as const,
      titulo: "Sumate a la comunidad",
      texto:
        "El Ecosistema Buen Vivir se encuentra una vez al mes para escucharse, aprender y explorar juntos qué puede emerger.",
      cta: { label: "Completar el formulario", href: formularioComunidad },
      destacada: false,
    },
  ],

  agendaTitulo: "Elegí día y horario",
  agendaTexto:
    "Estos son los horarios libres de Belén. Elegí el que mejor te quede y completá tus datos para reservar la conversación inicial.",

  redesTitulo: "También podés seguirla acá",
  redesTexto: footer.contacto.intro,
  ubicacion: footer.ubicacion,
};
