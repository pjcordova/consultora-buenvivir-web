import Image from "next/image";
import Boton from "@/components/Boton";
import { rutaVersionada } from "@/lib/assets";

type Cta = { label: string; href: string };

type HeroProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  body: string;
  note?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  scrollTarget?: string;
};

const FOTO_CIELO = "/images/hero-cielo.jpg";

export default async function Hero({
  eyebrow,
  title,
  titleAccent,
  body,
  note,
  primaryCta,
  secondaryCta,
  scrollTarget,
}: HeroProps) {
  // Mientras la foto no esté en public/images se muestra solo el degradado de fondo.
  const foto = await rutaVersionada(FOTO_CIELO);

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1d3552] via-[#5a7fa8] to-[#e4e8ea] px-[6vw] py-16 md:min-h-[calc(100svh-6rem)]">
      {foto && (
        <Image
          src={foto}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      <div className="relative w-full max-w-3xl rounded-3xl bg-white/85 px-6 py-10 text-center shadow-[0_24px_60px_-20px_rgba(18,23,15,0.45)] backdrop-blur-md sm:px-12 sm:py-12">
        {/* En celular la etiqueta no entra en una línea: se reparte pareja (text-balance) */}
        {eyebrow && (
          <p className="inline-flex items-center gap-2 text-balance rounded-2xl border border-moss/25 bg-cream px-4 py-1.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-moss sm:rounded-full sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden="true" />
            {eyebrow}
          </p>
        )}

        {/* 46px: "Regeneración organizacional y" entra en una línea dentro de max-w-3xl */}
        <h1 className="mt-6 text-4xl leading-[1.1] text-forest-950 sm:text-[2.875rem]">
          {title}
          {titleAccent && <em className="block text-honey-deep">{titleAccent}</em>}
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-forest-800/80 sm:text-lg">
          {body}
        </p>

        {note && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs italic text-forest-800/50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            [{note}]
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryCta && (
              <Boton
                href={primaryCta.href}
                className="inline-flex items-center gap-2 rounded-md bg-leaf px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-leaf-dark"
              >
                {primaryCta.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </Boton>
            )}
            {secondaryCta && (
              <Boton
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-md border border-butter-border bg-butter px-5 py-3 text-sm text-forest-800 transition-colors hover:bg-[#fbf1b8]"
              >
                {secondaryCta.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Boton>
            )}
          </div>
        )}
      </div>

      {scrollTarget && (
        <a
          href={scrollTarget}
          className="relative mt-6 flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/90 drop-shadow"
        >
          Descender
          <span className="h-8 w-px bg-white/70" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
