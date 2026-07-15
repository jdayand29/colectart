import type { ReactNode } from 'react'
import clsx from 'clsx'

interface SectionProps {
  children: ReactNode
  /** Espaciado vertical estandarizado (src/styles/tokens/spacing.ts) — `lg`
   * usa el paso editorial grande (112px) para separar bloques tipo Home. */
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

const spacingClass = {
  sm: 'py-8',
  md: 'py-14',
  lg: 'py-28-editorial',
} as const

export default function Section({ children, spacing = 'md', className }: SectionProps) {
  return <section className={clsx(spacingClass[spacing], className)}>{children}</section>
}
