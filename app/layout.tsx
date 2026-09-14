import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buen Vivir — Consultora Regenerativa",
  description:
    "Acompañamos a organizaciones, equipos y personas en procesos de regeneración organizacional, inspirados en la cosmovisión del Buen Vivir.",
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&family=Work+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-forest-950 text-parchment font-body">{children}</body>
    </html>
  );
}
