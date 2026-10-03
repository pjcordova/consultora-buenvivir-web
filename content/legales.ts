/**
 * Páginas de Privacidad y Términos.
 *
 * CONFIRMADO por Belén: la responsable es ella como persona (Belén Vera) y el
 * correo de contacto es el del pie. Describen cómo funciona el sitio hoy (sin
 * formularios propios, estadísticas sin cookies, agenda y formularios de Google,
 * videos de YouTube, WhatsApp). Si se suma un formulario propio, un newsletter o
 * pagos en el sitio, hay que actualizarlas.
 *
 * En los textos, {correo} se reemplaza por el correo de contacto (con enlace) y
 * {privacidad} por un enlace a la Política de privacidad.
 */

export type BloqueLegal = { titulo: string; parrafos: string[]; lista?: string[] };

export type TextoLegal = {
  eyebrow: string;
  titulo: string;
  bajada: string;
  actualizado: string;
  bloques: BloqueLegal[];
};

export const privacidad: TextoLegal = {
  eyebrow: "Legales · Privacidad",
  titulo: "Política de privacidad",
  bajada:
    "Cómo se cuidan los datos de quienes visitan este sitio y se ponen en contacto con Buen Vivir.",
  actualizado: "Última actualización: 3 de octubre de 2026",
  bloques: [
    {
      titulo: "Quién es responsable de tus datos",
      parrafos: [
        "Este sitio pertenece a Belén Vera, que ofrece sus servicios como Consultora Buen Vivir y es la responsable de los datos personales que se reciben a través de él. Para cualquier consulta sobre tus datos podés escribir a {correo}.",
      ],
    },
    {
      titulo: "Qué datos se reciben",
      parrafos: [
        "El sitio no tiene formularios propios ni cuentas de usuario: solo se reciben los datos que vos decidís compartir al ponerte en contacto.",
      ],
      lista: [
        "Si escribís por correo o por WhatsApp: tu nombre, tu correo o tu número de teléfono y lo que cuentes en el mensaje.",
        "Si reservás una conversación en la agenda: los datos que pide la reserva de Google Calendar, como tu nombre y tu correo.",
        "Si te sumás a la comunidad: las respuestas que completes en el formulario de Google Forms.",
      ],
    },
    {
      titulo: "Para qué se usan",
      parrafos: [
        "Para responder tus consultas, coordinar y llevar adelante las sesiones o encuentros que acuerdes, y contarte las novedades de la comunidad si te sumaste a ella.",
        "Tus datos no se venden ni se ceden a terceros, y no se usan para publicidad.",
      ],
    },
    {
      titulo: "Servicios de otras empresas",
      parrafos: [
        "Para funcionar, el sitio se apoya en servicios de otras empresas. Cada una trata los datos según su propia política de privacidad, y algunos de esos datos pueden alojarse fuera de la Argentina.",
      ],
      lista: [
        "Vercel (Estados Unidos) aloja el sitio y, como cualquier servidor, registra datos técnicos de las visitas, como la dirección IP, para su funcionamiento y su seguridad.",
        "Google provee la agenda de reservas, los formularios de inscripción y los videos de YouTube que se ven en algunas páginas.",
        "WhatsApp (Meta) recibe los mensajes que se envían desde el botón de WhatsApp.",
      ],
    },
    {
      titulo: "Estadísticas y cookies",
      parrafos: [
        "Para saber cuántas personas visitan el sitio y qué páginas leen se usa Vercel Web Analytics, que cuenta las visitas de forma agregada y anónima, sin cookies y sin identificar a nadie.",
        "El sitio usa solo dos cookies propias: una recuerda el idioma que elegiste (dura un año) y la otra mantiene abierta la sesión del panel de administración, que solo usa quien administra el sitio.",
        "La agenda de Google y los videos de YouTube pueden guardar sus propias cookies cuando interactuás con ellos. Los videos se muestran en el modo de privacidad mejorada de YouTube.",
      ],
    },
    {
      titulo: "Cuánto tiempo se guardan",
      parrafos: [
        "Los datos se conservan mientras hagan falta para responderte, para el proceso que acordaste o para tu participación en la comunidad, y se eliminan cuando lo pidas, salvo que una ley obligue a conservarlos.",
      ],
    },
    {
      titulo: "Tus derechos",
      parrafos: [
        "Podés pedir en cualquier momento acceder a tus datos, corregirlos, actualizarlos o eliminarlos escribiendo a {correo}. Tu pedido se responde dentro de los plazos que fija la Ley 25.326 de Protección de los Datos Personales.",
        "El acceso a tus datos es gratuito si lo pedís con intervalos no menores a seis meses, salvo que acredites un interés legítimo para hacerlo antes (artículo 14, inciso 3, de la Ley 25.326).",
        "La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.",
      ],
    },
    {
      titulo: "Cambios en esta política",
      parrafos: [
        "Si esta política cambia, la versión nueva se publica en esta página con su fecha de actualización.",
      ],
    },
  ],
};

export const terminos: TextoLegal = {
  eyebrow: "Legales · Términos",
  titulo: "Términos y condiciones",
  bajada: "Las condiciones para usar este sitio y para contratar los servicios de Buen Vivir.",
  actualizado: "Última actualización: 3 de octubre de 2026",
  bloques: [
    {
      titulo: "Quién está detrás del sitio",
      parrafos: [
        "Este sitio pertenece a Belén Vera, que ofrece sus servicios con el nombre Consultora Buen Vivir. Usar el sitio implica aceptar estos términos. Para cualquier consulta podés escribir a {correo}.",
      ],
    },
    {
      titulo: "Uso del sitio",
      parrafos: [
        "El sitio es informativo: presenta los servicios, los espacios del Ecosistema Buen Vivir y las formas de ponerse en contacto. Podés recorrerlo y compartir sus enlaces libremente.",
      ],
    },
    {
      titulo: "Propiedad intelectual",
      parrafos: [
        "Los textos, las imágenes, los videos, los logos y los materiales del sitio son de Belén Vera o de sus respectivos autores. No se pueden copiar, modificar ni usar con fines comerciales sin autorización previa por escrito.",
      ],
    },
    {
      titulo: "Servicios y reservas",
      parrafos: [
        "Las descripciones de los servicios son orientativas. El alcance, la modalidad, las fechas y los honorarios de cada proceso se acuerdan directamente con Belén antes de comenzar.",
        "Reservar un horario en la agenda coordina una conversación. Si necesitás reprogramarla o cancelarla, avisá por cualquiera de los canales de contacto.",
      ],
    },
    {
      titulo: "Sobre el acompañamiento",
      parrafos: [
        "Los procesos de facilitación y acompañamiento no reemplazan la atención médica ni psicológica.",
      ],
    },
    {
      titulo: "Enlaces y contenidos de otros sitios",
      parrafos: [
        "El sitio incluye enlaces y contenidos de servicios de otras empresas, como Google, YouTube, WhatsApp, Instagram, LinkedIn, TikTok y Substack. Buen Vivir no es responsable por sus contenidos ni por sus políticas.",
      ],
    },
    {
      titulo: "Responsabilidad",
      parrafos: [
        "Se procura que la información del sitio sea correcta y esté actualizada, pero puede contener errores o cambiar sin aviso.",
      ],
    },
    {
      titulo: "Datos personales",
      parrafos: ["Cómo se tratan tus datos se explica en la {privacidad}."],
    },
    {
      titulo: "Cambios y ley aplicable",
      parrafos: [
        "Estos términos pueden actualizarse; la versión vigente es la publicada en esta página. Se rigen por las leyes de la República Argentina.",
      ],
    },
  ],
};
