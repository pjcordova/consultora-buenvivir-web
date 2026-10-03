import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/*
 * Las páginas se arman en cada visita, con los textos e imágenes guardados en
 * memoria (lib/almacen.ts). Así, cuando Belén guarda algo en el panel, se ve en
 * la primera recarga. Con páginas estáticas Vercel entrega una vez más la
 * versión vieja mientras arma la nueva.
 */
export const dynamic = "force-dynamic";

/**
 * Envoltorio de las páginas públicas: el panel (/admin) no lleva pie ni botón
 * flotante, y sus visitas no se cuentan en las estadísticas.
 */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <WhatsAppButton />
      {/* Estadísticas de Vercel: sin cookies, así que no hace falta cartel de aviso */}
      <Analytics />
    </>
  );
}
