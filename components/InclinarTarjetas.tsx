"use client";

import { useEffect } from "react";

/**
 * Inclina en 3D las tarjetas marcadas con data-inclinar mientras el mouse pasa
 * por encima, con un brillo suave donde está el puntero (el estilo está en
 * app/globals.css). El valor del atributo es la inclinación máxima en grados
 * (por defecto 5): las tarjetas anchas llevan menos.
 *
 * Un solo oyente para toda la página, así las tarjetas siguen siendo de
 * servidor. Solo con mouse: en celulares y con "reducir movimiento" no hace nada.
 */
export default function InclinarTarjetas() {
  useEffect(() => {
    const conMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let actual: HTMLElement | null = null;
    let puntero = { x: 0, y: 0 };
    let cuadro = 0;

    const soltar = () => {
      actual?.classList.remove("inclinando");
      actual = null;
    };

    // Una vez por cuadro como mucho, aunque el mouse mande más movimientos
    const aplicar = () => {
      cuadro = 0;
      if (!actual) return;
      const caja = actual.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (puntero.x - caja.left) / caja.width));
      const y = Math.min(1, Math.max(0, (puntero.y - caja.top) / caja.height));
      const maximo = Number(actual.dataset.inclinar) || 5;
      // El lado donde está el mouse se hunde, como si se lo apoyara con el dedo
      actual.style.setProperty("--inclinar-x", `${((0.5 - y) * 2 * maximo).toFixed(2)}deg`);
      actual.style.setProperty("--inclinar-y", `${((x - 0.5) * 2 * maximo).toFixed(2)}deg`);
      actual.style.setProperty("--brillo-x", `${(x * 100).toFixed(1)}%`);
      actual.style.setProperty("--brillo-y", `${(y * 100).toFixed(1)}%`);
      actual.classList.add("inclinando");
    };

    const alMover = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse" || !conMouse.matches || quieto.matches) return;
      const objetivo = evento.target instanceof Element ? evento.target : null;
      // Dentro de una ventana abierta (un certificado) no se mueve la tarjeta de atrás
      const tarjeta = objetivo?.closest("dialog")
        ? null
        : (objetivo?.closest<HTMLElement>("[data-inclinar]") ?? null);

      if (tarjeta !== actual) soltar();
      if (!tarjeta) return;
      actual = tarjeta;
      puntero = { x: evento.clientX, y: evento.clientY };
      if (!cuadro) cuadro = requestAnimationFrame(aplicar);
    };

    // El mouse se fue de la ventana
    const alSalir = (evento: PointerEvent) => {
      if (!evento.relatedTarget) soltar();
    };

    document.addEventListener("pointermove", alMover, { passive: true });
    document.addEventListener("pointerout", alSalir);
    window.addEventListener("scroll", soltar, { passive: true });

    return () => {
      cancelAnimationFrame(cuadro);
      soltar();
      document.removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerout", alSalir);
      window.removeEventListener("scroll", soltar);
    };
  }, []);

  return null;
}
