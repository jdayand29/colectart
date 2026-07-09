import { Link } from 'react-router-dom'
import { getArtist } from '../data/mockData'
import { useAppState } from '../store/AppState'
import CountdownTimer from './CountdownTimer'

export default function ArtworkCard({ artwork }) {
  const { liked, toggleLike, auctions, cart, addToCart, removeFromCart } = useAppState()
  const artist = getArtist(artwork.artistId)
  const isLiked = liked.has(artwork.id)
  const inCart = cart.has(artwork.id)
  const auction = artwork.type === 'auction' ? auctions.find((a) => a.id === artwork.auctionId) : null

  return (
    <div className="mb-10 break-inside-avoid">
      <Link to={`/obra/${artwork.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {artwork.type === 'auction' && auction && (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white">
              Subasta · <CountdownTimer endTime={auction.endTime} />
            </span>
          )}
          {artwork.sold && (
            <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink">
              Vendida
            </span>
          )}

          {/* Artista y precio: solo se revelan al pasar el mouse, para que la imagen domine */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-1.5">
              <img src={artist.avatar} alt={artist.name} className="h-5 w-5 rounded-full object-cover" />
              <span className="text-xs text-white/90">{artist.name}</span>
              <span className="text-xs">{artist.flag}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">
              {artwork.type === 'sale' ? `$${artwork.price.toLocaleString()}` : `Puja: $${auction?.currentBid.toLocaleString()}`}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <Link to={`/obra/${artwork.id}`}>
          <h3 className="font-serif text-lg font-medium leading-snug">{artwork.title}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-ink/40">{artwork.style}</p>

        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleLike(artwork.id)
            }}
            className="flex items-center gap-1 text-sm"
            aria-label="Me gusta"
          >
            <span className={isLiked ? 'text-ink' : 'text-ink/30'}>{isLiked ? '♥' : '♡'}</span>
            <span className="text-xs text-ink/40">{artwork.likes + (isLiked ? 1 : 0)}</span>
          </button>

          {artwork.type === 'sale' && !artwork.sold && (
            <button
              onClick={(e) => {
                e.preventDefault()
                inCart ? removeFromCart(artwork.id) : addToCart(artwork.id)
              }}
              className={`text-xs underline-offset-2 hover:underline ${inCart ? 'text-ink' : 'text-ink/40'}`}
            >
              {inCart ? 'En el carrito ✓' : '+ Carrito'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
