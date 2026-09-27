import Image from "next/image";
import Link from "next/link";
import HeaderSticky from "@/components/HeaderSticky";
import Navigation from "@/components/Navigation";

// Alto fijo (h-20 / md:h-24): el Hero lo descuenta para ocupar el resto de la pantalla.
export default function Header() {
  return (
    <HeaderSticky>
      <Link href="/" className="shrink-0">
        <Image
          src="/images/logo-buen-vivir.png"
          alt="Buen Vivir — consultora regenerativa"
          width={480}
          height={331}
          priority
          className="h-12 w-auto md:h-16"
        />
      </Link>
      <Navigation />
    </HeaderSticky>
  );
}
