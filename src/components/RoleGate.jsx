import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../store/AppState'

const STEPS = [
  {
    title: 'Crea tu cuenta',
    body: 'Solo necesitas tu nombre y correo. No hay contraseñas complicadas — este es un prototipo, así que "crear cuenta" es instantáneo.',
    icon: '👤',
  },
  {
    title: 'Sube una foto de tu obra',
    body: 'Toma una foto clara del cuadro, sin marcos ni reflejos, y súbela desde el formulario de "Publicar obra".',
    icon: '📷',
  },
  {
    title: 'Completa la ficha técnica',
    body: 'Título, técnica (óleo, acrílico, acuarela...), tamaño, año y estilo. Así los compradores encuentran tu obra al filtrar.',
    icon: '🖌️',
  },
  {
    title: 'Elige cómo venderla y publica',
    body: 'Precio fijo o subasta — tú decides. Al publicar, tu obra aparece de inmediato en el feed global para todo el mundo.',
    icon: '🚀',
  },
]

const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Google', icon: '🔴' },
  { id: 'facebook', label: 'Facebook', icon: '🔵' },
  { id: 'yahoo', label: 'Yahoo', icon: '🟣' },
]

export default function RoleGate() {
  const { setRole } = useAppState()
  const navigate = useNavigate()
  const [mode, setMode] = useState('choosing') // choosing | onboarding | account
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [connecting, setConnecting] = useState(null)

  function chooseCollector() {
    setRole('coleccionista')
  }

  function chooseArtist() {
    setMode('onboarding')
  }

  function finishOnboarding() {
    setMode('account')
  }

  function createAccount(e) {
    e.preventDefault()
    setRole('artista')
    navigate('/publicar')
  }

  function connectWithProvider(provider) {
    setConnecting(provider.id)
    setTimeout(() => {
      setRole('artista')
      navigate('/publicar')
    }, 700)
  }

  function skipForNow() {
    setRole('coleccionista')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas px-4">
      {mode === 'choosing' && (
        <div className="w-full max-w-2xl text-center">
          <p className="mb-2 font-serif text-2xl italic text-accent">ColectArt</p>
          <h1 className="mb-3 font-serif text-3xl font-medium sm:text-4xl">¿Cómo quieres entrar?</h1>
          <p className="mb-10 text-ink/50">Puedes cambiar de modo cuando quieras desde el menú.</p>

          <div className="grid gap-6 sm:grid-cols-2">
            <button
              onClick={chooseArtist}
              className="group rounded-2xl bg-white p-8 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="text-3xl">🎨</span>
              <h2 className="mt-4 font-serif text-xl font-medium">Soy artista</h2>
              <p className="mt-2 text-sm text-ink/50">
                Crea tu cuenta y publica tus obras para que coleccionistas de todo el mundo las encuentren.
              </p>
              <span className="mt-4 inline-block text-sm text-accent group-hover:underline">Empezar →</span>
            </button>

            <button
              onClick={chooseCollector}
              className="group rounded-2xl bg-white p-8 text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="text-3xl">🖼️</span>
              <h2 className="mt-4 font-serif text-xl font-medium">Soy coleccionista</h2>
              <p className="mt-2 text-sm text-ink/50">
                Explora obras de artistas y galerías del mundo, compra directo o participa en subastas.
              </p>
              <span className="mt-4 inline-block text-sm text-accent group-hover:underline">Explorar →</span>
            </button>
          </div>
        </div>
      )}

      {mode === 'onboarding' && (
        <div className="w-full max-w-md text-center">
          <p className="mb-8 text-xs font-medium uppercase tracking-wide text-ink/40">
            Paso {step + 1} de {STEPS.length}
          </p>

          <span className="text-4xl">{STEPS[step].icon}</span>
          <h2 className="mt-4 font-serif text-2xl font-medium">{STEPS[step].title}</h2>
          <p className="mt-3 text-ink/60">{STEPS[step].body}</p>

          <div className="mt-8 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 w-6 rounded-full ${i === step ? 'bg-accent' : 'bg-ink/10'}`} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => setMode('choosing')} className="text-sm text-ink/40 hover:text-ink">
              Volver
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={finishOnboarding}
                className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Crear mi cuenta
              </button>
            )}
          </div>
        </div>
      )}

      {mode === 'account' && (
        <div className="w-full max-w-sm">
          <h2 className="mb-1 text-center font-serif text-2xl font-medium">Crea tu cuenta de artista</h2>
          <p className="mb-8 text-center text-sm text-ink/50">Es instantáneo — este es un prototipo.</p>

          <div className="space-y-2">
            {SOCIAL_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => connectWithProvider(provider)}
                disabled={connecting !== null}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white py-2.5 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
              >
                <span>{provider.icon}</span>
                {connecting === provider.id ? 'Conectando...' : `Continuar con ${provider.label}`}
              </button>
            ))}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-ink/30">
            <span className="h-px flex-1 bg-ink/10" />
            o con tu correo
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <form onSubmit={createAccount} className="space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              className="w-full rounded-lg border border-ink/15 px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Crear cuenta y publicar mi primera obra
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={skipForNow} className="text-sm text-ink/40 hover:text-ink">
              Ahora no, quiero explorar la página primero
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
