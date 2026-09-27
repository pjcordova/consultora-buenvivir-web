import { obtenerWhatsapp, urlWhatsapp } from "@/lib/contenido";

/**
 * Botón flotante fijo abajo a la derecha. Abre WhatsApp con el mensaje ya escrito.
 */
export default async function WhatsAppButton() {
  const [whatsapp, whatsappUrl] = await Promise.all([obtenerWhatsapp(), urlWhatsapp()]);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp a ${whatsapp.visible}`}
      title="Solicitar una asesoría por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg shadow-forest-950/25 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf sm:bottom-8 sm:right-8"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.17-1.35a9.93 9.93 0 0 0 4.87 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 18.18h-.01a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.43a8.22 8.22 0 0 1 2.42 5.85c0 4.57-3.71 8.25-8.28 8.25Zm4.54-6.18c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
      </svg>
    </a>
  );
}
