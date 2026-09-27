import { formularioComunidad } from "@/content/enlaces";
import { ctaFinal } from "@/content/home";
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
      cta: { label: "Ver horarios disponibles", href: ctaFinal.principal.href },
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

  redesTitulo: "También podés seguirla acá",
  redesTexto: footer.contacto.intro,
  ubicacion: footer.ubicacion,
};
