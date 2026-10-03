"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CampoDeLista, ElementoGuardado, ListaEditable, TextoBilingue } from "@/lib/admin/listas";

type EditorListaProps = {
  lista: ListaEditable;
  items: ElementoGuardado[];
};

const claseInput =
  "mt-1.5 w-full rounded-lg border border-forest-800/20 bg-white px-3 py-2 text-sm text-forest-950 outline-none focus:border-leaf";

/** Un elemento vacío, con cada campo en su forma inicial. */
function elementoNuevo(lista: ListaEditable): ElementoGuardado {
  const elemento: ElementoGuardado = { id: crypto.randomUUID() };
  for (const campo of lista.campos) {
    elemento[campo.id] = campo.tipo === "si-no" ? true : campo.porIdioma ? { es: "", en: "" } : "";
  }
  return elemento;
}

/** Caja de texto de una línea o de varias, según el campo. */
function Entrada({
  campo,
  valor,
  alCambiar,
}: {
  campo: CampoDeLista;
  valor: string;
  alCambiar: (valor: string) => void;
}) {
  if (campo.tipo === "parrafo") {
    return <textarea rows={4} value={valor} onChange={(e) => alCambiar(e.target.value)} className={claseInput} />;
  }
  const tipo = campo.tipo === "fecha" ? "date" : campo.tipo === "hora" ? "time" : "text";
  return (
    <input
      type={tipo}
      value={valor}
      onChange={(e) => alCambiar(e.target.value)}
      placeholder={campo.tipo === "enlace" ? "https://… o /contacto" : undefined}
      className={claseInput}
    />
  );
}

/**
 * Editor de una lista del panel (testimonios, talleres): agregar, quitar,
 * ordenar y guardar todo junto. Los textos tienen versión en español y en
 * inglés, una al lado de la otra.
 */
export default function EditorLista({ lista, items: iniciales }: EditorListaProps) {
  const router = useRouter();
  const [items, setItems] = useState<ElementoGuardado[]>(iniciales);
  const [cambios, setCambios] = useState(false);
  const [estado, setEstado] = useState<"listo" | "guardando" | "error">("listo");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const actualizar = (nuevos: ElementoGuardado[]) => {
    setItems(nuevos);
    setCambios(true);
    setMensaje(null);
  };

  const cambiarCampo = (indice: number, campo: string, valor: ElementoGuardado[string]) =>
    actualizar(items.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));

  const mover = (indice: number, hacia: -1 | 1) => {
    const destino = indice + hacia;
    if (destino < 0 || destino >= items.length) return;
    const copia = [...items];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    actualizar(copia);
  };

  const quitar = (indice: number) => {
    if (!confirm(`¿Quitar este ${lista.elemento}? Desaparece de la web al guardar.`)) return;
    actualizar(items.filter((_, i) => i !== indice));
  };

  async function guardar() {
    setEstado("guardando");
    setMensaje(null);

    let respuesta: Response;
    try {
      respuesta = await fetch("/api/admin/listas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lista: lista.id, items }),
      });
    } catch {
      setEstado("error");
      setMensaje("No hay conexión. Probá de nuevo en un rato.");
      return;
    }
    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      setEstado("error");
      setMensaje(datos.error ?? "No se pudo guardar.");
      return;
    }

    setItems(datos.items ?? items);
    setCambios(false);
    setEstado("listo");
    setMensaje("Guardado. Recargá la web para verlo.");
    router.refresh();
  }

  return (
    <div>
      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-forest-800/20 bg-white px-6 py-8 text-center text-sm text-forest-800/60">
          Todavía no hay ningún {lista.elemento}. Mientras la lista esté vacía, la sección no aparece en la web.
        </p>
      )}

      <ol className="space-y-5">
        {items.map((item, indice) => (
          <li key={item.id} className="rounded-2xl border border-forest-800/10 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg capitalize text-forest-950">
                {lista.elemento} {indice + 1}
              </h3>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => mover(indice, -1)}
                  disabled={indice === 0}
                  aria-label="Subir"
                  className="rounded-full border border-forest-800/20 px-3 py-1.5 text-forest-800 transition-colors hover:bg-cream disabled:opacity-40"
                >
                  ↑ Subir
                </button>
                <button
                  type="button"
                  onClick={() => mover(indice, 1)}
                  disabled={indice === items.length - 1}
                  aria-label="Bajar"
                  className="rounded-full border border-forest-800/20 px-3 py-1.5 text-forest-800 transition-colors hover:bg-cream disabled:opacity-40"
                >
                  ↓ Bajar
                </button>
                <button
                  type="button"
                  onClick={() => quitar(indice)}
                  className="rounded-full border border-[#8d3a32]/30 px-3 py-1.5 text-[#8d3a32] transition-colors hover:bg-[#8d3a32]/5"
                >
                  Quitar
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {lista.campos.map((campo) => {
                const valor = item[campo.id];

                if (campo.tipo === "si-no") {
                  return (
                    <label key={campo.id} className="flex items-center gap-2 text-sm text-forest-950">
                      <input
                        type="checkbox"
                        checked={valor !== false}
                        onChange={(e) => cambiarCampo(indice, campo.id, e.target.checked)}
                        className="h-4 w-4 accent-[#27a47e]"
                      />
                      {campo.etiqueta}
                    </label>
                  );
                }

                if (campo.porIdioma) {
                  const bilingue = (valor ?? { es: "", en: "" }) as TextoBilingue;
                  return (
                    <div key={campo.id}>
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="block text-sm font-medium text-forest-950">
                          {campo.etiqueta} <span className="font-normal text-forest-800/60">— español</span>
                          <Entrada
                            campo={campo}
                            valor={bilingue.es ?? ""}
                            alCambiar={(es) => cambiarCampo(indice, campo.id, { ...bilingue, es })}
                          />
                        </label>
                        <label className="block text-sm font-medium text-forest-950">
                          {campo.etiqueta}{" "}
                          <span className="font-normal text-forest-800/60">— inglés (opcional)</span>
                          <Entrada
                            campo={campo}
                            valor={bilingue.en ?? ""}
                            alCambiar={(en) => cambiarCampo(indice, campo.id, { ...bilingue, en })}
                          />
                        </label>
                      </div>
                      {campo.ayuda && <p className="mt-1 text-xs text-forest-800/50">{campo.ayuda}</p>}
                    </div>
                  );
                }

                return (
                  <div key={campo.id}>
                    <label className="block text-sm font-medium text-forest-950">
                      {campo.etiqueta}
                      <Entrada
                        campo={campo}
                        valor={typeof valor === "string" ? valor : ""}
                        alCambiar={(texto) => cambiarCampo(indice, campo.id, texto)}
                      />
                    </label>
                    {campo.ayuda && <p className="mt-1 text-xs text-forest-800/50">{campo.ayuda}</p>}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-forest-800/10 bg-white/95 p-4 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => actualizar([...items, elementoNuevo(lista)])}
          disabled={items.length >= lista.maximo}
          className="rounded-full border border-forest-800/20 px-5 py-2.5 text-sm text-forest-800 transition-colors hover:bg-cream disabled:opacity-50"
        >
          + Agregar {lista.elemento}
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={estado === "guardando" || !cambios}
          className="rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-dark disabled:opacity-60"
        >
          {estado === "guardando" ? "Guardando…" : "Guardar cambios"}
        </button>
        {cambios && estado !== "guardando" && (
          <span className="text-xs text-honey-deep">Hay cambios sin guardar.</span>
        )}
        {mensaje && (
          <span role="status" className={`text-xs ${estado === "error" ? "text-[#8d3a32]" : "text-leaf"}`}>
            {mensaje}
          </span>
        )}
      </div>
    </div>
  );
}
