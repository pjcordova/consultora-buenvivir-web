import Image from "next/image";
import { rutaVersionada } from "@/lib/assets";

type VideoSectionProps = {
  id?: string;
  /** Video de fondo (mp4). Mientras no exista se usa la foto o el degradado. */
  video: string;
  /** Foto de respaldo: se ve mientras carga el video y si alguien pidió menos animación. */
  poster: string;
  /** Texto de la chapita superior derecha (qué se está viendo). */
  credito?: string;
  eyebrow: string;
  statement: string;
  note?: string;
};

export default async function VideoSection({
  id,
  video,
  poster,
  credito,
  eyebrow,
  statement,
  note,
}: VideoSectionProps) {
  const videoSrc = await rutaVersionada(video);
  const posterSrc = await rutaVersionada(poster);
  const hayVideo = Boolean(videoSrc);
  const hayPoster = Boolean(posterSrc);
  // Un "." o un "-" en el panel cuenta como vacío: es lo que se escribe para borrar algo
  const tieneTexto = (texto?: string): texto is string => /[\p{L}\p{N}]/u.test(texto ?? "");

  return (
    // En celular el texto va arriba y abajo queda agua libre (la ballena nada por
    // el centro y la parte de abajo del video); en computadora, a la izquierda.
    <section id={id} className="relative isolate overflow-hidden bg-gradient-to-b from-[#0e4c55] via-[#2b6f76] to-[#116f71] px-[6vw] pb-96 pt-16 sm:pb-[28rem] sm:pt-20 lg:py-32">
      {hayPoster && (
        <Image src={posterSrc!} alt="" fill sizes="100vw" className="object-cover" />
      )}
      {hayVideo && (
        // motion-reduce: si el sistema pide menos animación queda solo la foto
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc ?? undefined}
        >
          <source src={videoSrc!} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-forest-950/25" aria-hidden="true" />
      {/* Sombra suave desde la izquierda, detrás del texto: se lee bien sin tapar la ballena */}
      <div
        className="absolute inset-y-0 left-0 hidden w-3/5 bg-gradient-to-r from-forest-950/45 via-forest-950/15 to-transparent lg:block"
        aria-hidden="true"
      />

      {tieneTexto(credito) && (
        <p className="absolute right-[6vw] top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-forest-950/45 px-4 py-1.5 text-[11px] text-white/85 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
          {credito}
          {!hayVideo && !hayPoster && " — pendiente"}
        </p>
      )}

      {/* Recuadro a un costado para no tapar la ballena (pedido de Belén):
          translúcido y apenas difuminado, con el texto alineado a la izquierda
          (en una columna angosta el justificado deja huecos entre palabras).
          Las letras llevan una sombra suave que las despega del agua clara. */}
      <div className="relative mx-auto max-w-xl rounded-3xl border border-white/15 bg-forest-950/25 px-6 py-9 text-left backdrop-blur-sm sm:px-10 sm:py-11 lg:mx-0 lg:ml-[2vw] lg:max-w-[31rem]">
        <p className="inline-flex items-center gap-2 text-balance rounded-2xl border border-white/25 px-4 py-1.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-white/90 sm:rounded-full sm:text-[11px] sm:tracking-[0.16em]">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
          {eyebrow}
        </p>

        {/* Más chica que un título: Belén escribe acá un párrafo entero */}
        <p className="mt-6 text-pretty font-display text-lg leading-[1.5] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-xl lg:text-[1.35rem]">
          {statement}
        </p>

        {/* Sin corchetes: Belén escribe acá su texto definitivo */}
        {tieneTexto(note) && (
          <>
            <span className="mt-7 block h-px w-16 bg-white/35" aria-hidden="true" />
            <p className="mt-6 text-sm leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] sm:text-[15px]">
              {note}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
