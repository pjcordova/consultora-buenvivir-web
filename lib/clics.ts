import {
  agendaBelen,
  formularioComunidad,
  formularioComunidadEn,
  preinscripcionCreatividad,
  preinscripcionRegeneracionPersonal,
} from "@/content/enlaces";

/**
 * Qué clics se cuentan en las estadísticas de Vercel y con qué nombre.
 * Solo los que muestran interés concreto (escribir, agendar, inscribirse,
 * seguir en redes); moverse entre páginas ya lo cuentan las visitas.
 *
 * Es una función pura: la usa components/MedirClics.tsx en el navegador.
 */

/** Los formularios conocidos, con un nombre que se entienda en el panel de Vercel. */
const FORMULARIOS: Record<string, string> = {
  [formularioComunidad]: "Comunidad (Casita del Árbol)",
  [formularioComunidadEn]: "Comunidad, en inglés",
  [preinscripcionRegeneracionPersonal]: "Pre-inscripción Regeneración Personal",
  [preinscripcionCreatividad]: "Pre-inscripción Regeneración y Creatividad",
};

const REDES: [RegExp, string][] = [
  [/instagram\.com/i, "Instagram"],
  [/linkedin\.com/i, "LinkedIn"],
  [/tiktok\.com/i, "TikTok"],
  [/youtube\.com|youtu\.be/i, "YouTube"],
  [/substack\.com/i, "Substack"],
];

export type ClicMedible = {
  /** Nombre del evento en Vercel: WhatsApp, Agenda, Formulario, Correo, Red social, Video. */
  evento: string;
  /** Cuál fue: el texto del botón, el formulario o la red. */
  detalle: string;
};

/** Texto de un botón en una línea y sin pasarse del largo que acepta Vercel. */
const resumir = (texto: string) => texto.replace(/\s+/g, " ").trim().slice(0, 100);

export function clicMedible(href: string, texto: string): ClicMedible | null {
  const destino = href.trim();
  const boton = resumir(texto) || "(sin texto)";

  if (/wa\.me\/|api\.whatsapp\.com|whatsapp\.com\/send/i.test(destino)) {
    return { evento: "WhatsApp", detalle: boton };
  }
  if (
    destino === agendaBelen ||
    /calendar\.app\.google|calendar\.google\.com/i.test(destino) ||
    /#agenda$/.test(destino)
  ) {
    return { evento: "Agenda", detalle: boton };
  }
  if (/forms\.gle|docs\.google\.com\/forms/i.test(destino)) {
    const conocido = Object.entries(FORMULARIOS).find(([enlace]) => destino.startsWith(enlace));
    return { evento: "Formulario", detalle: conocido?.[1] ?? boton };
  }
  if (/^mailto:/i.test(destino)) {
    return { evento: "Correo", detalle: boton };
  }
  // Un video puntual ("Verlo en YouTube") no es lo mismo que el canal
  if (/youtube\.com\/watch|youtu\.be\//i.test(destino)) {
    return { evento: "Video", detalle: boton };
  }
  const red = REDES.find(([patron]) => patron.test(destino));
  if (red) return { evento: "Red social", detalle: red[1] };

  return null;
}
