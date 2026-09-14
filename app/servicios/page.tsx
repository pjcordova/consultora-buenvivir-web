import ServiciosGrid from "@/components/sections/ServiciosGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getServicios } from "@/lib/content";

export const metadata = {
  title: "Servicios | Buen Vivir",
};

export default async function ServiciosPage() {
  const servicios = await getServicios();

  return (
    <AnimatedSection className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-serif text-bv-verde-oscuro">Servicios</h1>
      {/* TODO: texto introductorio a confirmar con Belén */}
      <ServiciosGrid servicios={servicios} />
    </AnimatedSection>
  );
}
