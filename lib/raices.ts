/**
 * Piezas de dibujo para las raíces y el micelio que crecen en un canvas (las del
 * panel del Ecosistema y las que unen a los integrantes de la Comunidad), y las
 * hojas del bosque de la Comunidad.
 * Solo para el navegador: crearHalo usa document.
 */

export type Punto = [number, number];

/** Un trazo ya armado: sus puntos y el largo recorrido hasta cada uno. */
export type Trazo = { puntos: Punto[]; largos: number[] };

export const azar = (min: number, max: number) => min + Math.random() * (max - min);

export function largosDe(puntos: Punto[]): number[] {
  const largos = [0];
  for (let i = 1; i < puntos.length; i++) {
    largos.push(largos[i - 1] + Math.hypot(puntos[i][0] - puntos[i - 1][0], puntos[i][1] - puntos[i - 1][1]));
  }
  return largos;
}

/** Camino orgánico de a hacia b: una curva suave con ondulaciones que no tocan las puntas. */
export function curva(a: Punto, b: Punto, desvio: Punto, amplitud: number): Punto[] {
  const c1: Punto = [a[0] + (b[0] - a[0]) / 3 + desvio[0], a[1] + (b[1] - a[1]) / 3 + desvio[1]];
  const c2: Punto = [a[0] + (2 * (b[0] - a[0])) / 3 + desvio[0], a[1] + (2 * (b[1] - a[1])) / 3 + desvio[1]];
  return bezier(a, c1, c2, b, amplitud);
}

/** Como curva, pero con los dos puntos de control elegidos (para dar la forma: un arco, una S). */
export function bezier(a: Punto, c1: Punto, c2: Punto, b: Punto, amplitud: number): Punto[] {
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
export function pelo(desde: Punto, angulo: number, largo: number): Punto[] {
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

/** Punto del trazo a cierta distancia del nacimiento. */
export function puntoEn(trazo: Trazo, distancia: number): Punto {
  const { puntos, largos } = trazo;
  let i = 1;
  while (i < largos.length - 1 && largos[i] < distancia) i++;
  const tramo = largos[i] - largos[i - 1] || 1;
  const t = Math.max(0, Math.min(1, (distancia - largos[i - 1]) / tramo));
  return [
    puntos[i - 1][0] + (puntos[i][0] - puntos[i - 1][0]) * t,
    puntos[i - 1][1] + (puntos[i][1] - puntos[i - 1][1]) * t,
  ];
}

/** Halo de luz redondo (centro casi blanco), dibujado una sola vez y reusado. */
export function crearHalo(color = "232,189,95", centro = "255,244,214"): HTMLCanvasElement {
  const halo = document.createElement("canvas");
  halo.width = halo.height = 48;
  const ctx = halo.getContext("2d")!;
  const degradado = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
  degradado.addColorStop(0, `rgba(${centro},1)`);
  degradado.addColorStop(0.3, `rgba(${color},0.55)`);
  degradado.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, 48, 48);
  return halo;
}

/** Contorno de una hoja con la punta hacia arriba, centrada en el origen (para rellenar). */
export function trazarHoja(ctx: CanvasRenderingContext2D, largo: number, ancho: number) {
  ctx.beginPath();
  ctx.moveTo(0, -largo / 2);
  ctx.bezierCurveTo(ancho, -largo / 4, ancho * 0.8, largo / 3, 0, largo / 2);
  ctx.bezierCurveTo(-ancho * 0.8, largo / 3, -ancho, -largo / 4, 0, -largo / 2);
}
