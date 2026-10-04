"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { clicMedible } from "@/lib/clics";

/**
 * Cuenta en Vercel Web Analytics los clics que importan (WhatsApp, agenda,
 * formularios, correo, redes), sin tocar cada botón: escucha todos los clics
 * de la página y se fija adónde lleva el enlace (lib/clics.ts).
 *
 * Cada evento lleva dos datos: la página y cuál botón fue. Si el botón está en
 * el pie, el menú o es el flotante de WhatsApp, se aclara entre paréntesis
 * (lo marca el atributo data-zona de esas partes).
 *
 * En la computadora de desarrollo no se envía nada: los eventos se ven en la
 * consola del navegador.
 */
export default function MedirClics() {
  useEffect(() => {
    const alHacerClic = (evento: MouseEvent) => {
      // Clic común o con la rueda (abrir en otra pestaña)
      if (evento.type === "auxclick" && evento.button !== 1) return;

      const enlace = (evento.target as Element | null)?.closest?.("a[href]");
      if (!(enlace instanceof HTMLAnchorElement)) return;

      const clic = clicMedible(
        enlace.getAttribute("href") ?? "",
        enlace.getAttribute("aria-label") || enlace.textContent || ""
      );
      if (!clic) return;

      const zona = enlace.closest<HTMLElement>("[data-zona]")?.dataset.zona;
      track(clic.evento, {
        pagina: window.location.pathname,
        boton: zona ? `${clic.detalle} (${zona})` : clic.detalle,
      });
    };

    // Formularios marcados con data-medir (la suscripción a las novedades).
    // Solo se cuenta el envío: el correo escrito nunca se manda a las estadísticas.
    const alEnviar = (evento: SubmitEvent) => {
      const formulario = evento.target as HTMLFormElement | null;
      const nombre = formulario?.dataset?.medir;
      if (nombre) track(nombre, { pagina: window.location.pathname });
    };

    // En fase de captura: se cuenta aunque el enlace abra otra pestaña
    document.addEventListener("click", alHacerClic, true);
    document.addEventListener("auxclick", alHacerClic, true);
    document.addEventListener("submit", alEnviar, true);
    return () => {
      document.removeEventListener("click", alHacerClic, true);
      document.removeEventListener("auxclick", alHacerClic, true);
      document.removeEventListener("submit", alEnviar, true);
    };
  }, []);

  return null;
}
