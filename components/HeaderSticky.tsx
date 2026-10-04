"use client";

import { useEffect, useState } from "react";

/**
 * Barra superior que acompaña el scroll.
 * La sombra aparece recién cuando la página se movió, para que sobre la portada
 * el header se apoye en la foto sin una línea dura.
 */
export default function HeaderSticky({ children }: { children: React.ReactNode }) {
  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const alScrollear = () => setScrolleado(window.scrollY > 8);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  return (
    <header
      data-zona="menú"
      className={`sticky top-0 z-30 flex h-20 items-center justify-between bg-white px-[8vw] transition-shadow duration-300 md:h-24 ${
        scrolleado ? "shadow-[0_6px_20px_-12px_rgba(18,23,15,0.5)]" : ""
      }`}
    >
      {children}

      {/* Franja con los verdes del logo: separa el header de la sección siguiente */}
      <span
        className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-leaf via-leaf-lime to-leaf"
        aria-hidden="true"
      />
    </header>
  );
}
