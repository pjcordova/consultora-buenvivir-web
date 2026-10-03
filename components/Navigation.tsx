"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SelectorIdioma from "@/components/SelectorIdioma";
import { enlaceEnIdioma, rutaSinIdioma, type Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

/** Persona dentro de un círculo: el ícono del acceso al panel. */
const IconoPanel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 18.6a6.5 6.5 0 0 1 11 0" />
  </svg>
);

export default function Navigation({ idioma }: { idioma: Idioma }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const { menu } = textosDe(idioma);

  const enlaces = [
    { href: "/servicios", label: menu.servicios },
    { href: "/sobre-belen", label: menu.sobreBelen },
    { href: "/contacto", label: menu.contacto },
  ];

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

  // Se compara sin el /en: la sección activa es la misma en los dos idiomas
  const linkClass = (href: string) =>
    rutaSinIdioma(pathname) === href
      ? "font-bold text-forest-950"
      : "text-forest-800/75 hover:text-forest-950";

  return (
    <>
      {/* Escritorio */}
      <nav className="hidden items-center gap-8 font-redonda text-[1.05rem] font-semibold md:flex lg:gap-10 lg:text-[1.15rem]">
        {enlaces.map((link) => (
          <Link key={link.href} href={enlaceEnIdioma(link.href, idioma)} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 border-l border-forest-800/15 pl-6 lg:pl-8">
          <SelectorIdioma idioma={idioma} etiqueta={menu.idioma} className="text-sm" />
          {/* Acceso al panel de Belén: si ya inició sesión entra directo; si no, le pide la clave.
              Enlace común: el panel no tiene versión en inglés ni conviene precargarlo. */}
          <a
            href="/admin"
            title={menu.panel}
            aria-label={menu.panel}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-800/70 transition-colors hover:bg-cream hover:text-forest-950"
          >
            <IconoPanel />
          </a>
        </div>
      </nav>

      {/* Móvil */}
      <button
        type="button"
        className="-mr-2 p-2 text-forest-800 md:hidden"
        aria-label={abierto ? menu.cerrar : menu.abrir}
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
          {enlaces.map((link) => (
            <Link
              key={link.href}
              href={enlaceEnIdioma(link.href, idioma)}
              className={`py-3 font-redonda text-xl font-semibold ${linkClass(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
          <SelectorIdioma
            idioma={idioma}
            etiqueta={menu.idioma}
            className="mt-2 border-t border-forest-800/10 pt-4 font-redonda text-lg font-semibold"
          />
          <a
            href="/admin"
            className="mt-3 flex items-center gap-2 py-2 font-redonda text-base font-semibold text-forest-800/60 transition-colors hover:text-forest-950"
          >
            <IconoPanel />
            {menu.panel}
          </a>
        </nav>
      )}
    </>
  );
}
