'use client'

import * as RadixToast from '@radix-ui/react-toast'
import type { ComponentProps } from 'react'
import clsx from 'clsx'
import { focusRingClassName } from '@/styles/tokens/focus'

export const ToastPrimitiveProvider = RadixToast.Provider

export function ToastViewport({ className, ...props }: ComponentProps<typeof RadixToast.Viewport>) {
  return (
    <RadixToast.Viewport
      className={clsx('fixed bottom-6 right-6 z-toast flex w-full max-w-sm flex-col gap-2 outline-none', className)}
      {...props}
    />
  )
}

interface ToastRootProps extends ComponentProps<typeof RadixToast.Root> {
  title: string
  description?: string
}

export function Toast({ title, description, className, ...props }: ToastRootProps) {
  return (
    <RadixToast.Root
      className={clsx('relative rounded-card bg-white p-4 pr-12 shadow-elevated', className)}
      {...props}
    >
      <RadixToast.Title className="text-sm font-semibold text-ink">{title}</RadixToast.Title>
      {description && <RadixToast.Description className="mt-1 text-sm text-ink/60">{description}</RadixToast.Description>}
      <RadixToast.Close
        aria-label="Cerrar notificación"
        className={clsx(
          'absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink',
          focusRingClassName,
        )}
      >
        ✕
      </RadixToast.Close>
    </RadixToast.Root>
  )
}
