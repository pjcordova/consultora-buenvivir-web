import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Servicio, SiteContent } from "@/types/content";
import siteJson from "@/content/site.json";

const SERVICIOS_DIR = path.join(process.cwd(), "content", "servicios");

/**
 * Lee los archivos .mdx de content/servicios y devuelve los servicios
 * ordenados según el campo `orden` del frontmatter.
 * (El render del MDX en la página de detalle se agrega cuando exista esa ruta;
 * por ahora se usa solo el frontmatter para los listados.)
 */
export async function getServicios(): Promise<Servicio[]> {
  const archivos = await fs.readdir(SERVICIOS_DIR);

  const servicios = await Promise.all(
    archivos
      .filter((archivo) => archivo.endsWith(".mdx"))
      .map(async (archivo) => {
        const raw = await fs.readFile(
          path.join(SERVICIOS_DIR, archivo),
          "utf-8"
        );
        const { data, content } = matter(raw);

        return {
          slug: archivo.replace(/\.mdx$/, ""),
          titulo: data.titulo ?? "TODO",
          resumen: data.resumen ?? "",
          orden: data.orden ?? 0,
          contenido: content,
        } satisfies Servicio;
      })
  );

  return servicios.sort((a, b) => a.orden - b.orden);
}

export async function getSiteContent(): Promise<SiteContent> {
  return siteJson as SiteContent;
}
