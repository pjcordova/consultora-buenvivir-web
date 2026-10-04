import { contenidoDe, type Contenido } from "@/content";
import { correo } from "@/content/site";
import {
  CAMPOS_COMPARTIDOS_DEL_PIE,
  incluyeATexto,
  listaATexto,
  parrafosATexto,
} from "@/lib/contenido";

/**
 * Qué se puede editar de cada sección desde el panel.
 * Para sumar una sección nueva alcanza con agregarla acá: el formulario del panel
 * se arma solo a partir de esta descripción.
 *
 * Cada sección se edita por separado en cada idioma. Los textos originales
 * (porDefecto) salen del contenido de base de ese idioma (content/ y content/en/).
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
  /** Vale para los dos idiomas (un número, un enlace): se edita solo en español. */
  compartido?: boolean;
};

export type SeccionEditable = {
  id: string;
  /** Para agrupar las secciones en el panel. */
  grupo: string;
  titulo: string;
  descripcion: string;
  /** Dónde mirar el resultado en la web (en español; el panel le suma el /en). */
  vistaPrevia: string;
  campos: Campo[];
  /** Ids de lib/admin/slots.ts: las imágenes de esta misma sección. */
  slots: string[];
  /** Textos originales de la sección, en el idioma del contenido que recibe. */
  porDefecto: (c: Contenido) => Record<string, unknown>;
};

const AYUDA_PARRAFOS =
  "Dejá un renglón en blanco entre párrafo y párrafo. Lo que pongas **entre dos asteriscos** se ve en negrita.";

// El panel está en español: los nombres de las secciones salen del contenido en español.
const ES = contenidoDe("es");

/** El servicio o espacio con ese slug, en el idioma del contenido (o en español). */
const ofertaDe = (c: Contenido, slug: string) =>
  c.caminos.flatMap((camino) => camino.ofertas).find((oferta) => oferta.slug === slug) ??
  ES.caminos.flatMap((camino) => camino.ofertas).find((oferta) => oferta.slug === slug)!;

const espacioDe = (c: Contenido, slug: string) =>
  c.espacios.find((espacio) => espacio.slug === slug) ??
  ES.espacios.find((espacio) => espacio.slug === slug)!;

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
    porDefecto: ({ hero }) => ({
      eyebrow: hero.eyebrow,
      title: hero.title,
      titleAccent: hero.titleAccent,
      body: hero.body,
      note: hero.note,
      primaryCta: hero.primaryCta,
      secondaryCta: hero.secondaryCta,
    }),
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
    porDefecto: ({ regeneracionOrganizacional: seccion }) => ({
      eyebrow: seccion.eyebrow,
      titulo: seccion.titulo,
      bajada: seccion.bajada,
      cita: seccion.cita,
      parrafos: parrafosATexto(seccion.parrafos),
      pregunta: seccion.pregunta,
      cta: seccion.cta,
    }),
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
    porDefecto: ({ ecosistema }) => ({
      eyebrow: ecosistema.eyebrow,
      titulo: ecosistema.titulo,
      bajada: ecosistema.bajada,
      nombreProvisional: ecosistema.nombreProvisional,
    }),
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
    porDefecto: ({ cosmovision }) => ({
      eyebrow: cosmovision.eyebrow,
      titulo: cosmovision.titulo,
      bajada: cosmovision.bajada,
      cita: cosmovision.cita,
      parrafos: parrafosATexto(cosmovision.parrafos),
      autor: cosmovision.autor,
      etiqueta: cosmovision.etiqueta,
    }),
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
        etiqueta: "Texto debajo de la frase",
        tipo: "parrafo",
        ayuda: "Dejala vacía para que no aparezca.",
      },
      {
        id: "credito",
        etiqueta: "Chapita del video",
        tipo: "texto",
        ayuda: "Qué se está viendo, arriba a la derecha. Dejala vacía para que no aparezca.",
      },
    ],
    slots: ["ballenas-foto", "ballenas-video"],
    porDefecto: ({ linajes }) => ({
      eyebrow: linajes.eyebrow,
      statement: linajes.statement,
      note: linajes.note,
      credito: linajes.credito,
    }),
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
    porDefecto: ({ ctaFinal }) => ({
      titulo: ctaFinal.titulo,
      bajada: ctaFinal.bajada,
      nota: ctaFinal.nota,
      principal: ctaFinal.principal,
      secundario: ctaFinal.secundario,
    }),
  },
  {
    id: "pie",
    grupo: "Inicio",
    titulo: "Pie de página y redes",
    descripcion: "Descripción, contacto, WhatsApp y enlaces a las redes sociales.",
    vistaPrevia: "/",
    campos: (
      [
        { id: "descripcion", etiqueta: "Descripción", tipo: "parrafo" },
        { id: "ubicacion", etiqueta: "Ubicación", tipo: "texto" },
        { id: "introContacto", etiqueta: "Texto de la columna de contacto", tipo: "parrafo" },
        { id: "lema", etiqueta: "Lema del final", tipo: "texto" },
        { id: "columnaServicios", etiqueta: "Título de la columna de servicios", tipo: "texto" },
        {
          id: "columnaEcosistema",
          etiqueta: "Título de la columna del Ecosistema",
          tipo: "texto",
          ayuda: "Los enlaces de las columnas toman solos el nombre de cada camino y cada espacio.",
        },
        { id: "columnaContacto", etiqueta: "Título de la columna de contacto", tipo: "texto" },
        {
          id: "correo",
          etiqueta: "Correo de contacto",
          tipo: "texto",
          ayuda: "Se ve en el pie, en Contacto y en las páginas de Privacidad y Términos.",
        },
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
        {
          id: "substack",
          etiqueta: "Substack (enlace)",
          tipo: "texto",
          ayuda: "Vacío deja el ícono apagado.",
        },
      ] satisfies Campo[]
    ).map((campo): Campo => ({ ...campo, compartido: CAMPOS_COMPARTIDOS_DEL_PIE.includes(campo.id) })),
    slots: [],
    porDefecto: ({ footer, whatsapp }) => ({
      descripcion: footer.descripcion,
      ubicacion: footer.ubicacion,
      introContacto: footer.contacto.intro,
      lema: footer.lema,
      columnaServicios: footer.columnas[0]?.titulo ?? "",
      columnaEcosistema: footer.columnas[1]?.titulo ?? "",
      columnaContacto: footer.contacto.titulo,
      correo,
      whatsappNumero: whatsapp.numero,
      whatsappVisible: whatsapp.visible,
      whatsappMensaje: whatsapp.mensaje,
      instagram: footer.contacto.instagram.href ?? "",
      linkedin: footer.redes.find((r) => r.id === "linkedin")?.href ?? "",
      tiktok: footer.redes.find((r) => r.id === "tiktok")?.href ?? "",
      youtube: footer.redes.find((r) => r.id === "youtube")?.href ?? "",
      substack: footer.redes.find((r) => r.id === "substack")?.href ?? "",
    }),
  },
  {
    id: "pagina-servicios",
    grupo: "Página de Servicios",
    titulo: "Encabezado y caminos de Servicios",
    descripcion: "La franja verde con el título de la página y los nombres de los tres caminos.",
    vistaPrevia: "/servicios",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      ...ES.caminos.flatMap((camino, i): Campo[] => [
        {
          id: `camino_${i + 1}_titulo`,
          etiqueta: `${camino.emoji} Camino ${i + 1} — nombre`,
          tipo: "texto",
          ayuda: "También aparece en el pie de página.",
        },
        { id: `camino_${i + 1}_descripcion`, etiqueta: `${camino.emoji} Camino ${i + 1} — descripción`, tipo: "parrafo" },
      ]),
    ],
    slots: [],
    porDefecto: ({ paginaServicios, caminos }) => ({
      eyebrow: paginaServicios.eyebrow,
      titulo: paginaServicios.titulo,
      bajada: paginaServicios.bajada,
      ...Object.fromEntries(
        caminos.flatMap((camino, i) => [
          [`camino_${i + 1}_titulo`, camino.titulo],
          [`camino_${i + 1}_descripcion`, camino.descripcion],
        ])
      ),
    }),
  },
  ...ES.caminos.flatMap((camino) =>
    camino.ofertas.map(
      (oferta): SeccionEditable => ({
        id: `servicio:${oferta.slug}`,
        grupo: "Página de Servicios",
        titulo: oferta.titulo,
        descripcion: `${camino.emoji} ${camino.titulo}`,
        vistaPrevia: `/servicios#${oferta.slug}`,
        campos: [
          { id: "titulo", etiqueta: "Nombre del servicio", tipo: "texto" },
          { id: "descripcion", etiqueta: "Descripción", tipo: "parrafo" },
          { id: "paraQuien", etiqueta: "Para quién es", tipo: "parrafo" },
          { id: "incluye", etiqueta: "Qué incluye", tipo: "lista", ayuda: "Un renglón por ítem." },
          {
            id: "inscripcion",
            etiqueta: "Botón de inscripción (opcional)",
            tipo: "enlace",
            ayuda:
              "Por ejemplo \"Pre-inscribirme\" y el enlace de un formulario de Google. Aparece antes de \"Reservar mi sesión\". Sin texto o sin destino no aparece.",
          },
        ],
        slots: [`folleto-${oferta.imagen.split("/").pop()?.replace(".jpg", "")}`],
        porDefecto: (c) => {
          const enIdioma = ofertaDe(c, oferta.slug);
          return {
            titulo: enIdioma.titulo,
            descripcion: enIdioma.descripcion,
            paraQuien: enIdioma.paraQuien,
            incluye: listaATexto(enIdioma.incluye),
            inscripcion: enIdioma.inscripcion ?? { label: "", href: "" },
          };
        },
      })
    )
  ),
  ...ES.espacios.map(
    (espacio): SeccionEditable => ({
      id: `espacio:${espacio.slug}`,
      grupo: "Espacios del Ecosistema",
      titulo: espacio.nombre,
      descripcion: "Su círculo en la Home y su página propia.",
      vistaPrevia: `/ecosistema/${espacio.slug}`,
      campos: [
        {
          id: "titulo",
          etiqueta: "Nombre del espacio",
          tipo: "texto",
          ayuda: "Se ve en el círculo de la Home, en la página del espacio y en el pie.",
        },
        {
          id: "estadoCorto",
          etiqueta: "Leyenda del círculo en la Home",
          tipo: "texto",
          ayuda: "La palabra chica arriba del nombre, como \"Próximamente\". Vacía no aparece.",
        },
        {
          id: "botonCirculo",
          etiqueta: "Botón del círculo en la Home",
          tipo: "texto",
          ayuda: "Por ejemplo \"+ info\". Lleva a la página del espacio.",
        },
        { id: "estado", etiqueta: "Estado", tipo: "texto", ayuda: "La pastilla verde de la página: \"Próximamente\", \"En lanzamiento…\"" },
        { id: "resumen", etiqueta: "Resumen", tipo: "parrafo" },
        { id: "parrafos", etiqueta: "Texto de la página", tipo: "parrafos", ayuda: "Un renglón en blanco entre párrafo y párrafo." },
        {
          id: "incluye",
          etiqueta: "Qué se lleva quien participa",
          tipo: "lista",
          ayuda:
            "Un renglón por ítem. Para una tarjeta con título y texto, separalos con dos puntos (Perspectiva: Acceder a miradas diversas…). Sin dos puntos se muestra como lista. Vacío no aparece.",
        },
        { id: "extras", etiqueta: "Además incluye", tipo: "lista", ayuda: "Un renglón por ítem. Dejalo vacío para ocultar el bloque." },
        {
          id: "video",
          etiqueta: "Video de YouTube (enlace)",
          tipo: "texto",
          ayuda:
            "Pegá el enlace del video: se ve al costado del texto. Si el enlace trae un minuto (&t=…), arranca ahí. Vacío no aparece.",
        },
        { id: "ctaTitulo", etiqueta: "Cierre — título", tipo: "texto" },
        { id: "ctaBajada", etiqueta: "Cierre — bajada", tipo: "parrafo" },
        {
          id: "ctaBoton",
          etiqueta: "Cierre — botón",
          tipo: "enlace",
          ayuda:
            "En \"Destino\" va adónde lleva: una página del sitio (/contacto) o un enlace completo, como un formulario de Google (https://forms.gle/…).",
        },
      ],
      slots: [],
      porDefecto: (c) => {
        const enIdioma = espacioDe(c, espacio.slug);
        return {
          titulo: enIdioma.titulo,
          estadoCorto: enIdioma.estadoCorto ?? "",
          botonCirculo: enIdioma.cta.label,
          estado: enIdioma.estado,
          resumen: enIdioma.resumen,
          parrafos: parrafosATexto(enIdioma.parrafos),
          incluye: incluyeATexto(enIdioma.incluye ?? []),
          extras: listaATexto(enIdioma.extras ?? []),
          video: enIdioma.video ?? "",
          ctaTitulo: enIdioma.ctaPagina.titulo,
          ctaBajada: enIdioma.ctaPagina.bajada,
          ctaBoton: enIdioma.ctaPagina.principal,
        };
      },
    })
  ),
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
      { id: "formacionTitulo", etiqueta: "Título de la formación", tipo: "texto" },
      {
        id: "formacion",
        etiqueta: "Formación",
        tipo: "lista",
        ayuda: "Una formación o certificación por renglón. Dejalo vacío para ocultar el bloque.",
      },
      { id: "enfoqueTitulo", etiqueta: "Título del enfoque", tipo: "texto" },
      { id: "enfoqueCita", etiqueta: "Frase del enfoque", tipo: "parrafo" },
      { id: "enfoque", etiqueta: "Enfoque", tipo: "parrafos" },
    ],
    slots: ["belen-foto"],
    porDefecto: ({ belen }) => ({
      eyebrow: belen.eyebrow,
      saludo: belen.saludo,
      rol: belen.rol,
      titulos: listaATexto(belen.titulos),
      presentacion: parrafosATexto(belen.presentacion),
      cita: belen.cita,
      citaTexto: belen.citaTexto,
      caminoTitulo: belen.caminoTitulo,
      camino: parrafosATexto(belen.camino),
      formacionTitulo: belen.formacionTitulo,
      formacion: listaATexto(belen.formacion),
      enfoqueTitulo: belen.enfoqueTitulo,
      enfoqueCita: belen.enfoqueCita,
      enfoque: parrafosATexto(belen.enfoque),
    }),
  },
  {
    id: "contacto",
    grupo: "Contacto",
    titulo: "Página de Contacto",
    descripcion: "El encabezado, las tres vías para escribirle a Belén y la agenda.",
    vistaPrevia: "/contacto",
    campos: [
      { id: "eyebrow", etiqueta: "Etiqueta", tipo: "texto" },
      { id: "titulo", etiqueta: "Título", tipo: "texto" },
      { id: "bajada", etiqueta: "Bajada", tipo: "parrafo" },
      { id: "nota", etiqueta: "Nota entre paréntesis", tipo: "texto" },
      ...ES.contacto.vias.flatMap((via): Campo[] => [
        { id: `via_${via.id}_titulo`, etiqueta: `${via.titulo} — título`, tipo: "texto" },
        { id: `via_${via.id}_texto`, etiqueta: `${via.titulo} — texto`, tipo: "parrafo" },
      ]),
      { id: "agendaTitulo", etiqueta: "Título de la agenda", tipo: "texto" },
      { id: "agendaTexto", etiqueta: "Texto de la agenda", tipo: "parrafo" },
      { id: "redesTitulo", etiqueta: "Título del bloque de redes", tipo: "texto" },
      { id: "redesTexto", etiqueta: "Texto del bloque de redes", tipo: "parrafo" },
    ],
    slots: [],
    porDefecto: ({ contacto }) => ({
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
      agendaTitulo: contacto.agendaTitulo,
      agendaTexto: contacto.agendaTexto,
      redesTitulo: contacto.redesTitulo,
      redesTexto: contacto.redesTexto,
    }),
  },
];

export function obtenerSeccion(id: string): SeccionEditable | undefined {
  return SECCIONES.find((seccion) => seccion.id === id);
}
