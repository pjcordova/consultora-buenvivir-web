import type { MetadataRoute } from "next";
import { URL_DEL_SITIO } from "@/lib/metadatos";

/** Qué pueden recorrer los buscadores: todo menos el panel y su API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${URL_DEL_SITIO}/sitemap.xml`,
  };
}
