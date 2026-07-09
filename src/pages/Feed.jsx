import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../store/AppState'
import { artStyles } from '../data/styles'
import { artists } from '../data/mockData'
import ArtworkCard from '../components/ArtworkCard'
import SubscribeForm from '../components/SubscribeForm'

export default function Feed() {
  const { artworks, auctions } = useAppState()
  const [activeStyle, setActiveStyle] = useState('Todos')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('recientes')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const styleOptions = useMemo(() => ['Todos', ...artStyles], [])
  const countries = useMemo(() => new Set(artists.map((a) => a.country)).size, [])
  const featuredArtists = useMemo(() => artists.slice(0, 5), [])

  function effectivePrice(artwork) {
    if (artwork.type === 'sale') return artwork.price
    const auction = auctions.find((a) => a.id === artwork.auctionId)
    return auction ? auction.currentBid : 0
  }

  function isAvailable(artwork) {
    if (artwork.type === 'sale') return !artwork.sold
    const auction = auctions.find((a) => a.id === artwork.auctionId)
    return auction ? auction.endTime - Date.now() > 0 : false
  }

  const filtered = useMemo(() => {
    let result = artworks

    if (activeStyle !== 'Todos') {
      result = result.filter((w) => w.style === activeStyle)
    }
    if (minPrice !== '') {
      result = result.filter((w) => effectivePrice(w) >= Number(minPrice))
    }
    if (maxPrice !== '') {
      result = result.filter((w) => effectivePrice(w) <= Number(maxPrice))
    }
    if (onlyAvailable) {
      result = result.filter((w) => isAvailable(w))
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'precio-asc') return effectivePrice(a) - effectivePrice(b)
      if (sortBy === 'precio-desc') return effectivePrice(b) - effectivePrice(a)
      if (sortBy === 'populares') return b.likes - a.likes
      return b.year - a.year // recientes
    })

    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworks, auctions, activeStyle, minPrice, maxPrice, onlyAvailable, sortBy])

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
          Descubre y compra arte original directo del artista
        </h1>
        <p className="mt-2 max-w-2xl text-ink/60">
          A precio fijo o en subasta, directo del artista — sin intermediarios. Empezamos en Panamá y crecemos cada
          semana con más artistas del mundo.
        </p>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-ink/60">
          <span>
            <strong className="text-ink">{artists.length}</strong> artistas
          </span>
          <span>
            <strong className="text-ink">{countries}</strong> países
          </span>
          <span>
            <strong className="text-ink">{artworks.length}</strong> obras publicadas
          </span>
        </div>
      </div>

      {/* Artistas destacados */}
      <div className="mb-12">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Artistas destacados</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {featuredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/perfil/${artist.id}`}
              className="flex w-40 shrink-0 flex-col items-center rounded-3xl bg-white p-5 text-center shadow-card hover:shadow-card-hover"
            >
              <img src={artist.avatar} alt={artist.name} className="mb-2 h-16 w-16 rounded-full object-cover" />
              <p className="text-sm font-semibold leading-tight">{artist.name}</p>
              <p className="text-xs text-ink/50">
                {artist.flag} {artist.country}
              </p>
              <p className="mt-1 text-xs text-ink/40">{artist.specialties?.[0]}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="mb-16 rounded-3xl bg-white p-8 shadow-card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Cómo funciona</h2>
        <ol className="grid gap-4 text-sm sm:grid-cols-3">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              1
            </span>
            <span>
              <strong>Descubre</strong> obras por estilo, artista o ciudad.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              2
            </span>
            <span>
              <strong>Compra directo o puja</strong> — cada artista elige cómo vender cada obra.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
              3
            </span>
            <span>
              <strong>Recíbela en casa</strong>, con envío asegurado desde el país del artista.
            </span>
          </li>
        </ol>
      </div>

      {/* Filtro de estilo */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {styleOptions.map((style) => (
          <button
            key={style}
            onClick={() => setActiveStyle(style)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeStyle === style
                ? 'border-accent bg-accent text-white'
                : 'border-ink/15 text-ink/70 hover:border-accent/40'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Presupuesto, orden y disponibilidad */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-ink/50">Presupuesto</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Mín"
            className="w-20 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent/50"
          />
          <span className="text-ink/30">–</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Máx"
            className="w-20 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent/50"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent/50"
        >
          <option value="recientes">Más recientes</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="populares">Más populares</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 accent-accent"
          />
          Solo disponibles
        </label>

        {(minPrice !== '' || maxPrice !== '' || onlyAvailable || sortBy !== 'recientes') && (
          <button
            onClick={() => {
              setMinPrice('')
              setMaxPrice('')
              setOnlyAvailable(false)
              setSortBy('recientes')
            }}
            className="text-xs text-ink/40 underline hover:text-ink"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink/50">
          No hay obras que coincidan con estos filtros. Prueba ampliando el presupuesto o quitando algún filtro.
        </p>
      ) : (
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}

      <div className="mt-16">
        <SubscribeForm />
      </div>
    </div>
  )
}
