import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getArtist } from '../data/mockData'
import { useAppState } from '../store/AppState'
import CartCheckoutModal from '../components/CartCheckoutModal'

const SHIPPING_PER_ITEM = 45

export default function Carrito() {
  const { artworks, cart, removeFromCart, checkoutCart } = useAppState()
  const [showCheckout, setShowCheckout] = useState(false)
  const [justPurchased, setJustPurchased] = useState(false)

  const items = artworks.filter((w) => cart.has(w.id))
  const subtotal = items.reduce((sum, w) => sum + w.price, 0)
  const shipping = items.length * SHIPPING_PER_ITEM
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-semibold mb-2">
          {justPurchased ? '¡Gracias por tu compra!' : 'Tu carrito está vacío'}
        </h1>
        <p className="text-ink/60 mb-6">
          {justPurchased
            ? 'Puedes seguir explorando arte de artistas de todo el mundo.'
            : 'Agrega obras desde el feed o el perfil de un artista para comprarlas todas juntas.'}
        </p>
        <Link to="/" className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
          Ir al feed
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold mb-2">Tu carrito</h1>
      <p className="text-ink/60 mb-6">
        Compra varias obras de distintos artistas en un solo pago.
      </p>

      <div className="mb-6 space-y-3">
        {items.map((artwork) => {
          const artist = getArtist(artwork.artistId)
          return (
            <div key={artwork.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
              <Link to={`/obra/${artwork.id}`}>
                <img src={artwork.image} alt={artwork.title} className="h-16 w-16 rounded-lg object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/obra/${artwork.id}`} className="font-medium">
                  {artwork.title}
                </Link>
                <p className="text-xs text-ink/50">
                  {artist.name} {artist.flag} · {artwork.medium}
                </p>
              </div>
              <span className="font-semibold">${artwork.price.toLocaleString()}</span>
              <button
                onClick={() => removeFromCart(artwork.id)}
                className="text-xs text-ink/40 hover:text-red-600"
                aria-label="Quitar del carrito"
              >
                Quitar
              </button>
            </div>
          )
        })}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="mb-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Subtotal ({items.length} obra{items.length > 1 ? 's' : ''})</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Envío asegurado</span>
            <span>${shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-ink/10 pt-1 mt-1">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Finalizar compra
        </button>
      </div>

      {showCheckout && (
        <CartCheckoutModal
          items={items}
          onClose={() => setShowCheckout(false)}
          onConfirm={() => {
            checkoutCart()
            setJustPurchased(true)
          }}
        />
      )}
    </div>
  )
}
