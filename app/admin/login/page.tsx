"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const respuesta = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, clave }),
    });

    if (respuesta.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }

    const datos = await respuesta.json().catch(() => ({}));
    setError(datos.error ?? "No se pudo entrar.");
    setEnviando(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_20px_50px_-25px_rgba(18,23,15,0.4)]"
      >
        <h1 className="font-display text-2xl text-forest-950">Panel de Buen Vivir</h1>
        <p className="mt-2 text-sm text-forest-800/70">
          Para editar los textos, las imágenes, los testimonios y los talleres del sitio.
        </p>

        <label className="mt-7 block text-sm text-forest-800">
          Usuario
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
            className="mt-2 w-full rounded-lg border border-forest-800/20 px-3 py-2 text-forest-950 outline-none focus:border-leaf"
          />
        </label>

        <label className="mt-4 block text-sm text-forest-800">
          Contraseña
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border border-forest-800/20 px-3 py-2 text-forest-950 outline-none focus:border-leaf"
          />
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-clayRose/15 px-3 py-2 text-sm text-[#8d3a32]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 w-full rounded-md bg-leaf px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-leaf-dark disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>

      {/* Quien llegó desde el ícono del encabezado puede volver sin entrar */}
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-2 text-sm text-forest-800/70 transition-colors hover:text-forest-950"
      >
        <span aria-hidden="true">←</span> Volver al sitio
      </a>
    </main>
  );
}
