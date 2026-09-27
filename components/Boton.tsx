import Link from "next/link";
import type { ReactNode } from "react";

type BotonProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Enlace de los botones del sitio. Los destinos editables desde el panel pueden
 * ser internos (/contacto) o externos (una agenda de Google, por ejemplo): los
 * externos se abren en otra pestaña.
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
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
