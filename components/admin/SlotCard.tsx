"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CARPETA_ENTRADA, revisarArchivo } from "@/lib/admin/archivos";
import type { Slot } from "@/lib/admin/slots";

type SlotCardProps = {
  slot: Slot;
  /** Dirección actual de la imagen (del depósito o del código), o null si falta. */
  url: string | null;
  /** Con el depósito conectado, el archivo va directo del navegador al depósito. */
  directo: boolean;
};

export default function SlotCard({ slot, url: urlInicial, directo }: SlotCardProps) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<"listo" | "subiendo" | "error">("listo");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [url, setUrl] = useState(urlInicial);
  const [etapa, setEtapa] = useState("Subiendo…");

  const acepta = slot.tipo === "video" ? "video/mp4" : "image/jpeg,image/png,image/webp";

  /**
   * Vercel no deja pasar por el servidor archivos de más de 4,5 MB. Con el
   * depósito conectado, el navegador deja el archivo ahí y al servidor le manda
   * solo la dirección; él lo optimiza y lo pone en su lugar.
   */
  async function enviar(archivo: File): Promise<Response> {
    if (!directo) {
      const cuerpo = new FormData();
      cuerpo.append("slot", slot.id);
      cuerpo.append("archivo", archivo);
      return fetch("/api/admin/upload", { method: "POST", body: cuerpo });
    }

    const extension = archivo.name.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase() ?? "";
    const entrada = await upload(`${CARPETA_ENTRADA}${slot.id}${extension}`, archivo, {
      access: "public",
      handleUploadUrl: "/api/admin/upload/permiso",
      clientPayload: slot.id,
      onUploadProgress: ({ percentage }) => setEtapa(`Subiendo… ${Math.round(percentage)}%`),
    });

    setEtapa(slot.tipo === "imagen" ? "Optimizando…" : "Guardando…");
    return fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot: slot.id, entrada: entrada.url }),
    });
  }

  async function subir(archivo: File) {
    // Se avisa antes de subir, así no hay que esperar para enterarse.
    const problema = revisarArchivo(archivo, slot.tipo);
    if (problema) {
      setEstado("error");
      setMensaje(problema);
      return;
    }

    setEstado("subiendo");
    setEtapa("Subiendo…");
    setMensaje(null);

    let respuesta: Response;
    try {
      respuesta = await enviar(archivo);
    } catch {
      setEstado("error");
      setMensaje(
        directo
          ? "No se pudo subir. Revisá la conexión y probá de nuevo; si hace rato que entraste, volvé a iniciar sesión."
          : "No hay conexión con el servidor. Fijate que esté corriendo y probá de nuevo."
      );
      return;
    }
    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      setEstado("error");
      setMensaje(
        datos.error ??
          (respuesta.status === 413 ? "El archivo es demasiado pesado para subirlo." : "No se pudo subir.")
      );
      return;
    }

    setUrl(datos.url);
    setEstado("listo");
    const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    setMensaje(
      datos.pesoFinal && datos.pesoOriginal > datos.pesoFinal * 1.1
        ? `Actualizada y optimizada: ${mb(datos.pesoOriginal)} → ${mb(datos.pesoFinal)}`
        : "Actualizada"
    );
    router.refresh();
  }

  async function quitar() {
    // eslint-disable-next-line no-alert
    if (!confirm(`¿Quitar la imagen de "${slot.titulo}"? La página vuelve a mostrar el espacio vacío.`)) return;

    const respuesta = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot: slot.id }),
    });

    if (respuesta.ok) {
      setUrl(null);
      setEstado("listo");
      setMensaje("Quitada");
      router.refresh();
    } else {
      const datos = await respuesta.json().catch(() => ({}));
      setEstado("error");
      setMensaje(datos.error ?? "No se pudo quitar.");
    }
  }

  return (
    <article className="flex flex-col rounded-2xl border border-forest-800/10 bg-white p-4">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-cream">
        {url ? (
          slot.tipo === "video" ? (
            <video src={url} muted loop playsInline autoPlay className="h-full w-full object-cover" />
          ) : (
            // Imagen sin optimizar: el panel muestra el archivo tal cual quedó subido
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={slot.titulo} className="h-full w-full object-contain" />
          )
        ) : (
          <p className="px-4 text-center text-xs uppercase tracking-[0.14em] text-forest-800/40">
            Sin {slot.tipo === "video" ? "video" : "imagen"}
          </p>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg leading-tight text-forest-950">{slot.titulo}</h3>
      <p className="mt-1 text-xs leading-relaxed text-forest-800/60">{slot.ayuda}</p>
      <p className="mt-2 font-mono text-[11px] text-forest-800/40">{slot.ruta}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={estado === "subiendo"}
          className="rounded-full bg-leaf px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-leaf-dark disabled:opacity-60"
        >
          {estado === "subiendo" ? etapa : url ? "Reemplazar" : "Subir"}
        </button>

        {url && (
          <button
            type="button"
            onClick={quitar}
            className="rounded-full border border-forest-800/20 px-4 py-2 text-xs text-forest-800 transition-colors hover:bg-cream"
          >
            Quitar
          </button>
        )}

        {mensaje && (
          <span
            role="status"
            className={`text-xs ${estado === "error" ? "text-[#8d3a32]" : "text-leaf"}`}
          >
            {mensaje}
          </span>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept={acepta}
        className="hidden"
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) subir(archivo);
          e.target.value = "";
        }}
      />
    </article>
  );
}
