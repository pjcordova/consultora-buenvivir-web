"use client";

import { useRouter } from "next/navigation";

export default function CerrarSesion() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full bg-forest-950 px-4 py-2 text-sm text-cream transition-colors hover:bg-forest-800"
    >
      Salir
    </button>
  );
}
