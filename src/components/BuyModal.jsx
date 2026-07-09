import { useState } from 'react'

export default function BuyModal({ artwork, onClose, onConfirm }) {
  const [step, setStep] = useState('resumen') // resumen -> pago -> confirmado

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-canvas p-6 shadow-xl">
        {step === 'resumen' && (
          <>
            <h2 className="font-serif text-xl font-semibold mb-4">Confirmar compra</h2>
            <div className="flex items-center gap-3 mb-4">
              <img src={artwork.image} alt={artwork.title} className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{artwork.title}</p>
                <p className="text-sm text-ink/50">{artwork.medium}</p>
              </div>
            </div>
            <div className="mb-6 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Precio de la obra</span>
                <span>${artwork.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Envío asegurado</span>
                <span>$45</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-ink/10 pt-1 mt-1">
                <span>Total</span>
                <span>${(artwork.price + 45).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 rounded-full border border-ink/20 py-2 text-sm font-medium">
                Cancelar
              </button>
              <button
                onClick={() => setStep('pago')}
                className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {step === 'pago' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep('confirmado')
            }}
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Datos de pago (simulado)</h2>
            <div className="space-y-3 mb-6">
              <input
                required
                placeholder="Número de tarjeta"
                defaultValue="4242 4242 4242 4242"
                className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm"
              />
              <div className="flex gap-3">
                <input
                  required
                  placeholder="MM/AA"
                  defaultValue="12/29"
                  className="w-1/2 rounded-lg border border-ink/15 px-3 py-2 text-sm"
                />
                <input
                  required
                  placeholder="CVC"
                  defaultValue="123"
                  className="w-1/2 rounded-lg border border-ink/15 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('resumen')}
                className="flex-1 rounded-full border border-ink/20 py-2 text-sm font-medium"
              >
                Atrás
              </button>
              <button type="submit" className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark">
                Pagar ${(artwork.price + 45).toLocaleString()}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-ink/40">
              Este es un prototipo — no se realiza ningún cargo real.
            </p>
          </form>
        )}

        {step === 'confirmado' && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>
            <h2 className="font-serif text-xl font-semibold mb-2">¡Compra confirmada!</h2>
            <p className="text-sm text-ink/60 mb-6">
              "{artwork.title}" es tuya. El artista recibirá tu pedido y coordinará el envío.
            </p>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="w-full rounded-full bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Volver a la obra
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
