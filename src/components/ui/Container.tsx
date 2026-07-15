import type { ReactNode } from 'react'
import clsx from 'clsx'

interface ContainerProps {
  children: ReactNode
  /** `content` (1152px, texto/grids) es el default; `page` (1440px) es para
   * bloques de ancho completo (hero, futuras franjas de colección) — ver
   * src/styles/tokens/layout.ts. */
  width?: 'content' | 'page'
  className?: string
  as?: 'div' | 'main' | 'section'
}

export default function Container({ children, width = 'content', className, as: As = 'div' }: ContainerProps) {
  return (
    <As className={clsx('mx-auto px-6', width === 'content' ? 'max-w-6xl' : 'max-w-page', className)}>
      {children}
    </As>
  )
}
