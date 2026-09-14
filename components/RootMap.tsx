"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Nodo = {
  id: string;
  titulo: string;
  estado: string;
  activo: boolean;
  x: number; // posición en % dentro del contenedor
  y: number;
  descripcion: string;
};

// NOTA: hoy hay una sola iniciativa real en lanzamiento ("Ecosistema Buen Vivir"),
// no 4 comunidades separadas como se pensó al principio. Este componente queda
// preparado para 1 a 4 nodos — ajustar `nodos` según la respuesta de Belén
// (pregunta 13 del cuestionario).
const nodos: Nodo[] = [
  {
    id: "ecosistema",
    titulo: "Ecosistema Buen Vivir",
    estado: "En lanzamiento — inicia en septiembre",
    activo: true,
    x: 50,
    y: 75,
    descripcion:
      "Un lugar para personas curiosas, profesionales, emprendedoras y agentes de cambio. Encuentro mensual por Zoom para escucharnos, aprender y explorar juntos qué puede emerger.",
  },
];

export default function RootMap() {
  const [seleccionado, setSeleccionado] = useState<string | null>(
    nodos[0]?.id ?? null
  );

  const nodoActivo = nodos.find((n) => n.id === seleccionado);

  return (
    <div>
      <div className="relative max-w-3xl mx-auto aspect-[2/1]">
        <svg viewBox="0 0 800 360" className="w-full h-full">
          <text
            x="400"
            y="40"
            textAnchor="middle"
            className="fill-parchment font-display text-sm"
          >
            raíz común
          </text>
          {nodos.map((n) => (
            <path
              key={n.id}
              d={`M400 55 C ${380 + (n.x - 50)} 150, ${
                n.x * 8
              } 220, ${n.x * 8} 300`}
              fill="none"
              stroke={seleccionado === n.id ? "#9db184" : "#3c4a30"}
              strokeWidth={seleccionado === n.id ? 3.5 : 2.5}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {nodos.map((n) => (
          <button
            key={n.id}
            onClick={() => setSeleccionado(n.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-32 text-center"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 transition-transform ${
                n.activo ? "border-moss-soft" : "border-dashed border-[#6b7a58]"
              } ${
                seleccionado === n.id
                  ? "bg-moss scale-125 shadow-[0_0_0_6px_rgba(116,140,92,0.22)]"
                  : "bg-forest-950"
              }`}
            />
            <span className="text-xs text-[#d8d2ba]">
              {n.titulo}
              <span className="block mt-1 text-[11px] text-honey">
                {n.estado}
              </span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {nodoActivo && (
          <motion.div
            key={nodoActivo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto mt-10 p-6 border border-[#37432b] bg-forest-800/50 text-left"
          >
            <span className="block text-xs text-honey mb-1">
              {nodoActivo.estado}
            </span>
            <h3 className="font-display text-lg text-parchment mb-2">
              {nodoActivo.titulo}
            </h3>
            <p className="text-sm leading-relaxed text-[#c9c2a9]">
              {nodoActivo.descripcion}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
