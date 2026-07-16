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

## Image Metadata Pipeline

`src/data/artwork-image-metadata.generated.json` es un manifest **machine-owned**
(`{ [rutaPública]: { width, height } }`) con el `width`/`height` real de cada
foto, medido del archivo — nunca derivado del campo `size` (medida física del
lienzo; no coincide con el ratio real del archivo fotografiado, verificado con
evidencia: `nebulosa-dorada.jpg` mide físicamente 40×50cm=ratio 0.8, pero el
archivo real es 1027×1400px=ratio 0.734). Es la única fuente de verdad del
aspect ratio de cada obra (consumida por el repositorio, Fase I.1).

Aunque es generado, **se versiona en git** como cualquier otro archivo de
datos — no se regenera en cada build (ver más abajo).

- `npm run images:generate` — mide con `sharp` cada ruta real referenciada en
  `data/artworks.ts` y sobreescribe el manifest completo. Correr cuando se
  agrega una obra nueva o se reemplaza el archivo de una foto existente en la
  misma ruta. Su resultado se commitea.
- `npm run images:check` — vuelve a medir cada archivo real y compara contra
  el manifest ya commiteado (clave **y** valor, no solo presencia). Si falta
  una entrada o una foto fue reemplazada sin regenerar, falla con la lista
  completa de discrepancias y código de salida 1.
- `prebuild` (antes de `vite build`) y `prebuild:next` (antes de `next build`)
  corren `images:check` — **nunca `images:generate`**: un build no debe
  reescribir en silencio un archivo versionado, eso ocultaría que una imagen
  cambió sin que nadie regenerara su metadata a propósito.
- El script vive en `scripts/generate-artwork-image-metadata.ts`, fuera de
  `src/` — es tooling de mantenimiento, no código de aplicación.

## Component Rules

1. Ningún componente recibe más props de las que efectivamente usa — preferir `Pick<Entity, 'campo1' | 'campo2'>` sobre la entidad completa cuando el componente no necesita todo.
2. Los primitivos de `ui/` no hardcodean color/espaciado/sombra — todo llega vía clases de Tailwind generadas desde `styles/tokens/`.
3. Server Components por defecto; `'use client'` solo cuando hay estado, efectos, o una librería que lo exige (Framer Motion, hooks de Radix, `usePathname`).
4. No duplicar lógica, estilos ni animaciones — si dos componentes necesitan "lo mismo", se extrae antes de escribir el segundo (precedente: `useSubmitStatus`, `CollectionCard`, `ArtworkLightbox`).
5. Preferir composición (`children`/slots) sobre props de configuración gigantes — más de ~3 variantes booleanas en un componente es señal de que debería dividirse.
6. Todo componente interactivo se prueba con teclado y tiene estado de foco visible antes de darse por terminado.
7. Un wrapper sobre un primitivo de Radix (`DialogContent`, `PopoverContent`, `SelectContent`, etc.) siempre reenvía las props restantes del primitivo subyacente (`ComponentProps<typeof Radix.X> & {...}`, spread de `...props`) — nunca una interfaz cerrada con solo los campos usados hoy. Corregido en la auditoría post-Fase E: `DialogContent`/`DrawerContent`/`PopoverContent`/`SelectContent` no reenviaban props como `onOpenAutoFocus`/`align`/`sideOffset`, bloqueando casos reales cercanos en el roadmap (p. ej. Framer Motion en Fase F necesita pasar `forceMount` a `Dialog.Content`).

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
    navigation/   cómo te mueves por el sitio (NavLink, MobileMenu — Fase H; futuro Breadcrumb en I.2)
    artwork/      dominio obra/colección
    forms/        formularios de negocio
    feedback/     estados del sistema (toast, empty state, skeleton) — aún vacía
    sections/     bloques de página compuestos — aún vacía
    providers/    providers de React (ToastProvider, Fase E)
  hooks/          hooks compartidos
  lib/
    repositories/ única puerta de acceso a datos
    services/     lógica de negocio con efectos secundarios — aún vacía
  styles/
    tokens/       design tokens tipados
    motion/       variants/transitions/interactions/stagger de Motion (Fase F)
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
- Orden de `zIndex` (`tokens/zIndex.ts`): `header < overlay < modal < dropdown < toast`. `dropdown` va por encima de `modal` a propósito — un Select/Popover/Tooltip anidado dentro de un Dialog debe pintarse sobre su overlay, no debajo (bug real encontrado y corregido en la auditoría post-Fase E: el orden anterior atrapaba visualmente y bloqueaba los clics de un Select abierto dentro de un Dialog).

## Motion Rules

- Ningún componente escribe un objeto de animación inline (`{ opacity: 0, y: 24 }`) — todos importan variants con nombre desde `styles/motion/` (JS-driven) o clases con nombre del catálogo CSS de `tailwind.config.js` (overlays).
- Toda animación consulta `useReducedMotion` (JS) o su equivalente `motion-reduce:` (CSS) y ofrece una versión reducida — no es opcional por componente.
- Duraciones/curvas vienen de `styles/tokens/motion.ts` — nunca un `duration-300` elegido a ojo sin corresponder a un token.

### Dos catálogos de animación, y por qué

- **Dialog / Drawer / Popover / Tooltip** — CSS puro (`@keyframes` + `animation-name`, clases `data-[state=open]:animate-*`/`data-[state=closed]:animate-*` en `tailwind.config.js`). Radix emite `data-state` y su `Presence` interno detecta el fin de la animación antes de desmontar — sin `forceMount`, sin levantar el estado `open` al consumidor, sin cambiar la API pública de estos 4 componentes.
- **Accordion** — también CSS, pero con `@keyframes` sobre `height` referenciando `var(--radix-accordion-content-height)` (patrón oficial de Radix), **no** una `transition` continua sobre `grid-template-rows`. Se probó empíricamente que la técnica de grid (`transition: grid-template-rows; data-[state=open]:grid-rows-[1fr]`) no interpola: `@radix-ui/react-collapsible` fuerza `transitionDuration:0s`/`animationName:none` inline en cada toggle (para medir el alto real sin interferencia y calcular esa misma CSS variable), lo que mata cualquier `transition` propio en el nodo — pero restaura `animationName` a tiempo, por lo que un `animation` (`@keyframes`) sí funciona correctamente.
- **`Reveal`/`Stagger`** (`components/ui/`) — Motion (`motion/react`, con `LazyMotion`+`domAnimation`), no CSS: necesitan disparo por scroll (`whileInView`) y cascada entre hijos, que CSS/Intersection Observer no resuelven idiomáticamente. `Reveal` y `Stagger` siempre renderizan el mismo árbol (mismo componente `m.div`/`m.li`/etc., siempre envuelto en `LazyMotion`) — solo cambian las props de animación (`initial`/`whileInView`/`animate`) según `useReducedMotion()`. **No alternar entre un componente animado y un elemento plano según una condición** (p. ej. `if (reducedMotion) return <div>` vs `return <motion.div>`): Motion aplica estilos de forma imperativa, fuera del diffing de React, y un cambio de forma del árbol entre renders deja un `opacity`/`transform` inline colgado que React nunca limpia — probado empíricamente (bajo reduced motion el contenido quedaba invisible para siempre hasta corregirlo).
- `Reveal` acepta un `variant` (`fade`/`scale`/`slideUp`/`slideDown`/`slideLeft`/`slideRight`, de `styles/motion/variants.ts`, `motionVariants`). `Stagger` provee un Context interno (no exportado) que sus `Reveal` hijos leen para heredar el trigger del contenedor en cascada, en vez de auto-dispararse cada uno por separado.
- Ninguno de los dos primitivos (`Reveal`/`Stagger`) tiene consumidores reales todavía — construidos y verificados en un harness temporal, sin aplicarse a ninguna página (Fase G/H/I decide dónde).

## Layout System

- **`MasonryGrid`** (`components/ui/`) centraliza el patrón de columnas (`columns-1 gap-* sm:columns-* lg:columns-* xl:columns-*`) — antes duplicado e inconsistente entre `ArtworkCatalog` (`sm:2 lg:3 xl:4`) y Home (`sm:2 lg:4`). Server Component puro, sin `break-inside-avoid` propio (responsabilidad del hijo, ej. `ArtworkCard`) y sin manejo de estado vacío (responsabilidad del consumidor). Cada consumidor pasa su propia configuración de columnas — las dos configuraciones siguen siendo distintas a propósito (unificarlas sería un cambio de diseño visual, no un refactor de infraestructura); lo que se eliminó es la duplicación del *mecanismo*, no de la configuración.
- **`app/template.tsx`** aplica un fade de entrada en cada navegación, reutilizando el keyframe `fade-in` ya definido en Fase F (`tailwind.config.js`, mismo usado por el overlay de Dialog/Drawer) vía la clase `motion-safe:animate-fade-in`. Es un **Server Component**, sin `'use client'`, sin Motion — `template.tsx` ya remonta en cada navegación por diseño de Next.js, así que una clase CSS que se dispara al montar basta; `motion-safe:` (variant nativo de Tailwind, contraparte de `motion-reduce:`) resuelve `prefers-reduced-motion` sin ningún JS.
  - Se investigaron y descartaron dos alternativas antes de esta, con evidencia: la `<ViewTransition>` nativa de Next.js/React (`experimental.viewTransition`, requiere una flag experimental — no apta para un sitio pensado a 10-20 años); y `LazyMotion`+`m.div`+`useReducedMotion` (funciona, pero agrega un límite cliente, una dependencia de bundle y una rama condicional para lograr únicamente un fade de opacidad que CSS puro ya resuelve).
  - Consecuencia: `transitions.pageTransition` (el preset de Motion definido en Fase F para este momento) sigue sin consumidor real — correcto, ya que ningún caso de uso actual necesita física de springs/gestos para esto.
  - Fade de entrada únicamente, sin crossfade de salida — un crossfade real exige `AnimatePresence` coordinado entre `layout.tsx` (no remonta) y `template.tsx` (sí remonta), con casos borde conocidos en Next.js App Router; el fade de entrada logra la sensación de "transición cuidada" sin esa fragilidad.

## Navigation System

- **`NavLink`** (`components/navigation/`) es el único lugar que decide si una ruta está activa (`pathname === href || pathname.startsWith(href + '/')`) y aplica `aria-current="page"` — corrige un hueco de accesibilidad real (el link activo antes solo se distinguía visualmente, sin atributo ARIA). Consumido por el nav de escritorio de `SiteHeader` y por `MobileMenu`; el estilo visual (`className`/`activeClassName`) queda en manos de quien lo usa, ya que desktop (píldoras horizontales) y móvil (lista vertical) necesitan aspectos distintos sobre la misma lógica.
- **`MobileMenu`** (`components/navigation/`) es el primer consumidor real de `Drawer` (Fase E/F, construido explícitamente para este momento). Mantiene `open`/`onOpenChange` controlado — no por costumbre, sino porque es la única forma de cerrar el Drawer automáticamente cuando el usuario toca un link de navegación (Radix no lo hace por sí solo). El botón trigger es `md:hidden`; el `<nav>` de escritorio en `SiteHeader` es `hidden md:flex` — ambos gobernados por el mismo breakpoint (`md`, 768px), verificado que no se solapan ni dejan un hueco en la transición.
- `SiteHeader` usa `Container width="content"` en vez de `mx-auto max-w-6xl px-6` propio (Fase H) — mismo criterio que Fase G aplicó a `ArtworkCatalog`/Home.

## Toast Pattern

- `providers/ToastProvider` mantiene un array de mensajes; cada uno monta su propia instancia de `Toast.Root` (`@radix-ui/react-toast`) vía `.map()` con `key` estable — mismo patrón que shadcn/ui. Soporta varios toasts simultáneos apilados en el viewport; cerrar uno (manual, Escape o auto-dismiss) solo lo remueve a él, sin afectar a los demás.
- Un diseño anterior usaba una única instancia de `Toast.Root` siempre montada (alternando solo `open`), adoptado durante la implementación inicial tras atribuir un bug de cierre inmediato al patrón array-based. Una auditoría posterior reprodujo ese patrón de forma aislada y fiel (array de mensajes, `.map()`, montaje fresco por toast, con y sin `open` controlado, `duration` real de 5000ms, hasta tres toasts simultáneos) y **no encontró el bug** — se apilaron y cerraron correctamente en todos los casos. La causa real del cierre inmediato observado originalmente nunca se identificó con certeza; lo más probable es que fuera un artefacto de la sesión de depuración en vivo (Fast Refresh/HMR de Turbopack), no una limitación de Radix ni del patrón array-based. Se migró a este patrón tras esa comprobación.
- `useToast()`/`toast({ title, description })` (API pública) y `ui/Toast.tsx` (presentación) no cambiaron con esta migración — el array-based es un cambio interno de `ToastProvider`, transparente para cualquier consumidor.

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
