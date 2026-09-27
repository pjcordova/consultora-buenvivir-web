"use client";

import Image from "next/image";
import { useState } from "react";

export type Slide = { src: string; alt: string };

type CarouselProps = {
  /** Imágenes reales. Los lugares vacíos muestran un espacio reservado. */
  slides?: (Slide | undefined)[];
  /** Cantidad de imágenes que tendrá el carrusel (para los espacios reservados). */
  total: number;
  label: string;
};

export default function Carousel({ slides = [], total, label }: CarouselProps) {
  const cantidad = slides.length || total;
  const [actual, setActual] = useState(0);

  const ir = (i: number) => setActual((i + cantidad) % cantidad);

  return (
    <div
      className="flex flex-col gap-5"
      role="group"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") ir(actual - 1);
        if (e.key === "ArrowRight") ir(actual + 1);
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream shadow-[0_18px_45px_-20px_rgba(18,23,15,0.35)]">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${actual * 100}%)` }}
        >
          {Array.from({ length: cantidad }, (_, i) => {
            const slide = slides[i];
            return (
              <div key={i} className="relative h-full w-full shrink-0">
                {slide ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  // PENDIENTE: reemplazar por las imágenes reales (publicaciones de Belén)
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-forest-800/20 p-6 text-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest-800/35" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <p className="text-sm text-forest-800/50">
                      Imagen {i + 1} de {cantidad} — pendiente
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => ir(actual - 1)}
          aria-label="Imagen anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-800/25 text-forest-950 transition-colors hover:bg-cream"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: cantidad }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === actual}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === actual ? "bg-leaf" : "bg-[#ccc6b7] hover:bg-forest-800/40"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-forest-800/60" aria-live="polite">
            {actual + 1} de {cantidad}
          </p>
        </div>

        <button
          type="button"
          onClick={() => ir(actual + 1)}
          aria-label="Imagen siguiente"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-forest-800/25 text-forest-950 transition-colors hover:bg-cream"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
