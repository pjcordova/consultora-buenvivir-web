"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Campo } from "@/lib/admin/secciones";
import type { Idioma } from "@/lib/idioma";

/** Cómo se nombra cada idioma dentro del panel, que está en español. */
const IDIOMA_EN_EL_PANEL: Record<Idioma, string> = { es: "español", en: "inglés" };

type Valores = Record<string, unknown>;

type FormularioSeccionProps = {
  seccion: string;
  /** Idioma de la pestaña: se guarda por separado del otro. */
  idioma: Idioma;
  campos: Campo[];
  valores: Valores;
  /** true si esta sección ya tiene textos editados guardados. */
  editada: boolean;
};

const claseInput =
  "mt-2 w-full rounded-lg border border-forest-800/20 bg-white px-3 py-2 text-sm text-forest-950 outline-none focus:border-leaf";

export default function FormularioSeccion({
  seccion,
  idioma,
  campos,
  valores,
  editada,
}: FormularioSeccionProps) {
  const router = useRouter();
  const [datos, setDatos] = useState<Valores>(valores);
  const [estado, setEstado] = useState<"listo" | "guardando" | "error">("listo");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cambiar = (id: string, valor: unknown) => setDatos((d) => ({ ...d, [id]: valor }));

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("guardando");
    setMensaje(null);

    const respuesta = await fetch("/api/admin/contenido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seccion, idioma, valores: datos }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => ({}));
      setEstado("error");
      setMensaje(error.error ?? "No se pudo guardar.");
      return;
    }

    setEstado("listo");
    setMensaje("Guardado. Recargá la web para verlo.");
    router.refresh();
  }

  async function restaurar() {
    const enIdioma = IDIOMA_EN_EL_PANEL[idioma];
    if (!confirm(`¿Volver a los textos originales en ${enIdioma}? Se pierde lo editado en esta sección, solo en ese idioma.`)) return;

    await fetch("/api/admin/contenido", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seccion, idioma }),
    });
    router.refresh();
    setMensaje("Se restauraron los textos originales.");
  }

  return (
    <form onSubmit={guardar} className="rounded-2xl border border-forest-800/10 bg-white p-6">
      {campos.map((campo) => {
        const valor = datos[campo.id];

        return (
          <div key={campo.id} className="mt-5 first:mt-0">
            <label className="block text-sm font-medium text-forest-950">
              {campo.etiqueta}

              {(campo.tipo === "parrafo" || campo.tipo === "parrafos" || campo.tipo === "lista") && (
                <textarea
                  rows={campo.tipo === "parrafos" ? 12 : campo.tipo === "lista" ? 6 : 4}
                  value={String(valor ?? "")}
                  onChange={(e) => cambiar(campo.id, e.target.value)}
                  className={claseInput}
                />
              )}

              {campo.tipo === "texto" && (
                <input
                  type="text"
                  value={String(valor ?? "")}
                  onChange={(e) => cambiar(campo.id, e.target.value)}
                  className={claseInput}
                />
              )}
            </label>

            {campo.tipo === "enlace" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs text-forest-800/70">
                  Texto del botón
                  <input
                    type="text"
                    value={String((valor as { label?: string })?.label ?? "")}
                    onChange={(e) =>
                      cambiar(campo.id, { ...(valor as object), label: e.target.value })
                    }
                    className={claseInput}
                  />
                </label>
                <label className="block text-xs text-forest-800/70">
                  Destino
                  <input
                    type="text"
                    value={String((valor as { href?: string })?.href ?? "")}
                    onChange={(e) =>
                      cambiar(campo.id, { ...(valor as object), href: e.target.value })
                    }
                    placeholder="/contacto"
                    className={claseInput}
                  />
                </label>
              </div>
            )}

            {campo.ayuda && <p className="mt-1 text-xs text-forest-800/50">{campo.ayuda}</p>}
          </div>
        );
      })}

      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-forest-800/10 pt-5">
        <button
          type="submit"
          disabled={estado === "guardando"}
          className="rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-dark disabled:opacity-60"
        >
          {estado === "guardando" ? "Guardando…" : "Guardar textos"}
        </button>

        {editada && (
          <button
            type="button"
            onClick={restaurar}
            className="rounded-full border border-forest-800/20 px-5 py-2.5 text-sm text-forest-800 transition-colors hover:bg-cream"
          >
            Volver a los textos originales
          </button>
        )}

        {mensaje && (
          <span role="status" className={`text-xs ${estado === "error" ? "text-[#8d3a32]" : "text-leaf"}`}>
            {mensaje}
          </span>
        )}
      </div>
    </form>
  );
}
