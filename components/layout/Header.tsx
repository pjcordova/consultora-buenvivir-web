import Link from "next/link";
import Navigation from "@/components/layout/Navigation";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-6 py-4">
      <Link href="/" className="whitespace-nowrap font-serif text-xl text-bv-verde-oscuro">
        Buen Vivir
      </Link>
      <Navigation />
    </header>
  );
}
