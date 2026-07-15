/** @type {import('tailwindcss').Config} */
//
// Espejo manual de src/styles/tokens/*.ts — Tailwind carga este archivo con
// require() directo de Node (independiente de Vite/Next), así que no puede
// importar los .ts de tokens sin un loader adicional. Cualquier cambio de
// valor debe hacerse en AMBOS lugares hasta el cutover a Tailwind v4 (donde
// las variables CSS de globals.css pasan a ser la única fuente, vía @theme,
// y este archivo desaparece).
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Antes #0a0a0a/#ffffff puros — ahora los neutros cálidos del
        // Documento Maestro (sección 9). Mismo nombre de clase, tono nuevo.
        ink: '#141210',
        'ink-soft': '#4a4540',
        canvas: '#faf8f5',
        'canvas-alt': '#f1ede6',
        line: '#e4ded4',
        // Nuevo, todavía sin uso: se dosifica en la Fase D/I (Button decide
        // qué reemplaza a `accent` para botones sólidos — gold nunca es un
        // fondo de botón grande, ver src/styles/tokens/color.ts).
        gold: {
          DEFAULT: '#a97e42',
          soft: 'rgba(169, 126, 66, 0.12)',
        },
        // `accent` se mantiene sin tocar: lo consumen todos los componentes
        // actuales para botones sólidos; su reemplazo es una decisión del
        // primitivo Button (Fase D/I), no de esta fase de tokens.
        accent: {
          DEFAULT: '#0a0a0a',
          dark: '#000000',
          light: '#f2f2f2',
        },
      },
      fontFamily: {
        // Mismo patrón de fallback-dentro-de-var() ya establecido (ver nota
        // original): funciona igual en Vite (variable indefinida → usa el
        // fallback) y en Next (next/font define la variable).
        serif: ['var(--font-serif, Fraunces)', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['var(--font-sans, Inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono, "IBM Plex Mono")', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.1' }],
        'display-lg': ['5rem', { lineHeight: '1.05' }],
        label: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      letterSpacing: {
        tight: '-0.02em',
        wide: '0.025em',
        mono: '0.08em',
      },
      spacing: {
        '28-editorial': '7rem',
        '36-editorial': '9rem',
        '48-editorial': '12rem',
      },
      maxWidth: {
        page: '90rem', // 1440px — bloques de ancho completo (hero, futuras franjas de colección)
      },
      borderRadius: {
        card: '1.5rem',
        // Faltaban en este espejo aunque ya existían documentados en
        // src/styles/tokens/radius.ts — Skeleton/Textarea usaban el valor
        // equivalente sin la clase nombrada (auditoría Fase D).
        image: '0.75rem',
        field: '1rem', // radio real ya usado por los textarea del sitio (rounded-2xl)
      },
      boxShadow: {
        card: '0 2px 24px -8px rgba(0, 0, 0, 0.10)',
        'card-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.16)',
        elevated: '0 16px 48px -12px rgba(0, 0, 0, 0.24)',
        // Mismo valor exacto que el shadow-sm nativo de Tailwind que Button
        // usaba sin tokenizar (auditoría Fase D) — cero cambio visual.
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      zIndex: {
        header: '40',
        dropdown: '50',
        overlay: '100',
        modal: '200',
        toast: '300',
      },
      transitionDuration: {
        550: '550ms',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
