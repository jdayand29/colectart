'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import IconButton from '@/components/ui/IconButton'

// Reskin completo de @radix-ui/react-dialog con los tokens de Joseph Dayan —
// Radix resuelve foco atrapado/Esc/scroll-lock/ARIA de fábrica, aquí solo se
// define la apariencia. Modal (abajo) es Dialog preconfigurado para
// contenido general; Drawer (deslizante) es la misma base con un preset de
// motion distinto (Fase F).

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger

interface DialogContentProps {
  children: ReactNode
  title: string
  /** Título visualmente oculto pero requerido por Radix para lectores de
   * pantalla — usar cuando el diseño no muestra un <h2> visible. */
  hideTitle?: boolean
  description?: string
  className?: string
}

export function DialogContent({ children, title, hideTitle, description, className }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-overlay bg-ink/50" />
      <RadixDialog.Content
        className={clsx(
          // Transiciones de entrada/salida reales (fade/zoom) son trabajo de
          // la Fase F (motion system, Framer Motion) — por ahora el diálogo
          // aparece/desaparece sin animación, funcionalmente correcto.
          'fixed left-1/2 top-1/2 z-modal w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card bg-white p-6 shadow-elevated outline-none',
          className,
        )}
      >
        <RadixDialog.Title className={clsx('font-serif text-xl font-medium', hideTitle && 'sr-only')}>
          {title}
        </RadixDialog.Title>
        {description && <RadixDialog.Description className="mt-1 text-sm text-ink/60">{description}</RadixDialog.Description>}
        <div className="mt-4">{children}</div>
        <RadixDialog.Close asChild>
          <IconButton aria-label="Cerrar" className="absolute right-3 top-3">
            ✕
          </IconButton>
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

// Alias semántico: mismo Dialog, para cuando el uso es "contenido general"
// (confirmaciones, futuros formularios) en vez de un caso más específico.
export const Modal = Dialog
export const ModalContent = DialogContent
export const ModalTrigger = DialogTrigger
