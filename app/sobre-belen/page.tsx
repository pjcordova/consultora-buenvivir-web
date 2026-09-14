import AnimatedSection from "@/components/ui/AnimatedSection";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Sobre Belén | Buen Vivir",
};

export default async function SobreBelenPage() {
  const { sobreBelen } = await getSiteContent();

  return (
    <AnimatedSection className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-serif text-bv-verde-oscuro">Sobre Belén</h1>
      {/*
        TODO: reemplazar por la biografía, formación y credenciales reales
        de Belén Vera. No inventar títulos, certificaciones ni años de
        experiencia — confirmar cada dato con ella antes de publicar.
      */}
      <p className="mt-4 text-bv-negro/80">{sobreBelen?.bioCorta ?? "Biografía pendiente de confirmar."}</p>
    </AnimatedSection>
  );
}
