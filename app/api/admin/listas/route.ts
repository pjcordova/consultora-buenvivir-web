import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { sesionActiva } from "@/lib/admin/auth";
import { MENSAJE_SOLO_LECTURA, soloLectura } from "@/lib/admin/entorno";
import { obtenerLista, type CampoDeLista, type ElementoGuardado } from "@/lib/admin/listas";
import { publicarCambios } from "@/lib/admin/publicar";
import { rutaDelCertificado } from "@/lib/admin/slots";
import { leerMedios, quitarMedio, usaBlob } from "@/lib/almacen";
import { guardarLista, leerLista } from "@/lib/contenido";

const LARGO_MAXIMO = 2000;

const error = (mensaje: string, status = 400) => NextResponse.json({ error: mensaje }, { status });

const FORMATOS: Partial<Record<CampoDeLista["tipo"], { patron: RegExp; ejemplo: string }>> = {
  fecha: { patron: /^\d{4}-\d{2}-\d{2}$/, ejemplo: "una fecha válida" },
  hora: { patron: /^([01]\d|2[0-3]):[0-5]\d$/, ejemplo: "una hora como 18:30" },
  enlace: { patron: /^(https?:\/\/\S+|\/\S*)$/, ejemplo: "una dirección que empiece con https:// o /" },
};

/** Un texto limpio, o null si es demasiado largo. */
function limpiar(valor: unknown): string | null {
  const texto = typeof valor === "string" ? valor.trim() : "";
  return texto.length > LARGO_MAXIMO ? null : texto;
}

/**
 * Borra la imagen del certificado de las formaciones que se quitaron de la
 * lista, si tenían. De a una: cada borrado reescribe el mapa de imágenes.
 */
async function quitarCertificados(ids: string[]): Promise<boolean> {
  let quito = false;
  const medios = usaBlob ? await leerMedios() : {};
  for (const id of ids) {
    const ruta = rutaDelCertificado(id);
    if (usaBlob) {
      if (!medios[ruta]?.url) continue;
      await quitarMedio(ruta);
    } else {
      await fs.rm(path.join(process.cwd(), "public", ruta), { force: true });
    }
    quito = true;
  }
  return quito;
}

/**
 * Guarda una lista entera (testimonios, talleres, preguntas o formación). Solo se aceptan los campos
 * declarados en lib/admin/listas.ts, con el formato esperado.
 */
export async function POST(request: Request) {
  if (soloLectura) return error(MENSAJE_SOLO_LECTURA, 503);
  if (!sesionActiva()) return error("Sesión vencida. Volvé a entrar.", 401);

  const { lista: id, items } = (await request.json()) as { lista?: string; items?: unknown };
  const lista = obtenerLista(String(id ?? ""));
  if (!lista) return error("Esa lista no existe.");
  if (!Array.isArray(items)) return error("Faltan los elementos.");
  if (items.length > lista.maximo) return error(`Se pueden cargar hasta ${lista.maximo}.`);

  const limpios: ElementoGuardado[] = [];

  for (const [posicion, crudo] of items.entries()) {
    const item = (crudo ?? {}) as Record<string, unknown>;
    const cual = `el ${lista.elemento} ${posicion + 1}`;
    const elemento: ElementoGuardado = {
      id: typeof item.id === "string" && /^[\w-]{1,64}$/.test(item.id) ? item.id : randomUUID(),
    };

    for (const campo of lista.campos) {
      const valor = item[campo.id];

      if (campo.tipo === "si-no") {
        elemento[campo.id] = valor !== false;
        continue;
      }
      // La imagen no viaja con la lista: se sube aparte, con el id del elemento
      if (campo.tipo === "imagen") continue;

      if (campo.porIdioma) {
        const { es, en } = (valor ?? {}) as { es?: unknown; en?: unknown };
        const textoEs = limpiar(es);
        const textoEn = limpiar(en);
        if (textoEs === null || textoEn === null) return error(`"${campo.etiqueta}" es demasiado largo en ${cual}.`);
        if (campo.obligatorio && !textoEs) return error(`Falta "${campo.etiqueta}" (en español) en ${cual}.`);
        elemento[campo.id] = { es: textoEs, en: textoEn };
        continue;
      }

      const texto = limpiar(valor);
      if (texto === null) return error(`"${campo.etiqueta}" es demasiado largo en ${cual}.`);
      if (campo.obligatorio && !texto) return error(`Falta "${campo.etiqueta}" en ${cual}.`);
      const formato = FORMATOS[campo.tipo];
      if (texto && formato && !formato.patron.test(texto)) {
        return error(`"${campo.etiqueta}" en ${cual} tiene que ser ${formato.ejemplo}.`);
      }
      elemento[campo.id] = texto;
    }

    limpios.push(elemento);
  }

  const conImagen = lista.campos.some((campo) => campo.tipo === "imagen");
  const anteriores = conImagen ? await leerLista(lista.id) : [];

  try {
    await guardarLista(lista.id, limpios);
  } catch {
    return error("No se pudo guardar en el depósito. Probá de nuevo en un rato.", 502);
  }

  publicarCambios("contenido");

  // Las formaciones que se quitaron se llevan su certificado. Si falla, la lista
  // ya quedó guardada: la imagen sobra, pero no se ve en ningún lado.
  if (conImagen) {
    const quedan = new Set(limpios.map((elemento) => elemento.id));
    const quitados = anteriores.map((elemento) => elemento.id).filter((id) => !quedan.has(id));
    try {
      if (await quitarCertificados(quitados)) publicarCambios("medios");
    } catch {
      /* sin consecuencias en la web */
    }
  }
  return NextResponse.json({ ok: true, items: limpios });
}
