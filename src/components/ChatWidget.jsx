import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const LINK_REGEX = /\/(obra|perfil|galeria)\/[a-zA-Z0-9-]+/g

function renderWithLinks(text) {
  const parts = []
  let lastIndex = 0
  let match

  while ((match = LINK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <Link key={match.index} to={match[0]} className="font-semibold underline text-ink">
        {match[0]}
      </Link>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

const WELCOME = {
  role: 'assistant',
  content:
    '¡Hola! Soy el asistente de ColectArt. Cuéntame tu presupuesto, el estilo que te gusta o la ciudad que te interesa, y te ayudo a encontrar obras, artistas o galerías.',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error desconocido')
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message || 'No se pudo contactar al asistente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-lg hover:bg-ink/90"
        aria-label="Abrir asistente de ColectArt"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-2xl">
          <div className="border-b border-ink/10 bg-white px-4 py-3">
            <p className="font-serif text-base font-semibold">Asistente ColectArt</p>
            <p className="text-xs text-ink/50">Te ayudo a encontrar arte según tu gusto y presupuesto</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === 'user' ? 'ml-auto bg-ink text-canvas' : 'bg-white text-ink border border-ink/10'
                }`}
              >
                {m.role === 'assistant' ? (
                  <span className="whitespace-pre-wrap">{renderWithLinks(m.content)}</span>
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            ))}
            {loading && <div className="text-xs text-ink/40">Pensando...</div>}
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-ink/10 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej. busco algo abstracto bajo $800"
              className="flex-1 rounded-full border border-ink/15 px-3 py-2 text-sm outline-none focus:border-ink/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-canvas disabled:opacity-50"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  )
}
