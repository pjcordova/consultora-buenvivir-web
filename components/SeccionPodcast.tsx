import { LOGOS_REDES } from "@/components/RedesSociales";
import SectionHeader from "@/components/SectionHeader";
import type { Contenido } from "@/content";
import { reproductorDeSpotify } from "@/lib/spotify";

type SeccionPodcastProps = { textos: Contenido["podcast"] };

/**
 * El podcast del Ecosistema en Spotify, con su reproductor para mirarlo o
 * escucharlo sin salir de la web, y un botón para seguirlo en Spotify.
 *
 * El enlace y los textos se editan en el panel ("Podcast en Spotify"); sin un
 * enlace de Spotify válido, la sección no aparece. El reproductor se carga
 * recién cuando se acerca a la pantalla (loading="lazy").
 */
export default async function SeccionPodcast({ textos }: SeccionPodcastProps) {
  const reproductor = await reproductorDeSpotify(textos.enlace);
  if (!reproductor) return null;

  return (
    <section id="podcast" className="bg-white px-[8vw] py-16 sm:py-20 bajo:py-12">
      <SectionHeader eyebrow={textos.eyebrow} title={textos.titulo} subtitle={textos.bajada} />

      <div className="mx-auto mt-10 max-w-3xl bajo:mt-8 bajo:max-w-xl">
        <iframe
          src={reproductor.incrustado}
          title={`Spotify: ${reproductor.titulo || textos.titulo}`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          // Fondo oscuro mientras carga, como el reproductor de Spotify
          className={`block w-full rounded-xl bg-forest-950 shadow-[0_22px_50px_-28px_rgba(18,23,15,0.55)] ${reproductor.video ? "aspect-video" : ""}`}
          style={reproductor.video ? undefined : { height: reproductor.alto }}
        />

        {textos.boton && (
          <div className="mt-6 flex justify-center">
            <a
              href={reproductor.enSpotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-forest-800/15 bg-white px-5 py-2.5 text-sm font-medium text-forest-950 transition-colors hover:border-leaf hover:text-leaf-deep"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="text-[#1db954]">
                {LOGOS_REDES.spotify}
              </svg>
              {textos.boton}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
