"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import EnredaderaTarjeta, { DefinicionesEnredaderas, broteDe } from "@/components/EnredaderaTarjeta";
import RedComunidad from "@/components/RedComunidad";
import { LOGOS_REDES } from "@/components/RedesSociales";
import type { Integrante } from "@/lib/contenido";
import type { Idioma } from "@/lib/idioma";
import { textosDe } from "@/lib/textos";

export type IntegranteConFoto = Integrante & {
  /** Dirección de la foto, o null para mostrar las iniciales. */
  foto: string | null;
  /** Nombre actual del espacio donde participa. */
  espacioNombre: string;
  /** Bandera del país (imagen SVG), o null si el nombre del país no se reconoce. */
  bandera: string | null;
};

type DirectorioComunidadProps = {
  integrantes: IntegranteConFoto[];
  /** Los espacios que tienen al menos un integrante, para filtrar. */
  espacios: { valor: string; etiqueta: string }[];
  /** Espacio ya elegido al llegar (desde la página de un espacio: /comunidad?espacio=…). */
  espacioInicial?: string;
  idioma: Idioma;
};

/** Sin tildes ni mayúsculas: "Perú" se encuentra escribiendo "peru". */
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const iniciales = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");

/**
 * Directorio de la comunidad: tarjetas de los integrantes con filtros por
 * espacio y país y un buscador. Todo se filtra en el navegador (son pocos).
 */
export default function DirectorioComunidad({
  integrantes,
  espacios,
  espacioInicial,
  idioma,
}: DirectorioComunidadProps) {
  const textos = textosDe(idioma).comunidad;
  const [espacio, setEspacio] = useState(espacioInicial ?? "");
  const [pais, setPais] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const paises = useMemo(
    () =>
      [...new Set(integrantes.map((integrante) => integrante.pais))].sort((a, b) =>
        a.localeCompare(b, idioma)
      ),
    [integrantes, idioma]
  );

  const visibles = useMemo(() => {
    const buscado = normalizar(busqueda);
    return integrantes.filter(
      (integrante) =>
        (!espacio || integrante.espacio === espacio) &&
        (!pais || integrante.pais === pais) &&
        (!buscado ||
          normalizar(
            [
              integrante.nombre,
              integrante.especialidad,
              integrante.proyecto,
              integrante.descripcion,
              integrante.pais,
              integrante.espacioNombre,
            ].join(" ")
          ).includes(buscado))
    );
  }, [integrantes, espacio, pais, busqueda]);

  const hayFiltros = Boolean(espacio || pais || busqueda);
  const limpiar = () => {
    setEspacio("");
    setPais("");
    setBusqueda("");
  };

  const chip = (activo: boolean) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${
      activo
        ? "bg-leaf-deep text-white"
        : "border border-forest-800/15 bg-white text-forest-800 hover:border-leaf hover:text-forest-950"
    }`;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-[0_14px_40px_-30px_rgba(18,23,15,0.35)] ring-1 ring-forest-800/5 sm:p-6">
        {espacios.length > 1 && (
          <div role="group" aria-label={textos.filtroEspacio} className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setEspacio("")} className={chip(!espacio)} aria-pressed={!espacio}>
              {textos.todos}
            </button>
            {espacios.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => setEspacio(opcion.valor)}
                className={chip(espacio === opcion.valor)}
                aria-pressed={espacio === opcion.valor}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">{textos.buscar}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-800/50" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder={textos.buscar}
              className="w-full rounded-full border border-forest-800/15 bg-cream/60 py-2.5 pl-11 pr-4 text-sm text-forest-950 outline-none placeholder:text-forest-800/50 focus:border-leaf"
            />
          </label>
          {paises.length > 1 && (
            <label className="sm:w-56">
              <span className="sr-only">{textos.todosLosPaises}</span>
              <select
                value={pais}
                onChange={(evento) => setPais(evento.target.value)}
                className="w-full rounded-full border border-forest-800/15 bg-cream/60 px-4 py-2.5 text-sm text-forest-950 outline-none focus:border-leaf"
              >
                <option value="">{textos.todosLosPaises}</option>
                {paises.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-cream/70" aria-live="polite">
        {textos.resultados(visibles.length)}
        {hayFiltros && (
          <button type="button" onClick={limpiar} className="ml-3 font-medium text-leaf-lime underline underline-offset-4">
            {textos.verTodos}
          </button>
        )}
      </p>

      {visibles.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-forest-800/20 bg-white px-6 py-12 text-center text-sm text-forest-800/70">
          {textos.sinResultados}
        </p>
      ) : (
        // La red de raíces de la comunidad corre por detrás: los pasillos entre
        // filas son más altos para que se vea cómo une a cada tarjeta con las demás
        <div className="relative mt-6">
          <DefinicionesEnredaderas />
          <RedComunidad />
          <ul className="relative grid gap-x-7 gap-y-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
          {visibles.map((integrante) => (
            <li
              key={integrante.id}
              data-inclinar="4"
              data-nodo
              data-brote={broteDe(integrante.id)}
              className="relative flex flex-col rounded-3xl bg-white p-6 shadow-[0_22px_50px_-24px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
            >
              <EnredaderaTarjeta id={integrante.id} />
              <div className="flex items-center gap-4">
                {integrante.foto ? (
                  <Image
                    src={integrante.foto}
                    alt={integrante.nombre}
                    width={128}
                    height={128}
                    sizes="64px"
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-leaf-lime font-display text-xl text-white"
                    aria-hidden="true"
                  >
                    {iniciales(integrante.nombre)}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-lg leading-snug text-forest-950">{integrante.nombre}</h3>
                  <p className="mt-0.5 text-sm font-medium text-leaf-deep">{integrante.especialidad}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-forest-800">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 font-medium">
                  {/* La bandera del país (pedido de Belén); si el nombre no se reconoce, un pin */}
                  {integrante.bandera ? (
                    // SVG chiquito ya armado en el servidor: no hace falta optimizarlo
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={integrante.bandera}
                      alt=""
                      width={18}
                      height={12}
                      className="h-3 w-[18px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(18,23,15,0.12)]"
                    />
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                  {integrante.pais}
                </span>
                {integrante.espacioNombre && (
                  <span className="rounded-full bg-cream px-2.5 py-1">{integrante.espacioNombre}</span>
                )}
              </div>

              {integrante.proyecto && <p className="mt-4 font-medium text-forest-950">{integrante.proyecto}</p>}
              {integrante.descripcion && (
                <p className={`text-sm leading-relaxed text-forest-800/80 ${integrante.proyecto ? "mt-1" : "mt-4"}`}>
                  {integrante.descripcion}
                </p>
              )}

              {(integrante.web || integrante.instagram || integrante.linkedin) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {integrante.web && (
                    <a href={integrante.web} target="_blank" rel="noopener noreferrer" className={claseEnlace}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
                      </svg>
                      {textos.web}
                    </a>
                  )}
                  {integrante.instagram && (
                    <a href={integrante.instagram} target="_blank" rel="noopener noreferrer" className={claseEnlace} aria-label={idioma === "es" ? `Instagram de ${integrante.nombre}` : `${integrante.nombre} on Instagram`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">{LOGOS_REDES.instagram}</svg>
                      Instagram
                    </a>
                  )}
                  {integrante.linkedin && (
                    <a href={integrante.linkedin} target="_blank" rel="noopener noreferrer" className={claseEnlace} aria-label={idioma === "es" ? `LinkedIn de ${integrante.nombre}` : `${integrante.nombre} on LinkedIn`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">{LOGOS_REDES.linkedin}</svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const claseEnlace =
  "inline-flex items-center gap-1.5 rounded-full border border-forest-800/15 px-3 py-1.5 text-xs font-medium text-forest-800 transition-colors hover:border-leaf hover:text-forest-950";
