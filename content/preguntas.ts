import type { Idioma } from "@/lib/idioma";

/**
 * Preguntas frecuentes DE EJEMPLO, solo para ver el diseño en la computadora de
 * desarrollo mientras la lista del panel está vacía. Nunca se publican: las
 * preguntas reales (y sobre todo las respuestas, como el precio o la modalidad)
 * las carga Belén desde el panel.
 */
export const PREGUNTAS_DE_EJEMPLO: Record<Idioma, { pregunta: string; respuesta: string }[]> = {
  es: [
    {
      pregunta: "¿Cómo es la primera conversación?",
      respuesta:
        "Es un primer encuentro para conocerse: le contás a Belén en qué momento estás y qué estás buscando, y ven juntos qué camino te puede servir. Se reserva en la agenda de la página de Contacto.",
    },
    {
      pregunta: "¿Las sesiones son online o presenciales?",
      respuesta: "Las sesiones son online por videollamada, así podés participar desde cualquier lugar.",
    },
    {
      pregunta: "¿En qué idioma son los encuentros?",
      respuesta: "En español y en inglés.",
    },
    {
      pregunta: "¿Cuánto dura un proceso?",
      respuesta:
        "Depende de cada persona o equipo. En la primera conversación se acuerdan la cantidad de encuentros y su frecuencia.",
    },
    {
      pregunta: "¿Cuánto cuesta?",
      respuesta: "El valor depende del proceso que elijas. En la primera conversación Belén te cuenta las opciones.",
    },
  ],
  en: [
    {
      pregunta: "What is the first conversation like?",
      respuesta:
        "It's a first meeting to get to know each other: you tell Belén where you are and what you're looking for, and together you see which path could help. You can book it in the calendar on the Contact page.",
    },
    {
      pregunta: "Are sessions online or in person?",
      respuesta: "Sessions are held online by video call, so you can join from anywhere.",
    },
    {
      pregunta: "What language are the sessions in?",
      respuesta: "In Spanish and English.",
    },
    {
      pregunta: "How long does a process last?",
      respuesta:
        "It depends on each person or team. The number of sessions and how often to meet are agreed in the first conversation.",
    },
    {
      pregunta: "How much does it cost?",
      respuesta: "It depends on the process you choose. In the first conversation Belén will walk you through the options.",
    },
  ],
};
