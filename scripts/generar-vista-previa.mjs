/**
 * Genera el ícono de la pestaña y las imágenes que se ven al compartir el sitio
 * (WhatsApp, LinkedIn, Facebook…), a partir del logo y las fotos de public/images.
 *
 * Uso:   node scripts/generar-vista-previa.mjs
 *
 * Hay que volver a correrlo si cambian el logo, la foto de portada, la de Belén o
 * la del bosque. El ícono va a app/ (Next.js lo toma por su nombre) y las
 * imágenes para compartir a public/compartir/ (cada página dice cuál usa en
 * lib/metadatos.ts).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const raiz = process.cwd();
const imagen = (nombre) => path.join(raiz, "public", "images", nombre);
const destino = (...partes) => path.join(raiz, "app", ...partes);
const compartir = (nombre) => path.join(raiz, "public", "compartir", nombre);

const ANCHO = 1200;
const ALTO = 630;
const CREMA = "#f6f3eb";

/** Línea verde de la marca, la misma que separa el encabezado del contenido. */
const lineaVerde = (ancho, alto) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#27a47e"/><stop offset="0.5" stop-color="#92c149"/><stop offset="1" stop-color="#27a47e"/>
    </linearGradient></defs>
    <rect width="${ancho}" height="${alto}" fill="url(#g)"/>
  </svg>`);

const rectangulo = (ancho, alto, radio, relleno, borde = "none") =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">
    <rect x="0.5" y="0.5" width="${ancho - 1}" height="${alto - 1}" rx="${radio}" fill="${relleno}" stroke="${borde}"/>
  </svg>`);

/** Las redes sociales piden JPG livianos: WhatsApp no muestra imágenes muy pesadas. */
const guardarJpg = async (canvas, archivo) => {
  const info = await canvas.jpeg({ quality: 82, mozjpeg: true }).toFile(archivo);
  console.log(`${path.relative(raiz, archivo)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
};

/* --- Ícono: solo la hoja del logo, que se reconoce aunque sea chiquita --- */

async function hojaDelLogo() {
  // Medido sobre logo-buen-vivir.png (480 × 331): la hoja ocupa las filas 0 a 98
  // entre x = 160 y x = 470; en la fila 108 empieza el trazo de la "b" y en la
  // 120 el texto. Si cambia el logo, hay que volver a medir.
  const recorte = await sharp(imagen("logo-buen-vivir.png"))
    .extract({ left: 160, top: 0, width: 310, height: 104 })
    .toBuffer();
  // En dos pasos: sharp aplica trim() antes que extract() si van juntos.
  return sharp(recorte).trim().toBuffer();
}

async function iconos() {
  const hoja = await hojaDelLogo();
  const cuadrado = async (lado, margen, fondo) => {
    const interior = Math.round(lado * (1 - margen * 2));
    const dibujo = await sharp(hoja)
      .resize(interior, interior, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    return sharp({ create: { width: lado, height: lado, channels: 4, background: fondo } })
      .composite([{ input: dibujo, gravity: "center" }])
      .png();
  };

  await (await cuadrado(512, 0.04, { r: 0, g: 0, b: 0, alpha: 0 })).toFile(destino("icon.png"));
  console.log("app/icon.png  512×512");

  // En iPhone el ícono no puede ser transparente: va sobre blanco y con aire.
  await (await cuadrado(180, 0.14, { r: 255, g: 255, b: 255, alpha: 1 })).toFile(destino("apple-icon.png"));
  console.log("app/apple-icon.png  180×180");
}

/* --- Imágenes para compartir (1200 × 630) --- */

/** Portada: la foto de la portada a la izquierda y el logo sobre crema a la derecha. */
async function compartirInicio() {
  const anchoFoto = 660;
  const foto = await sharp(imagen("hero-cielo.jpg"))
    .resize(anchoFoto, ALTO, { fit: "cover" })
    .toBuffer();
  const logo = await sharp(imagen("logo-buen-vivir.png")).resize({ width: 400 }).toBuffer();
  const { height: altoLogo } = await sharp(logo).metadata();

  await guardarJpg(
    sharp({ create: { width: ANCHO, height: ALTO, channels: 3, background: CREMA } }).composite([
      { input: foto, left: 0, top: 0 },
      { input: lineaVerde(6, ALTO), left: anchoFoto, top: 0 },
      { input: logo, left: anchoFoto + Math.round((ANCHO - anchoFoto - 400) / 2), top: Math.round((ALTO - altoLogo) / 2) },
    ]),
    compartir("inicio.jpg")
  );
}

/** Sobre Belén: su presentación entera (es vertical) y el logo al lado. */
async function compartirBelen() {
  const altoFlyer = 560;
  const flyer = await sharp(imagen("belen.jpg")).resize({ height: altoFlyer }).toBuffer();
  const { width: anchoFlyer } = await sharp(flyer).metadata();
  const redondeado = await sharp(flyer)
    .composite([{ input: rectangulo(anchoFlyer, altoFlyer, 28, "#fff"), blend: "dest-in" }])
    .png()
    .toBuffer();

  const anchoLogo = 420;
  const logo = await sharp(imagen("logo-buen-vivir.png")).resize({ width: anchoLogo }).toBuffer();
  const { height: altoLogo } = await sharp(logo).metadata();
  const izquierda = 80;
  const libre = ANCHO - (izquierda + anchoFlyer);

  await guardarJpg(
    sharp({ create: { width: ANCHO, height: ALTO, channels: 3, background: CREMA } }).composite([
      { input: redondeado, left: izquierda, top: Math.round((ALTO - 6 - altoFlyer) / 2) },
      { input: logo, left: izquierda + anchoFlyer + Math.round((libre - anchoLogo) / 2), top: Math.round((ALTO - altoLogo) / 2) },
      { input: lineaVerde(ANCHO, 6), left: 0, top: ALTO - 6 },
    ]),
    compartir("belen.jpg")
  );
}

/** Espacios del Ecosistema: el bosque con la placa del logo, como en la Home. */
async function compartirEcosistema() {
  const bosque = await sharp(imagen("ecosistema-bosque.jpg")).resize(ANCHO, ALTO, { fit: "cover" }).toBuffer();
  const anchoLogo = 640;
  const logo = await sharp(imagen("logo-ecosistema.png")).resize({ width: anchoLogo }).toBuffer();
  const { height: altoLogo } = await sharp(logo).metadata();
  const placa = { ancho: 760, alto: altoLogo + 60 };

  await guardarJpg(
    sharp(bosque).composite([
      { input: rectangulo(ANCHO, ALTO, 0, "rgba(18,23,15,0.35)"), left: 0, top: 0 },
      {
        input: rectangulo(placa.ancho, placa.alto, 24, "rgba(18,23,15,0.45)", "rgba(255,255,255,0.18)"),
        left: Math.round((ANCHO - placa.ancho) / 2),
        top: Math.round((ALTO - placa.alto) / 2),
      },
      { input: logo, left: Math.round((ANCHO - anchoLogo) / 2), top: Math.round((ALTO - altoLogo) / 2) },
    ]),
    compartir("ecosistema.jpg")
  );
}

await mkdir(path.join(raiz, "public", "compartir"), { recursive: true });
await iconos();
await compartirInicio();
await compartirBelen();
await compartirEcosistema();
