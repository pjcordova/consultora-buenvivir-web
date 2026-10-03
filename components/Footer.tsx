import Image from "next/image";
import Link from "next/link";
import type { EnlaceFooter } from "@/content/site";
import RedesSociales from "@/components/RedesSociales";
import { obtenerPie } from "@/lib/contenido";
import { enlaceEnIdioma, type Idioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { textosDe } from "@/lib/textos";

type EnlaceProps = { enlace: EnlaceFooter; idioma: Idioma; className?: string };

/** Enlace del pie: si está pendiente de confirmar se muestra como texto. */
function Enlace({ enlace, idioma, className = "" }: EnlaceProps) {
  if (!enlace.href) {
    return (
      <span className={`text-cream/60 ${className}`} title={textosDe(idioma).pie.pendiente}>
        {enlace.label}
      </span>
    );
  }
  const clases = `text-cream/75 transition-colors hover:text-cream ${className}`;

  // El correo abre el programa de correo de quien visita
  if (enlace.href.startsWith("mailto:")) {
    return (
      <a href={enlace.href} className={clases}>
        {enlace.label}
      </a>
    );
  }

  // Los enlaces externos (WhatsApp, Instagram) se abren en otra pestaña
  if (enlace.href.startsWith("http")) {
    return (
      <a href={enlace.href} target="_blank" rel="noopener noreferrer" className={clases}>
        {enlace.label}
      </a>
    );
  }

  return (
    <Link href={enlaceEnIdioma(enlace.href, idioma)} className={clases}>
      {enlace.label}
    </Link>
  );
}

export default async function Footer() {
  const idioma = obtenerIdioma();
  const textos = textosDe(idioma);
  const { descripcion, ubicacion, columnas, contacto, redes, lema, legales } = await obtenerPie(idioma);

  return (
    <footer className="bg-forest-900 px-[8vw] py-16 text-sm">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo-buen-vivir-claro.png"
            alt={textos.sitio.logoAlt}
            width={480}
            height={331}
            className="h-14 w-auto"
          />
          <p className="mt-5 leading-relaxed text-cream/70">{descripcion}</p>
          <p className="mt-5 flex items-center gap-2 text-xs text-leaf-lime">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {ubicacion}
          </p>
        </div>

        {columnas.map((columna) => (
          <nav key={columna.titulo} aria-label={columna.titulo}>
            <h2 className="font-display text-lg text-cream">{columna.titulo}</h2>
            <ul className="mt-5 space-y-3">
              {columna.enlaces.map((enlace) => (
                <li key={enlace.label} className="flex gap-2">
                  <span className="text-leaf-lime" aria-hidden="true">
                    →
                  </span>
                  <Enlace enlace={enlace} idioma={idioma} />
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="font-display text-lg text-cream">{contacto.titulo}</h2>
          <p className="mt-5 leading-relaxed text-leaf-lime/90">{contacto.intro}</p>
          <ul className="mt-5 space-y-3">
            <li className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream/60" aria-hidden="true">
                <rect x="3" y="4.5" width="18" height="16" rx="2" />
                <path d="M8 2.5v4M16 2.5v4M3 10h18" />
              </svg>
              <Enlace enlace={contacto.agenda} idioma={idioma} />
            </li>
            <li className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream/60" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
              </svg>
              <Enlace enlace={contacto.whatsapp} idioma={idioma} />
            </li>
            <li className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream/60" aria-hidden="true">
                <circle cx="9" cy="8" r="3.2" />
                <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
              </svg>
              <Enlace enlace={contacto.comunidad} idioma={idioma} />
            </li>
            <li className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream/60" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
              <Enlace enlace={contacto.instagram} idioma={idioma} />
            </li>
            <li className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-cream/60" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <Enlace enlace={contacto.email} idioma={idioma} className="break-all" />
            </li>
          </ul>

          <RedesSociales redes={redes} idioma={idioma} className="mt-6" />
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-pretty">
          © {new Date().getFullYear()} Buen Vivir · {textos.pie.derechos} ·{" "}
          <em>{lema}</em>
        </p>
        <p className="flex gap-4">
          {legales.map((enlace) => (
            <Enlace key={enlace.label} enlace={enlace} idioma={idioma} />
          ))}
        </p>
      </div>
    </footer>
  );
}
