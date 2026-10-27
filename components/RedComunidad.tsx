"use client";

import { useEffect, useRef } from "react";
import { azar, bezier, crearHalo, curva, largosDe, pelo, puntoEn, trazarHoja, type Punto } from "@/lib/raices";

/**
 * La red de raíces de la comunidad, detrás de las tarjetas de los integrantes:
 * como la red subterránea de un bosque, donde cada árbol está unido a los de
 * al lado y se pasan ayuda. Cada tarjeta tiene un nudo de luz arriba y otro
 * abajo. Las raíces bajan hasta la primera fila, atraviesan cada tarjeta y de
 * ahí la unen con sus vecinas: con las de al lado, por un arco que cuelga por
 * debajo, y con las de la fila siguiente, trenzadas o en S. En los bordes se
 * pierden por el margen, y aquí y allá les brota una hojita.
 *
 * Crece a medida que se baja por la página (no se adelanta a las tarjetas que
 * todavía no se ven) y cada nudo se enciende cuando la raíz llega. El de arriba
 * está donde nace la enredadera de la tarjeta (data-brote): al llegar la raíz,
 * le pone data-brotada y la enredadera crece (EnredaderaTarjeta). Por las
 * raíces ya crecidas viaja luz de una persona a otra (y a veces sigue de largo
 * hacia otra más), y al pasar el mouse por una tarjeta, esa persona manda luz a
 * todas sus vecinas.
 *
 * Toma la posición de los elementos con data-nodo de su contenedor y vuelve a
 * crecer si cambian los filtros o el tamaño. Dibujo propio en dos canvas: las
 * raíces, que se dibujan mientras crecen y después quedan quietas, y las luces
 * encima, donde cada cuadro solo se borra lo que cambió. Con "reducir
 * movimiento" aparece crecida y sin luces que viajan.
 */

type Rama = {
  puntos: Punto[];
  largos: number[];
  /** Cuándo empieza a crecer, en píxeles de recorrido desde el arranque. */
  inicio: number;
  /** Grosor al nacer y en la punta. */
  grosor: [number, number];
  /** Las principales son raíces; las otras, pelitos. */
  principal: boolean;
  /** Los nudos que une (las que van de una tarjeta a otra): por ellas viaja la luz. */
  desde?: number;
  hasta?: number;
  /** Aparece de a poco al nacer, o se va perdiendo hacia la punta (en el margen). */
  desvanece?: "inicio" | "fin";
};

type Nudo = {
  x: number;
  y: number;
  tarjeta: number;
  /** En qué punto del crecimiento le llega la raíz. */
  llegada: number;
  /** El de arriba de la tarjeta, donde nace su enredadera. */
  brota: boolean;
  encendido: boolean;
  /** Destello al recibir luz: 1 recién encendido, y se va apagando solo. */
  brillo: number;
  fase: number;
};

type Hojita = { x: number; y: number; angulo: number; largo: number; color: string; aparece: number };

/** Luz que viaja por una raíz; con recorrido negativo, todavía está cruzando la tarjeta. */
type Pulso = { rama: Rama; recorrido: number; sentido: 1 | -1 };

/** Una tarjeta: su lugar y, si tiene enredadera, dónde nace (px desde su borde izquierdo). */
type Caja = { left: number; top: number; right: number; bottom: number; brote?: number };

const VELOCIDAD = 240; // px/s del frente de crecimiento
const VELOCIDAD_LUZ = 95;
// Sobre el fondo oscuro del bosque: raíces doradas que brillan un poco
const PASADAS_RAIZ: [number, string][] = [
  [5, "rgba(232,189,95,0.05)"],
  [2.2, "rgba(232,189,95,0.11)"],
  [1, "rgba(218,180,96,0.72)"],
];
const PASADAS_PELO: [number, string][] = [[1, "rgba(201,162,74,0.3)"]];
const VERDES = ["#4c8f3a", "#6dbb5a", "#2f9a74", "#82ad45", "#a8c66c"];

const largoDe = (rama: Rama) => rama.largos[rama.largos.length - 1];

function crearRed(cajas: Caja[], alto: number) {
  const ramas: Rama[] = [];
  const nudos: Nudo[] = [];
  const hojitas: Hojita[] = [];
  if (!cajas.length) return { ramas, nudos, hojitas };

  // Filas (por la altura de cada tarjeta), cada una de izquierda a derecha
  const filas: number[][] = [];
  const orden = cajas.map((_, i) => i).sort((a, b) => cajas[a].top - cajas[b].top || cajas[a].left - cajas[b].left);
  for (const i of orden) {
    const fila = filas.find((f) => Math.abs(cajas[f[0]].top - cajas[i].top) < 12);
    if (fila) fila.push(i);
    else filas.push([i]);
  }
  const centroX = (i: number) => (cajas[i].left + cajas[i].right) / 2;
  const anchoDe = (i: number) => cajas[i].right - cajas[i].left;

  // Dos nudos por tarjeta, por donde entra y sale la raíz: el de arriba, donde nace
  // su enredadera; el de abajo, un poco corrido del centro
  const nudo = (i: number, x: number, y: number, brota: boolean) =>
    nudos.push({ x, y, tarjeta: i, llegada: Infinity, brota, encendido: false, brillo: 0, fase: azar(0, 6.3) }) - 1;
  const corrido = (i: number) => centroX(i) + azar(-0.2, 0.2) * anchoDe(i);
  const arriba = cajas.map((caja, i) => nudo(i, caja.brote ? caja.left + caja.brote : corrido(i), caja.top - 4, true));
  const abajo = cajas.map((caja, i) => nudo(i, corrido(i), caja.bottom + 5, false));
  const punto = (n: number): Punto => [nudos[n].x, nudos[n].y];

  const agregar = (puntos: Punto[], inicio: number, grosor: [number, number], extra: Partial<Rama> = {}, conPelitos = true) => {
    const rama: Rama = { puntos, largos: largosDe(puntos), inicio, grosor, principal: true, ...extra };
    ramas.push(rama);
    // Pelitos a los dos lados y, de vez en cuando, una hojita
    const total = conPelitos ? largoDe(rama) : 0;
    for (let d = azar(10, 30); d < total - 8; d += azar(22, 50)) {
      const [x0, y0] = puntoEn(rama, d);
      const [x1, y1] = puntoEn(rama, d + 2);
      const angulo = Math.atan2(y1 - y0, x1 - x0) + (Math.random() < 0.5 ? -1 : 1) * azar(0.6, 1.4);
      if (Math.random() < 0.2) {
        const color = Math.random() < 0.12 ? "#d0a54b" : VERDES[Math.floor(Math.random() * VERDES.length)];
        hojitas.push({ x: x0, y: y0, angulo, largo: azar(7, 12), color, aparece: inicio + d });
      } else {
        const puntosPelo = pelo([x0, y0], angulo, azar(8, 24));
        ramas.push({ puntos: puntosPelo, largos: largosDe(puntosPelo), inicio: inicio + d, grosor: [0.9, 0.5], principal: false });
      }
    }
    return rama;
  };
  /** Une dos nudos y le avisa al de llegada cuándo lo alcanza la raíz. */
  const unir = (a: number, b: number, puntos: Punto[], grosor: [number, number]) => {
    const rama = agregar(puntos, nudos[a].llegada, grosor, { desde: a, hasta: b });
    nudos[b].llegada = Math.min(nudos[b].llegada, rama.inicio + largoDe(rama));
  };
  /** Raíz suelta que sale de un nudo y se pierde. */
  const cola = (n: number, hasta: Punto) =>
    agregar(curva(punto(n), hasta, [azar(-8, 8), azar(-8, 8)], 4), nudos[n].llegada, [1.3, 0.4], { desvanece: "fin" });

  filas.forEach((fila, r) => {
    // A la primera fila le llegan raíces desde arriba (lisas: con pelitos parecen rayos)
    if (r === 0) {
      for (const i of fila) {
        const destino = punto(arriba[i]);
        const desde: Punto = [destino[0] + azar(-24, 24), destino[1] - 40];
        const rama = agregar(curva(desde, destino, [azar(-8, 8), 0], 1.5), azar(0, 60), [1.2, 1.5], { hasta: arriba[i], desvanece: "inicio" }, false);
        nudos[arriba[i]].llegada = rama.inicio + largoDe(rama);
      }
    }
    // La savia atraviesa la tarjeta: llega abajo un poco después
    for (const i of fila) {
      if (nudos[arriba[i]].llegada === Infinity) nudos[arriba[i]].llegada = 0;
      nudos[abajo[i]].llegada = nudos[arriba[i]].llegada + (cajas[i].bottom - cajas[i].top) * 0.35;
    }

    const fondo = Math.max(...fila.map((i) => cajas[i].bottom));
    const piso = r < filas.length - 1 ? Math.min(...filas[r + 1].map((i) => cajas[i].top)) : alto;
    const pasillo = piso - fondo;

    // Con la de al lado: un arco que cuelga por el pasillo de abajo
    for (let k = 0; k < fila.length - 1; k++) {
      let [a, b] = [abajo[fila[k]], abajo[fila[k + 1]]];
      if (nudos[b].llegada < nudos[a].llegada) [a, b] = [b, a];
      const [pa, pb] = [punto(a), punto(b)];
      const caida = Math.min(pasillo * 0.45, 28) * 1.33;
      const c1: Punto = [pa[0] + (pb[0] - pa[0]) * 0.3, pa[1] + caida];
      const c2: Punto = [pa[0] + (pb[0] - pa[0]) * 0.7, pb[1] + caida];
      unir(a, b, bezier(pa, c1, c2, pb, 4), [1.6, 1.2]);
    }

    // Por los costados, raíces que se pierden en el margen
    const [primera, ultima] = [fila[0], fila[fila.length - 1]];
    cola(abajo[primera], [cajas[primera].left - azar(30, 44), punto(abajo[primera])[1] + azar(6, pasillo * 0.6)]);
    cola(abajo[ultima], [cajas[ultima].right + azar(30, 44), punto(abajo[ultima])[1] + azar(6, pasillo * 0.6)]);

    if (r < filas.length - 1) {
      // Con la fila de abajo: cada tarjeta con la más cercana, y algunas en diagonal
      const siguiente = filas[r + 1];
      const cercana = (i: number, opciones: number[]) =>
        opciones.reduce((mejor, j) => (Math.abs(centroX(j) - centroX(i)) < Math.abs(centroX(mejor) - centroX(i)) ? j : mejor));
      const pares = new Set<string>();
      for (const i of fila) pares.add(`${i}-${cercana(i, siguiente)}`);
      for (const j of siguiente) pares.add(`${cercana(j, fila)}-${j}`);
      for (const i of fila) {
        for (const j of siguiente) {
          const vecinas = Math.abs(centroX(i) - centroX(j)) < anchoDe(i) * 1.5;
          if (vecinas && Math.random() < 0.35) pares.add(`${i}-${j}`);
        }
      }
      for (const par of pares) {
        const [i, j] = par.split("-").map(Number);
        const [pa, pb] = [punto(abajo[i]), punto(arriba[j])];
        const salto = pb[1] - pa[1];
        if (Math.abs(centroX(i) - centroX(j)) < 20) {
          // Misma columna: dos raíces trenzadas
          for (const lado of [1, -1]) {
            const abre = lado * azar(10, 18);
            const c1: Punto = [pa[0] + abre, pa[1] + salto * 0.75];
            const c2: Punto = [pb[0] - abre, pb[1] - salto * 0.75];
            unir(abajo[i], arriba[j], bezier(pa, c1, c2, pb, 2), [1.3, 1.1]);
          }
        } else {
          // En diagonal: una S que cruza por el pasillo
          const c1: Punto = [pa[0], pa[1] + salto * 0.8];
          const c2: Punto = [pb[0], pb[1] - salto * 0.8];
          unir(abajo[i], arriba[j], bezier(pa, c1, c2, pb, 3), [1.5, 1.2]);
        }
      }
    } else {
      // La última fila: raíces que siguen bajando
      for (const i of fila) {
        const [x, y] = punto(abajo[i]);
        for (let k = 0; k < 2; k++) {
          const angulo = Math.PI / 2 + azar(-0.9, 0.9);
          const largo = azar(26, 38);
          cola(abajo[i], [x + Math.cos(angulo) * largo, y + Math.sin(angulo) * largo]);
        }
      }
    }
  });
  return { ramas, nudos, hojitas };
}

export default function RedComunidad() {
  const lienzoRaices = useRef<HTMLCanvasElement>(null);
  const lienzoLuces = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzoRaices.current;
    const canvasLuces = lienzoLuces.current;
    const contenedor = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    const ctxLuces = canvasLuces?.getContext("2d");
    if (!canvas || !canvasLuces || !contenedor || !ctx || !ctxLuces) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    const halo = crearHalo();

    let ancho = 0;
    let alto = 0;
    let firma = "";
    let ramas: Rama[] = [];
    let nudos: Nudo[] = [];
    let hojitas: Hojita[] = [];
    let conexiones: Rama[] = [];
    let total = 0;
    let recorrido = 0;
    let empezo = false;
    let crecida = false;
    let visible = false;
    let cuadro = 0;
    let anterior = 0;
    let pendiente = 0;
    let tiempo = 0;
    let pulsos: Pulso[] = [];
    let proximoPulso = 0.6;
    /** Lo que se dibujó en las luces el cuadro anterior, para borrar solo eso. */
    let sucio: [number, number, number][] = [];
    let tarjetaBajoMouse = -1;
    let elementos: HTMLElement[] = [];

    const tarjetas = () => [...contenedor.querySelectorAll<HTMLElement>("[data-nodo]")];

    function armar() {
      const caja = canvas!.getBoundingClientRect();
      if (!caja.width || !caja.height) return;
      elementos = tarjetas();
      const cajas: Caja[] = elementos.map((elemento) => {
        const r = elemento.getBoundingClientRect();
        const brote = Number(elemento.dataset.brote) || undefined;
        return { left: r.left - caja.left, top: r.top - caja.top, right: r.right - caja.left, bottom: r.bottom - caja.top, brote };
      });
      // Varios avisos sin cambios reales (el primero del ResizeObserver, por ejemplo): queda como está
      const nueva = [caja.width, caja.height, ...cajas.flatMap((c) => [c.left, c.top, c.right, c.bottom])]
        .map(Math.round)
        .join(",");
      if (nueva === firma) return;
      firma = nueva;

      ancho = caja.width;
      alto = caja.height;
      // Hasta el doble de resolución, sin pasarse del tamaño máximo de canvas de los celulares
      const ppp = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(12e6 / (ancho * alto)));
      for (const [lugar, dibujo] of [
        [canvas!, ctx!],
        [canvasLuces!, ctxLuces!],
      ] as const) {
        lugar.width = Math.round(ancho * ppp);
        lugar.height = Math.round(alto * ppp);
        dibujo.setTransform(ppp, 0, 0, ppp, 0, 0);
        dibujo.lineCap = "round";
        dibujo.lineJoin = "round";
      }

      ({ ramas, nudos, hojitas } = crearRed(cajas, alto));
      conexiones = ramas.filter((rama) => rama.hasta !== undefined);
      total = ramas.reduce((maximo, rama) => Math.max(maximo, rama.inicio + largoDe(rama)), 0);
      pulsos = [];
      sucio = [];
      tarjetaBajoMouse = -1;
      // Con la nueva disposición, la red vuelve a crecer
      recorrido = 0;
      crecida = false;
      seguir();
    }

    /** Una rama hasta donde llegó el crecimiento, en tramos que se afinan (y se apagan, si se desvanece). */
    function trazar(rama: Rama, hasta: number, pasadas: [number, string][]) {
      const crecido = hasta - rama.inicio;
      if (crecido <= 0) return;
      const { puntos, largos, grosor } = rama;
      const largo = largos[largos.length - 1];
      const tramos = rama.desvanece ? 6 : rama.principal ? 3 : 1;
      for (const [ensanche, color] of pasadas) {
        ctx!.strokeStyle = color;
        for (let t = 0; t < tramos; t++) {
          const desde = (largo * t) / tramos;
          if (desde >= crecido) break;
          const hastaTramo = Math.min(crecido, (largo * (t + 1)) / tramos);
          const medio = (t + 0.5) / tramos;
          ctx!.lineWidth = (grosor[0] + (grosor[1] - grosor[0]) * medio) * ensanche;
          ctx!.globalAlpha =
            rama.desvanece === "inicio" ? Math.min(1, medio * 1.6) : rama.desvanece === "fin" ? Math.min(1, (1 - medio) * 1.6) : 1;
          ctx!.beginPath();
          ctx!.moveTo(...puntoEn(rama, desde));
          for (let i = 1; i < puntos.length && largos[i] < hastaTramo; i++) {
            if (largos[i] > desde) ctx!.lineTo(puntos[i][0], puntos[i][1]);
          }
          ctx!.lineTo(...puntoEn(rama, hastaTramo));
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;
    }

    function dibujarRaices(hasta: number) {
      ctx!.clearRect(0, 0, ancho, alto);
      for (const rama of ramas) if (!rama.principal) trazar(rama, hasta, PASADAS_PELO);
      for (const rama of ramas) if (rama.principal) trazar(rama, hasta, PASADAS_RAIZ);
      for (const hoja of hojitas) {
        const crece = Math.min(1, (hasta - hoja.aparece) / 25);
        if (crece <= 0) continue;
        const largo = hoja.largo * crece;
        ctx!.save();
        ctx!.translate(hoja.x + (Math.cos(hoja.angulo) * largo) / 2, hoja.y + (Math.sin(hoja.angulo) * largo) / 2);
        ctx!.rotate(hoja.angulo + Math.PI / 2);
        ctx!.globalAlpha = 0.9;
        ctx!.fillStyle = hoja.color;
        trazarHoja(ctx!, largo, largo * 0.42);
        ctx!.fill();
        ctx!.restore();
      }
    }

    function luz(x: number, y: number, tamano: number, alfa: number) {
      if (alfa <= 0.01) return;
      ctxLuces!.globalAlpha = Math.min(1, alfa);
      ctxLuces!.drawImage(halo, x - tamano / 2, y - tamano / 2, tamano, tamano);
      sucio.push([x, y, tamano]);
    }

    function dibujarLuces(dt: number) {
      for (const [x, y, tamano] of sucio) {
        ctxLuces!.clearRect(Math.floor(x - tamano / 2) - 1, Math.floor(y - tamano / 2) - 1, Math.ceil(tamano) + 3, Math.ceil(tamano) + 3);
      }
      sucio = [];

      // Los nudos a los que ya llegó la raíz respiran despacio y destellan al recibir luz
      for (const nudo of nudos) {
        if (nudo.llegada > recorrido) continue;
        if (!nudo.encendido) {
          nudo.encendido = true;
          nudo.brillo = 1;
          if (nudo.brota) elementos[nudo.tarjeta]?.setAttribute("data-brotada", "");
        }
        nudo.brillo *= Math.exp(-dt * 1.8);
        const respira = 0.5 + 0.5 * Math.sin(tiempo * 1.3 + nudo.fase);
        luz(nudo.x, nudo.y, 16 + 6 * respira + 28 * nudo.brillo, 0.45 + 0.15 * respira + 0.4 * nudo.brillo);
        ctxLuces!.globalAlpha = 0.8 + 0.2 * nudo.brillo;
        ctxLuces!.fillStyle = "rgb(255,240,204)";
        ctxLuces!.beginPath();
        ctxLuces!.arc(nudo.x, nudo.y, 2.2 + nudo.brillo, 0, Math.PI * 2);
        ctxLuces!.fill();
      }
      // Mientras crece, las puntas de las raíces van iluminadas
      if (!crecida) {
        for (const rama of ramas) {
          const crecido = recorrido - rama.inicio;
          if (rama.principal && crecido > 0 && crecido < largoDe(rama)) luz(...puntoEn(rama, crecido), 12, 0.75);
        }
      }
      // La luz que viaja, con una estela corta
      for (const pulso of pulsos) {
        const largo = largoDe(pulso.rama);
        for (let k = 0; k < 3; k++) {
          const d = pulso.recorrido - k * 7;
          if (d < 0) break;
          const [x, y] = puntoEn(pulso.rama, pulso.sentido > 0 ? d : largo - d);
          luz(x, y, 20 - k * 5, (1 - k * 0.35) * Math.min(1, (d + 1) / 12));
        }
      }
      ctxLuces!.globalAlpha = 1;
    }

    const crecio = (rama: Rama) => rama.inicio + largoDe(rama) <= recorrido;

    /** Las raíces ya crecidas que salen de una tarjeta hacia otra, en el sentido que se aleja de ella. */
    function salidas(tarjeta: number): Pulso[] {
      const lista: Pulso[] = [];
      for (const rama of conexiones) {
        if (rama.desde === undefined || !crecio(rama)) continue;
        if (nudos[rama.desde].tarjeta === tarjeta) lista.push({ rama, sentido: 1, recorrido: 0 });
        else if (nudos[rama.hasta!].tarjeta === tarjeta) lista.push({ rama, sentido: -1, recorrido: 0 });
      }
      return lista;
    }

    function moverLuz(dt: number) {
      proximoPulso -= dt;
      if (proximoPulso <= 0 && pulsos.length < 5) {
        const crecidas = conexiones.filter(crecio);
        const rama = crecidas[Math.floor(Math.random() * crecidas.length)];
        if (rama) pulsos.push({ rama, sentido: rama.desde === undefined || Math.random() < 0.5 ? 1 : -1, recorrido: 0 });
        proximoPulso = azar(0.5, 1.2);
      }
      const llegaron: Pulso[] = [];
      pulsos = pulsos.filter((pulso) => {
        pulso.recorrido += VELOCIDAD_LUZ * dt;
        if (pulso.recorrido < largoDe(pulso.rama)) return true;
        llegaron.push(pulso);
        return false;
      });
      for (const pulso of llegaron) {
        const destino = pulso.sentido > 0 ? pulso.rama.hasta : pulso.rama.desde;
        if (destino === undefined) continue;
        nudos[destino].brillo = 1;
        // A veces la ayuda sigue de largo: cruza esa tarjeta y sale hacia otra persona
        if (Math.random() < 0.5 && pulsos.length < 7) {
          const otras = salidas(nudos[destino].tarjeta).filter((salida) => salida.rama !== pulso.rama);
          const elegida = otras[Math.floor(Math.random() * otras.length)];
          if (elegida) pulsos.push({ ...elegida, recorrido: -azar(25, 60) });
        }
      }
    }

    /** Hasta dónde puede crecer: sin llegar a las tarjetas que todavía no se ven. */
    function limite() {
      const abajoVisible = window.innerHeight - canvas!.getBoundingClientRect().top;
      let tope = total;
      for (const nudo of nudos) if (nudo.y > abajoVisible - 40) tope = Math.min(tope, nudo.llegada - 1);
      return tope;
    }

    function cuadroSiguiente(ahora: number) {
      const dt = Math.min(0.05, (ahora - (anterior || ahora)) / 1000);
      anterior = ahora;
      tiempo += dt;
      if (!crecida) {
        const nuevo = Math.min(limite(), recorrido + VELOCIDAD * dt);
        if (nuevo > recorrido) {
          recorrido = nuevo;
          dibujarRaices(recorrido);
        }
        crecida = recorrido >= total;
      }
      moverLuz(dt);
      dibujarLuces(dt);
      cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    function seguir() {
      cancelAnimationFrame(cuadro);
      anterior = 0;
      if (!empezo) return;
      if (quieto.matches) {
        // Crecida de una vez, con los nudos quietos
        recorrido = total;
        crecida = true;
        pulsos = [];
        for (const nudo of nudos) nudo.encendido = true;
        for (const elemento of elementos) elemento.setAttribute("data-brotada", "");
        dibujarRaices(Infinity);
        dibujarLuces(0);
        return;
      }
      if (visible) cuadro = requestAnimationFrame(cuadroSiguiente);
    }

    // Rearmar una sola vez por cuadro aunque lleguen varios avisos juntos
    const rearmar = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(armar);
    };

    // Al pasar el mouse por una tarjeta, esa persona manda luz a sus vecinas
    const alPasarMouse = (evento: PointerEvent) => {
      if (evento.pointerType !== "mouse" || quieto.matches) return;
      const tarjeta = (evento.target as Element).closest<HTMLElement>("[data-nodo]");
      const indice = tarjeta ? tarjetas().indexOf(tarjeta) : -1;
      if (indice === tarjetaBajoMouse) return;
      tarjetaBajoMouse = indice;
      if (indice < 0) return;
      for (const nudo of nudos) if (nudo.tarjeta === indice) nudo.brillo = 1;
      pulsos.push(...salidas(indice));
    };

    armar();
    const alVerse = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        // Empieza cuando se ve un buen pedazo (con muchas tarjetas, el 15 % puede no entrar en pantalla)
        if (visible && (entrada.intersectionRatio >= 0.15 || entrada.intersectionRect.height >= 200)) empezo = true;
        seguir();
      },
      { threshold: [0, 0.02, 0.05, 0.1, 0.15] }
    );
    alVerse.observe(contenedor);
    const alCambiarTamano = new ResizeObserver(rearmar);
    alCambiarTamano.observe(contenedor);
    // Los filtros cambian qué tarjetas hay
    const alCambiarTarjetas = new MutationObserver(rearmar);
    alCambiarTarjetas.observe(contenedor, { childList: true, subtree: true });
    contenedor.addEventListener("pointerover", alPasarMouse);
    const alPedirQuietud = () => seguir();
    quieto.addEventListener("change", alPedirQuietud);

    return () => {
      cancelAnimationFrame(cuadro);
      cancelAnimationFrame(pendiente);
      alVerse.disconnect();
      alCambiarTamano.disconnect();
      alCambiarTarjetas.disconnect();
      contenedor.removeEventListener("pointerover", alPasarMouse);
      quieto.removeEventListener("change", alPedirQuietud);
    };
  }, []);

  // Un poco más grandes que la grilla: las raíces de afuera corren por el
  // margen. Un canvas no se estira con inset: lleva su ancho y alto.
  const clase = "pointer-events-none absolute -left-12 -top-12 h-[calc(100%+6rem)] w-[calc(100%+6rem)]";
  return (
    <>
      <canvas ref={lienzoRaices} aria-hidden="true" className={clase} />
      <canvas ref={lienzoLuces} aria-hidden="true" className={clase} />
    </>
  );
}
