import type { Metadata } from "next";

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

export const TITULO_DEL_SITIO = "Buen Vivir — Consultora Regenerativa";

export const DESCRIPCION_DEL_SITIO =
  "Acompañamos a organizaciones, equipos y personas en procesos de regeneración organizacional, inspirados en la cosmovisión del Buen Vivir.";

/**
 * Imágenes que se ven al compartir un enlace (WhatsApp, LinkedIn, Facebook…).
 * Están en public/compartir/ y se generan con scripts/generar-vista-previa.mjs.
 */
const IMAGENES_PARA_COMPARTIR = {
  inicio: {
    url: "/compartir/inicio.jpg",
    alt: "Una chica sopla un diente de león junto al logo de Buen Vivir, consultora regenerativa.",
  },
  belen: {
    url: "/compartir/belen.jpg",
    alt: "Presentación de Belén Vera, facilitadora en Regeneración Organizacional y Personal, junto al logo de Buen Vivir.",
  },
  ecosistema: {
    url: "/compartir/ecosistema.jpg",
    alt: "Sendero en un bosque al atardecer con el logo del Ecosistema Buen Vivir.",
  },
};

type ImagenParaCompartir = keyof typeof IMAGENES_PARA_COMPARTIR;

/** La imagen con sus medidas, como la piden las redes sociales. */
export const imagenParaCompartir = (nombre: ImagenParaCompartir) => ({
  ...IMAGENES_PARA_COMPARTIR[nombre],
  width: 1200,
  height: 630,
});

type Pagina = {
  titulo: string;
  descripcion: string;
  /** Ruta de la página ("/servicios"): su dirección oficial para Google. */
  ruta: string;
  /** Imagen al compartir. Si no se indica, la de inicio. */
  imagen?: ImagenParaCompartir;
};

/** Título, descripción y vista previa al compartir de una página. */
export function metadatosDePagina({
  titulo,
  descripcion,
  ruta,
  imagen = "inicio",
}: Pagina): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: NOMBRE_DEL_SITIO,
      title: titulo,
      description: descripcion,
      url: ruta,
      images: [imagenParaCompartir(imagen)],
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}
