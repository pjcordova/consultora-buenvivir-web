import {
  cosmovision,
  ctaFinal,
  ecosistema,
  hero,
  linajes,
  regeneracionOrganizacional,
} from "@/content/home";
import { belen } from "@/content/belen";
import { contacto } from "@/content/contacto";
import { espacios } from "@/content/ecosistema";
import { caminos, paginaServicios } from "@/content/servicios";
import { footer, whatsapp } from "@/content/site";
import { listaATexto, parrafosATexto } from "@/lib/contenido";

/**
 * Qué se puede editar de cada sección desde el panel.
 * Para sumar una sección nueva alcanza con agregarla acá: el formulario del panel
 * se arma solo a partir de esta descripción.
 */
export type Campo = {
  id: string;
  etiqueta: string;
  /**
   * texto: una línea · parrafo: varias líneas · parrafos: varios párrafos
   * (renglón en blanco entre cada uno, **negrita** entre asteriscos) ·
   * lista: un renglón por ítem · enlace: texto del botón + destino
   */
  tipo: "texto" | "parrafo" | "parrafos" | "lista" | "enlace";
  ayuda?: string;
};

export type SeccionEditable = {
  id: string;
  /** Para agrupar las secciones en el panel. */
  grupo: string;
  titulo: string;
  descripcion: string;
  /** Dónde mirar el resultado en la web. */
  vistaPrevia: string;
  campos: Campo[];
  /** Ids de lib/admin/slots.ts: las imágenes de esta misma sección. */
  slots: string[];
  /** Textos originales, los que están hoy en content/. */
  porDefecto: Record<string, unknown>;
};

const AYUDA_PARRAFOS =
  "Dejá un renglón en blanco entre párrafo y párrafo. Lo que pongas **entre dos asteriscos** se ve en negrita.";

export const SECCIONES: SeccionEditable[] = [
  {
    id: "portada",
    grupo: "Inicio",
    titulo: "Portada",
    descripcion: "Lo primero que se ve: la tarjeta sobre la foto del cielo.",
    vistaPrevia: "/",
    campos: [
      {
        id: "eyebrow",
        etiqueta: "Etiqueta",
        tipo: "texto",
        ayuda: "El texto chico de la pastilla, arriba del título.",
      },
      { id: "title", etiqueta: "Título", tipo: "texto" },
      {
        id: "titleAccent",
        etiqueta: "Título en dorado",
        tipo: "texto",
        ayuda: "La parte en itálica y dorado, que va en su propia línea.",
      },
      { id: "body", etiqueta: "Texto de presentación", tipo: "parrafo" },
      {
        id: "note",
        etiqueta: "Nota entre corchetes",
        tipo: "texto",
        ayuda: "Aviso provisorio. Dejalo vacío para que no aparezca.",
      },
      { id: "primaryCta", etiqueta: "Botón principal", tipo: "enlace" },
      { id: "secondaryCta", etiqueta: "Botón secundario", tipo: "enlace" },
    ],
    slots: ["hero-cielo"],
    porDefecto: {
      eyebrow: hero.eyebrow,
      title: hero.title,
      titleAccent: hero.titleAccent,
      body: hero.body,
      note: hero.note,
      primaryCta: hero.primaryCta,
      secondaryCta: hero.secondaryCta,
    },
  },
  {
    id: "paradigma",
    grupo: "Inicio",
    titulo: "Un nuevo paradigma",
    descripcion: "Carrusel de publicaciones y tarjeta sobre regeneración organizacional.",
    vistaPrevia: "/#regeneracion",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      { id: "cita", etiqueta: "Frase destacada", tipo: "parrafo", ayuda: "Va en itálica, entre comillas." },
      { id: "parrafos", etiqueta: "Párrafos de la tarjeta", tipo: "parrafos", ayuda: AYUDA_PARRAFOS },
      { id: "pregunta", etiqueta: "Pregunta del pie", tipo: "parrafo" },
      { id: "cta", etiqueta: "Botón", tipo: "enlace" },
    ],
    slots: ["paradigma-1", "paradigma-2", "paradigma-3", "paradigma-4", "paradigma-5", "paradigma-6", "paradigma-7"],
    porDefecto: {
      eyebrow: regeneracionOrganizacional.eyebrow,
      titulo: regeneracionOrganizacional.titulo,
      bajada: regeneracionOrganizacional.bajada,
      cita: regeneracionOrganizacional.cita,
      parrafos: parrafosATexto(regeneracionOrganizacional.parrafos),
      pregunta: regeneracionOrganizacional.pregunta,
      cta: regeneracionOrganizacional.cta,
    },
  },
  {
    id: "servicios",
    grupo: "Inicio",
    titulo: "Nuestros Servicios",
    descripcion: "Encabezado del panel del bosque con los tres espacios del Ecosistema.",
    vistaPrevia: "/#servicios",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      {
        id: "nombreProvisional",
        etiqueta: "Nombre en la placa",
        tipo: "texto",
        ayuda: "Se usa cuando todavía no está cargado el logo del Ecosistema.",
      },
    ],
    slots: [
      "ecosistema-bosque",
      "logo-ecosistema",
      "servicio-casita",
      "servicio-personal",
      "servicio-creatividad",
      "libro-camino-artista",
    ],
    porDefecto: {
      eyebrow: ecosistema.eyebrow,
      titulo: ecosistema.titulo,
      bajada: ecosistema.bajada,
      nombreProvisional: ecosistema.nombreProvisional,
    },
  },
  {
    id: "cosmovision",
    grupo: "Inicio",
    titulo: "Cosmovisión",
    descripcion: "Carrusel y tarjeta firmada por Belén.",
    vistaPrevia: "/#cosmovision",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      { id: "cita", etiqueta: "Frase destacada", tipo: "parrafo" },
      { id: "parrafos", etiqueta: "Párrafos de la tarjeta", tipo: "parrafos", ayuda: AYUDA_PARRAFOS },
      { id: "autor", etiqueta: "Firma", tipo: "texto" },
      { id: "etiqueta", etiqueta: "Etiqueta del pie", tipo: "texto" },
    ],
    slots: ["cosmovision-1", "cosmovision-2", "cosmovision-3", "cosmovision-4", "cosmovision-5"],
    porDefecto: {
      eyebrow: cosmovision.eyebrow,
      titulo: cosmovision.titulo,
      bajada: cosmovision.bajada,
      cita: cosmovision.cita,
      parrafos: parrafosATexto(cosmovision.parrafos),
      autor: cosmovision.autor,
      etiqueta: cosmovision.etiqueta,
    },
  },
  {
    id: "linajes",
    grupo: "Inicio",
    titulo: "Linajes de aprendizaje",
    descripcion: "La franja ancha con el video o la foto de las ballenas.",
    vistaPrevia: "/#linajes",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "statement", etiqueta: "Frase grande", tipo: "parrafo" },
      {
        id: "note",
        etiqueta: "Nota entre corchetes",
        tipo: "parrafo",
        ayuda: "Dejala vacía para que no aparezca.",
      },
      {
        id: "credito",
        etiqueta: "Chapita del video",
        tipo: "texto",
        ayuda: "Qué se está viendo, arriba a la derecha.",
      },
    ],
    slots: ["ballenas-foto", "ballenas-video"],
    porDefecto: {
      eyebrow: linajes.eyebrow,
      statement: linajes.statement,
      note: linajes.note,
      credito: linajes.credito,
    },
  },
  {
    id: "cierre",
    grupo: "Inicio",
    titulo: "Cierre",
    descripcion: "La invitación a conversar, al final de la página.",
    vistaPrevia: "/#conversemos",
    campos: [
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      {
        id: "nota",
        etiqueta: "Nota entre paréntesis",
        tipo: "texto",
        ayuda: "Dejala vacía para que no aparezca.",
      },
      { id: "principal", etiqueta: "Botón principal", tipo: "enlace" },
      { id: "secundario", etiqueta: "Botón secundario", tipo: "enlace" },
    ],
    slots: [],
    porDefecto: {
      titulo: ctaFinal.titulo,
      bajada: ctaFinal.bajada,
      nota: ctaFinal.nota,
      principal: ctaFinal.principal,
      secundario: ctaFinal.secundario,
    },
  },
  {
    id: "pie",
    grupo: "Inicio",
    titulo: "Pie de página y redes",
    descripcion: "Descripción, contacto, WhatsApp y enlaces a las redes sociales.",
    vistaPrevia: "/",
    campos: [
      { id: "descripcion", etiqueta: "Descripción", tipo: "parrafo" },
      { id: "ubicacion", etiqueta: "Ubicación", tipo: "texto" },
      { id: "introContacto", etiqueta: "Texto de la columna de contacto", tipo: "parrafo" },
      { id: "lema", etiqueta: "Lema del final", tipo: "texto" },
      {
        id: "whatsappNumero",
        etiqueta: "WhatsApp — número para el enlace",
        tipo: "texto",
        ayuda: "Sin +, sin espacios y con el 9 de celular argentino. Ejemplo: 5493564381909.",
      },
      {
        id: "whatsappVisible",
        etiqueta: "WhatsApp — número que se muestra",
        tipo: "texto",
      },
      {
        id: "whatsappMensaje",
        etiqueta: "WhatsApp — mensaje que viene escrito",
        tipo: "parrafo",
        ayuda: "Lo que aparece cargado en el chat cuando alguien toca el botón flotante.",
      },
      { id: "instagram", etiqueta: "Instagram (enlace)", tipo: "texto" },
      {
        id: "linkedin",
        etiqueta: "LinkedIn (enlace)",
        tipo: "texto",
        ayuda: "Vacío deja el ícono apagado.",
      },
      {
        id: "tiktok",
        etiqueta: "TikTok (enlace)",
        tipo: "texto",
        ayuda: "Vacío deja el ícono apagado.",
      },
      {
        id: "youtube",
        etiqueta: "YouTube (enlace)",
        tipo: "texto",
        ayuda: "Vacío deja el ícono apagado.",
      },
    ],
    slots: [],
    porDefecto: {
      descripcion: footer.descripcion,
      ubicacion: footer.ubicacion,
      introContacto: footer.contacto.intro,
      lema: footer.lema,
      whatsappNumero: whatsapp.numero,
      whatsappVisible: whatsapp.visible,
      whatsappMensaje: whatsapp.mensaje,
      instagram: footer.contacto.instagram.href ?? "",
      linkedin: footer.redes.find((r) => r.id === "linkedin")?.href ?? "",
      tiktok: footer.redes.find((r) => r.id === "tiktok")?.href ?? "",
      youtube: footer.redes.find((r) => r.id === "youtube")?.href ?? "",
    },
  },
  {
    id: "pagina-servicios",
    grupo: "Página de Servicios",
    titulo: "Encabezado de Servicios",
    descripcion: "La franja verde con el título de la página de Servicios.",
    vistaPrevia: "/servicios",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
    ],
    slots: [],
    porDefecto: {
      eyebrow: paginaServicios.eyebrow,
      titulo: paginaServicios.titulo,
      bajada: paginaServicios.bajada,
    },
  },
  ...caminos.flatMap((camino) =>
    camino.ofertas.map((oferta) => ({
      id: `servicio:${oferta.slug}`,
      grupo: "Página de Servicios",
      titulo: oferta.titulo,
      descripcion: `${camino.emoji} ${camino.titulo}`,
      vistaPrevia: `/servicios#${oferta.slug}`,
      campos: [
        { id: "titulo", etiqueta: "Nombre del servicio", tipo: "texto" as const },
        { id: "descripcion", etiqueta: "Descripción", tipo: "parrafo" as const },
        { id: "paraQuien", etiqueta: "Para quién es", tipo: "parrafo" as const },
        { id: "incluye", etiqueta: "Qué incluye", tipo: "lista" as const, ayuda: "Un renglón por ítem." },
      ],
      slots: [`folleto-${oferta.imagen.split("/").pop()?.replace(".jpg", "")}`],
      porDefecto: {
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        paraQuien: oferta.paraQuien,
        incluye: listaATexto(oferta.incluye),
      },
    }))
  ),
  ...espacios.map((espacio) => ({
    id: `espacio:${espacio.slug}`,
    grupo: "Espacios del Ecosistema",
    titulo: espacio.nombre,
    descripcion: "Página propia del espacio.",
    vistaPrevia: `/ecosistema/${espacio.slug}`,
    campos: [
      { id: "titulo", etiqueta: "Título", tipo: "texto" as const },
      { id: "estado", etiqueta: "Estado", tipo: "texto" as const, ayuda: "La pastilla verde: \"Próximamente\", \"En lanzamiento…\"" },
      { id: "estadoCorto", etiqueta: "Leyenda del círculo en la Home", tipo: "texto" as const },
      { id: "resumen", etiqueta: "Resumen", tipo: "parrafo" as const },
      { id: "parrafos", etiqueta: "Texto de la página", tipo: "parrafos" as const, ayuda: "Un renglón en blanco entre párrafo y párrafo." },
      { id: "extras", etiqueta: "Además incluye", tipo: "lista" as const, ayuda: "Un renglón por ítem. Dejalo vacío para ocultar el bloque." },
      { id: "ctaTitulo", etiqueta: "Cierre — título", tipo: "texto" as const },
      { id: "ctaBajada", etiqueta: "Cierre — bajada", tipo: "parrafo" as const },
      { id: "ctaBoton", etiqueta: "Cierre — botón", tipo: "enlace" as const },
    ],
    slots: [],
    porDefecto: {
      titulo: espacio.titulo,
      estado: espacio.estado,
      estadoCorto: espacio.estadoCorto ?? "",
      resumen: espacio.resumen,
      parrafos: parrafosATexto(espacio.parrafos),
      extras: listaATexto(espacio.extras ?? []),
      ctaTitulo: espacio.ctaPagina.titulo,
      ctaBajada: espacio.ctaPagina.bajada,
      ctaBoton: espacio.ctaPagina.principal,
    },
  })),
  {
    id: "sobre-belen",
    grupo: "Sobre Belén",
    titulo: "Página Sobre Belén",
    descripcion: "Su presentación, su historia y su enfoque.",
    vistaPrevia: "/sobre-belen",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "saludo", etiqueta: "Saludo", tipo: "texto" },
      { id: "rol", etiqueta: "Rol", tipo: "texto" },
      { id: "titulos", etiqueta: "Etiquetas de perfil", tipo: "lista", ayuda: "Un renglón por ítem." },
      { id: "presentacion", etiqueta: "Presentación", tipo: "parrafos" },
      { id: "cita", etiqueta: "Frase destacada", tipo: "parrafo" },
      { id: "citaTexto", etiqueta: "Texto bajo la frase", tipo: "parrafo" },
      { id: "caminoTitulo", etiqueta: "Título de su camino", tipo: "texto" },
      { id: "camino", etiqueta: "Su camino", tipo: "parrafos" },
      { id: "enfoqueTitulo", etiqueta: "Título del enfoque", tipo: "texto" },
      { id: "enfoqueCita", etiqueta: "Frase del enfoque", tipo: "parrafo" },
      { id: "enfoque", etiqueta: "Enfoque", tipo: "parrafos" },
    ],
    slots: ["belen-foto"],
    porDefecto: {
      eyebrow: belen.eyebrow,
      saludo: belen.saludo,
      rol: belen.rol,
      titulos: listaATexto(belen.titulos),
      presentacion: parrafosATexto(belen.presentacion),
      cita: belen.cita,
      citaTexto: belen.citaTexto,
      caminoTitulo: belen.caminoTitulo,
      camino: parrafosATexto(belen.camino),
      enfoqueTitulo: belen.enfoqueTitulo,
      enfoqueCita: belen.enfoqueCita,
      enfoque: parrafosATexto(belen.enfoque),
    },
  },
  {
    id: "contacto",
    grupo: "Contacto",
    titulo: "Página de Contacto",
    descripcion: "El encabezado y las tres vías para escribirle a Belén.",
    vistaPrevia: "/contacto",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      { id: "nota", etiqueta: "Nota entre paréntesis", tipo: "texto" },
      ...contacto.vias.flatMap((via) => [
        { id: `via_${via.id}_titulo`, etiqueta: `${via.titulo} — título`, tipo: "texto" as const },
        { id: `via_${via.id}_texto`, etiqueta: `${via.titulo} — texto`, tipo: "parrafo" as const },
      ]),
      { id: "redesTitulo", etiqueta: "Título del bloque de redes", tipo: "texto" },
      { id: "redesTexto", etiqueta: "Texto del bloque de redes", tipo: "parrafo" },
    ],
    slots: [],
    porDefecto: {
      eyebrow: contacto.eyebrow,
      titulo: contacto.titulo,
      bajada: contacto.bajada,
      nota: contacto.nota,
      ...Object.fromEntries(
        contacto.vias.flatMap((via) => [
          [`via_${via.id}_titulo`, via.titulo],
          [`via_${via.id}_texto`, via.texto],
        ])
      ),
      redesTitulo: contacto.redesTitulo,
      redesTexto: contacto.redesTexto,
    },
  },
];

export function obtenerSeccion(id: string): SeccionEditable | undefined {
  return SECCIONES.find((seccion) => seccion.id === id);
}
