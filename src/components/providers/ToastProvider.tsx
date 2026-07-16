'use client'

import { createContext, useCallback, useState, type ReactNode } from 'react'
import { ToastPrimitiveProvider, ToastViewport, Toast } from '@/components/ui/Toast'

interface ToastMessage {
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (message: ToastMessage) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

// Provider real (estado + orquestación) sobre los primitivos presentacionales
// de ui/Toast.tsx — se monta una sola vez en la raíz de la app el día que el
// primer consumidor real lo necesite (Fase J: SubscribeForm/ContactForm).
//
// Patrón oficial de Radix (no un array de instancias montadas/desmontadas
// dinámicamente vía .map): un único Toast.Root permanece siempre montado,
// solo se alterna su prop `open` — confirmado con el mantenedor de Radix
// (github.com/radix-ui/primitives, discusión #2907). Un segundo toast
// mientras el primero sigue visible reemplaza su contenido, no apila varios
// — suficiente para los casos reales de este sitio (confirmación de envío,
// error de formulario), nunca notificaciones simultáneas múltiples.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<ToastMessage>({ title: '' })

  const toast = useCallback((next: ToastMessage) => {
    setMessage(next)
    setOpen(true)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitiveProvider swipeDirection="right">
        {children}
        <Toast open={open} onOpenChange={setOpen} title={message.title} description={message.description} />
        <ToastViewport />
      </ToastPrimitiveProvider>
    </ToastContext.Provider>
  )
}
