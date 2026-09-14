import Hero from "@/components/sections/Hero";
import ServiciosGrid from "@/components/sections/ServiciosGrid";
import { getServicios } from "@/lib/content";

export default async function HomePage() {
  const servicios = await getServicios();

  return (
    <>
      <Hero />
      <ServiciosGrid servicios={servicios} />
    </>
  );
}
