import type { Metadata } from "next";
import Header from "@/components/Header";

// PENDIENTE — WhatsApp definitivo, email real, y si hay sistema de agenda
// (Calendly/Cal.com) dependen de las preguntas 1, 2, 30 y 31 del cuestionario.

export const metadata: Metadata = {
  title: "Contacto | Buen Vivir",
  description: "Reserva tu sesión y coordinamos una conversación inicial.",
};

export default function ContactoPage() {
  return (
    <main>
      <Header />
      <section className="px-[8vw] py-16 max-w-xl text-center mx-auto">
        <h1 className="font-display italic text-4xl mb-6">¿Conversamos?</h1>
        <p className="text-[#c9c2a9] mb-10">
          Reserva tu sesión y coordinamos una conversación inicial.
        </p>
        <div className="text-sm text-[#8a8470]">
          [PENDIENTE — WhatsApp, email y agenda reales, a confirmar con Belén]
        </div>
      </section>
    </main>
  );
}
