// Nombra lo que hoy son clases sueltas (rounded-xl/2xl/3xl/full) repetidas
// sin criterio consistente entre componentes.
export const radius = {
  card: '1.5rem', // rounded-3xl
  image: '0.75rem', // rounded-xl
  field: '1rem', // rounded-2xl — textarea multilínea (Input de una línea usa `pill`)
  pill: '9999px', // rounded-full (botones, badges, inputs)
} as const
