# Arquitectura — Joseph Dayan

Referencia técnica permanente del proyecto. Complementa (no reemplaza) `docs/MASTER-PLAN.md` (marca, negocio, roadmap) y el historial de commits (decisiones puntuales con su porqué). Este documento se actualiza cada vez que una fase del Sistema de Diseño cambia una regla o agrega una capa nueva.

## Layers

De abajo hacia arriba — cada capa solo conoce a la que tiene debajo, nunca a la de arriba:

```
src/data/                fuente de datos cruda (hoy arrays TS en memoria, mañana Supabase)
  ↓
src/lib/repositories/    única puerta de lectura — nunca expone referencias mutables
  ↓
src/lib/services/        lógica de negocio con efectos secundarios (checkout, email, PDF) — aún vacía
  ↓
src/config/              configuración estática del sitio (nav, SEO, metadata base)
  ↓
src/components/          ui/ (primitivos) → artwork/, forms/, layout/, navigation/ (dominio) → sections/ (composición de página)
  ↓
src/app/                 rutas — orquestan repositorios/servicios y componentes, no contienen lógica de negocio propia
```

`src/styles/tokens/`, `src/types/`, `src/utils/`, `src/hooks/` son transversales: cualquier capa puede consumirlos, ninguna vive "encima" de otra.

## Dependency Flow

- `src/data/*` — **nunca** se importa fuera de `src/lib/repositories/`. Verificar con: `grep -rn "from '@/data" src --include="*.tsx" --include="*.ts" | grep -v repositories/artworkRepository.ts` (debe devolver vacío).
- Rutas (`src/app/**/page.tsx`) importan repositorios/servicios y componentes — nunca `src/data` directamente, nunca lógica de negocio inline que debería vivir en un servicio.
- Componentes de dominio (`artwork/`, `forms/`) reciben datos ya resueltos por props — no llaman al repositorio ellos mismos (excepción: páginas de `app/`, que sí son el punto de entrada de datos).
- Componentes `ui/` no importan nada de `lib/`, `data/`, `config/` ni `types/artwork.ts` — son genéricos, no conocen el dominio "obra/artista".
- `config/*` puede leer del repositorio (ej. `config/site.ts` reexporta `Artist.socials`) para no duplicar datos, pero nunca al revés.

## Repository Rules

1. Es la única puerta de acceso a los datos — ninguna ruta ni componente importa `src/data/*` directamente.
2. Nunca devuelve una referencia mutable: toda colección se devuelve como `ReadonlyArray<T>` mediante una copia (`[...array]`); toda entidad individual se devuelve como una copia (`{ ...entity }`).
3. Expone funciones por **slug**, nunca por `id` técnico, para cualquier búsqueda pública (`getArtworkBySlug`, no `getArtworkById`). `id` existe y se conserva como identificador interno estable, pero no debería aparecer en una URL.
4. Cada función tiene un nombre que describe qué devuelve, no cómo lo hace (`getFeaturedArtwork()`, no `getArtworkWhereFeaturedFlagIsTrue()`).
5. Reglas de negocio simples y explícitas viven aquí (ej. `getRelatedArtworks`: misma colección primero, si no mismo estilo) — se documentan inline el día que se definen, nunca se asumen implícitas.
6. El acceso condicionado futuro (área privada, membresías) se resuelve en esta capa (o en `services/`), nunca ocultando/mostrando UI con una condición dispersa en un componente visual.

## Component Rules

1. Ningún componente recibe más props de las que efectivamente usa — preferir `Pick<Entity, 'campo1' | 'campo2'>` sobre la entidad completa cuando el componente no necesita todo.
2. Los primitivos de `ui/` no hardcodean color/espaciado/sombra — todo llega vía clases de Tailwind generadas desde `styles/tokens/`.
3. Server Components por defecto; `'use client'` solo cuando hay estado, efectos, o una librería que lo exige (Framer Motion, hooks de Radix, `usePathname`).
4. No duplicar lógica, estilos ni animaciones — si dos componentes necesitan "lo mismo", se extrae antes de escribir el segundo (precedente: `useSubmitStatus`, `CollectionCard`, `ArtworkLightbox`).
5. Preferir composición (`children`/slots) sobre props de configuración gigantes — más de ~3 variantes booleanas en un componente es señal de que debería dividirse.
6. Todo componente interactivo se prueba con teclado y tiene estado de foco visible antes de darse por terminado.

## Naming

| Qué | Convención | Ejemplo |
|---|---|---|
| Componentes | `PascalCase` | `ArtworkCard.tsx` |
| Hooks | `camelCase`, prefijo `use` | `useSubmitStatus.ts` |
| Funciones/variables | `camelCase` | `getArtworkBySlug` |
| Tipos/Interfaces | `PascalCase` | `Artwork`, `NavItem` |
| Rutas y slugs | `kebab-case` | `/obra/corazon-y-razon` |
| Archivos de un solo export por defecto | igual al export | `SiteHeader.tsx` exporta `SiteHeader` |

## Folder conventions

Ver también el documento de Sistema de Diseño (sección 2) para el razonamiento completo de cada carpeta.

```
src/
  app/            rutas (App Router)
  components/
    ui/           primitivos sin conocimiento de dominio
    layout/       esqueleto de página (header, footer, container)
    navigation/   cómo te mueves por el sitio (nav links, futuro menú móvil, breadcrumb)
    artwork/      dominio obra/colección
    forms/        formularios de negocio
    feedback/     estados del sistema (toast, empty state, skeleton) — aún vacía
    sections/     bloques de página compuestos — aún vacía
    providers/    providers de React — aún vacía
  hooks/          hooks compartidos
  lib/
    repositories/ única puerta de acceso a datos
    services/     lógica de negocio con efectos secundarios — aún vacía
  styles/
    tokens/       design tokens tipados
    motion/       presets de Framer Motion — aún vacía
  data/           fuente de datos cruda
  types/          tipos de dominio compartidos
  utils/          funciones puras sin estado
  config/         configuración estática del sitio
```

Una carpeta "aún vacía" existe en la estructura porque su necesidad ya está justificada (ver Sistema de Diseño), no porque se haya adivinado una funcionalidad futura sin fundamento.

## Styling Rules

- Todo color/espaciado/tipografía/sombra/radio/z-index consumido por un componente debe originarse en `src/styles/tokens/*.ts` (documental) y su espejo en `tailwind.config.js` — nunca un hex, `px` o número mágico inline.
- `tailwind.config.js` es un espejo manual de los tokens mientras el proyecto conviva con Vite en Tailwind v3 (ver comentario en el propio archivo) — cualquier cambio de valor se hace en ambos lugares hasta el cutover a v4.
- `accent` (botones sólidos) es el único grupo de color heredado sin tokenizar todavía — su reemplazo es una decisión del primitivo `Button` (Fase D/I del Sistema de Diseño), no se improvisa antes.
- `gold` nunca es el fondo de un botón grande — es condimento (links, bordes, detalles), regla explícita del Documento Maestro.

## Motion Rules

(Arquitectura aprobada, implementación en la Fase F del Sistema de Diseño.)

- Ningún componente escribe un objeto de animación inline (`{ opacity: 0, y: 24 }`) — todos importan variants con nombre desde `styles/motion/`.
- Toda animación consulta `useReducedMotion` y ofrece una versión reducida — no es opcional por componente.
- Duraciones/curvas vienen de `styles/tokens/motion.ts` — nunca un `duration-300` elegido a ojo sin corresponder a un token.

## Toast Pattern

- `providers/ToastProvider` mantiene un único `Toast.Root` (`@radix-ui/react-toast`) siempre montado, alternando su prop `open` — nunca un array de instancias creadas/destruidas dinámicamente vía `.map()`. Montar una instancia nueva de `Toast.Root` ya con `open`/`defaultOpen` en `true` en el mismo render dispara `onOpenChange(false)` inmediatamente (confirmado empíricamente); el patrón oficial del mantenedor (Radix `primitives` discusión #2907) es dejar el `Root` montado y solo alternar `open`.
- Consecuencia: un solo toast visible a la vez. Disparar uno mientras otro sigue abierto reemplaza su contenido en vez de apilarlo — suficiente para los casos reales del sitio (confirmación de envío, error de formulario); si en el futuro se necesita una cola de varios toasts simultáneos, requiere rediseñar `ToastProvider`, no `ui/Toast.tsx`.

## Accessibility Checklist

Antes de dar por terminado cualquier componente interactivo nuevo:

- [ ] Navegable con `Tab`/`Shift+Tab` en el orden visual esperado.
- [ ] Activable con `Enter`/`Space` según corresponda (botones/links).
- [ ] Tiene un estado de foco visible (anillo `focus-visible`, `tokens/focus.ts`) — no depende solo de `hover`.
- [ ] Imágenes con `alt` descriptivo real (nunca el nombre de archivo).
- [ ] Contraste de texto/fondo verificado contra AA (4.5:1 normal, 3:1 grande), incluyendo estados `muted`/`subtle`.
- [ ] Si anima, respeta `prefers-reduced-motion`.
- [ ] Si es un formulario, los errores están asociados al campo (`aria-describedby`), no solo mostrados sueltos debajo.
- [ ] Si es complejo (modal, popover, tabs, accordion, select), se construyó sobre un primitivo de Radix/shadcn en vez de a mano.
