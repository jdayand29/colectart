# CUTOVER-PLAN.md — Vite (Artora) → Next.js (Joseph Dayan Art)

**Versión 2** — actualizado para cerrar todos los hallazgos de
`docs/CUTOVER-REVIEW.md` (conclusión B). Documento estratégico. Construido
sobre `docs/AUDITORIA-DESPLIEGUE.md` (Alternativa A, aprobada).

**Ejecución en curso en la rama `cutover-preflight`** (no `main`, no
producción). Progreso:

- [x] **PFV-3 — Favicon corregido.** `icons: { icon: '/favicon.svg' }`
  agregado a `metadata` en `src/app/layout.tsx`. Verificado con un build de
  producción real (`next build` + `next start`, no `next dev`): el HTML
  servido ahora incluye `<link rel="icon" href="/favicon.svg">`. Commit
  hecho en `cutover-preflight`.
- [x] **Colisión de `/api/subscribe` resuelta.** `api/subscribe.js` y
  `api/chat.js` borrados. `tsc --noEmit` limpio; confirmado que
  `src/app/api/subscribe/route.ts` sigue intacto y es ahora el único
  resolutor de esa ruta; cero referencias colgantes a los archivos borrados
  en todo el repo (grep de `api/subscribe.js`/`api/chat.js`: vacío).
- [ ] `vercel.json`: `framework: nextjs` + `buildCommand: npm run build:next`.
- [ ] PFV-1/PFV-2 — instalación limpia + build limpio equivalente a Vercel.
- [ ] PFV-7 — `NEXT_PUBLIC_SITE_URL` en Vercel (entorno Preview).
- [ ] PFV-4 — push de la rama, Preview Deployment, verificación funcional completa.

**Hallazgo adicional de esta sesión de ejecución:** `origin/main` en GitHub
está detenido en "Fase E" — las Fases F, G, H, I.0, I.1 e I.2 (9 commits)
solo existían en el repositorio local hasta la creación de la rama
`cutover-preflight`. El push de esa rama será la primera vez que ese
trabajo llegue a GitHub — en una rama, no en `main`. No cambia la seguridad
del plan (producción no se toca), pero es relevante: el Preview Deployment
de esta fase será también la primera vez que Vercel construye remotamente
cualquier código posterior a Fase E.

---

## 1. Estado inicial (verificado)

- **Proyecto Vercel:** `joseph-dayan-art` (`prj_TklvwovFPkQivVnNiUmMG35U8xD6`),
  único proyecto conectado a `github.com/jdayand29/joseph-dayan-art`, rama
  `main` (única rama existente en GitHub hasta ahora).
- **Framework Preset:** `Vite`. **Build Command:** `npm run build` (→
  `vite build`). **Output Directory:** default de Vite (`dist/`).
- **`vercel.json`** (raíz del repo, contenido completo):
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "/api/$1" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **`package.json` scripts relevantes:**
  ```json
  "dev": "vite",
  "prebuild": "npm run images:check",
  "build": "vite build",
  "dev:next": "next dev",
  "prebuild:next": "npm run images:check",
  "build:next": "next build"
  ```
- **API routes duplicadas (colisión real, verificada):** `api/subscribe.js`
  (función serverless suelta en la raíz, convención de Vercel, contenido
  funcionalmente idéntico — mismo regex de validación, mismo comportamiento
  de solo-log) coexiste con `src/app/api/subscribe/route.ts` (Next.js App
  Router) — ambas resuelven la URL pública `/api/subscribe`.
  `api/chat.js` (usa `@anthropic-ai/sdk`, catálogo hardcodeado del prototipo
  "ColectArt") no tiene equivalente en Next.js y hoy está inerte: no existe
  `ANTHROPIC_API_KEY` en las variables de entorno del proyecto, y el único
  componente que lo consumía (`ChatWidget`) está comentado en `src/App.jsx`.
- **Variables de entorno configuradas (16, todas "Encrypted", Production +
  Preview + Development):** `POSTGRES_*` (7), `SUPABASE_*` (8),
  `NEXT_PUBLIC_SUPABASE_*` incluidas en esas 8. **`NEXT_PUBLIC_SITE_URL` no
  está configurada.**
- **Dominios:** 0 (`vercel domains ls`). Alias activos hoy:
  `art-marketplace-ruddy.vercel.app` (el más antiguo, 12 días),
  `joseph-dayan-art-josephd.vercel.app`,
  `joseph-dayan-art-git-main-josephd.vercel.app`.
- **Bug de metadata ya presente (independiente del cutover, pero relevante
  para él):** `config/site.ts` usa como fallback
  `https://joseph-dayan-art.vercel.app` — un alias que **no existe** en la
  lista real de arriba. Esto afecta `metadataBase` (`layout.tsx`) y por lo
  tanto las URLs absolutas de Open Graph.
- **Bug de favicon: corregido en `cutover-preflight`** (ver arriba). Antes
  de la corrección: `public/favicon.svg` existía y respondía `200`, pero
  `src/app/layout.tsx` no definía ningún campo `metadata.icons` ni existía
  `src/app/icon.*` — no había ningún `<link rel="icon">` en el HTML
  generado.
- **Paridad de entorno Node.js verificada:** local `node --version` →
  `v24.18.0`; Vercel reporta "Node.js Version: 24.x" — coinciden.
- **Lo que sirve hoy en producción:** confirmado por `curl` — el shell HTML
  de Vite, que monta `src/App.jsx` (prototipo "Artora": `RoleGate`,
  `/explorar`, `/subastas`, `/carrito`, etc.), no ninguna ruta de `src/app/`.
- **Next.js (`next build`) ya está verificado limpio** en cada una de las
  últimas 6 fases del Sistema de Diseño (I.0-I.2 incluidas), siempre sobre
  un `node_modules` incremental de macOS — la instalación limpia equivalente
  a la de Vercel es PFV-1/PFV-2, todavía pendiente.

---

## 2. Estado final esperado (de este Preview Deployment)

- El proyecto Vercel `joseph-dayan-art` recibe, en una rama `cutover-preflight`
  (no `main`), un Preview Deployment sirviendo el build de Next.js completo.
- Ese Preview Deployment muestra: favicon correcto, sin colisión de
  `/api/subscribe`, metadata/OG correctos, imágenes optimizadas
  funcionando, lightbox funcional en un build de producción real (no
  `next dev`), navegación completa, cero errores de consola/build.
- **Producción no se toca en ningún momento de esta fase** — el alias de
  producción sigue sirviendo Vite/Artora hasta que se apruebe explícitamente
  un cutover posterior (fuera del alcance de esta fase).
- El proyecto Vite y el código legacy siguen existiendo en el repo — sin
  cambios, sin relación con esta fase.

---

## 3. Lista completa de cambios (alcance de esta fase — rama `cutover-preflight`)

| Área | Cambio | Estado |
|---|---|---|
| `src/app/layout.tsx` | `icons: { icon: '/favicon.svg' }` | ✅ Hecho, commiteado en `cutover-preflight` |
| `api/subscribe.js`, `api/chat.js` | Borrados (colisión con `src/app/api/subscribe/route.ts`; `chat.js` inerte) | Pendiente |
| `vercel.json` | `"framework": "nextjs"`, `"buildCommand": "npm run build:next"`, sin `rewrites` | Pendiente |
| Instalación/build | `rm -rf node_modules && npm ci` + `npm run build:next` limpio | Pendiente |
| Vercel env vars | `NEXT_PUBLIC_SITE_URL` en entorno **Preview** (no Production todavía) | Pendiente |
| Vercel (Git) | Push de `cutover-preflight` → Preview Deployment automático | Pendiente |
| Validación funcional | Favicon, metadata, imágenes, API, Lightbox, navegación, consola, build — todo contra el Preview Deployment | Pendiente |

**Fuera de alcance de esta fase (explícito, por instrucción directa):**
cualquier cambio a `main`, cualquier cambio al alias de producción, cambiar
el Framework Preset del proyecto vía dashboard de Vercel (se prueba primero
en Preview, vía `vercel.json`), el cutover definitivo en sí.

---

## 4. Bloques de ejecución (implementar → verificar → documentar → commit)

Cada bloque se completa y valida antes de continuar al siguiente.

### Bloque 1 — Favicon ✅ Completo

- **Implementado:** `metadata.icons: { icon: '/favicon.svg' }` en
  `src/app/layout.tsx`.
- **Verificado:** `npx tsc --noEmit` limpio; build de producción local
  (`next build` + `next start`, puerto efímero) — el HTML servido en `/`
  contiene `<link rel="icon" href="/favicon.svg">`, confirmado con `curl` +
  grep contra el HTML real.
- **Documentado:** esta sección + apartado de progreso arriba.
- **Commit:** `8c7c355`.

### Bloque 2 — Colisión de `/api/subscribe` ✅ Completo

- **Implementado:** borrados `api/subscribe.js` y `api/chat.js`.
- **Verificado:** `tsc --noEmit` limpio; `src/app/api/subscribe/route.ts`
  confirmado intacto (único resolutor de `/api/subscribe` de aquí en
  adelante); `grep` de `api/subscribe.js`/`api/chat.js` en todo el repo
  (excluyendo `node_modules`/`.git`) sin resultados — sin referencias
  colgantes.
- **Documentado:** esta sección + apartado de progreso arriba.
- **Commit:** siguiente en este mismo turno.

### Bloque 3 — `vercel.json`

- **A implementar:** reemplazar el archivo completo:
  ```json
  {
    "framework": "nextjs",
    "buildCommand": "npm run build:next"
  }
  ```
- **A verificar:** JSON válido; `tsc --noEmit` limpio (no afecta TS, pero se
  corre igual como red de seguridad).

### Bloque 4 — Instalación y build limpios (PFV-1/PFV-2)

- **A implementar:** nada de código — solo ejecución: `rm -rf node_modules
  && npm ci`, luego `npm run build:next`.
- **A verificar:** instalación sin errores; build termina en verde,
  incluyendo `images:check` (`prebuild:next`) sin advertencias de `sharp`.

### Bloque 5 — `NEXT_PUBLIC_SITE_URL` en Vercel (Preview)

- **A implementar:** agregar la variable en Vercel, **entorno Preview
  únicamente** en este bloque (Production se deja para el cutover real,
  fuera de alcance aquí).
- **A verificar:** `vercel env ls` muestra la variable con Preview marcado.

### Bloque 6 — Push y Preview Deployment

- **A implementar:** `git push origin cutover-preflight`.
- **A verificar:** Vercel genera un Preview Deployment; monitorear el log de
  build hasta `Ready`; confirmar en el log: Framework reconocido como
  Next.js, comando de build ejecutado (`npm run build:next`), `images:check`
  exitoso.

### Bloque 7 — Validación funcional completa contra el Preview

- **A verificar (checklist obligatoria del pedido original):** instalación
  limpia ✓ (Bloque 4), build limpio ✓ (Bloque 4), TypeScript limpio ✓ (cada
  bloque), sitio funcionando en Preview, favicon correcto ✓ (Bloque 1),
  metadata correcta, imágenes funcionando, API funcionando (`/api/subscribe`
  responde desde Next.js, no desde el archivo borrado), Lightbox funcionando
  en producción real (Preview, no `next dev`), navegación completa, cero
  errores de consola, cero errores de build.

---

## 5. Plan de rollback (sin cambios de fondo)

Esta fase no promueve nada a producción, por lo que el "rollback" aquí es
trivial: si el Preview Deployment falla o algo no valida, se corrige en la
misma rama `cutover-preflight` y se reintenta — producción nunca estuvo en
riesgo. El plan de rollback de dos niveles (operativo inmediato vía `vercel
rollback`, y de código vía `git revert`) sigue reservado para el cutover
real a `main`, documentado en la versión previa de este archivo y sin
cambios: reasignación de alias para el nivel 1, `git revert` del commit de
cutover para el nivel 2.

---

## 6. Checklists

### Checklist de esta fase (Preview, no producción)

- [x] Favicon corregido y verificado (Bloque 1).
- [ ] `api/subscribe.js`/`api/chat.js` borrados (Bloque 2).
- [ ] `vercel.json` actualizado (Bloque 3).
- [ ] Instalación + build limpios verificados (Bloque 4).
- [ ] `NEXT_PUBLIC_SITE_URL` en Preview (Bloque 5).
- [ ] Rama pusheada, Preview Deployment `Ready` (Bloque 6).
- [ ] Validación funcional completa contra el Preview (Bloque 7): metadata,
      imágenes, API, Lightbox, navegación, consola, build — todo en verde.

### Checklist que queda para una fase posterior (cutover real a producción — NO parte de esta fase)

- [ ] `NEXT_PUBLIC_SITE_URL` en Production.
- [ ] Replicar los cambios de esta rama en `main`.
- [ ] Commit + push a `main`.
- [ ] Monitorear build de Production.
- [ ] Verificar los 3 alias de producción.
- [ ] Aprobación explícita del usuario antes de cualquiera de estos pasos.

---

## 7. Riesgos (de esta fase — Preview únicamente)

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| `images:check` falla en Linux por `sharp` | Media hasta que se pruebe (Bloque 4/6) | Bajo — solo afecta al Preview, no a producción | Se descubre y corrige en esta misma rama, sin ningún riesgo para el sitio real |
| Vercel no reconoce el output de Next.js con `buildCommand` envuelto en un script npm | Baja, pero no probada hasta el Bloque 6 | Bajo — mismo motivo | Ídem |
| El Preview Deployment expone datos o comportamiento inesperado | Baja | Bajo — los Preview Deployments de Vercel no son públicos por defecto de la misma forma que producción (requieren la URL específica, no un alias conocido) | Verificación funcional completa antes de considerar la fase cerrada |

---

## 8. Tiempo estimado (de esta fase)

- Bloques 1-5 (implementación + verificación local): ya iniciados, estimado
  20-30 minutos en total.
- Bloque 6 (push + build remoto): 2-5 minutos de espera por el build de
  Vercel.
- Bloque 7 (validación funcional): 15-20 minutos con Playwright/`curl`
  contra el Preview.
- **Sin downtime posible en esta fase** — no se toca producción en ningún
  bloque.

---

## 9. Validación final de esta fase

Cuando los 7 bloques estén completos y en verde, esta fase (Preview
Deployment funcional) queda cerrada. El cutover real a producción **no se
ejecuta** hasta una aprobación explícita separada, con su propio documento
de progreso si corresponde — no se reabre este archivo para eso sin
instrucción directa.
