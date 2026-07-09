import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { artists, galleries, museums, getArtistsByGallery } from '../data/mockData'
import { useAppState } from '../store/AppState'
import ArtworkCard from '../components/ArtworkCard'

export default function Explorar() {
  const [searchParams] = useSearchParams()
  const { artworks } = useAppState()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState('Todos')
  const [tab, setTab] = useState('artistas') // artistas | galerias | museos

  const locations = useMemo(() => {
    const combos = [...artists, ...galleries, ...museums].map((x) => `${x.city}, ${x.country}`)
    return ['Todos', ...new Set(combos)]
  }, [])

  const q = query.trim().toLowerCase()

  // Artistas/galerías/museos dentro de la ciudad elegida, antes de aplicar el texto de búsqueda.
  const locationArtists = useMemo(
    () => artists.filter((a) => location === 'Todos' || `${a.city}, ${a.country}` === location),
    [location],
  )
  const locationGalleries = useMemo(
    () => galleries.filter((g) => location === 'Todos' || `${g.city}, ${g.country}` === location),
    [location],
  )
  const locationMuseums = useMemo(
    () => museums.filter((m) => location === 'Todos' || `${m.city}, ${m.country}` === location),
    [location],
  )

  const filteredArtists = useMemo(() => {
    if (!q) return locationArtists
    return locationArtists.filter(
      (a) => a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.city.toLowerCase().includes(q),
    )
  }, [locationArtists, q])

  const filteredGalleries = useMemo(() => {
    if (!q) return locationGalleries
    return locationGalleries.filter(
      (g) => g.name.toLowerCase().includes(q) || g.country.toLowerCase().includes(q) || g.city.toLowerCase().includes(q),
    )
  }, [locationGalleries, q])

  const filteredMuseums = useMemo(() => {
    if (!q) return locationMuseums
    return locationMuseums.filter(
      (m) => m.name.toLowerCase().includes(q) || m.country.toLowerCase().includes(q) || m.city.toLowerCase().includes(q),
    )
  }, [locationMuseums, q])

  // Las obras se buscan también por título y estilo, no solo por el artista/galería/museo.
  const filteredArtworks = useMemo(() => {
    if (tab === 'artistas') {
      const idsInLocation = new Set(locationArtists.map((a) => a.id))
      return artworks.filter((w) => {
        if (!idsInLocation.has(w.artistId)) return false
        if (!q) return true
        const artist = artists.find((a) => a.id === w.artistId)
        return (
          w.title.toLowerCase().includes(q) ||
          w.style.toLowerCase().includes(q) ||
          artist?.name.toLowerCase().includes(q) ||
          artist?.city.toLowerCase().includes(q) ||
          artist?.country.toLowerCase().includes(q)
        )
      })
    }
    if (tab === 'galerias') {
      const galleryArtistIds = new Set(locationGalleries.flatMap((g) => getArtistsByGallery(g.id).map((a) => a.id)))
      return artworks.filter((w) => {
        if (!galleryArtistIds.has(w.artistId)) return false
        if (!q) return true
        const gallery = galleries.find((g) => getArtistsByGallery(g.id).some((a) => a.id === w.artistId))
        return (
          w.title.toLowerCase().includes(q) ||
          w.style.toLowerCase().includes(q) ||
          gallery?.name.toLowerCase().includes(q) ||
          gallery?.city.toLowerCase().includes(q) ||
          gallery?.country.toLowerCase().includes(q)
        )
      })
    }
    const museumIds = new Set(locationMuseums.map((m) => m.id))
    return artworks.filter((w) => {
      if (!w.exhibitedAt || !museumIds.has(w.exhibitedAt)) return false
      if (!q) return true
      const museum = museums.find((m) => m.id === w.exhibitedAt)
      return (
        w.title.toLowerCase().includes(q) ||
        w.style.toLowerCase().includes(q) ||
        museum?.name.toLowerCase().includes(q) ||
        museum?.city.toLowerCase().includes(q) ||
        museum?.country.toLowerCase().includes(q)
      )
    })
  }, [artworks, locationArtists, locationGalleries, locationMuseums, tab, q])

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold mb-2">Explorar arte del mundo</h1>
      <p className="text-ink/60 mb-6">
        Elige una ciudad para ver qué artistas, galerías y museos hay ahí, o busca por artista, obra, estilo o
        institución.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. cubismo, Camila Reyes, Kioto..."
          className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent/50"
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent/50"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {location !== 'Todos' && (
        <p className="mb-6 rounded-xl bg-ink/5 px-4 py-2 text-sm text-ink/70">
          Recomendado en <strong>{location}</strong>: {filteredArtists.length} artista
          {filteredArtists.length !== 1 ? 's' : ''}, {filteredGalleries.length} galería
          {filteredGalleries.length !== 1 ? 's' : ''} y {filteredMuseums.length} museo
          {filteredMuseums.length !== 1 ? 's' : ''}.
        </p>
      )}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('artistas')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'artistas' ? 'bg-accent text-white' : 'bg-ink/5 text-ink/70'
          }`}
        >
          Artistas
        </button>
        <button
          onClick={() => setTab('galerias')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'galerias' ? 'bg-accent text-white' : 'bg-ink/5 text-ink/70'
          }`}
        >
          Galerías
        </button>
        <button
          onClick={() => setTab('museos')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === 'museos' ? 'bg-accent text-white' : 'bg-ink/5 text-ink/70'
          }`}
        >
          Museos
        </button>
      </div>

      {tab === 'artistas' && (
        <div className="mb-8 flex flex-wrap gap-4">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/perfil/${artist.id}`}
              className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-card hover:shadow-card-hover"
            >
              <img src={artist.avatar} alt={artist.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">{artist.name}</p>
                <p className="text-xs text-ink/50">
                  {artist.flag} {artist.city}, {artist.country}
                </p>
              </div>
            </Link>
          ))}
          {filteredArtists.length === 0 && (
            <p className="text-ink/50">No se encontraron artistas con esos filtros.</p>
          )}
        </div>
      )}

      {tab === 'galerias' && (
        <div className="mb-8 flex flex-wrap gap-4">
          {filteredGalleries.map((gallery) => (
            <Link
              key={gallery.id}
              to={`/galeria/${gallery.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-card hover:shadow-card-hover"
            >
              <img src={gallery.logo} alt={gallery.name} className="h-10 w-10 rounded-xl object-cover" />
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">{gallery.name}</p>
                <p className="text-xs text-ink/50">
                  {gallery.flag} {gallery.city}, {gallery.country}
                </p>
              </div>
            </Link>
          ))}
          {filteredGalleries.length === 0 && (
            <p className="text-ink/50">No se encontraron galerías con esos filtros.</p>
          )}
        </div>
      )}

      {tab === 'museos' && (
        <div className="mb-8 flex flex-wrap gap-4">
          {filteredMuseums.map((museum) => (
            <Link
              key={museum.id}
              to={`/museo/${museum.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-card hover:shadow-card-hover"
            >
              <img src={museum.image} alt={museum.name} className="h-10 w-10 rounded-xl object-cover" />
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">{museum.name}</p>
                <p className="text-xs text-ink/50">
                  {museum.flag} {museum.city}, {museum.country}
                </p>
              </div>
            </Link>
          ))}
          {filteredMuseums.length === 0 && (
            <p className="text-ink/50">No se encontraron museos con esos filtros.</p>
          )}
        </div>
      )}

      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      {tab === 'museos' && filteredArtworks.length === 0 && (
        <p className="text-ink/50">Ninguna obra del catálogo está vinculada a estos museos todavía.</p>
      )}
    </div>
  )
}
