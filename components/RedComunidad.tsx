"use client";

import { useEffect, useRef } from "react";
import { azar, crearHalo, curva, largosDe, pelo, puntoEn, type Punto } from "@/lib/raices";

/**
 * La red de raíces de la comunidad, detrás de las tarjetas de los integrantes:
 * como la red subterránea de un bosque, donde los árboles se ayudan entre sí.
 * Crece desde arriba cuando el directorio aparece en pantalla, corre por los
 * pasillos entre las tarjetas, manda pelitos que se meten debajo de cada una y,
 * ya crecida, la recorren pulsos de luz. Si cambian los filtros (o el tamaño),
 * la red se rearma con la nueva disposición.
 *
 * Toma la posición de los elementos con data-nodo de su contenedor. Dibujo
 * propio en un canvas; con "reducir movimiento" aparece crecida y sin pulsos.
 */

type Rama = {
  puntos: Punto[];
  largos: number[];
  /** Cuándo empieza a crecer, en píxeles de recorrido desde el arranque. */
  inicio: number;
  /** Grosor al nacer y en la punta. */
  grosor: [number, number];
  /** Las principales corren por los pasillos; las otras son pelitos. */
  principal: boolean;
};

type Pulso = { rama: Rama; recorrido: number };

const VELOCIDAD = 360; // px/s del frente de crecimiento
const COLOR_RAIZ = "138,104,66";
const COLOR_BRILLO = "201,162,74";
const COLOR_PELO = "122,92,58";
/** Cuánto se alejan del borde de la grilla las raíces de afuera. */
const MARGEN = 18;

type Caja = { left: number; top: number; right: number; bottom: number };

function crearRed(cajas: Caja[]): Rama[] {
  if (!cajas.length) return [];
  const ramas: Rama[] = [];
  const izquierda = Math.min(...cajas.map((c) => c.left)) - MARGEN;
  const derecha = Math.max(...cajas.map((c) => c.right)) + MARGEN;
  const arriba = Math.min(...cajas.map((c) => c.top)) - MARGEN;
  const abajo = Math.max(...cajas.map((c) => c.bottom)) + MARGEN;
  const centro = (izquierda + derecha) / 2;

  // Filas (por la altura de cada tarjeta) y pasillos entre columnas (de la fila más larga)
  const filas: Caja[][] = [];
  for (const caja of [...cajas].sort((a, b) => a.top - b.top || a.left - b.left)) {
    const fila = filas.find((f) => Math.abs(f[0].top - caja.top) < 12);
    if (fila) fila.push(caja);
    else filas.push([caja]);
  }
  const masLarga = [...filas].sort((a, b) => b.length - a.length)[0].sort((a, b) => a.left - b.left);
  const columnas = [izquierda];
  for (let i = 0; i < masLarga.length - 1; i++) columnas.push((masLarga[i].right + masLarga[i + 1].left) / 2);
  columnas.push(derecha);
  const pasillos = [arriba];
  for (let i = 0; i < filas.length - 1; i++) {
    const finFila = Math.max(...filas[i].map((c) => c.bottom));
    const inicioSiguiente = Math.min(...filas[i + 1].map((c) => c.top));
    pasillos.push((finFila + inicioSiguiente) / 2);
  }
  pasillos.push(abajo);

  const agregar = (
    puntos: Punto[],
    inicio: number,
    grosor: [number, number],
    principal: boolean,
    pelitos = 1
  ): Rama => {
    const rama: Rama = { puntos, largos: largosDe(puntos), inicio, grosor, principal };
    ramas.push(rama);
    if (!principal) return rama;
    // Pelitos a los dos lados: los que caen debajo de una tarjeta parecen llegar a ella
    const total = rama.largos[rama.largos.length - 1];
    for (let d = azar(8, 30); d < total - 8; d += azar(18, 46) / pelitos) {
      const i = Math.max(0, rama.largos.findIndex((largo) => largo >= d) - 1);
      const [x0, y0] = puntos[i];
      const [x1, y1] = puntos[Math.min(i + 1, puntos.length - 1)];
      const angulo = Math.atan2(y1 - y0, x1 - x0) + (Math.random() < 0.5 ? -1 : 1) * azar(0.6, 1.4);
      agregar(pelo([x0, y0], angulo, azar(12, 34)), inicio + d, [0.9, 0.15], false);
    }
    return rama;
  };
  const largoDe = (rama: Rama) => rama.largos[rama.largos.length - 1];
  /** Raíz suelta que sale de un punto y se pierde en el margen, ondulando. */
  const cola = (desde: Punto, angulo: number, inicio: number) => {
    const largo = azar(40, 90);
    const hasta: Punto = [desde[0] + Math.cos(angulo) * largo, desde[1] + Math.sin(angulo) * largo];
    agregar(curva(desde, hasta, [azar(-14, 14), azar(-14, 14)], 6), inicio, [1.3, 0.2], true, 1.4);
  };

  const interiores = columnas.slice(1, -1);
  const origen: Punto = [centro, arriba - 6];

  // Desde arriba (desde el bosque): un abanico de raíces que baja a cada pasillo vertical
  const llegadas: { x: number; inicio: number }[] = [];
  const destinos = interiores.length ? interiores : [izquierda, derecha];
  for (const x of destinos) {
    const rama = agregar(curva(origen, [x, arriba + 10], [azar(-20, 20), azar(-6, 10)], 6), 0, [1.8, 1.4], true);
    llegadas.push({ x, inicio: largoDe(rama) });
  }
  // Pasillos verticales entre columnas (en celular, por los costados de las tarjetas)
  for (const { x, inicio } of llegadas) {
    const rama = agregar(curva([x, arriba + 10], [x, abajo], [azar(-8, 8), 0], 7), inicio, [1.6, 1.1], true);
    cola([x, abajo], Math.PI / 2 + azar(-0.6, 0.6), inicio + largoDe(rama));
  }
  // Pasillos entre filas: desde el centro hacia cada lado, y al final se pierden en el margen
  const inicioFila = (y: number) => (y - arriba) * 0.9 + 60;
  for (const y of pasillos.slice(1, -1)) {
    for (const [hasta, lado] of [
      [izquierda + MARGEN, -1],
      [derecha - MARGEN, 1],
    ] as const) {
      const rama = agregar(curva([centro, y], [hasta, y], [0, azar(-7, 7)], 5), inicioFila(y), [1.5, 1], true);
      cola([hasta, y], (lado < 0 ? Math.PI : 0) + azar(-0.7, 0.7), inicioFila(y) + largoDe(rama));
    }
  }
  // Algunas más que salen de los costados de la grilla hacia afuera
  for (const [x, lado] of [
    [izquierda + MARGEN, -1],
    [derecha - MARGEN, 1],
  ] as const) {
    for (let k = 0; k < 2; k++) {
      const y = azar(arriba + 60, abajo - 60);
      cola([x, y], (lado < 0 ? Math.PI : 0) + azar(-0.8, 0.8), inicioFila(y));
    }
  }
  return ramas;
}

export default function RedComunidad() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const contenedor = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !contenedor || !ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const halo = crearHalo("39,164,126", "236,250,240");
    const copia = document.createElement("canvas");
    const ctxCopia = copia.getContext("2d")!;

    let ancho = 0;
    let alto = 0;
    let ramas: Rama[] = [];
    let total = 0;
    let recorrido = 0;
    let empezo = false;
    let crecida = false;
    let visible = false;
    let cuadro = 0;
    let anterior = 0;
    let pulsos: Pulso[] = [];
    let proximoPulso = 0.4;
    let pendiente = 0;

    function armar() {
      const caja = canvas!.getBoundingClientRect();
      if (!caja.width || !caja.height) return;
      ancho = caja.width;
      alto = caja.height;
      const ppp = Math.min(window.devicePixelRatio || 1, 2);
      for (const lugar of [canvas!, copia]) {
        lugar.width = Math.round(ancho * ppp);
        lugar.height = Math.round(alto * ppp);
      }
      ctx!.setTransform(ppp, 0, 0, ppp, 0, 0);
      ctxCopia.setTransform(ppp, 0, 0, ppp, 0, 0);

      const cajas = [...contenedor!.querySelectorAll("[data-nodo]")].map((elemento) => {
        const r = elemento.getBoundingClientRect();
        return { left: r.left - caja.left, top: r.top - caja.top, right: r.right - caja.left, bottom: r.bottom - caja.top };
      });
      ramas = crearRed(cajas);
      total = ramas.length ? Math.max(...ramas.map((rama) => rama.inicio + rama.largos[rama.largos.length - 1])) : 0;
      pulsos = [];
      if (crecida) {
        dibujarRed(ctxCopia, Infinity);
        mostrarCopia();
      }
    }

    function dibujarRama(destino: CanvasRenderingContext2D, rama: Rama, hasta: number) {
      const visibleDeRama = hasta - rama.inicio;
      if (visibleDeRama <= 0) return;
      const { puntos, largos, grosor } = rama;
      const largoTotal = largos[largos.length - 1];
      const pasadas: [number, string][] = rama.principal
        ? [
            [3.2, `rgba(${COLOR_BRILLO},0.1)`],
            [1, `rgba(${COLOR_RAIZ},0.34)`],
          ]
        : [[1, `rgba(${COLOR_PELO},0.24)`]];
      for (const [ensanche, trazo] of pasadas) {
        destino.strokeStyle = trazo;
        for (let i = 1; i < puntos.length && largos[i - 1] < visibleDeRama; i++) {
          const fin = largos[i] <= visibleDeRama ? puntos[i] : puntoEn(rama, visibleDeRama);
          destino.lineWidth = (grosor[0] + (grosor[1] - grosor[0]) * (largos[i] / largoTotal)) * ensanche;
          destino.beginPath();
          destino.moveTo(puntos[i - 1][0], puntos[i - 1][1]);
          destino.lineTo(fin[0], fin[1]);
          destino.stroke();
        }
      }
    }

    function dibujarRed(destino: CanvasRenderingContext2D, hasta: number) {
      destino.clearRect(0, 0, ancho, alto);
      destino.lineCap = "round";
      for (const rama of ramas) if (!rama.principal) dibujarRama(destino, rama, hasta);
      for (const rama of ramas) if (rama.principal) dibujarRama(destino, rama, hasta);
    }

    function mostrarCopia() {
      if (!copia.width || !copia.height) return;
      ctx!.clearRect(0, 0, ancho, alto);
      ctx!.drawImage(copia, 0, 0, ancho, alto);
    }

    function cuadroSiguiente(ahora: number) {
      const dt = Math.min(0.05, (ahora - (anterior || ahora)) / 1000);
      anterior = ahora;

      if (!crecida) {
        recorrido += VELOCIDAD * dt;
        if (recorrido >= total) {
          crecida = true;
          dibujarRed(ctxCopia, Infinity);
        } else {
          dibujarRed(ctx!, recorrido);
        }
      }

      if (crecida) {
        mostrarCopia();
        // Pulsos de luz por las raíces principales, de a pocos
        proximoPulso -= dt;
        const principales = ramas.filter((rama) => rama.principal);
        if (proximoPulso <= 0 && pulsos.length < 4 && principales.length) {
          pulsos.push({ rama: principales[Math.floor(Math.random() * principales.length)], recorrido: 0 });
          proximoPulso = azar(0.5, 1.3);
        }
        pulsos = pulsos.filter((pulso) => {
          pulso.recorrido += 110 * dt;
          const largo = pulso.rama.largos[pulso.rama.largos.length - 1];
          if (pulso.recorrido > largo) return false;
          const [x, y] = puntoEn(pulso.rama, pulso.recorrido);
          ctx!.globalAlpha = Math.sin((Math.PI * pulso.recorrido) / largo) * 0.9;
          ctx!.drawImage(halo, x - 8, y - 8, 16, 16);
          ctx!.globalAlpha = 1;
          return true;
        });
      }
      cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    function seguir() {
      cancelAnimationFrame(cuadro);
      anterior = 0;
      if (!empezo) return;
      if (quieto.matches) {
        crecida = true;
        dibujarRed(ctxCopia, Infinity);
        mostrarCopia();
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    // Rearmar una sola vez por cuadro aunque lleguen varios avisos juntos
    const rearmar = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(armar);
    };

    armar();
    const alVerse = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        if (visible && entrada.intersectionRatio >= 0.15) empezo = true;
        seguir();
      },
      { threshold: [0, 0.15] }
    );
    alVerse.observe(contenedor);
    const alCambiarTamano = new ResizeObserver(rearmar);
    alCambiarTamano.observe(contenedor);
    // Los filtros cambian qué tarjetas hay
    const alCambiarTarjetas = new MutationObserver(rearmar);
    alCambiarTarjetas.observe(contenedor, { childList: true, subtree: true });
    const alPedirQuietud = () => seguir();
    quieto.addEventListener("change", alPedirQuietud);

    return () => {
      cancelAnimationFrame(cuadro);
      cancelAnimationFrame(pendiente);
      alVerse.disconnect();
      alCambiarTamano.disconnect();
      alCambiarTarjetas.disconnect();
      quieto.removeEventListener("change", alPedirQuietud);
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      aria-hidden="true"
      // Un poco más grande que la grilla: las raíces de afuera corren por el
      // margen. Un canvas no se estira con inset: lleva su ancho y alto.
      className="pointer-events-none absolute -left-8 -top-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]"
    />
  );
}
