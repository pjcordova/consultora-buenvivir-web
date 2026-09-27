import Image from "next/image";
import Boton from "@/components/Boton";
import { rutaVersionada } from "@/lib/assets";

type Espacio = {
  slug: string;
  nombre: string;
  estadoCorto?: string;
  /** Imagen del servicio, dentro del círculo. */
  imagen?: string;
  /** "sello": insignia con fondo propio. "foto": imagen de fondo con el texto encima. */
  estilo?: "sello" | "foto";
  /** Imagen que asoma al costado del círculo (tapa del libro). */
  adorno?: string;
  cta: { label: string; href: string };
};

type EcosistemaPanelProps = {
  foto: string;
  logo: string;
  nombre: string;
  espacios: Espacio[];
};

export default function EcosistemaPanel({ foto, logo, nombre, espacios }: EcosistemaPanelProps) {
  const fotoFondo = rutaVersionada(foto);
  const logoSrc = rutaVersionada(logo);

  return (
    <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl bg-forest-800">
      {fotoFondo ? (
        <>
          <Image src={fotoFondo} alt="" fill sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-forest-950/35" aria-hidden="true" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-forest-800 to-forest-950" aria-hidden="true" />
      )}

      <div className="relative flex flex-col items-center gap-10 px-6 py-12 sm:gap-14 sm:py-16">
        {/* Placa con el logo del ecosistema */}
        <div className="w-full max-w-[36rem] rounded-2xl border border-white/15 bg-forest-950/35 px-6 py-3 backdrop-blur-md sm:px-10 sm:py-4">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={nombre}
              width={540}
              height={165}
              // Se mide por el ancho para que se vea más largo, manteniendo la proporción
              className="h-auto w-64 sm:w-96 md:w-[32rem]"
            />
          ) : (
            <p className="text-center font-display text-lg tracking-[0.12em] text-white sm:text-2xl">
              {nombre}
            </p>
          )}
        </div>

        {/* Espacios */}
        <ul className="grid w-full gap-10 sm:grid-cols-3 sm:gap-6">
          {espacios.map((espacio) => {
            const imagen = espacio.imagen ? rutaVersionada(espacio.imagen) : null;
            const hayImagen = Boolean(imagen);
            const esSello = espacio.estilo === "sello";
            const adorno = espacio.adorno ? rutaVersionada(espacio.adorno) : null;

            return (
              <li key={espacio.slug} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className={`relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full p-6 text-center sm:h-56 sm:w-56 ${
                      hayImagen
                        ? esSello
                          ? ""
                          : "border border-white/40"
                        : esSello
                          ? "border-2 border-dashed border-cream/70 bg-cream"
                          : "border-2 border-dashed border-white/40 bg-forest-950/25 backdrop-blur-sm"
                    }`}
                  >
                    {/* Imagen del servicio: de fondo ("foto") o como insignia ("sello") */}
                    {imagen && (
                      <>
                        <Image
                          src={imagen}
                          alt={esSello ? espacio.nombre : ""}
                          fill
                          sizes="224px"
                          className={esSello ? "object-contain" : "object-cover"}
                        />
                        {!esSello && (
                          <div className="absolute inset-0 bg-forest-950/45" aria-hidden="true" />
                        )}
                      </>
                    )}

                    {/* Texto encima, salvo cuando la insignia ya lo trae dibujado */}
                    {!(esSello && hayImagen) && (
                      <div className={`relative ${esSello ? "text-forest-950" : "text-white"}`}>
                        {espacio.estadoCorto && (
                          <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">
                            {espacio.estadoCorto}
                          </p>
                        )}
                        <p
                          className={`font-display leading-snug ${
                            espacio.estadoCorto ? "mt-2" : ""
                          } ${esSello ? "text-base uppercase tracking-[0.08em]" : "text-lg"}`}
                        >
                          {espacio.nombre}
                        </p>
                        {!hayImagen && (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] opacity-60">
                            Imagen pendiente
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {adorno && (
                    <Image
                      src={adorno}
                      alt=""
                      width={140}
                      height={200}
                      className="absolute -right-6 top-1/2 w-20 -translate-y-1/2 rotate-6 rounded shadow-lg sm:w-24"
                    />
                  )}
                </div>

                <Boton
                  href={espacio.cta.href}
                  className="inline-flex items-center gap-2 rounded-full bg-leaf-olive px-6 py-2.5 font-redonda text-base font-semibold text-white transition-colors hover:bg-leaf-dark sm:text-lg"
                >
                  {espacio.cta.label}
                  {espacio.cta.label === "Iniciando…" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  )}
                </Boton>
              </li>
            );
          })}
        </ul>

        {!fotoFondo && (
          <p className="text-xs text-white/50">Foto del bosque — pendiente</p>
        )}
      </div>
    </div>
  );
}
