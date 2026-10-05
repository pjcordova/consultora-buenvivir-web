"use client";

import { useRef, useState } from "react";

type VerCertificadoProps = {
  src: string;
  /** "Certificado: Teoría U", título de la ventana y texto alternativo de la imagen. */
  titulo: string;
  etiqueta: string;
  cerrar: string;
  className?: string;
};

/**
 * Botón que muestra el certificado de una formación en grande, en una ventana
 * sobre la página. Se cierra con la cruz, con Escape o tocando afuera.
 */
export default function VerCertificado({ src, titulo, etiqueta, cerrar, className }: VerCertificadoProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  // La imagen se pide recién cuando alguien abre la ventana
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAbierto(true);
          dialogo.current?.showModal();
        }}
        className={className}
      >
        {/* Documento */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
        {etiqueta}
      </button>

      <dialog
        ref={dialogo}
        aria-label={titulo}
        onClose={() => setAbierto(false)}
        // Tocar el fondo oscuro (fuera de la ventana) la cierra
        onClick={(evento) => {
          if (evento.target === dialogo.current) dialogo.current.close();
        }}
        className="w-[min(60rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-forest-950/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4 border-b border-forest-800/10 px-5 py-3">
          <p className="font-display text-lg leading-snug text-forest-950">{titulo}</p>
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            aria-label={cerrar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-forest-800 transition-colors hover:bg-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {abierto && (
          // Proporción libre (cada certificado es distinto): imagen común, entera
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={titulo} className="max-h-[calc(100vh-9rem)] w-full bg-cream object-contain" />
        )}
      </dialog>
    </>
  );
}
