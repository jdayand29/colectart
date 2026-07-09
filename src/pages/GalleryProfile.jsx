import { Link, useParams } from 'react-router-dom'
import { getGallery, getArtistsByGallery } from '../data/mockData'
import { useAppState } from '../store/AppState'
import ArtworkCard from '../components/ArtworkCard'

export default function GalleryProfile() {
  const { id } = useParams()
  const { artworks } = useAppState()
  const gallery = getGallery(id)

  if (!gallery) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-ink/60">Galería no encontrada.</div>
  }

  const represented = getArtistsByGallery(gallery.id)
  const representedIds = new Set(represented.map((a) => a.id))
  const works = artworks.filter((w) => representedIds.has(w.artistId))

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <img src={gallery.logo} alt={gallery.name} className="h-24 w-24 rounded-2xl object-cover" />
        <div className="flex-1">
          <span className="mb-1 inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark">
            Galería
          </span>
          <h1 className="font-serif text-2xl font-semibold">{gallery.name}</h1>
          <p className="text-sm text-ink/50 mb-2">
            {gallery.flag} {gallery.city}, {gallery.country} · Desde {gallery.founded}
          </p>
          <p className="text-sm text-ink/70 max-w-md">{gallery.description}</p>
        </div>
      </div>

      {represented.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-ink/50 uppercase tracking-wide">Artistas representados</h2>
          <div className="flex flex-wrap gap-3">
            {represented.map((artist) => (
              <Link
                key={artist.id}
                to={`/perfil/${artist.id}`}
                className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-card hover:shadow-card-hover"
              >
                <img src={artist.avatar} alt={artist.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{artist.name}</p>
                  <p className="text-xs text-ink/50">{artist.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold text-ink/50 uppercase tracking-wide">Obras en la galería</h2>
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {works.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  )
}
