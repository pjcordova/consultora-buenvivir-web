import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between px-[8vw] py-6">
      <Link href="/" className="whitespace-nowrap font-display italic text-lg text-parchment">
        Buen Vivir
      </Link>
      <Navigation />
    </header>
  );
}
