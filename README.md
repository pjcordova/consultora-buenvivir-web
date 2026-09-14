# Buen Vivir — sitio web

Sitio web de **Buen Vivir**, consultora regenerativa dirigida por Belén Vera.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animaciones/transiciones)
- Contenido en el propio repo como MDX/JSON (sin CMS en la v1)
- Alta de comunidad vía Google Forms (link en `content/site.json`)
- Deploy en Vercel

## Estructura de carpetas

```
app/                    Rutas (App Router)
  layout.tsx            Layout raíz (Header + Footer)
  page.tsx               Home
  servicios/page.tsx     Servicios
  sobre-belen/page.tsx    Sobre Belén
  contacto/page.tsx      Contacto
components/
  layout/                Header, Footer, Navigation
  sections/              Bloques de página (Hero, ServiciosGrid, ContactoForm)
  ui/                     Piezas reutilizables (AnimatedSection = wrapper Framer Motion)
content/
  servicios/*.mdx         Un archivo por servicio (frontmatter: titulo, resumen, orden)
  site.json               Textos generales y datos de contacto
lib/
  content.ts              Helpers para leer content/ (MDX + JSON)
  constants.ts            Constantes (nav, nombre del sitio)
types/
  content.ts              Tipos compartidos (Servicio, SiteContent)
public/images/            Assets estáticos (fotos de naturaleza, logo, etc.)
```

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Pendientes marcados con TODO

Todo el contenido de ejemplo (bio de Belén, datos de contacto, textos de
servicios, link de Google Form) es **placeholder**. Antes de publicar,
reemplazar cada `TODO` con la información real confirmada por Belén — no
inventar credenciales, precios ni datos de contacto (ver notas del proyecto).

También falta:
- Reemplazar la paleta de colores en `tailwind.config.ts` por los hex exactos
  del manual de marca (Canva).
- Cargar tipografías reales del manual de marca.
- Traer imágenes de naturaleza / diente de león a `public/images/`.
- Portar el diseño de los mockups de Google Stitch (Home, Servicios, Sobre
  Belén, Contacto) a los componentes de `components/`.

## Subir esto a GitHub

Este esqueleto todavía no es un repo git. Desde esta carpeta:

```bash
git init
git add .
git commit -m "Esqueleto inicial Next.js (App Router + Tailwind + Framer Motion)"
git branch -M main
git remote add origin https://github.com/pjcordova/consultora-buenvivir-web.git
git push -u origin main
```
