/**
 * Listas que Belén arma desde el panel: testimonios y próximos talleres.
 *
 * A diferencia de las secciones (un texto por campo), acá se agregan, quitan y
 * ordenan elementos. Cada lista se guarda una sola vez para los dos idiomas:
 * los campos de texto tienen versión en español y, opcional, en inglés (si
 * queda vacía, el sitio en inglés muestra la versión en español).
 */

export type CampoDeLista = {
  id: string;
  etiqueta: string;
  /**
   * texto: una línea · parrafo: varias líneas · fecha: AAAA-MM-DD ·
   * hora: HH:MM · enlace: una dirección · si-no: casilla para tildar
   */
  tipo: "texto" | "parrafo" | "fecha" | "hora" | "enlace" | "si-no";
  /** Tiene versión en español y en inglés. */
  porIdioma?: boolean;
  obligatorio?: boolean;
  ayuda?: string;
};

export type IdLista = "testimonios" | "talleres" | "preguntas";

export type ListaEditable = {
  id: IdLista;
  titulo: string;
  descripcion: string;
  /** Cómo se llama cada elemento ("testimonio", "taller"). */
  elemento: string;
  /** Dónde se ve en la web. */
  vistaPrevia: string;
  campos: CampoDeLista[];
  maximo: number;
};

export const LISTAS: ListaEditable[] = [
  {
    id: "testimonios",
    titulo: "Testimonios",
    descripcion:
      "Frases de personas o equipos que trabajaron con Belén. Se muestran en la Home, antes del cierre. Publicá solo testimonios reales y con permiso de quien los dio.",
    elemento: "testimonio",
    vistaPrevia: "/#testimonios",
    maximo: 12,
    campos: [
      { id: "texto", etiqueta: "Testimonio", tipo: "parrafo", porIdioma: true, obligatorio: true },
      { id: "nombre", etiqueta: "Nombre", tipo: "texto", obligatorio: true, ayuda: "Por ejemplo: María G." },
      {
        id: "rol",
        etiqueta: "Cargo u organización",
        tipo: "texto",
        porIdioma: true,
        ayuda: "Opcional. Por ejemplo: Líder de equipo en una cooperativa.",
      },
      { id: "visible", etiqueta: "Mostrar en la web", tipo: "si-no" },
    ],
  },
  {
    id: "talleres",
    titulo: "Próximos talleres y encuentros",
    descripcion:
      "Se muestran en la Home, ordenados por fecha. Los que ya pasaron se ocultan solos.",
    elemento: "taller",
    vistaPrevia: "/#talleres",
    maximo: 20,
    campos: [
      { id: "titulo", etiqueta: "Nombre del taller", tipo: "texto", porIdioma: true, obligatorio: true },
      { id: "fecha", etiqueta: "Fecha", tipo: "fecha", obligatorio: true },
      {
        id: "hora",
        etiqueta: "Hora (de Argentina)",
        tipo: "hora",
        ayuda: "Opcional. La web aclara que es hora de Argentina, para quien entra desde otro país.",
      },
      {
        id: "modalidad",
        etiqueta: "Modalidad o lugar",
        tipo: "texto",
        porIdioma: true,
        ayuda: "Por ejemplo: Online por Zoom · Freyre, Córdoba.",
      },
      { id: "descripcion", etiqueta: "Descripción", tipo: "parrafo", porIdioma: true },
      { id: "cupo", etiqueta: "Cupo", tipo: "texto", porIdioma: true, ayuda: "Opcional. Por ejemplo: 12 lugares." },
      {
        id: "inscripcion",
        etiqueta: "Enlace de inscripción",
        tipo: "enlace",
        ayuda: "Un formulario, la agenda o /contacto. Vacío: el botón lleva a Contacto.",
      },
    ],
  },
  {
    id: "preguntas",
    titulo: "Preguntas frecuentes",
    descripcion:
      "Se muestran en la Home (antes de \"Iniciar una conversación\"), en Contacto y al final de Servicios, en el orden de esta lista. Sirven para responder las dudas de siempre (la primera sesión, la modalidad, el idioma, la duración, el precio) antes de que te escriban.",
    elemento: "pregunta",
    vistaPrevia: "/#preguntas",
    maximo: 15,
    campos: [
      {
        id: "pregunta",
        etiqueta: "Pregunta",
        tipo: "texto",
        porIdioma: true,
        obligatorio: true,
        ayuda: "Por ejemplo: ¿Las sesiones son online o presenciales?",
      },
      {
        id: "respuesta",
        etiqueta: "Respuesta",
        tipo: "parrafo",
        porIdioma: true,
        obligatorio: true,
        ayuda: "Corta y clara. Un renglón en blanco separa párrafos.",
      },
    ],
  },
];

export const obtenerLista = (id: string): ListaEditable | undefined =>
  LISTAS.find((lista) => lista.id === id);

/** Un texto en los dos idiomas. */
export type TextoBilingue = { es: string; en: string };

/** Un elemento tal como se guarda: cada campo es un texto, un texto bilingüe o un sí/no. */
export type ElementoGuardado = { id: string } & Record<string, string | boolean | TextoBilingue>;
