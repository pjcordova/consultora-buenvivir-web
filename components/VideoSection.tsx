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

export default function VideoSection({
  id,
  video,
  poster,
  credito,
  eyebrow,
  statement,
  note,
}: VideoSectionProps) {
  const videoSrc = rutaVersionada(video);
  const posterSrc = rutaVersionada(poster);
  const hayVideo = Boolean(videoSrc);
  const hayPoster = Boolean(posterSrc);

  return (
    <section id={id} className="relative isolate overflow-hidden bg-gradient-to-b from-[#0e4c55] via-[#2b6f76] to-[#116f71] px-[6vw] py-24 sm:py-32">
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

      {credito && (
        <p className="absolute right-[6vw] top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-forest-950/45 px-4 py-1.5 text-[11px] text-white/85 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
          {credito}
          {!hayVideo && !hayPoster && " — pendiente"}
        </p>
      )}

      <div className="relative mx-auto max-w-3xl rounded-3xl border border-white/15 bg-forest-950/35 px-6 py-10 text-center backdrop-blur-md sm:px-12 sm:py-14">
        <p className="inline-flex items-center gap-2 text-balance rounded-2xl border border-white/25 px-4 py-1.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-white/90 sm:rounded-full sm:text-[11px] sm:tracking-[0.16em]">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" aria-hidden="true" />
          {eyebrow}
        </p>

        <p className="mt-6 text-pretty font-display text-2xl leading-snug text-white sm:text-[2rem]">
          {statement}
        </p>

        {note && (
          <>
            <span className="mx-auto mt-8 block h-px w-16 bg-white/35" aria-hidden="true" />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/75">
              [{note}]
            </p>
          </>
        )}
      </div>
    </section>
  );
}
