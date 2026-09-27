"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navigation() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // Cerrar el menú móvil al cambiar de página o al presionar Escape.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [abierto]);

  const linkClass = (href: string) =>
    pathname === href
      ? "font-bold text-forest-950"
      : "text-forest-800/75 hover:text-forest-950";

  return (
    <>
      {/* Escritorio */}
      <nav className="hidden items-center gap-8 font-redonda text-[1.05rem] font-semibold md:flex lg:gap-10 lg:text-[1.15rem]">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Móvil */}
      <button
        type="button"
        className="-mr-2 p-2 text-forest-800 md:hidden"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        onClick={() => setAbierto((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          {abierto ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {abierto && (
        <nav
          id="menu-movil"
          className="absolute inset-x-0 top-full z-50 flex flex-col border-b border-forest-800/10 bg-white px-[8vw] pb-4 shadow-sm md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 font-redonda text-xl font-semibold ${linkClass(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
