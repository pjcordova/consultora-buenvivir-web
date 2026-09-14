export interface Servicio {
  slug: string;
  titulo: string;
  resumen: string;
  orden: number;
  contenido: string;
}

export interface SiteContent {
  googleFormUrl: string;
  sobreBelen: {
    bioCorta: string;
  };
  contacto: {
    email: string;
    redes: Record<string, string>;
  };
}
