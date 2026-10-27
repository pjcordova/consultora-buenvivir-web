import { useMemo, type CSSProperties } from "react";

/**
 * Enredadera en la esquina de arriba a la izquierda de una tarjeta de la
 * Comunidad (pedido de Belén: que se sienta un bosque). Nace donde la red de
 * raíces llega a la tarjeta (un punto del borde de arriba), corre por ese
 * borde hacia la izquierda, dobla la esquina y baja por el costado; un brote
 * corto sale para el otro lado. Hojas a los dos lados: grandes cerca de donde
 * nace y más chicas en las puntas; las de adentro, chicas y echadas, para no
 * tapar la foto ni el nombre.
 *
 * Cada integrante tiene la suya: sale de su id, así que es siempre la misma y
 * distinta de las demás, con uno de tres tipos de hoja. Queda escondida hasta
 * que la red de raíces llega a la tarjeta (RedComunidad le pone data-brotada)
 * y ahí crece: primero el tallo y cada hoja cuando el tallo pasa por su lugar
 * (ver .enredadera en globals.css). Con "reducir movimiento" ya está crecida.
 */

type Punto = [number, number];
type Camino = (s: number) => { p: Punto; dir: Punto; afuera: Punto };

const R = 24; // radio de la esquina de la tarjeta (rounded-3xl)
const M = 26; // margen del dibujo por fuera de la tarjeta
const T = 1.8; // segundos que tarda en crecer el tallo principal

const TIPOS = ["hiedra", "corazon", "ovalada"] as const;
type Tipo = (typeof TIPOS)[number];

// Hojas con la base en (0,0) y la punta en (0,-1); se escalan a su tamaño
const FORMAS: Record<Tipo, { hoja: string; nervios: string }> = {
  hiedra: {
    hoja: "M0 0Q.2 .1 .42 .06Q.5-.06 .38-.16Q.62-.22 .72-.42Q.5-.5 .3-.5Q.22-.8 0-1Q-.22-.8-.3-.5Q-.5-.5-.72-.42Q-.62-.22-.38-.16Q-.5-.06-.42 .06Q-.2 .1 0 0Z",
    nervios: "M0 0L0-.85M0 0L.6-.38M0 0L-.6-.38M0 0L.34 .02M0 0L-.34 .02",
  },
  corazon: {
    hoja: "M0 0C.2 .08 .5 .02 .46-.3C.42-.55 .2-.78 0-1C-.2-.78-.42-.55-.46-.3C-.5 .02-.2 .08 0 0Z",
    nervios: "M0 0L0-.9M0-.2Q.25-.3 .4-.5M0-.2Q-.25-.3-.4-.5M0-.45Q.15-.55 .25-.7M0-.45Q-.15-.55-.25-.7",
  },
  ovalada: {
    hoja: "M0 0C.45-.1 .5-.55 0-1C-.5-.55-.45-.1 0 0Z",
    nervios: "M0-.03L0-.9M0-.25L.27-.4M0-.25L-.27-.4M0-.45L.24-.6M0-.45L-.24-.6M0-.65L.15-.77M0-.65L-.15-.77",
  },
};

// [base, punta] de cada hoja: verdes distintos según el tipo (y alguna otoñal en las ovaladas)
const COLORES: Record<Tipo, [string, string][]> = {
  hiedra: [
    ["#2c5e27", "#4f9a3f"],
    ["#356b2c", "#62ad4c"],
    ["#24563a", "#3f8f5f"],
    ["#3d6e22", "#78b04a"],
  ],
  corazon: [
    ["#3f8a35", "#86c867"],
    ["#2f7d55", "#5fbf8c"],
    ["#5b8f2c", "#a3d063"],
    ["#2c7a3c", "#6cbf5a"],
  ],
  ovalada: [
    ["#4b8a33", "#8cc45e"],
    ["#5f9a3a", "#a9d36f"],
    ["#3f7f3a", "#7dbb63"],
    ["#9a5a34", "#d39a5a"],
  ],
};

/** Números al azar que salen siempre iguales para un mismo texto. */
function semilla(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Dónde nace la enredadera: píxeles desde el borde izquierdo (el primer número de su semilla). */
const nacimiento = (azar: () => number) => Math.round(140 + azar() * 40);

/** Dónde nace la enredadera de esta tarjeta (ahí le llega la raíz de la red). */
export function broteDe(id: string) {
  return nacimiento(semilla(id));
}

/** El borde de la tarjeta desde el brote: hacia la izquierda, la esquina y abajo. */
function borde(brote: number): Camino {
  const recta = brote - R;
  const arco = (Math.PI * R) / 2;
  return (s) => {
    if (s <= recta) return { p: [brote - s, 0], dir: [-1, 0], afuera: [0, -1] };
    if (s <= recta + arco) {
      const fi = -Math.PI / 2 - (s - recta) / R;
      return {
        p: [R + R * Math.cos(fi), R + R * Math.sin(fi)],
        dir: [Math.sin(fi), -Math.cos(fi)],
        afuera: [Math.cos(fi), Math.sin(fi)],
      };
    }
    return { p: [0, R + s - recta - arco], dir: [0, 1], afuera: [-1, 0] };
  };
}

/** El mismo camino, ondulando un poco (casi siempre hacia afuera, pegado al borde). */
function ondulado(camino: Camino, azar: () => number): Camino {
  const k = (Math.PI * 2) / (45 + azar() * 25);
  const f = azar() * 6.3;
  return (s) => {
    const punto = camino(s);
    const desvio = 1.2 + 2.2 * Math.sin(s * k + f);
    return { ...punto, p: [punto.p[0] + punto.afuera[0] * desvio, punto.p[1] + punto.afuera[1] * desvio] };
  };
}

const n = (valor: number) => Math.round(valor * 10) / 10;
const trazo = (puntos: Punto[]) => "M" + puntos.map(([x, y]) => `${n(x + M)} ${n(y + M)}`).join("L");

/** Ángulo (grados) de una dirección, girada hacia otra. */
function girar(base: Punto, hacia: Punto, grados: number) {
  const cruz = base[0] * hacia[1] - base[1] * hacia[0];
  return (Math.atan2(base[1], base[0]) * 180) / Math.PI + Math.sign(cruz || 1) * grados;
}

function crearEnredadera(id: string) {
  const azar = semilla(id);
  const brote = nacimiento(azar);
  const tipo = TIPOS[Math.floor(azar() * TIPOS.length)];
  const bajada = 120 + azar() * 50;
  const largo = brote - R + (Math.PI * R) / 2 + bajada;
  const largoBrote = 34 + azar() * 16;
  const velocidad = largo / T;

  const principal = ondulado(borde(brote), azar);
  const lateral = ondulado((s) => ({ p: [brote + s, 0], dir: [1, 0], afuera: [0, -1] }), azar);
  const puntos = (camino: Camino, hasta: number) => {
    const lista: Punto[] = [];
    for (let s = 0; s < hasta; s += 5) lista.push(camino(s).p);
    lista.push(camino(hasta).p);
    return lista;
  };

  // Tallos: más gruesos y oscuros donde nace, finitos y verdes en las puntas
  const tallos: { d: string; ancho: number; color: string; dur: number; retraso: number }[] = [];
  for (const [parte, ancho, color] of [
    [1, 1.1, "#71803f"],
    [0.7, 1.8, "#6c6a38"],
    [0.35, 2.6, "#62553a"],
  ] as const) {
    tallos.push({ d: trazo(puntos(principal, largo * parte)), ancho, color, dur: T * parte, retraso: 0 });
  }
  for (const [parte, ancho, color] of [
    [1, 1, "#71803f"],
    [0.5, 1.7, "#6c6a38"],
  ] as const) {
    tallos.push({ d: trazo(puntos(lateral, largoBrote * parte)), ancho, color, dur: (largoBrote * parte) / velocidad, retraso: 0 });
  }

  const hojas: { x: number; y: number; giro: number; tam: number; color: number; retraso: number; peciolo: string }[] = [];
  const agregarHoja = (p: Punto, grados: number, tam: number, cuando: number) => {
    const angulo = (grados * Math.PI) / 180;
    const cabo = 2 + tam * 0.12;
    const base: Punto = [p[0] + Math.cos(angulo) * cabo, p[1] + Math.sin(angulo) * cabo];
    const colores = COLORES[tipo];
    // Entre las ovaladas, de vez en cuando una otoñal (la última)
    const otonal = tipo === "ovalada" && azar() < 0.12;
    const color = otonal
      ? colores.length - 1
      : Math.floor(azar() * (tipo === "ovalada" ? colores.length - 1 : colores.length));
    hojas.push({ x: n(base[0] + M), y: n(base[1] + M), giro: n(grados + 90), tam: n(tam), color, retraso: cuando + 0.1, peciolo: trazo([p, base]) });
  };
  const hojasDe = (camino: Camino, hasta: number, grande: number, chica: number) => {
    for (let d = 6 + azar() * 6; d < hasta - 2; d += 14 + azar() * 11) {
      const t = d / hasta;
      const { p, dir, afuera } = camino(d);
      const tam = (grande + (chica - grande) * t) * (0.7 + 0.55 * azar());
      // Afuera, inclinadas hacia donde crece el tallo
      agregarHoja(p, girar(afuera, dir, 8 + azar() * 62), tam, d / velocidad);
      // Adentro, de vez en cuando: chicas y casi echadas sobre el borde
      if (azar() < 0.3) {
        const otra = camino(Math.min(hasta - 1, d + 4));
        agregarHoja(otra.p, girar([-otra.afuera[0], -otra.afuera[1]], otra.dir, 58 + azar() * 18), tam * 0.6, (d + 4) / velocidad);
      }
    }
    // Un brote en la punta
    const punta = camino(hasta);
    agregarHoja(punta.p, (Math.atan2(punta.dir[1], punta.dir[0]) * 180) / Math.PI, chica * 0.8, hasta / velocidad);
  };
  hojasDe(principal, largo, 22, 9);
  hojasDe(lateral, largoBrote, 16, 9);

  // Un zarcillo enrulado que sale hacia afuera
  const desde = largo * (0.45 + azar() * 0.3);
  const { p, dir, afuera } = principal(desde);
  let angulo = (girar(afuera, dir, 30) * Math.PI) / 180;
  const sentido = azar() < 0.5 ? 1 : -1;
  const rulo: Punto[] = [p];
  let [x, y] = p;
  for (let i = 0; i < 26; i++) {
    angulo += sentido * (0.08 + i * 0.022);
    const paso = Math.max(0.5, 1.7 - i * 0.045);
    x += Math.cos(angulo) * paso;
    y += Math.sin(angulo) * paso;
    rulo.push([x, y]);
  }
  tallos.push({ d: trazo(rulo), ancho: 0.75, color: "#8fae4e", dur: 0.7, retraso: desde / velocidad });

  return {
    tipo,
    tallos,
    hojas,
    ancho: Math.ceil(brote + largoBrote + M + 30),
    alto: Math.ceil(R + bajada + M + 30),
  };
}

type Variables = CSSProperties & Record<`--${string}`, string>;

export default function EnredaderaTarjeta({ id }: { id: string }) {
  const { tipo, tallos, hojas, ancho, alto } = useMemo(() => crearEnredadera(id), [id]);
  return (
    <svg
      aria-hidden="true"
      className="enredadera pointer-events-none absolute z-[1] overflow-visible"
      style={{ left: -M, top: -M }}
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
    >
      {tallos.map((tallo, i) => (
        <path
          key={i}
          className="enr-tallo"
          d={tallo.d}
          pathLength={1}
          fill="none"
          stroke={tallo.color}
          strokeWidth={tallo.ancho}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ "--dur": `${tallo.dur.toFixed(2)}s`, "--retraso": `${tallo.retraso.toFixed(2)}s` } as Variables}
        />
      ))}
      {hojas.map((hoja, i) => (
        <g key={i} style={{ "--retraso": `${hoja.retraso.toFixed(2)}s` } as Variables}>
          <path className="enr-tallo" d={hoja.peciolo} pathLength={1} fill="none" stroke="#6c7a3c" strokeWidth={0.8} strokeLinecap="round" />
          <g transform={`translate(${hoja.x} ${hoja.y}) rotate(${hoja.giro}) scale(${hoja.tam})`}>
            <use className="enr-hoja" href={`#enr-${tipo}`} fill={`url(#enr-${tipo}-${hoja.color})`} />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Formas y colores de las hojas, una sola vez en la página (las usan todas las enredaderas). */
export function DefinicionesEnredaderas() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {TIPOS.map((tipo) => (
          <g key={tipo} id={`enr-${tipo}`}>
            <path d={FORMAS[tipo].hoja} />
            <path d={FORMAS[tipo].nervios} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth={0.04} strokeLinecap="round" />
          </g>
        ))}
        {TIPOS.flatMap((tipo) =>
          COLORES[tipo].map(([base, punta], i) => (
            <linearGradient key={`${tipo}-${i}`} id={`enr-${tipo}-${i}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={base} />
              <stop offset="1" stopColor={punta} />
            </linearGradient>
          ))
        )}
      </defs>
    </svg>
  );
}
