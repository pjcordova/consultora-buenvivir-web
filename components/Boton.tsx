import Link from "next/link";
import type { ReactNode } from "react";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";

type BotonProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Enlace de los botones del sitio. Los destinos editables desde el panel pueden
 * ser internos (/contacto) o externos (una agenda de Google, por ejemplo): los
 * externos se abren en otra pestaña, y los internos se llevan solos al idioma
 * de la página ("/contacto" → "/en/contacto").
 */
export default function Boton({ href, className, children }: BotonProps) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={enlaceEnIdioma(href, obtenerIdioma())} className={className}>
      {children}
    </Link>
  );
}
