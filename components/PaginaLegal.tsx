import Link from "next/link";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import { contenidoDe } from "@/content";
import type { TextoLegal } from "@/content/legales";
import { obtenerCorreo } from "@/lib/contenido";
import { enlaceEnIdioma, type Idioma } from "@/lib/idioma";

type PaginaLegalProps = { texto: TextoLegal; idioma: Idioma };

const ESTILO_ENLACE =
  "font-medium text-forest-950 underline decoration-leaf/50 underline-offset-4 hover:decoration-leaf";

/**
 * Privacidad y Términos: el mismo diseño, cambia el texto.
 * Las marcas {correo} y {privacidad} de los textos se vuelven enlaces.
 */
export default async function PaginaLegal({ texto, idioma }: PaginaLegalProps) {
  const correo = await obtenerCorreo();
  const privacidad = contenidoDe(idioma).privacidad;

  const conEnlaces = (parrafo: string) =>
    parrafo.split(/(\{correo\}|\{privacidad\})/).map((trozo, i) => {
      if (trozo === "{correo}") {
        // Sin correo cargado en el panel, se manda a la página de Contacto
        return correo ? (
          <a key={i} href={`mailto:${correo}`} className={`break-words ${ESTILO_ENLACE}`}>
            {correo}
          </a>
        ) : (
          <Link key={i} href={enlaceEnIdioma("/contacto", idioma)} className={ESTILO_ENLACE}>
            {contenidoDe(idioma).footer.contacto.titulo}
          </Link>
        );
      }
      if (trozo === "{privacidad}") {
        return (
          <Link key={i} href={enlaceEnIdioma("/privacidad", idioma)} className={ESTILO_ENLACE}>
            {privacidad.titulo}
          </Link>
        );
      }
      return trozo;
    });

  return (
    <main>
      <Header />

      <section className="bg-cream px-[8vw] py-16 text-center sm:py-20">
        <SectionHeader
          eyebrow={texto.eyebrow}
          title={texto.titulo}
          subtitle={texto.bajada}
          nivel="h1"
        />
        <p className="mt-5 text-xs text-forest-800/60">{texto.actualizado}</p>
      </section>

      <section className="bg-white px-[8vw] py-16 sm:py-20">
        <div className="mx-auto max-w-2xl space-y-12">
          {texto.bloques.map((bloque) => (
            <div key={bloque.titulo}>
              <h2 className="font-display text-xl text-forest-950 sm:text-2xl">{bloque.titulo}</h2>
              {bloque.parrafos.map((parrafo, i) => (
                <p key={i} className="mt-4 text-[0.95rem] leading-relaxed text-forest-800/80">
                  {conEnlaces(parrafo)}
                </p>
              ))}
              {bloque.lista && (
                <ul className="mt-4 space-y-3">
                  {bloque.lista.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-forest-800/80">
                      <span className="text-leaf" aria-hidden="true">
                        →
                      </span>
                      <span>{conEnlaces(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
