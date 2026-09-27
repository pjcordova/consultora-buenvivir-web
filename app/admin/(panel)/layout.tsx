import { redirect } from "next/navigation";
import { hayConfiguracion, sesionActiva } from "@/lib/admin/auth";

export const metadata = {
  title: "Panel | Buen Vivir",
  robots: { index: false, follow: false },
};

/** Puerta del panel: sin sesión válida no se ve nada de lo que está adentro. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!hayConfiguracion()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-forest-950">
        <h1 className="font-display text-2xl">Falta configurar el panel</h1>
        <p className="mt-4 text-sm leading-relaxed text-forest-800/80">
          Creá el archivo <code>.env.local</code> con <code>ADMIN_USUARIO</code>,{" "}
          <code>ADMIN_PASSWORD_HASH</code> y <code>ADMIN_SESSION_SECRET</code>. El archivo{" "}
          <code>.env.example</code> del proyecto explica cómo generarlos.
        </p>
      </main>
    );
  }

  if (!sesionActiva()) redirect("/admin/login");

  return <>{children}</>;
}
