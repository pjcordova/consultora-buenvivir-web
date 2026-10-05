"use client";

import { useEffect, useRef } from "react";

/**
 * Semillas de diente de león que flotan en 3D sobre la foto de la portada,
 * llevadas por una brisa: giran sobre sí mismas, las lejanas se ven chicas y
 * tenues y las cercanas grandes y más rápidas. El mouse las sopla y al
 * deslizar la página las cercanas se corren más que las lejanas (profundidad).
 *
 * Dibujo propio en un canvas (sin librerías 3D): pesa poco y en celular se
 * dibujan menos semillas. Con "reducir movimiento" activado quedan quietas, y
 * la animación se pausa cuando la portada no está en pantalla.
 */

type Semilla = {
  x: number;
  y: number;
  /** Profundidad: 0 cerca … 1 lejos. */
  z: number;
  /** Escala por la distancia (1 cerca, ~0,25 lejos). */
  s: number;
  tamano: number;
  /** Giro sobre su eje, inclinación hacia la cámara y vaivén. */
  giro: number;
  velGiro: number;
  inclinacion: number;
  fase: number;
  /** Empujón del mouse, que se va apagando. */
  ex: number;
  ey: number;
  /** Puntas de los pelitos del penacho (x, y, z de a tres), en unidades del radio. */
  puntas: Float32Array;
};

const PROFUNDIDAD = 3;
const VIENTO = 16; // px/s hacia la derecha
const SUBIDA = 9; // px/s hacia arriba

const azar = (min: number, max: number) => min + Math.random() * (max - min);

function crearSemilla(ancho: number, alto: number, alInicio: boolean): Semilla {
  // Más semillas lejos que cerca, como en un campo abierto
  const z = 0.05 + 0.95 * (1 - Math.random() ** 1.6);
  const pelos = Math.round(azar(22, 30));
  const puntas = new Float32Array(pelos * 3);
  for (let i = 0; i < pelos; i++) {
    const angulo = (i / pelos) * Math.PI * 2 + azar(-0.08, 0.08);
    const elevacion = azar(0.15, 0.85); // de casi horizontal a bien abierto hacia arriba
    const largo = azar(0.85, 1);
    puntas[i * 3] = Math.cos(angulo) * Math.cos(elevacion) * largo;
    puntas[i * 3 + 1] = -Math.sin(elevacion) * largo;
    puntas[i * 3 + 2] = Math.sin(angulo) * Math.cos(elevacion) * largo;
  }

  // Al arrancar, repartidas por toda la portada; después entran por la izquierda o por abajo
  const margen = 80;
  let x: number;
  let y: number;
  if (alInicio) {
    x = azar(0, ancho);
    y = azar(0, alto);
  } else if (Math.random() < 0.6) {
    x = -margen;
    y = azar(alto * 0.1, alto + margen);
  } else {
    x = azar(-margen, ancho * 0.7);
    y = alto + margen;
  }

  return {
    x,
    y,
    z,
    s: 1 / (1 + z * PROFUNDIDAD),
    tamano: azar(0.7, 1.2),
    giro: azar(0, Math.PI * 2),
    velGiro: azar(0.15, 0.5) * (Math.random() < 0.5 ? -1 : 1),
    inclinacion: azar(-0.15, 0.6),
    fase: azar(0, Math.PI * 2),
    ex: 0,
    ey: 0,
    puntas,
  };
}

/** Halo suave del penacho, dibujado una sola vez y reusado en cada semilla. */
function crearHalo(): HTMLCanvasElement {
  const halo = document.createElement("canvas");
  halo.width = halo.height = 64;
  const ctx = halo.getContext("2d")!;
  const degradado = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  degradado.addColorStop(0, "rgba(255,255,255,0.9)");
  degradado.addColorStop(0.4, "rgba(255,255,255,0.35)");
  degradado.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, 64, 64);
  return halo;
}

export default function SemillasFlotantes() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const halo = crearHalo();
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ancho = 0;
    let alto = 0;
    let radioBase = 22;
    let semillas: Semilla[] = [];
    let cuadro = 0;
    let anterior = 0;
    let tiempo = 0;
    let visible = true;
    // Mouse: posición relativa a la portada (para la profundidad) y para soplar
    const mouse = { x: 0.5, y: 0.5, suaveX: 0.5, suaveY: 0.5, px: -1, py: -1 };

    const ordenar = () => semillas.sort((a, b) => b.z - a.z); // lejanas primero

    function medir() {
      const caja = canvas!.getBoundingClientRect();
      const nuevoAncho = caja.width;
      const nuevoAlto = caja.height;
      const ppp = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(nuevoAncho * ppp);
      canvas!.height = Math.round(nuevoAlto * ppp);
      ctx!.setTransform(ppp, 0, 0, ppp, 0, 0);

      // Menos semillas en pantallas chicas: se ve igual de lleno y pesa menos
      const cantidad = Math.round(Math.min(40, Math.max(16, (nuevoAncho * nuevoAlto) / 30000)));
      radioBase = nuevoAncho < 640 ? 19 : 26;

      if (!semillas.length) {
        semillas = Array.from({ length: cantidad }, () => crearSemilla(nuevoAncho, nuevoAlto, true));
      } else {
        // Al cambiar el tamaño se mantienen donde estaban, en proporción
        for (const semilla of semillas) {
          semilla.x *= nuevoAncho / (ancho || nuevoAncho);
          semilla.y *= nuevoAlto / (alto || nuevoAlto);
        }
        while (semillas.length < cantidad) semillas.push(crearSemilla(nuevoAncho, nuevoAlto, true));
        semillas.length = cantidad;
      }
      ancho = nuevoAncho;
      alto = nuevoAlto;
      ordenar();
    }

    function dibujarSemilla(semilla: Semilla, desplazamiento: number) {
      const { s } = semilla;
      const radio = radioBase * semilla.tamano * s;
      // Profundidad: las cercanas se corren más con el mouse y al deslizar
      const cx = semilla.x + (mouse.suaveX - 0.5) * -40 * s;
      const cy = semilla.y + (mouse.suaveY - 0.5) * -24 * s - desplazamiento * 0.35 * s;
      if (cx < -radio * 4 || cx > ancho + radio * 4 || cy < -radio * 4 || cy > alto + radio * 4) return;

      // Vaivén con la brisa: se inclina hacia donde la lleva el viento
      const vaiven = Math.sin(tiempo * 0.9 + semilla.fase) * 0.22 + Math.max(-0.4, Math.min(0.4, semilla.ex / 120));
      const cg = Math.cos(semilla.giro);
      const sg = Math.sin(semilla.giro);
      const ci = Math.cos(semilla.inclinacion);
      const si = Math.sin(semilla.inclinacion);
      const cv = Math.cos(vaiven);
      const sv = Math.sin(vaiven);

      // Del espacio de la semilla a la pantalla: giro, inclinación, vaivén y perspectiva
      const proyectar = (x: number, y: number, z: number): [number, number] => {
        const x1 = x * cg + z * sg;
        const z1 = -x * sg + z * cg;
        const y2 = y * ci - z1 * si;
        const z2 = y * si + z1 * ci;
        const x3 = x1 * cv - y2 * sv;
        const y3 = x1 * sv + y2 * cv;
        const perspectiva = radio / (1 + z2 * 0.18);
        return [cx + x3 * perspectiva, cy + y3 * perspectiva];
      };

      const opacidad = 0.25 + 0.65 * s;

      // Halo del penacho
      const [hx, hy] = proyectar(0, -0.35, 0);
      const lado = radio * 2.6;
      ctx!.globalAlpha = opacidad * 0.4;
      ctx!.drawImage(halo, hx - lado / 2, hy - lado / 2, lado, lado);

      // Pelitos del penacho, todos en un solo trazo
      const [ax, ay] = proyectar(0, 0, 0);
      ctx!.globalAlpha = opacidad;
      ctx!.strokeStyle = "rgba(255,255,255,0.9)";
      ctx!.lineWidth = 0.35 + 0.6 * s;
      ctx!.beginPath();
      const { puntas } = semilla;
      for (let i = 0; i < puntas.length; i += 3) {
        const [px, py] = proyectar(puntas[i], puntas[i + 1], puntas[i + 2]);
        ctx!.moveTo(ax, ay);
        ctx!.lineTo(px, py);
      }
      // Tallito
      const [bx, by] = proyectar(0, 1.7, 0);
      ctx!.moveTo(ax, ay);
      ctx!.lineTo(bx, by);
      ctx!.stroke();

      // Semilla (aquenio), marrón y un poco más gruesa
      const [sx, sy] = proyectar(0, 2.25, 0);
      ctx!.strokeStyle = "rgba(150,112,72,0.95)";
      ctx!.lineWidth = 0.8 + 1.6 * s;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(bx, by);
      ctx!.lineTo(sx, sy);
      ctx!.stroke();
    }

    function dibujar() {
      ctx!.clearRect(0, 0, ancho, alto);
      const desplazamiento = Math.min(window.scrollY, alto);
      for (const semilla of semillas) dibujarSemilla(semilla, desplazamiento);
      ctx!.globalAlpha = 1;
    }

    function mover(dt: number) {
      tiempo += dt;
      // El mouse se sigue con suavidad, para que la profundidad no salte
      mouse.suaveX += (mouse.x - mouse.suaveX) * Math.min(1, dt * 3);
      mouse.suaveY += (mouse.y - mouse.suaveY) * Math.min(1, dt * 3);

      let reordenar = false;
      for (let i = 0; i < semillas.length; i++) {
        const semilla = semillas[i];
        const { s } = semilla;
        const vx = (VIENTO + Math.sin(tiempo * 0.6 + semilla.fase) * 10) * s;
        const vy = (-SUBIDA + Math.cos(tiempo * 0.8 + semilla.fase * 1.3) * 7) * s;
        semilla.x += (vx + semilla.ex) * dt;
        semilla.y += (vy + semilla.ey) * dt;
        const freno = Math.exp(-dt * 1.4);
        semilla.ex *= freno;
        semilla.ey *= freno;
        semilla.giro += semilla.velGiro * dt;

        const margen = 120;
        if (semilla.x > ancho + margen || semilla.y < -margen - alto * 0.35) {
          semillas[i] = crearSemilla(ancho, alto, false);
          reordenar = true;
        }
      }
      if (reordenar) ordenar();
    }

    function cuadroSiguiente(ahora: number) {
      const dt = Math.min(0.05, (ahora - (anterior || ahora)) / 1000);
      anterior = ahora;
      mover(dt);
      dibujar();
      cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    function arrancar() {
      cancelAnimationFrame(cuadro);
      anterior = 0;
      if (quieto.matches) {
        dibujar(); // quietas, pero se ven
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    // Soplar: las semillas cerca del mouse salen empujadas hacia donde va
    function alMover(evento: PointerEvent) {
      const caja = canvas!.getBoundingClientRect();
      const x = evento.clientX - caja.left;
      const y = evento.clientY - caja.top;
      mouse.x = Math.max(0, Math.min(1, x / caja.width));
      mouse.y = Math.max(0, Math.min(1, y / caja.height));

      if (mouse.px >= 0 && evento.pointerType === "mouse") {
        const dx = x - mouse.px;
        const dy = y - mouse.py;
        for (const semilla of semillas) {
          const distancia = Math.hypot(semilla.x - x, semilla.y - y);
          const alcance = 140;
          if (distancia > alcance) continue;
          const fuerza = (1 - distancia / alcance) * semilla.s;
          semilla.ex = Math.max(-220, Math.min(220, semilla.ex + dx * 6 * fuerza));
          semilla.ey = Math.max(-220, Math.min(220, semilla.ey + dy * 6 * fuerza));
        }
      }
      mouse.px = x;
      mouse.py = y;
    }

    medir();
    arrancar();
    // Aparece de a poco, recién cuando ya hay algo dibujado
    requestAnimationFrame(() => canvas.classList.remove("opacity-0"));

    const alCambiarTamano = new ResizeObserver(() => {
      medir();
      if (quieto.matches) dibujar();
    });
    alCambiarTamano.observe(canvas);

    // Fuera de pantalla no se anima: no gasta batería
    const alVerse = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      arrancar();
    });
    alVerse.observe(canvas);

    const alPedirQuietud = () => arrancar();
    quieto.addEventListener("change", alPedirQuietud);
    window.addEventListener("pointermove", alMover, { passive: true });

    return () => {
      cancelAnimationFrame(cuadro);
      alCambiarTamano.disconnect();
      alVerse.disconnect();
      quieto.removeEventListener("change", alPedirQuietud);
      window.removeEventListener("pointermove", alMover);
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000"
    />
  );
}
