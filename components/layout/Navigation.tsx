"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sobre-belen", label: "Sobre Belén" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "font-semibold text-bv-verde-oscuro"
              : "text-bv-negro/70 hover:text-bv-verde-oscuro"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
