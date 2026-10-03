import type { Metadata } from "next";
import PaginaLegal from "@/components/PaginaLegal";
import { contenidoDe } from "@/content";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDePagina } from "@/lib/metadatos";

export function generateMetadata(): Metadata {
  const idioma = obtenerIdioma();
  const { titulo, bajada } = contenidoDe(idioma).privacidad;
  return metadatosDePagina({
    idioma,
    titulo: `${titulo} | Buen Vivir`,
    descripcion: bajada,
    ruta: "/privacidad",
  });
}

export default function PrivacidadPage() {
  const idioma = obtenerIdioma();
  return <PaginaLegal texto={contenidoDe(idioma).privacidad} idioma={idioma} />;
}
