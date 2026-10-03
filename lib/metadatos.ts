import type { Metadata } from "next";
import { enlaceEnIdioma, IDIOMA_DE_BASE, IDIOMAS, type Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

/**
 * Dirección pública del sitio, para los enlaces completos que piden Google y las
 * redes sociales (vista previa al compartir, mapa del sitio, ficha de la
 * organización).
 *
 * Vercel la informa sola en VERCEL_PROJECT_PRODUCTION_URL. Cuando se conecte el
 * dominio propio pasa a ser ese, sin tocar código: alcanza con volver a publicar.
 */
export const URL_DEL_SITIO = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const NOMBRE_DEL_SITIO = "Buen Vivir";

/** Cómo se nombra cada idioma para las redes sociales. */
const LOCALE: Record<Idioma, string> = { es: "es_AR", en: "en_US" };

/**
 * Imágenes que se ven al compartir un enlace (WhatsApp, LinkedIn, Facebook…).
 * Están en public/compartir/ y se generan con scripts/generar-vista-previa.mjs.
 */
const IMAGENES_PARA_COMPARTIR = {
  inicio: {
    url: "/compartir/inicio.jpg",
    alt: {
      es: "Una chica sopla un diente de león junto al logo de Buen Vivir, consultora regenerativa.",
      en: "A girl blows on a dandelion next to the logo of Buen Vivir, regenerative consultancy.",
    },
  },
  belen: {
    url: "/compartir/belen.jpg",
    alt: {
      es: "Presentación de Belén Vera, facilitadora en Regeneración Organizacional y Personal, junto al logo de Buen Vivir.",
      en: "Introduction card of Belén Vera, facilitator of Organizational and Personal Regeneration, next to the Buen Vivir logo.",
    },
  },
  ecosistema: {
    url: "/compartir/ecosistema.jpg",
    alt: {
      es: "Sendero en un bosque al atardecer con el logo del Ecosistema Buen Vivir.",
      en: "A forest path at sunset with the logo of the Buen Vivir Ecosystem.",
    },
  },
};

type ImagenParaCompartir = keyof typeof IMAGENES_PARA_COMPARTIR;

/** La imagen con sus medidas, como la piden las redes sociales. */
const imagenParaCompartir = (nombre: ImagenParaCompartir, idioma: Idioma) => ({
  url: IMAGENES_PARA_COMPARTIR[nombre].url,
  alt: IMAGENES_PARA_COMPARTIR[nombre].alt[idioma],
  width: 1200,
  height: 630,
});

/** Metadatos de base del sitio (layout raíz), en el idioma de la visita. */
export function metadatosDelSitio(idioma: Idioma): Metadata {
  const { sitio } = textosDe(idioma);
  return {
    metadataBase: new URL(URL_DEL_SITIO),
    title: sitio.titulo,
    description: sitio.descripcion,
    openGraph: {
      type: "website",
      locale: LOCALE[idioma],
      siteName: NOMBRE_DEL_SITIO,
      images: [imagenParaCompartir("inicio", idioma)],
    },
    twitter: { card: "summary_large_image" },
  };
}

type Pagina = {
  idioma: Idioma;
  titulo: string;
  descripcion: string;
  /** Ruta de la página en español ("/servicios"); la de inglés se arma sola. */
  ruta: string;
  /** Imagen al compartir. Si no se indica, la de inicio. */
  imagen?: ImagenParaCompartir;
};

/**
 * Título, descripción y vista previa al compartir de una página, más la
 * dirección de su versión en el otro idioma (para que Google las relacione).
 */
export function metadatosDePagina({
  idioma,
  titulo,
  descripcion,
  ruta,
  imagen = "inicio",
}: Pagina): Metadata {
  const direccion = enlaceEnIdioma(ruta, idioma);

  return {
    title: titulo,
    description: descripcion,
    alternates: {
      canonical: direccion,
      languages: {
        ...Object.fromEntries(IDIOMAS.map((otro) => [otro, enlaceEnIdioma(ruta, otro)])),
        "x-default": enlaceEnIdioma(ruta, IDIOMA_DE_BASE),
      },
    },
    openGraph: {
      type: "website",
      locale: LOCALE[idioma],
      alternateLocale: IDIOMAS.filter((otro) => otro !== idioma).map((otro) => LOCALE[otro]),
      siteName: NOMBRE_DEL_SITIO,
      title: titulo,
      description: descripcion,
      url: direccion,
      images: [imagenParaCompartir(imagen, idioma)],
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}
