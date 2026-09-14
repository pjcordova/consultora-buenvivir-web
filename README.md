# Buen Vivir — Web

Sitio de Buen Vivir, consultora regenerativa (Argentina). Ver el stack completo y las decisiones de tecnología en `stack-tecnico-buen-vivir.md` (documento de referencia del proyecto, fuera de este repo).

## Setup

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Estado del contenido

Todo el contenido en `content/*.ts` está marcado explícitamente como `CONFIRMADO` (viene de publicaciones reales de Belén) o `PENDIENTE` (espera respuesta del cuestionario que se le envió). Antes de dar por terminada una página, revisar que no queden placeholders con `[PENDIENTE ...]`.

Páginas ya armadas con contenido real:
- `/` (Home) — hero, definición de regeneración organizacional, ecosistema
- `/servicios` — los 3 caminos de acompañamiento completos

Páginas con placeholder, a la espera del cuestionario:
- `/sobre-belen`
- `/contacto`

## Componentes a revisar

- `components/RootMap.tsx` — hoy tiene un solo nodo activo ("Ecosistema Buen Vivir"), porque todo indica que "Casita del Árbol" / "Club de Conversaciones Regenerativas" / "Ecosistema Buen Vivir" son la misma iniciativa en evolución. Ajustar según la respuesta de la pregunta 13 del cuestionario.

## Pendientes fuera de código

- Fotos reales de Belén (pregunta 11 del cuestionario)
- Logo definitivo (vector/SVG)
- Dominio
