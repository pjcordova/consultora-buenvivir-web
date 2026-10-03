import * as belenEs from "@/content/belen";
import * as contactoEs from "@/content/contacto";
import * as ecosistemaEs from "@/content/ecosistema";
import * as homeEs from "@/content/home";
import * as legalesEs from "@/content/legales";
import * as serviciosEs from "@/content/servicios";
import * as sitioEs from "@/content/site";
import * as belenEn from "@/content/en/belen";
import * as contactoEn from "@/content/en/contacto";
import * as ecosistemaEn from "@/content/en/ecosistema";
import * as homeEn from "@/content/en/home";
import * as legalesEn from "@/content/en/legales";
import * as serviciosEn from "@/content/en/servicios";
import * as sitioEn from "@/content/en/site";
import type { Idioma } from "@/lib/idioma";

/**
 * Todo el contenido de base del sitio, por idioma.
 * Son los textos originales: lo que se edita en el panel se guarda aparte y se
 * aplica encima (lib/contenido.ts).
 */
const ESPANOL = {
  hero: homeEs.hero,
  regeneracionOrganizacional: homeEs.regeneracionOrganizacional,
  ecosistema: homeEs.ecosistema,
  cosmovision: homeEs.cosmovision,
  linajes: homeEs.linajes,
  ctaFinal: homeEs.ctaFinal,
  espacios: ecosistemaEs.espacios,
  caminos: serviciosEs.caminos,
  paginaServicios: serviciosEs.paginaServicios,
  ctaServicios: serviciosEs.ctaServicios,
  belen: belenEs.belen,
  contacto: contactoEs.contacto,
  footer: sitioEs.footer,
  whatsapp: sitioEs.whatsapp,
  privacidad: legalesEs.privacidad,
  terminos: legalesEs.terminos,
};

export type Contenido = typeof ESPANOL;

const INGLES: Contenido = {
  hero: homeEn.hero,
  regeneracionOrganizacional: homeEn.regeneracionOrganizacional,
  ecosistema: homeEn.ecosistema,
  cosmovision: homeEn.cosmovision,
  linajes: homeEn.linajes,
  ctaFinal: homeEn.ctaFinal,
  espacios: ecosistemaEn.espacios,
  caminos: serviciosEn.caminos,
  paginaServicios: serviciosEn.paginaServicios,
  ctaServicios: serviciosEn.ctaServicios,
  belen: belenEn.belen,
  contacto: contactoEn.contacto,
  footer: sitioEn.footer,
  whatsapp: sitioEn.whatsapp,
  privacidad: legalesEn.privacidad,
  terminos: legalesEn.terminos,
};

const CONTENIDO: Record<Idioma, Contenido> = { es: ESPANOL, en: INGLES };

export const contenidoDe = (idioma: Idioma): Contenido => CONTENIDO[idioma];
