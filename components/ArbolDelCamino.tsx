"use client";

import { useEffect, useRef } from "react";

/**
 * Una semilla que se vuelve árbol al ritmo de la lectura de "Mi camino":
 * semilla en la tierra, brote, tronco, ramas, hojas y al final flores
 * doradas, con raíces que crecen bajo la tierra (como el logo del Ecosistema).
 * Es un árbol en 3D que gira apenas mientras se desliza y se mece con la brisa.
 *
 * - "pegado": acompaña el texto desde una columna al costado; crece según
 *   cuánto se leyó del elemento con id `sigue`.
 * - "final": va debajo del texto (celular y tablet) y crece mientras sube por
 *   la pantalla.
 *
 * Dibujo propio en un canvas, sin librerías. Siempre es el mismo árbol. Con
 * "reducir movimiento" se ve ya crecido y quieto.
 */

type Vec = [number, number, number];

type Rama = { desde: Vec; hasta: Vec; grosor: number; nace: number; dura: number; nivel: number };
type Hoja = { en: Vec; tamano: number; giro: number; color: string; nace: number; fase: number };
type Flor = { en: Vec; tamano: number; nace: number };

const COLORES_HOJA = ["#27a47e", "#3fae6b", "#6dbb5a", "#4c8f3a", "#2f9a74"];
const COLOR_FLOR = "#e8bd5f";
const COLOR_RAIZ = "168,121,43";

/** Azar con semilla fija: el árbol sale siempre igual. */
function azarFijo(semilla: number) {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sumar = (a: Vec, b: Vec, k = 1): Vec => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const normal = (v: Vec): Vec => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

/** Abre una dirección: la inclina `apertura` radianes hacia el lado `azimut`. */
function abrir(dir: Vec, apertura: number, azimut: number): Vec {
  // Dos perpendiculares a la dirección
  const ayuda: Vec = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = normal([
    dir[1] * ayuda[2] - dir[2] * ayuda[1],
    dir[2] * ayuda[0] - dir[0] * ayuda[2],
    dir[0] * ayuda[1] - dir[1] * ayuda[0],
  ]);
  const w: Vec = [dir[1] * u[2] - dir[2] * u[1], dir[2] * u[0] - dir[0] * u[2], dir[0] * u[1] - dir[1] * u[0]];
  const lado = sumar(sumar([0, 0, 0], u, Math.cos(azimut)), w, Math.sin(azimut));
  return normal(sumar(sumar([0, 0, 0], dir, Math.cos(apertura)), lado, Math.sin(apertura)));
}

function crearArbol() {
  const azar = azarFijo(20260913);
  const ramas: Rama[] = [];
  const hojas: Hoja[] = [];
  const flores: Flor[] = [];
  const raices: Rama[] = [];

  const crecer = (desde: Vec, dir: Vec, largo: number, grosor: number, nivel: number, nace: number) => {
    const dura = 0.17 - nivel * 0.015;
    const hasta = sumar(desde, dir, largo);
    ramas.push({ desde, hasta, grosor, nace, dura, nivel });

    // Hojas a lo largo de las ramitas y un racimo en cada punta
    if (nivel >= 3) {
      for (let i = 0; i < 2; i++) {
        const t = 0.4 + azar() * 0.5;
        hojas.push({
          en: sumar(sumar(desde, dir, largo * t), [azar() - 0.5, azar() - 0.3, azar() - 0.5], 0.08),
          tamano: 0.05 + azar() * 0.03,
          giro: azar() * Math.PI,
          color: COLORES_HOJA[Math.floor(azar() * COLORES_HOJA.length)],
          nace: nace + dura * 0.4,
          fase: azar() * 6.3,
        });
      }
    }
    if (nivel >= 4 || largo < 0.12) {
      for (let i = 0; i < 6; i++) {
        hojas.push({
          en: sumar(hasta, [azar() - 0.5, azar() - 0.35, azar() - 0.5], 0.2),
          tamano: 0.055 + azar() * 0.035,
          giro: azar() * Math.PI,
          color: COLORES_HOJA[Math.floor(azar() * COLORES_HOJA.length)],
          nace: nace + dura * 0.4,
          fase: azar() * 6.3,
        });
      }
      if (azar() < 0.55) flores.push({ en: sumar(hasta, [azar() - 0.5, azar() * 0.2, azar() - 0.5], 0.12), tamano: 0.035 + azar() * 0.02, nace: 0 });
      return;
    }

    const hijos = nivel === 0 ? 3 : azar() < 0.55 ? 2 : 3;
    for (let k = 0; k < hijos; k++) {
      const t = nivel === 0 ? 0.5 + k * 0.17 : 0.65 + azar() * 0.35;
      const azimut = (k / hijos) * Math.PI * 2 + azar() * 0.9 + nivel * 1.3;
      // El primer hijo del tronco sigue casi derecho: es la guía del árbol
      const apertura = nivel === 0 && k === hijos - 1 ? 0.12 : 0.5 + azar() * 0.35;
      const nueva = normal(sumar(abrir(dir, apertura, azimut), [0, 1, 0], 0.22));
      crecer(sumar(desde, dir, largo * t), nueva, largo * (0.66 + azar() * 0.12), grosor * 0.62, nivel + 1, nace + dura * t);
    }
  };
  crecer([0, 0, 0], [0, 1, 0], 0.95, 0.11, 0, 0.12);

  // Raíces: hacia abajo, más finas y menos niveles
  const enraizar = (desde: Vec, dir: Vec, largo: number, grosor: number, nivel: number, nace: number) => {
    const dura = 0.14;
    const hasta = sumar(desde, dir, largo);
    raices.push({ desde, hasta, grosor, nace, dura, nivel });
    if (nivel >= 3) return;
    const hijos = 2;
    for (let k = 0; k < hijos; k++) {
      const t = 0.55 + azar() * 0.4;
      const nueva = normal(sumar(abrir(dir, 0.5 + azar() * 0.4, (k / hijos) * Math.PI * 2 + azar() * 1.2), [0, -1, 0], 0.15));
      enraizar(sumar(desde, dir, largo * t), nueva, largo * 0.65, grosor * 0.6, nivel + 1, nace + dura * t);
    }
  };
  for (let k = 0; k < 4; k++) {
    enraizar([0, 0, 0], normal(abrir([0, -1, 0], 0.75 + azar() * 0.35, (k / 4) * Math.PI * 2 + azar() * 0.5)), 0.45, 0.05, 0, 0.1 + k * 0.03);
  }

  // Se reparte el crecimiento para que las ramas terminen a ~0,84 de la lectura
  const fin = Math.max(...ramas.map((rama) => rama.nace + rama.dura));
  const escala = (0.84 - 0.12) / (fin - 0.12);
  for (const rama of ramas) {
    rama.nace = 0.12 + (rama.nace - 0.12) * escala;
    rama.dura *= escala;
  }
  const finRaices = Math.max(...raices.map((raiz) => raiz.nace + raiz.dura));
  for (const raiz of raices) {
    raiz.nace = 0.1 + (raiz.nace - 0.1) * (0.55 / (finRaices - 0.1));
    raiz.dura *= 0.55 / (finRaices - 0.1);
  }
  // Las hojas salen mientras crece su rama (entre 0,4 y 0,94); las flores, al final
  for (const hoja of hojas) hoja.nace = Math.min(0.94, Math.max(0.4, 0.12 + (hoja.nace - 0.12) * escala));
  flores.forEach((flor, i) => (flor.nace = 0.88 + (i / flores.length) * 0.1));

  return { ramas, hojas, flores, raices };
}

const limitar = (v: number) => Math.max(0, Math.min(1, v));

type ArbolDelCaminoProps = {
  modo: "pegado" | "final";
  /** En modo "pegado": id del texto cuya lectura hace crecer el árbol. */
  sigue?: string;
};

export default function ArbolDelCamino({ modo, sigue }: ArbolDelCaminoProps) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { ramas, hojas, flores, raices } = crearArbol();
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ancho = 0;
    let alto = 0;
    let progreso = 0; // lo que se ve, que persigue suave al de la lectura
    let tiempo = 0;
    let anterior = 0;
    let cuadro = 0;
    let visible = false;

    function medir() {
      const caja = canvas!.getBoundingClientRect();
      ancho = caja.width;
      alto = caja.height;
      const ppp = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(ancho * ppp);
      canvas!.height = Math.round(alto * ppp);
      ctx!.setTransform(ppp, 0, 0, ppp, 0, 0);
    }

    /** Cuánto se leyó, de 0 a 1. */
    function objetivo(): number {
      if (quieto.matches) return 1;
      const pantalla = window.innerHeight;
      if (modo === "pegado") {
        const texto = sigue ? document.getElementById(sigue) : null;
        if (!texto) return 1;
        const caja = texto.getBoundingClientRect();
        return limitar((pantalla * 0.6 - caja.top) / (caja.height - pantalla * 0.15));
      }
      const caja = canvas!.getBoundingClientRect();
      return limitar((pantalla - caja.top) / (pantalla * 0.6 + caja.height / 2));
    }

    function dibujar() {
      ctx!.clearRect(0, 0, ancho, alto);
      const p = progreso;
      const suelo = alto * 0.74;
      const unidad = Math.min(ancho / 2.05, (alto * 0.7) / 2.6);
      // Gira apenas al leer (se ve en 3D) y se mece con la brisa
      const giro = -0.6 + p * 1.6 + (quieto.matches ? 0 : Math.sin(tiempo * 0.25) * 0.08);
      const [cg, sg] = [Math.cos(giro), Math.sin(giro)];
      const inclinacion = 0.16;
      const [ci, si] = [Math.cos(inclinacion), Math.sin(inclinacion)];
      const brisa = quieto.matches ? 0 : 1;

      const proyectar = (v: Vec, mece = 1): [number, number, number] => {
        const altura = Math.max(0, v[1]);
        const x0 = v[0] + Math.sin(tiempo * 1.1 + altura * 1.7) * 0.025 * altura * altura * brisa * mece;
        const x = x0 * cg + v[2] * sg;
        const z = -x0 * sg + v[2] * cg;
        const y = v[1] * ci - z * si;
        const zz = v[1] * si + z * ci;
        const s = 6 / (6 + zz);
        return [ancho / 2 + x * s * unidad, suelo - y * s * unidad, zz];
      };
      const punto = (rama: Rama, g: number): Vec => [
        rama.desde[0] + (rama.hasta[0] - rama.desde[0]) * g,
        rama.desde[1] + (rama.hasta[1] - rama.desde[1]) * g,
        rama.desde[2] + (rama.hasta[2] - rama.desde[2]) * g,
      ];
      const engrosar = 0.35 + 0.65 * limitar((p - 0.12) / 0.7);

      // Tierra
      ctx!.fillStyle = "rgba(122,92,58,0.10)";
      ctx!.beginPath();
      ctx!.ellipse(ancho / 2, suelo, unidad * (0.5 + 0.5 * p), unidad * 0.09, 0, 0, Math.PI * 2);
      ctx!.fill();

      // Raíces
      ctx!.lineCap = "round";
      for (const raiz of raices) {
        const g = limitar((p - raiz.nace) / raiz.dura);
        if (g <= 0) continue;
        const [x1, y1] = proyectar(raiz.desde, 0);
        const [x2, y2] = proyectar(punto(raiz, g), 0);
        ctx!.strokeStyle = `rgba(${COLOR_RAIZ},${0.35 + 0.25 * (1 - raiz.nivel / 3)})`;
        ctx!.lineWidth = Math.max(0.6, raiz.grosor * unidad * engrosar);
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
      }

      // Semilla: entera al principio, se abre al brotar y desaparece
      if (p < 0.32) {
        const [sx, sy] = proyectar([0, 0, 0], 0);
        const abierta = limitar((p - 0.1) / 0.12);
        ctx!.globalAlpha = 1 - limitar((p - 0.2) / 0.12);
        ctx!.fillStyle = "#8a6440";
        for (const lado of abierta > 0 ? [-1, 1] : [0]) {
          ctx!.beginPath();
          ctx!.ellipse(
            sx + lado * abierta * unidad * 0.09,
            sy - unidad * 0.05 + Math.sin(tiempo * 2) * (1 - abierta) * 0.6 * brisa,
            unidad * (lado ? 0.055 : 0.08),
            unidad * 0.12,
            lado * abierta * 0.7,
            0,
            Math.PI * 2
          );
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      }

      // Hojas de atrás, ramas, hojas de adelante: así el tronco tapa lo que corresponde
      const hojasVisibles = hojas
        .map((hoja) => ({ hoja, g: limitar((p - hoja.nace) / 0.08), pos: proyectar(hoja.en) }))
        .filter(({ g }) => g > 0);
      const dibujarHojas = (atras: boolean) => {
        for (const { hoja, g, pos } of hojasVisibles) {
          if (pos[2] > 0 !== atras) continue;
          const s = 6 / (6 + pos[2]);
          ctx!.fillStyle = hoja.color;
          ctx!.globalAlpha = (atras ? 0.75 : 0.95) * g;
          ctx!.beginPath();
          ctx!.ellipse(
            pos[0],
            pos[1],
            hoja.tamano * unidad * s * g,
            hoja.tamano * unidad * s * g * 0.5,
            hoja.giro + giro * 0.5 + Math.sin(tiempo * 2.2 + hoja.fase) * 0.15 * brisa,
            0,
            Math.PI * 2
          );
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      };
      dibujarHojas(true);

      for (const rama of ramas) {
        const g = limitar((p - rama.nace) / rama.dura);
        if (g <= 0) continue;
        const [x1, y1] = proyectar(rama.desde);
        const [x2, y2] = proyectar(punto(rama, g));
        ctx!.strokeStyle = rama.nivel <= 1 ? "#6b4a2f" : rama.nivel <= 3 ? "#7d5a3c" : "#8f6c49";
        ctx!.lineWidth = Math.max(0.8, rama.grosor * unidad * engrosar);
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.stroke();
      }

      // Brote: dos hojitas en la punta del tallo mientras es chico
      const tronco = ramas[0];
      const gTronco = limitar((p - tronco.nace) / tronco.dura);
      const brote = limitar((p - 0.13) / 0.05) * (1 - limitar((p - 0.32) / 0.1));
      if (brote > 0) {
        const [bx, by] = proyectar(punto(tronco, gTronco));
        ctx!.fillStyle = "#6dbb5a";
        ctx!.globalAlpha = brote;
        for (const lado of [-1, 1]) {
          ctx!.beginPath();
          ctx!.ellipse(bx + lado * unidad * 0.05, by - unidad * 0.01, unidad * 0.055, unidad * 0.024, lado * -0.45, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      }

      dibujarHojas(false);

      // Flores doradas al final
      for (const flor of flores) {
        const g = limitar((p - flor.nace) / 0.06);
        if (g <= 0) continue;
        const [fx, fy, fz] = proyectar(flor.en);
        const s = 6 / (6 + fz);
        ctx!.fillStyle = COLOR_FLOR;
        ctx!.globalAlpha = g;
        ctx!.beginPath();
        ctx!.arc(fx, fy, flor.tamano * unidad * s * g, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    function cuadroSiguiente(ahora: number) {
      const transcurrido = (ahora - (anterior || ahora)) / 1000;
      anterior = ahora;
      tiempo += Math.min(0.05, transcurrido);
      // Persigue lo leído con suavidad: aunque se deslice a los saltos, crece
      // fluido. Con el tiempo real, así se pone al día si el navegador dibujó
      // pocos cuadros (por ejemplo, al volver de otra pestaña).
      progreso += (objetivo() - progreso) * (1 - Math.exp(-transcurrido * 4));
      dibujar();
      cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    function seguir() {
      cancelAnimationFrame(cuadro);
      anterior = 0;
      if (quieto.matches) {
        progreso = 1;
        dibujar();
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    medir();
    progreso = objetivo();
    dibujar();

    const alCambiarTamano = new ResizeObserver(() => {
      medir();
      dibujar();
    });
    alCambiarTamano.observe(canvas);

    // Fuera de pantalla no se anima
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
  }, [modo, sigue]);

  return <canvas ref={lienzo} aria-hidden="true" className="h-full w-full" />;
}
