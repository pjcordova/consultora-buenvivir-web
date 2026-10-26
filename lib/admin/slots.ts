/**
 * Catálogo de imágenes editables del sitio.
 * Cada "slot" es un lugar fijo de la página: el panel solo permite reemplazar
 * estos archivos, nunca escribir en otra ruta.
 */
export type Slot = {
  id: string;
  seccion: string;
  titulo: string;
  ayuda: string;
  /** Ruta pública del archivo (dentro de /public). */
  ruta: string;
  tipo: "imagen" | "video";
  /** Lleva una leyenda corta debajo de la foto, que se carga junto a ella en el panel. */
  leyenda?: boolean;
};

/** Hasta cuántas fotos lleva el carrusel de "Mi enfoque", en Sobre Belén. */
export const FOTOS_ENFOQUE = 8;

const carrusel = (
  prefijo: string,
  seccion: string,
  total: number,
  etiqueta: string
): Slot[] =>
  Array.from({ length: total }, (_, i) => ({
    id: `${prefijo}-${i + 1}`,
    seccion,
    titulo: `${etiqueta} ${i + 1} de ${total}`,
    ayuda: "Publicación del carrusel. Cuadrada, por ejemplo 1080 × 1080 px.",
    ruta: `/images/carrusel/${prefijo}-${i + 1}.jpg`,
    tipo: "imagen" as const,
  }));

export const SLOTS: Slot[] = [
  {
    id: "hero-cielo",
    seccion: "Portada",
    titulo: "Foto del cielo",
    ayuda: "Fondo de la portada. Apaisada y grande, por ejemplo 2000 px de ancho.",
    ruta: "/images/hero-cielo.jpg",
    tipo: "imagen",
  },
  ...carrusel("paradigma", "Un nuevo paradigma", 7, "Imagen"),
  {
    id: "ecosistema-bosque",
    seccion: "Nuestros Servicios",
    titulo: "Foto del bosque",
    ayuda: "Fondo del panel de servicios. Apaisada, por ejemplo 1600 × 900 px.",
    ruta: "/images/ecosistema-bosque.jpg",
    tipo: "imagen",
  },
  {
    id: "logo-ecosistema",
    seccion: "Nuestros Servicios",
    titulo: "Logo del Ecosistema",
    ayuda: "Logo con las raíces. Con fondo transparente (.png), claro sobre oscuro.",
    ruta: "/images/logo-ecosistema.png",
    tipo: "imagen",
  },
  {
    id: "servicio-casita",
    seccion: "Nuestros Servicios",
    titulo: "Casita del Árbol",
    ayuda: "Insignia del servicio. Cuadrada y con fondo transparente (.png).",
    ruta: "/images/servicios/casita-del-arbol.png",
    tipo: "imagen",
  },
  {
    id: "servicio-personal",
    seccion: "Nuestros Servicios",
    titulo: "Grupo de Regeneración Personal",
    ayuda: "Imagen del servicio. Cuadrada; el texto va encima, así que conviene que no sea muy cargada.",
    ruta: "/images/servicios/regeneracion-personal.jpg",
    tipo: "imagen",
  },
  {
    id: "servicio-creatividad",
    seccion: "Nuestros Servicios",
    titulo: "Grupo de Regeneración y Creatividad",
    ayuda: "Imagen del servicio. Cuadrada; el texto va encima.",
    ruta: "/images/servicios/regeneracion-creatividad.jpg",
    tipo: "imagen",
  },
  {
    id: "libro-camino-artista",
    seccion: "Nuestros Servicios",
    titulo: "Tapa del libro",
    ayuda: "Tapa de El Camino del Artista, que asoma junto al círculo. Vertical.",
    ruta: "/images/el-camino-del-artista.jpg",
    tipo: "imagen",
  },
  ...carrusel("cosmovision", "Cosmovisión", 5, "Imagen"),
  {
    id: "folleto-regeneracion-equipos",
    seccion: "Página de Servicios",
    titulo: "Regeneración de Equipos",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/regeneracion-equipos.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-liderazgo-regenerativo",
    seccion: "Página de Servicios",
    titulo: "Liderazgo Regenerativo",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/liderazgo-regenerativo.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-regeneracion-emprendedores",
    seccion: "Página de Servicios",
    titulo: "Regeneración para Emprendedores",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/regeneracion-emprendedores.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-teoria-u",
    seccion: "Página de Servicios",
    titulo: "Introducción a la Teoría U",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/teoria-u.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-regeneracion-personal-flyer",
    seccion: "Página de Servicios",
    titulo: "Regeneración Personal",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/regeneracion-personal-flyer.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-creatividad-regeneracion",
    seccion: "Página de Servicios",
    titulo: "Creatividad y Regeneración",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/creatividad-regeneracion.jpg",
    tipo: "imagen",
  },
  {
    id: "folleto-profesionales-diversos",
    seccion: "Página de Servicios",
    titulo: "Para Profesionales diversos",
    ayuda: "Folleto del servicio. Vertical 4:5, como las publicaciones de Instagram (1080 × 1350 px).",
    ruta: "/images/servicios/profesionales-diversos.jpg",
    tipo: "imagen",
  },
  {
    id: "belen-foto",
    seccion: "Sobre Belén",
    titulo: "Foto de Belén",
    ayuda: "Retrato o placa de presentación. Vertical, por ejemplo 1200 × 1500 px.",
    ruta: "/images/belen.jpg",
    tipo: "imagen",
  },
  // Carrusel de "Mi enfoque": Belén en acción (talleres, círculos, sesiones).
  // Solo se muestran las que estén cargadas.
  ...carrusel("enfoque", "Sobre Belén", FOTOS_ENFOQUE, "Mi enfoque, foto").map((slot) => ({
    ...slot,
    ayuda:
      "Una foto real de Belén en acción: un taller, un círculo de conversación, una sesión con un equipo. Cuadrada, por ejemplo 1080 × 1080 px.",
    leyenda: true,
  })),
  // Carrusel de su trayectoria en Sobre Belén: fotos que Belén baja de la página
  // de Facebook de Ecoproyectos Freyre. Solo se muestran las que estén cargadas.
  ...carrusel("freyre", "Sobre Belén", 8, "Ecoproyectos Freyre, foto").map((slot) => ({
    ...slot,
    leyenda: true,
  })),
  {
    id: "ballenas-foto",
    seccion: "Linajes de aprendizaje",
    titulo: "Foto de las ballenas",
    ayuda: "Fondo de la franja. Se ve mientras carga el video y si el visitante pidió menos animación.",
    ruta: "/images/ballenas.jpg",
    tipo: "imagen",
  },
  {
    id: "ballenas-video",
    seccion: "Linajes de aprendizaje",
    titulo: "Video de las ballenas",
    ayuda: "mp4 sin audio, de 10 a 20 segundos, hasta 12 MB. Opcional: sin video se usa la foto.",
    ruta: "/videos/ballenas.mp4",
    tipo: "video",
  },
];

/*
 * Imágenes de los elementos de una lista del panel (el certificado de cada
 * formación, la foto de cada integrante). No son lugares fijos de la página: hay
 * una por elemento, con el id de ese elemento.
 */
const IMAGENES_DE_LISTAS = {
  formacion: {
    prefijo: "certificado-",
    carpeta: "/images/certificados",
    seccion: "Formación",
    titulo: "Imagen del certificado",
    ayuda:
      "Opcional. Una foto o captura del certificado (jpg o png); si lo tenés en PDF, sacale una captura. Antes de subirla, tapá el DNI u otros datos personales.",
  },
  integrantes: {
    prefijo: "integrante-",
    carpeta: "/images/integrantes",
    seccion: "Integrantes",
    titulo: "Foto",
    ayuda:
      "Opcional, y solo con su permiso. Cuadrada, de la cara o de medio cuerpo, con buena luz. Sin foto se muestran sus iniciales.",
  },
} as const;

export type ListaConImagen = keyof typeof IMAGENES_DE_LISTAS;

export const tieneImagenes = (lista: string): lista is ListaConImagen => lista in IMAGENES_DE_LISTAS;

export const rutaDeImagenDeLista = (lista: ListaConImagen, idElemento: string) =>
  `${IMAGENES_DE_LISTAS[lista].carpeta}/${idElemento}.jpg`;

export const slotDeImagenDeLista = (lista: ListaConImagen, idElemento: string): Slot => {
  const { prefijo, seccion, titulo, ayuda } = IMAGENES_DE_LISTAS[lista];
  return {
    id: `${prefijo}${idElemento}`,
    seccion,
    titulo,
    ayuda,
    ruta: rutaDeImagenDeLista(lista, idElemento),
    tipo: "imagen",
  };
};

/** El certificado de una formación (Sobre Belén). */
export const rutaDelCertificado = (idFormacion: string) => rutaDeImagenDeLista("formacion", idFormacion);

export function obtenerSlot(id: string): Slot | undefined {
  const fijo = SLOTS.find((slot) => slot.id === id);
  if (fijo) return fijo;

  for (const lista of Object.keys(IMAGENES_DE_LISTAS) as ListaConImagen[]) {
    const { prefijo } = IMAGENES_DE_LISTAS[lista];
    if (!id.startsWith(prefijo)) continue;
    // Mismo formato que los ids de las listas: la ruta no puede salirse de su carpeta.
    const elemento = id.slice(prefijo.length);
    return /^[\w-]{1,64}$/.test(elemento) ? slotDeImagenDeLista(lista, elemento) : undefined;
  }
  return undefined;
}

export function slotsPorSeccion(): { seccion: string; slots: Slot[] }[] {
  const secciones: { seccion: string; slots: Slot[] }[] = [];
  for (const slot of SLOTS) {
    const actual = secciones.find((s) => s.seccion === slot.seccion);
    if (actual) actual.slots.push(slot);
    else secciones.push({ seccion: slot.seccion, slots: [slot] });
  }
  return secciones;
}
