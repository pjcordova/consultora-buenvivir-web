"use client";

import { useEffect, useRef } from "react";

/**
 * Raíces que crecen en el panel del Ecosistema cuando aparece en pantalla:
 * salen de la placa del logo, llegan a cada espacio y los unen entre sí, con
 * pelitos finos como de micelio. Ya crecidas, unos pulsos de luz viajan por las
 * conexiones (el intercambio entre los espacios).
 *
 * Se apoya en las marcas del panel: data-raiz="origen" (la placa del logo) y
 * data-raiz="espacio" (cada círculo). Dibujo propio en un canvas, sin
 * librerías. Con "reducir movimiento" aparecen ya crecidas y sin pulsos.
 */

type Punto = [number, number];

type Rama = {
  puntos: Punto[];
  /** Largo recorrido hasta cada punto. */
  largos: number[];
  /** Cuándo empieza a crecer, en píxeles de recorrido desde el arranque. */
  inicio: number;
  /** Grosor al nacer y en la punta. */
  grosor: [number, number];
  principal: boolean;
  /** Las conexiones entre la placa y los espacios llevan pulsos de luz. */
  conexion: boolean;
};

type Pulso = { rama: Rama; recorrido: number };

const VELOCIDAD = 80; // px/s del frente de crecimiento: lento, para que se vea brotar
const COLOR_RAIZ = "250,222,150"; // dorado claro, que se lea sobre el bosque
const COLOR_PELO = "250,240,214";

const azar = (min: number, max: number) => min + Math.random() * (max - min);

function largosDe(puntos: Punto[]): number[] {
  const largos = [0];
  for (let i = 1; i < puntos.length; i++) {
    largos.push(largos[i - 1] + Math.hypot(puntos[i][0] - puntos[i - 1][0], puntos[i][1] - puntos[i - 1][1]));
  }
  return largos;
}

/** Camino orgánico de a hacia b: una curva suave con ondulaciones que no tocan las puntas. */
function curva(a: Punto, b: Punto, desvio: Punto, amplitud: number): Punto[] {
  const c1: Punto = [a[0] + (b[0] - a[0]) / 3 + desvio[0], a[1] + (b[1] - a[1]) / 3 + desvio[1]];
  const c2: Punto = [a[0] + (2 * (b[0] - a[0])) / 3 + desvio[0], a[1] + (2 * (b[1] - a[1])) / 3 + desvio[1]];
  const pasos = Math.max(8, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6));
  const [f1, f2, k1, k2] = [azar(0, 6.3), azar(0, 6.3), azar(1.5, 3.5), azar(5, 9)];

  const puntos: Punto[] = [];
  for (let i = 0; i <= pasos; i++) {
    const t = i / pasos;
    const u = 1 - t;
    const x = u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0];
    const y = u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1];
    const dx = 3 * u * u * (c1[0] - a[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (b[0] - c2[0]);
    const dy = 3 * u * u * (c1[1] - a[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (b[1] - c2[1]);
    const largo = Math.hypot(dx, dy) || 1;
    const onda =
      (Math.sin(t * k1 * Math.PI + f1) * 0.7 + Math.sin(t * k2 * Math.PI + f2) * 0.3) * amplitud * Math.sin(Math.PI * t);
    puntos.push([x + (-dy / largo) * onda, y + (dx / largo) * onda]);
  }
  return puntos;
}

/** Pelito de micelio: un trazo corto que va cambiando de dirección. */
function pelo(desde: Punto, angulo: number, largo: number): Punto[] {
  const pasos = Math.max(3, Math.round(largo / 5));
  const puntos: Punto[] = [desde];
  let [x, y] = desde;
  let direccion = angulo;
  for (let i = 0; i < pasos; i++) {
    direccion += azar(-0.35, 0.35);
    x += (Math.cos(direccion) * largo) / pasos;
    y += (Math.sin(direccion) * largo) / pasos;
    puntos.push([x, y]);
  }
  return puntos;
}

type Circulo = { x: number; y: number; r: number };

/** Arma la red completa a partir de dónde están la placa y los círculos. */
function crearRed(origen: DOMRect, espacios: Circulo[]): Rama[] {
  const ramas: Rama[] = [];

  const agregar = (puntos: Punto[], inicio: number, grosor: [number, number], conexion: boolean, nivel: number) => {
    const rama: Rama = { puntos, largos: largosDe(puntos), inicio, grosor, principal: nivel === 0, conexion };
    ramas.push(rama);

    // Pelitos a los costados (y algunos pelitos de los pelitos)
    if (nivel > 1) return rama;
    const total = rama.largos[rama.largos.length - 1];
    const cada = nivel === 0 ? 30 : 16;
    for (let d = azar(6, cada); d < total - 6; d += azar(cada * 0.6, cada * 1.4)) {
      const i = Math.max(0, rama.largos.findIndex((largo) => largo >= d) - 1);
      const [x0, y0] = puntos[i];
      const [x1, y1] = puntos[Math.min(i + 1, puntos.length - 1)];
      const angulo = Math.atan2(y1 - y0, x1 - x0) + (Math.random() < 0.5 ? -1 : 1) * azar(0.6, 1.3);
      const largo = nivel === 0 ? azar(14, 44) : azar(6, 15);
      agregar(pelo([x0, y0], angulo, largo), inicio + d, nivel === 0 ? [1.1, 0.25] : [0.6, 0.2], false, nivel + 1);
    }
    return rama;
  };

  const borde = (circulo: Circulo, angulo: number): Punto => [
    circulo.x + Math.cos(angulo) * circulo.r * 0.98,
    circulo.y + Math.sin(angulo) * circulo.r * 0.98,
  ];
  const hacia = (circulo: Circulo, punto: Punto) => Math.atan2(punto[1] - circulo.y, punto[0] - circulo.x);
  const centroPlaca = origen.left + origen.width / 2;
  const salida = (x: number): Punto => [centroPlaca + (x - centroPlaca) * 0.22, origen.bottom - 3];
  const llegadas: number[] = [];
  const largoDe = (rama: Rama) => rama.largos[rama.largos.length - 1];

  const enFila = espacios.length > 1 && Math.abs(espacios[0].y - espacios[espacios.length - 1].y) < 20;

  if (enFila) {
    // Computadora: de la placa a cada espacio, en abanico, y los espacios unidos por abajo
    for (const espacio of espacios) {
      const a = salida(espacio.x);
      const b = borde(espacio, hacia(espacio, a));
      const rama = agregar(curva(a, b, [(espacio.x - a[0]) * -0.12, 18], 7), 0, [2.6, 1.4], true, 0);
      llegadas.push(largoDe(rama));
    }
    for (let i = 0; i < espacios.length - 1; i++) {
      const [uno, otro] = [espacios[i], espacios[i + 1]];
      const a = borde(uno, 0.55);
      const b = borde(otro, Math.PI - 0.55);
      agregar(curva(a, b, [0, 42], 5), llegadas[i], [1.9, 1.9], true, 0);
    }
  } else {
    // Celular: una cadena de un espacio al otro, que rodea los botones por los costados
    const a = salida(espacios[0].x);
    let rama = agregar(curva(a, borde(espacios[0], -Math.PI / 2), [24, 0], 6), 0, [2.6, 1.4], true, 0);
    llegadas.push(largoDe(rama));
    for (let i = 0; i < espacios.length - 1; i++) {
      const [uno, otro] = [espacios[i], espacios[i + 1]];
      const lado = i % 2 === 0 ? -1 : 1;
      const desde = borde(uno, Math.PI / 2 - lado * 0.75);
      const hasta = borde(otro, -Math.PI / 2 + lado * 0.75);
      rama = agregar(curva(desde, hasta, [lado * uno.r * 1.1, 0], 5), llegadas[i], [2, 1.5], true, 0);
      llegadas.push(llegadas[i] + largoDe(rama));
    }
  }

  // Raíces sueltas que se pierden hacia afuera: la red sigue más allá
  espacios.forEach((espacio, i) => {
    for (let n = 0; n < 2; n++) {
      const angulo = azar(0.15, Math.PI - 0.15); // hacia abajo o hacia los costados
      const a = borde(espacio, angulo);
      const largo = azar(50, 120);
      const b: Punto = [a[0] + Math.cos(angulo) * largo, a[1] + Math.sin(angulo) * largo];
      agregar(curva(a, b, [azar(-15, 15), azar(-10, 10)], 6), llegadas[i] ?? 0, [1.7, 0.4], false, 0);
    }
  });
  for (const lado of [-1, 1]) {
    const a: Punto = [centroPlaca + (lado * origen.width) / 2 - lado * 24, origen.bottom - 3];
    const largo = azar(90, 170);
    const b: Punto = [a[0] + lado * largo, a[1] + azar(30, 70)];
    agregar(curva(a, b, [0, 18], 8), azar(0, 40), [1.9, 0.4], false, 0);
  }

  return ramas;
}

/** Halo de luz, dibujado una sola vez y reusado. */
function crearHalo(): HTMLCanvasElement {
  const halo = document.createElement("canvas");
  halo.width = halo.height = 48;
  const ctx = halo.getContext("2d")!;
  const degradado = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
  degradado.addColorStop(0, "rgba(255,244,214,1)");
  degradado.addColorStop(0.3, "rgba(232,189,95,0.55)");
  degradado.addColorStop(1, "rgba(232,189,95,0)");
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, 48, 48);
  return halo;
}

/** Punto de la rama a cierta distancia del nacimiento. */
function puntoEn(rama: Rama, distancia: number): Punto {
  const { puntos, largos } = rama;
  let i = 1;
  while (i < largos.length - 1 && largos[i] < distancia) i++;
  const tramo = largos[i] - largos[i - 1] || 1;
  const t = Math.max(0, Math.min(1, (distancia - largos[i - 1]) / tramo));
  return [
    puntos[i - 1][0] + (puntos[i][0] - puntos[i - 1][0]) * t,
    puntos[i - 1][1] + (puntos[i][1] - puntos[i - 1][1]) * t,
  ];
}

export default function RaicesEcosistema() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const panel = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !panel || !ctx) return;

    const halo = crearHalo();
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Copia de la red ya crecida: después solo se dibujan los pulsos encima
    const copia = document.createElement("canvas");
    const ctxCopia = copia.getContext("2d")!;

    let ancho = 0;
    let alto = 0;
    let ppp = 1;
    let ramas: Rama[] = [];
    let total = 0;
    let recorrido = 0; // cuánto creció la red, en px
    let empezo = false;
    let crecida = false;
    let visible = false;
    let cuadro = 0;
    let anterior = 0;
    let pulsos: Pulso[] = [];
    let proximoPulso = 0.6;

    function armar() {
      const caja = panel!.getBoundingClientRect();
      ancho = caja.width;
      alto = caja.height;
      ppp = Math.min(window.devicePixelRatio || 1, 2);
      for (const lugar of [canvas!, copia]) {
        lugar.width = Math.round(ancho * ppp);
        lugar.height = Math.round(alto * ppp);
      }
      ctx!.setTransform(ppp, 0, 0, ppp, 0, 0);
      ctxCopia.setTransform(ppp, 0, 0, ppp, 0, 0);

      const relativo = (elemento: Element) => {
        const r = elemento.getBoundingClientRect();
        return new DOMRect(r.left - caja.left, r.top - caja.top, r.width, r.height);
      };
      const placa = panel!.querySelector("[data-raiz='origen']");
      const espacios = [...panel!.querySelectorAll("[data-raiz='espacio']")].map((elemento) => {
        const r = relativo(elemento);
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
      });
      if (!placa || !espacios.length) {
        ramas = [];
        return;
      }
      ramas = crearRed(relativo(placa), espacios);
      total = Math.max(...ramas.map((rama) => rama.inicio + rama.largos[rama.largos.length - 1]));
      pulsos = [];
      if (crecida) guardarCopia();
    }

    function dibujarRama(destino: CanvasRenderingContext2D, rama: Rama, hasta: number) {
      const visibleDeRama = hasta - rama.inicio;
      if (visibleDeRama <= 0) return;
      const { puntos, largos, grosor } = rama;
      const largoTotal = largos[largos.length - 1];
      const color = rama.principal ? COLOR_RAIZ : COLOR_PELO;

      // Tres pasadas en las raíces principales: una sombra oscura que las despega
      // de las partes claras de la foto, un brillo ancho y tenue, y el trazo
      const pasadas: [number, string][] = rama.principal
        ? [
            [2.4, "rgba(18,23,15,0.35)"],
            [4, `rgba(${color},0.18)`],
            [1, `rgba(${color},0.95)`],
          ]
        : [[1, `rgba(${color},0.6)`]];
      for (const [ensanche, trazo] of pasadas) {
        destino.strokeStyle = trazo;
        for (let i = 1; i < puntos.length && largos[i - 1] < visibleDeRama; i++) {
          const fin = largos[i] <= visibleDeRama ? puntos[i] : puntoEn(rama, visibleDeRama);
          const t = largos[i] / largoTotal;
          destino.lineWidth = (grosor[0] + (grosor[1] - grosor[0]) * t) * ensanche;
          destino.beginPath();
          destino.moveTo(puntos[i - 1][0], puntos[i - 1][1]);
          destino.lineTo(fin[0], fin[1]);
          destino.stroke();
        }
      }

      // Mientras crece, la punta de las raíces principales brilla
      if (rama.principal && visibleDeRama < largoTotal) {
        const [x, y] = puntoEn(rama, visibleDeRama);
        destino.globalAlpha = 0.8;
        destino.drawImage(halo, x - 9, y - 9, 18, 18);
        destino.globalAlpha = 1;
      }
    }

    function dibujarRed(destino: CanvasRenderingContext2D, hasta: number) {
      destino.clearRect(0, 0, ancho, alto);
      destino.lineCap = "round";
      for (const rama of ramas) if (!rama.principal) dibujarRama(destino, rama, hasta);
      for (const rama of ramas) if (rama.principal) dibujarRama(destino, rama, hasta);
    }

    function guardarCopia() {
      dibujarRed(ctxCopia, Infinity);
    }

    function cuadroSiguiente(ahora: number) {
      const dt = Math.min(0.05, (ahora - (anterior || ahora)) / 1000);
      anterior = ahora;

      if (!crecida) {
        recorrido += VELOCIDAD * dt;
        if (recorrido >= total) {
          crecida = true;
          guardarCopia();
        } else {
          dibujarRed(ctx!, recorrido);
        }
      }

      if (crecida) {
        ctx!.clearRect(0, 0, ancho, alto);
        ctx!.drawImage(copia, 0, 0, ancho, alto);

        // Pulsos de luz por las conexiones, de a pocos
        proximoPulso -= dt;
        const conexiones = ramas.filter((rama) => rama.conexion);
        if (proximoPulso <= 0 && pulsos.length < 3 && conexiones.length) {
          pulsos.push({ rama: conexiones[Math.floor(Math.random() * conexiones.length)], recorrido: 0 });
          proximoPulso = azar(0.8, 1.8);
        }
        pulsos = pulsos.filter((pulso) => {
          pulso.recorrido += 120 * dt;
          const largo = pulso.rama.largos[pulso.rama.largos.length - 1];
          if (pulso.recorrido > largo) return false;
          const [x, y] = puntoEn(pulso.rama, pulso.recorrido);
          ctx!.globalAlpha = Math.sin((Math.PI * pulso.recorrido) / largo);
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
        // Sin movimiento: la red aparece entera y quieta
        crecida = true;
        guardarCopia();
        ctx!.clearRect(0, 0, ancho, alto);
        ctx!.drawImage(copia, 0, 0, ancho, alto);
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    armar();

    // Crece la primera vez que el panel se ve bien; fuera de pantalla se pausa
    const alVerse = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        if (visible && entrada.intersectionRatio >= 0.3) empezo = true;
        seguir();
      },
      { threshold: [0, 0.3] }
    );
    alVerse.observe(panel);

    const alCambiarTamano = new ResizeObserver(() => {
      armar();
      if (crecida) {
        ctx!.clearRect(0, 0, ancho, alto);
        ctx!.drawImage(copia, 0, 0, ancho, alto);
      }
    });
    alCambiarTamano.observe(panel);

    const alPedirQuietud = () => seguir();
    quieto.addEventListener("change", alPedirQuietud);

    return () => {
      cancelAnimationFrame(cuadro);
      alVerse.disconnect();
      alCambiarTamano.disconnect();
      quieto.removeEventListener("change", alPedirQuietud);
    };
  }, []);

  return (
    <canvas ref={lienzo} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}
