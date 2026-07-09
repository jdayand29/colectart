import { Link } from 'react-router-dom'
import { getArtist } from '../data/mockData'
import { useAppState } from '../store/AppState'
import BidPanel from '../components/BidPanel'

export default function Subastas() {
  const { auctions, artworks } = useAppState()

  const sorted = [...auctions].sort((a, b) => a.endTime - b.endTime)

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold mb-2">Subastas en vivo</h1>
      <p className="text-ink/60 mb-8">
        Algunos artistas eligen poner ciertas obras a subasta por tiempo limitado, en vez de precio fijo. Aquí puedes
        pujar en tiempo real desde cualquier parte del mundo. La mayoría de las obras del marketplace se compran
        directo, sin necesidad de subasta.
      </p>

      <div className="space-y-6">
        {sorted.map((auction) => {
          const artwork = artworks.find((w) => w.id === auction.artworkId)
          if (!artwork) return null
          const artist = getArtist(artwork.artistId)

          return (
            <div key={auction.id} className="grid gap-5 rounded-3xl bg-white p-6 shadow-card sm:grid-cols-[160px_1fr_260px]">
              <Link to={`/obra/${artwork.id}`}>
                <img src={artwork.image} alt={artwork.title} className="h-40 w-full rounded-xl object-cover" />
              </Link>

              <div>
                <Link to={`/perfil/${artist.id}`} className="mb-2 flex items-center gap-2">
                  <img src={artist.avatar} alt={artist.name} className="h-6 w-6 rounded-full object-cover" />
                  <span className="text-xs font-medium text-ink/70">{artist.name}</span>
                  <span className="text-xs">{artist.flag}</span>
                </Link>
                <Link to={`/obra/${artwork.id}`}>
                  <h2 className="font-serif text-xl font-semibold mb-1">{artwork.title}</h2>
                </Link>
                <p className="text-sm text-ink/50 mb-2">{artwork.medium}</p>
                <p className="text-xs text-ink/40">Precio inicial: ${auction.startPrice.toLocaleString()}</p>
              </div>

              <BidPanel auction={auction} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
