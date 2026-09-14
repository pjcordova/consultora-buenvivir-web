import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Hero() {
  return (
    <AnimatedSection className="mx-auto max-w-4xl px-6 py-24 text-center">
      {/* TODO: reemplazar copy e imagen por los definidos en el mockup de Google Stitch (Home) */}
      <h1 className="text-4xl font-serif text-bv-verde-oscuro sm:text-5xl">
        Regeneración organizacional y crecimiento personal
      </h1>
      <p className="mt-6 text-lg text-bv-negro/70">
        Acompañamos a equipos y personas a florecer, inspirados en los ciclos
        de la naturaleza.
      </p>
    </AnimatedSection>
  );
}
