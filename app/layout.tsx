import type { Metadata } from "next";
import {
  DESCRIPCION_DEL_SITIO,
  imagenParaCompartir,
  NOMBRE_DEL_SITIO,
  TITULO_DEL_SITIO,
  URL_DEL_SITIO,
} from "@/lib/metadatos";
import "./globals.css";

// Valores de base: cada página pone su título, descripción y dirección oficial
// con metadatosDePagina() (lib/metadatos.ts).
export const metadata: Metadata = {
  metadataBase: new URL(URL_DEL_SITIO),
  title: TITULO_DEL_SITIO,
  description: DESCRIPCION_DEL_SITIO,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: NOMBRE_DEL_SITIO,
    images: [imagenParaCompartir("inicio")],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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
