import NextLink, { type LinkProps } from 'next/link'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

interface UiLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  underline?: boolean
}

// Wrapper de next/link con foco/hover consistentes — para links de texto
// simples (ej. "Ver toda la obra →"). Para un link con apariencia de botón
// (ej. "Adquirir esta obra"), usar next/link + buttonVariants() de Button.tsx.
export default function Link({ children, className, underline = true, ...props }: UiLinkProps) {
  return (
    <NextLink
      className={clsx(
        'text-sm font-medium text-ink',
        underline && 'underline-offset-2 hover:underline',
        focusRingClassName,
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  )
}
