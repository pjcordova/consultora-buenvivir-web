// Contenido del pie de página (se muestra en todas las páginas).

import { agendaBelen, formularioComunidad } from "@/content/enlaces";

// CONFIRMADO — correo de contacto para la web (se cambia desde el panel, en el pie)
export const correo = "consultoriabuenvivir@gmail.com";

export type EnlaceFooter = {
  label: string;
  href?: string;
  /** Sin confirmar: se muestra como texto, no como enlace. */
  pendiente?: boolean;
};

// WhatsApp de Belén (botón flotante y pie de página).
// El número para el enlace va sin "+", sin espacios y con el 9 de celular argentino:
// +54 3564 38-1909 → 54 9 3564 381909.
export const whatsapp = {
  numero: "5493564381909",
  visible: "+54 3564 38-1909",
  mensaje:
    "Hola Belén, te escribo desde la web de Buen Vivir. Me gustaría solicitar una asesoría. ¿Cómo podemos coordinar?",
};

/** Enlace listo para usar, con el mensaje ya escrito. */
export const whatsappUrl = `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`;

export const footer = {
  descripcion:
    "Buen Vivir — Regeneración organizacional y cultivo humano desde una perspectiva sistémica.",
  // PENDIENTE: confirmar cómo se nombra la ubicación
  ubicacion: "Sede en Argentina · Presencia regional",
  columnas: [
    {
      titulo: "Servicios",
      enlaces: [
        { label: "Revitaliza tu Equipo", href: "/servicios#camino-1" },
        { label: "Revitaliza tu Trabajo", href: "/servicios#camino-2" },
        { label: "Revitaliza tu Vida", href: "/servicios#camino-3" },
        { label: "Ver todos los servicios", href: "/servicios" },
      ] satisfies EnlaceFooter[],
    },
    {
      titulo: "Ecosistema y Filosofía",
      enlaces: [
        { label: "Casita del Árbol", href: "/ecosistema/casita-del-arbol" },
        { label: "Grupo de Regeneración Personal", href: "/ecosistema/regeneracion-personal" },
        { label: "Grupo de Regeneración y Creatividad", href: "/ecosistema/regeneracion-creatividad" },
        { label: "Cosmovisión del Buen Vivir", href: "/#cosmovision" },
        { label: "Sobre Belén Vera", href: "/sobre-belen" },
      ] satisfies EnlaceFooter[],
    },
  ],
  contacto: {
    titulo: "Contacto y Diálogo",
    intro:
      "Abiertos a conversaciones significativas sobre momentos organizativos y vitales.",
    agenda: { label: "Agendar una conversación", href: agendaBelen } satisfies EnlaceFooter,
    whatsapp: { label: `WhatsApp: ${whatsapp.visible}`, href: whatsappUrl } satisfies EnlaceFooter,
    comunidad: { label: "Sumarme a la comunidad", href: formularioComunidad } satisfies EnlaceFooter,
    instagram: {
      label: "@consultorabuenvivir",
      href: "https://www.instagram.com/consultorabuenvivir/",
    } satisfies EnlaceFooter,
    email: { label: correo, href: `mailto:${correo}` } satisfies EnlaceFooter,
  },
  // Redes sociales del pie. Para activar una red, pegá su enlace en `href`.
  // Sin `href` el ícono se ve apagado y no se puede clickear.
  redes: [
    { id: "instagram" as const, label: "Instagram", href: "https://www.instagram.com/consultorabuenvivir/" },
    // La "é" va codificada (%C3%A9) para que el enlace funcione en cualquier navegador
    { id: "linkedin" as const, label: "LinkedIn", href: "https://www.linkedin.com/in/bel%C3%A9nvera-regeneracion" },
    { id: "tiktok" as const, label: "TikTok", href: "https://www.tiktok.com/@consultora.buen.v" },
    {
      id: "youtube" as const,
      label: "YouTube",
      href: "https://www.youtube.com/@ConsultoraRegenerativaBuenVivi",
    },
    // Perfil personal de Belén, donde publica sus escritos
    { id: "substack" as const, label: "Substack", href: "https://substack.com/@belenvera82" },
  ],
  lema: "Espacio de cultivo, pausa y transformación guiado por Belén Vera.",
  legales: [
    { label: "Privacidad", href: "/privacidad" },
    { label: "Términos", href: "/terminos" },
    { label: "Contacto", href: "/contacto" },
  ] satisfies EnlaceFooter[],
};
