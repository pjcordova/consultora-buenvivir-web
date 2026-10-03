import Image from "next/image";
import Link from "next/link";
import HeaderSticky from "@/components/HeaderSticky";
import Navigation from "@/components/Navigation";
import { enlaceEnIdioma } from "@/lib/idioma";
import { obtenerIdioma } from "@/lib/idioma-servidor";
import { textosDe } from "@/lib/textos";

// Alto fijo (h-20 / md:h-24): el Hero lo descuenta para ocupar el resto de la pantalla.
export default function Header() {
  const idioma = obtenerIdioma();

  return (
    <HeaderSticky>
      <Link href={enlaceEnIdioma("/", idioma)} className="shrink-0">
        <Image
          src="/images/logo-buen-vivir.png"
          alt={textosDe(idioma).sitio.logoAlt}
          width={480}
          height={331}
          priority
          className="h-12 w-auto md:h-16"
        />
      </Link>
      <Navigation idioma={idioma} />
    </HeaderSticky>
  );
}
