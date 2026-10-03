import type { Idioma } from "@/lib/idioma";

/**
 * Enlaces externos de Belén, en un solo lugar.
 * Los usan la Home, la página de Contacto, la Casita del Árbol y el pie.
 */

/** Agenda de Google para reservar la conversación inicial. */
export const agendaBelen = "https://calendar.app.google/7qR3FzGnvnmJHtwn8";

/**
 * La misma agenda, en el modo de Google para mostrarla dentro de la página
 * (?gv=true) y en el idioma de la página (hl). Si Belén cambia de agenda: abrir
 * el enlace corto de arriba y copiar acá la dirección completa a la que lleva.
 */
const AGENDA_COMPLETA =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rYRSbiihmDOx7Mob9-pVXxTIFx9dkk4du2gTxQGSYmA0CkcOAkK4UmJ_sGeCFWFloRUuLy0nC";

export const agendaIncrustada = (idioma: Idioma) => `${AGENDA_COMPLETA}?gv=true&hl=${idioma}`;

/** Formulario de inscripción a la comunidad del Ecosistema. */
export const formularioComunidad =
  "https://docs.google.com/forms/d/e/1FAIpQLSdjL5PFX60yAKiAs9BcSz3mwLAY8h4JR86yxlVlLDsd9g_zww/viewform";

/**
 * El mismo formulario en inglés ("Regenerative Conversations Club
 * Registration"), que Belén ya tenía publicado. Verificado activo el 2026-10-03.
 */
export const formularioComunidadEn = "https://forms.gle/ZWLrTYtRZyHwwFmQ7";
