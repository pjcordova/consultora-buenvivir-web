import AnimatedSection from "@/components/ui/AnimatedSection";
import ContactoForm from "@/components/sections/ContactoForm";

export const metadata = {
  title: "Contacto | Buen Vivir",
};

export default function ContactoPage() {
  return (
    <AnimatedSection className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-serif text-bv-verde-oscuro">Contacto</h1>
      <p className="mt-4 text-bv-negro/80">
        Sumate a la comunidad de Buen Vivir completando el formulario.
      </p>
      <ContactoForm />
    </AnimatedSection>
  );
}
