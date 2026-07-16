'use client'

import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastPrimitiveProvider, ToastViewport, Toast } from '@/components/ui/Toast'

interface ToastMessage {
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (message: ToastMessage) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastEntry extends ToastMessage {
  id: number
}

let nextId = 0

// Provider real (estado + orquestación) sobre los primitivos presentacionales
// de ui/Toast.tsx — se monta una sola vez en la raíz de la app el día que el
// primer consumidor real lo necesite (Fase J: SubscribeForm/ContactForm).
//
// Cada toast es una instancia propia de Toast.Root, montada/desmontada vía
// `.map()` sobre un array de mensajes (mismo patrón que shadcn/ui) — soporta
// varios toasts simultáneos apilados en el viewport. Un patrón anterior de
// instancia única fue reemplazado por este tras comprobar en una auditoría
// que el bug que lo motivó no era reproducible con el patrón array-based
// (ver ARCHITECTURE.md, sección "Toast Pattern").
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const toast = useCallback((message: ToastMessage) => {
    const id = nextId++
    setToasts((prev) => [...prev, { ...message, id }])
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Memoizado: sin esto, cada cambio de `toasts` (agregar/quitar un toast)
  // crea un objeto `value` nuevo y fuerza a re-renderizar a todo consumidor
  // de useToast(), aunque `toast` en sí no haya cambiado.
  const contextValue = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastPrimitiveProvider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            defaultOpen
            title={t.title}
            description={t.description}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id)
            }}
          />
        ))}
        <ToastViewport />
      </ToastPrimitiveProvider>
    </ToastContext.Provider>
  )
}
