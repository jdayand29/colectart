import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'

interface ButtonVariantOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
}

const variantClass: Record<ButtonVariant, string> = {
  // `accent` (no `gold`) a propósito: qué reemplaza a accent para botones
  // sólidos es una decisión de la Fase I, no de este primitivo (ver
  // src/styles/tokens/color.ts). Este primitivo solo consume lo que ya existe.
  solid: 'bg-accent text-white hover:bg-accent-dark disabled:hover:bg-accent',
  outline: 'border border-ink/20 text-ink hover:bg-ink/5 disabled:hover:bg-transparent',
  ghost: 'text-ink/70 hover:bg-accent-light/60 disabled:hover:bg-transparent',
}

/**
 * Genera la clase de un botón sin necesitar el componente <Button> — para
 * aplicar el mismo look a un next/link que navega mas visualmente es un botón
 * (ej. "Adquirir esta obra"). Evita duplicar las clases de variante/tamaño.
 */
export function buttonVariants({ variant = 'solid', size = 'md', className }: ButtonVariantOptions = {}) {
  return clsx(
    'inline-flex items-center justify-center rounded-full font-semibold shadow-subtle transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClass[size],
    variantClass[variant],
    focusRingClassName,
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export default function Button({ variant = 'solid', size = 'md', className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    />
  )
}
