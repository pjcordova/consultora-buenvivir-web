import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/** Envoltorio de las páginas públicas: el panel (/admin) no lleva pie ni botón flotante. */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
