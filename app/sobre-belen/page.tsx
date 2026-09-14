import type { Metadata } from "next";
import Header from "@/components/Header";

// PENDIENTE — esta página depende casi por completo de las respuestas del
// cuestionario (Sección 3): años de trayectoria, título universitario,
// certificaciones, y cómo redactar la afiliación real con Presencing Institute /
// U-Lab / Regenerative Network for Migrant and Refugee Communities.
// Se deja la estructura lista para no perder tiempo una vez que lleguen los datos.

// PENDIENTE: sumar `description` cuando esté la biografía confirmada.
export const metadata: Metadata = {
  title: "Sobre Belén | Buen Vivir",
};

export default function SobreBelenPage() {
  return (
    <main>
      <Header />
      <section className="px-[8vw] py-16 max-w-2xl">
        <h1 className="font-display text-4xl mb-6">Belén</h1>
        <blockquote className="font-display italic text-2xl text-parchment mb-8">
          &ldquo;Las organizaciones no son máquinas, son organismos vivos.&rdquo;
        </blockquote>
        <p className="text-[#c9c2a9] text-sm">
          [PENDIENTE — biografía completa a partir de las respuestas del
          cuestionario: años de trayectoria, formación, certificaciones,
          afiliaciones reales]
        </p>
      </section>
    </main>
  );
}
