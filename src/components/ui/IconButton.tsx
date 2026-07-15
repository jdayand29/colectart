import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obligatorio: un botón de solo-ícono sin aria-label es invisible para
   * lectores de pantalla — no hay texto que lo describa. */
  'aria-label': string
  variant?: 'dark' | 'light'
}

const variantClass = {
  dark: 'bg-ink/5 text-ink hover:bg-ink/10',
  light: 'bg-white/10 text-white hover:bg-white/20',
} as const

export default function IconButton({ variant = 'dark', className, ...props }: IconButtonProps) {
  return (
    <button
      className={clsx(
        // 44px mínimo de área de toque (regla de accesibilidad táctil), aunque
        // el ícono visual sea más pequeño.
        'flex h-11 w-11 items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantClass[variant],
        focusRingClassName,
        className,
      )}
      {...props}
    />
  )
}
