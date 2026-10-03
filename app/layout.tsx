import type { Metadata } from "next";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { metadatosDelSitio } from "@/lib/metadatos";
import "./globals.css";

// Valores de base, en el idioma de la visita: cada página pone su título,
// descripción y dirección oficial con metadatosDePagina() (lib/metadatos.ts).
export function generateMetadata(): Metadata {
  return metadatosDelSitio(obtenerIdioma());
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={obtenerIdioma()}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Quicksand:wght@500;600;700&family=Work+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-forest-950 text-parchment font-body">
        {children}
      </body>
    </html>
  );
}
