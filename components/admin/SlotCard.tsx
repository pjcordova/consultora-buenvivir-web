"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Slot } from "@/lib/admin/slots";

type SlotCardProps = {
  slot: Slot;
  /** Marca de tiempo del archivo, para que el navegador no muestre la versión vieja. */
  version: number | null;
};

export default function SlotCard({ slot, version }: SlotCardProps) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<"listo" | "subiendo" | "error">("listo");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [v, setV] = useState(version);

  const url = v ? `${slot.ruta}?v=${v}` : null;
  const acepta = slot.tipo === "video" ? "video/mp4" : "image/jpeg,image/png,image/webp";

  async function subir(archivo: File) {
    setEstado("subiendo");
    setMensaje(null);

    const cuerpo = new FormData();
    cuerpo.append("slot", slot.id);
    cuerpo.append("archivo", archivo);

    let respuesta: Response;
    try {
      respuesta = await fetch("/api/admin/upload", { method: "POST", body: cuerpo });
    } catch {
      setEstado("error");
      setMensaje("No hay conexión con el servidor. Fijate que esté corriendo y probá de nuevo.");
      return;
    }
    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      setEstado("error");
      setMensaje(datos.error ?? "No se pudo subir.");
      return;
    }

    setV(datos.actualizado);
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
      setV(null);
      setMensaje("Quitada");
      router.refresh();
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
          {estado === "subiendo" ? "Subiendo…" : url ? "Reemplazar" : "Subir"}
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
