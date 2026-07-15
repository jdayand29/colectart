'use client'

import { useState } from 'react'
import { useSubmitStatus } from '@/hooks/useSubmitStatus'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { status, run } = useSubmitStatus()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await run(async () => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setName('')
        setEmail('')
        setMessage('')
      }
      return res.ok
    })
  }

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-accent-light/60 p-8 text-center">
        <p className="font-serif text-xl font-medium">Mensaje enviado ✓</p>
        <p className="mt-1 text-sm text-ink/60">Gracias por escribir — responderé lo antes posible.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent/50"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent/50"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tu mensaje"
        rows={4}
        className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent/50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-50"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
      </button>
      {status === 'error' && <p className="text-xs text-red-600">Algo falló, intenta de nuevo.</p>}
    </form>
  )
}
