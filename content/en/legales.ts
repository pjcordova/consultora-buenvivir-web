import type { TextoLegal } from "@/content/legales";

/**
 * Privacy and Terms pages, in English.
 * Traducción de content/legales.ts: si cambia una, hay que cambiar la otra.
 */

export const privacidad: TextoLegal = {
  eyebrow: "Legal · Privacy",
  titulo: "Privacy policy",
  bajada:
    "How the data of people who visit this site and get in touch with Buen Vivir is looked after.",
  actualizado: "Last updated: October 3, 2026",
  bloques: [
    {
      titulo: "Who is responsible for your data",
      parrafos: [
        "This site belongs to Belén Vera, who offers her services as Consultora Buen Vivir and is responsible for the personal data received through it. For any question about your data you can write to {correo}.",
      ],
    },
    {
      titulo: "What data is received",
      parrafos: [
        "The site has no forms of its own and no user accounts: the only data received is what you choose to share when you get in touch.",
      ],
      lista: [
        "If you write by email or WhatsApp: your name, your email address or phone number and whatever you share in the message.",
        "If you book a conversation in the calendar: the details requested by the Google Calendar booking, such as your name and email.",
        "If you join the community: the answers you fill in on the Google Forms form.",
      ],
    },
    {
      titulo: "What it is used for",
      parrafos: [
        "To answer your questions, arrange and carry out the sessions or gatherings you agree on, and share community news with you if you joined it.",
        "Your data is not sold or passed on to third parties, and it is not used for advertising.",
      ],
    },
    {
      titulo: "Services from other companies",
      parrafos: [
        "To work, the site relies on services from other companies. Each of them handles data according to its own privacy policy, and some of that data may be stored outside Argentina.",
      ],
      lista: [
        "Vercel (United States) hosts the site and, like any server, logs technical data about visits, such as the IP address, for its operation and security.",
        "Google provides the booking calendar, the sign-up forms and the YouTube videos shown on some pages.",
        "WhatsApp (Meta) receives the messages sent from the WhatsApp button.",
      ],
    },
    {
      titulo: "Statistics and cookies",
      parrafos: [
        "To know how many people visit the site and which pages they read, it uses Vercel Web Analytics, which counts visits in an aggregated and anonymous way, without cookies and without identifying anyone.",
        "The site uses only two cookies of its own: one remembers the language you chose (it lasts one year) and the other keeps the admin panel session open, used only by whoever manages the site.",
        "The Google calendar and the YouTube videos may store their own cookies when you interact with them. Videos are shown in YouTube's privacy-enhanced mode.",
      ],
    },
    {
      titulo: "How long it is kept",
      parrafos: [
        "Data is kept for as long as it is needed to answer you, for the process you agreed on or for your participation in the community, and it is deleted when you ask, unless a law requires keeping it.",
      ],
    },
    {
      titulo: "Your rights",
      parrafos: [
        "You can ask at any time to access, correct, update or delete your data by writing to {correo}. Your request will be answered within the time limits set by Argentine Personal Data Protection Law 25,326.",
        "Access to your data is free of charge if you request it at intervals of no less than six months, unless you show a legitimate interest in doing so sooner (article 14, subsection 3, of Law 25,326).",
        "The Agency for Access to Public Information (Agencia de Acceso a la Información Pública), as the supervisory authority of Law 25,326, has the power to handle complaints and claims filed by anyone whose rights are affected by non-compliance with the rules on personal data protection.",
      ],
    },
    {
      titulo: "Changes to this policy",
      parrafos: [
        "If this policy changes, the new version will be published on this page with its update date.",
      ],
    },
  ],
};

export const terminos: TextoLegal = {
  eyebrow: "Legal · Terms",
  titulo: "Terms and conditions",
  bajada: "The conditions for using this site and for hiring Buen Vivir's services.",
  actualizado: "Last updated: October 3, 2026",
  bloques: [
    {
      titulo: "Who is behind the site",
      parrafos: [
        "This site belongs to Belén Vera, who offers her services under the name Consultora Buen Vivir. Using the site means accepting these terms. For any question you can write to {correo}.",
      ],
    },
    {
      titulo: "Use of the site",
      parrafos: [
        "The site is informational: it presents the services, the spaces of the Buen Vivir Ecosystem and the ways to get in touch. You are free to browse it and share its links.",
      ],
    },
    {
      titulo: "Intellectual property",
      parrafos: [
        "The texts, images, videos, logos and materials on the site belong to Belén Vera or to their respective authors. They may not be copied, modified or used for commercial purposes without prior written permission.",
      ],
    },
    {
      titulo: "Services and bookings",
      parrafos: [
        "Service descriptions are for guidance. The scope, format, dates and fees of each process are agreed directly with Belén before starting.",
        "Booking a slot in the calendar arranges a conversation. If you need to reschedule or cancel it, let her know through any of the contact channels.",
      ],
    },
    {
      titulo: "About the accompaniment",
      parrafos: [
        "Facilitation and accompaniment processes do not replace medical or psychological care.",
      ],
    },
    {
      titulo: "Links and content from other sites",
      parrafos: [
        "The site includes links and content from services of other companies, such as Google, YouTube, WhatsApp, Instagram, LinkedIn, TikTok and Substack. Buen Vivir is not responsible for their content or their policies.",
      ],
    },
    {
      titulo: "Liability",
      parrafos: [
        "Every effort is made to keep the information on the site accurate and up to date, but it may contain errors or change without notice.",
      ],
    },
    {
      titulo: "Personal data",
      parrafos: ["How your data is handled is explained in the {privacidad}."],
    },
    {
      titulo: "Changes and governing law",
      parrafos: [
        "These terms may be updated; the version in force is the one published on this page. They are governed by the laws of the Argentine Republic.",
      ],
    },
  ],
};
