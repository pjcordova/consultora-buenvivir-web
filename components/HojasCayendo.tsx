"use client";

import { useEffect, useRef } from "react";

/**
 * Hojas que caen despacio sobre la foto del bosque (Comunidad): cada una gira
 * sobre su eje mientras baja, así se ve su cara clara y su cara oscura, y la
 * brisa la hamaca. Distintos verdes y, de vez en cuando, una dorada.
 *
 * Dibujo propio en un canvas: pesa poco, en celular caen menos hojas, se pausa
 * fuera de pantalla y con "reducir movimiento" quedan quietas.
 */

type Hoja = {
  x: number;
  y: number;
  /** Cercanía: 1 cerca (grande, rápida) … 0,45 lejos. */
  s: number;
  largo: number;
  /** Ancho de la hoja respecto de su largo. */
  forma: number;
  giro: number;
  velGiro: number;
  /** Vuelta sobre su eje largo: se ve de frente, de canto y del revés. */
  volteo: number;
  velVolteo: number;
  fase: number;
  colores: [string, string];
};

// [cara de arriba, cara de abajo]
const VERDES: [string, string][] = [
  ["#4c8f3a", "#3a6e2c"],
  ["#6dbb5a", "#52984a"],
  ["#2f9a74", "#247a5c"],
  ["#82ad45", "#678a35"],
  ["#a8c66c", "#89a656"],
];
const DORADA: [string, string] = ["#d0a54b", "#a8832f"];

const azar = (min: number, max: number) => min + Math.random() * (max - min);

function nuevaHoja(ancho: number, alto: number, alInicio: boolean): Hoja {
  const s = 0.45 + 0.55 * Math.random() ** 1.5;
  return {
    x: azar(-20, ancho + 20),
    y: alInicio ? azar(-alto * 0.1, alto) : azar(-70, -25),
    s,
    largo: azar(22, 38),
    forma: azar(0.38, 0.52),
    giro: azar(0, Math.PI * 2),
    velGiro: azar(-0.7, 0.7),
    volteo: azar(0, Math.PI * 2),
    velVolteo: azar(1.1, 2.4) * (Math.random() < 0.5 ? -1 : 1),
    fase: azar(0, Math.PI * 2),
    colores: Math.random() < 0.12 ? DORADA : VERDES[Math.floor(Math.random() * VERDES.length)],
  };
}

export default function HojasCayendo() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ancho = 0;
    let alto = 0;
    let hojas: Hoja[] = [];
    let tiempo = 0;
    let anterior = 0;
    let cuadro = 0;
    let visible = false;

    function medir() {
      const caja = canvas!.getBoundingClientRect();
      if (!caja.width || !caja.height) return;
      const ppp = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(caja.width * ppp);
      canvas!.height = Math.round(caja.height * ppp);
      ctx!.setTransform(ppp, 0, 0, ppp, 0, 0);
      const cantidad = Math.round(Math.min(34, Math.max(12, (caja.width * caja.height) / 26000)));
      if (!hojas.length) {
        hojas = Array.from({ length: cantidad }, () => nuevaHoja(caja.width, caja.height, true));
      } else {
        while (hojas.length < cantidad) hojas.push(nuevaHoja(caja.width, caja.height, true));
        hojas.length = cantidad;
      }
      ancho = caja.width;
      alto = caja.height;
      hojas.sort((a, b) => a.s - b.s); // las lejanas primero
    }

    function dibujar() {
      ctx!.clearRect(0, 0, ancho, alto);
      for (const hoja of hojas) {
        const largo = hoja.largo * hoja.s;
        const anchoHoja = largo * hoja.forma;
        const vuelta = Math.cos(hoja.volteo);
        ctx!.save();
        ctx!.translate(hoja.x, hoja.y);
        ctx!.rotate(hoja.giro);
        // De canto se ve finita, nunca desaparece del todo
        ctx!.scale(Math.sign(vuelta || 1) * Math.max(0.12, Math.abs(vuelta)), 1);
        ctx!.globalAlpha = 0.55 + 0.4 * hoja.s;
        ctx!.fillStyle = vuelta >= 0 ? hoja.colores[0] : hoja.colores[1];
        ctx!.beginPath();
        ctx!.moveTo(0, -largo / 2);
        ctx!.bezierCurveTo(anchoHoja, -largo / 4, anchoHoja * 0.8, largo / 3, 0, largo / 2);
        ctx!.bezierCurveTo(-anchoHoja * 0.8, largo / 3, -anchoHoja, -largo / 4, 0, -largo / 2);
        ctx!.fill();
        // Nervadura y cabito
        ctx!.strokeStyle = "rgba(255,255,255,0.28)";
        ctx!.lineWidth = Math.max(0.6, 0.9 * hoja.s);
        ctx!.beginPath();
        ctx!.moveTo(0, -largo / 2 + 2);
        ctx!.lineTo(0, largo / 2 + largo * 0.18);
        ctx!.stroke();
        ctx!.restore();
      }
      ctx!.globalAlpha = 1;
    }

    function mover(dt: number) {
      tiempo += dt;
      for (let i = 0; i < hojas.length; i++) {
        const hoja = hojas[i];
        hoja.y += (12 + 16 * hoja.s) * dt;
        hoja.x += (Math.sin(tiempo * 0.7 + hoja.fase) * 22 + 6) * hoja.s * dt;
        hoja.giro += hoja.velGiro * dt;
        hoja.volteo += hoja.velVolteo * dt;
        if (hoja.y > alto + 40 || hoja.x > ancho + 60) hojas[i] = nuevaHoja(ancho, alto, false);
      }
    }

    function cuadroSiguiente(ahora: number) {
      const dt = Math.min(0.05, (ahora - (anterior || ahora)) / 1000);
      anterior = ahora;
      mover(dt);
      dibujar();
      cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    function seguir() {
      cancelAnimationFrame(cuadro);
      anterior = 0;
      if (quieto.matches) {
        dibujar();
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    medir();
    dibujar();
    requestAnimationFrame(() => canvas.classList.remove("opacity-0"));

    const alCambiarTamano = new ResizeObserver(() => {
      medir();
      dibujar();
    });
    alCambiarTamano.observe(canvas);
    const alVerse = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      seguir();
    });
    alVerse.observe(canvas);
    const alPedirQuietud = () => seguir();
    quieto.addEventListener("change", alPedirQuietud);

    return () => {
      cancelAnimationFrame(cuadro);
      alCambiarTamano.disconnect();
      alVerse.disconnect();
      quieto.removeEventListener("change", alPedirQuietud);
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
