import type { Servicio } from "@/types/content";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface ServiciosGridProps {
  servicios: Servicio[];
}

export default function ServiciosGrid({ servicios }: ServiciosGridProps) {
  return (
    <AnimatedSection className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {servicios.map((servicio) => (
        <article
          key={servicio.slug}
          className="rounded-organic border border-bv-verde/20 bg-white/60 p-6"
        >
          <h3 className="font-serif text-xl text-bv-verde-oscuro">
            {servicio.titulo}
          </h3>
          <p className="mt-2 text-sm text-bv-negro/70">{servicio.resumen}</p>
        </article>
      ))}
    </AnimatedSection>
  );
}
