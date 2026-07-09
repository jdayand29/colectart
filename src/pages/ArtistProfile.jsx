import { Link, useParams } from 'react-router-dom'
import { getArtist, getGallery, getCollectionsByArtist } from '../data/mockData'
import { useAppState } from '../store/AppState'
import ArtworkCard from '../components/ArtworkCard'

export default function ArtistProfile() {
  const { id } = useParams()
  const { following, toggleFollow, artworks } = useAppState()
  const artist = getArtist(id)

  if (!artist) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-ink/60">Artista no encontrado.</div>
  }

  const works = artworks.filter((w) => w.artistId === id)
  const isFollowing = following.has(id)
  const gallery = artist.galleryId ? getGallery(artist.galleryId) : null
  const collections = getCollectionsByArtist(id)
  const soloWorks = works.filter((w) => !w.collectionId)

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-20 flex flex-col items-center text-center">
        <img src={artist.avatar} alt={artist.name} className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40" />

        <div className="mt-6 flex items-center gap-2">
          <h1 className="font-serif text-4xl font-medium sm:text-5xl">{artist.name}</h1>
          {artist.verified && <span className="text-blue-500" title="Artista verificado">✓</span>}
        </div>
        <p className="mt-1 text-sm text-ink/40">{artist.username}</p>
        <p className="mt-1 text-sm text-ink/50">
          {artist.flag} {artist.city}, {artist.country}
        </p>

        <p className="mt-5 max-w-lg text-ink/70">{artist.bio}</p>

        {gallery && (
          <Link
            to={`/galeria/${gallery.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-ink/10"
          >
            <img src={gallery.logo} alt={gallery.name} className="h-5 w-5 rounded-full object-cover" />
            Representado por {gallery.name} → ver galería
          </Link>
        )}

        {artist.specialties?.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {artist.specialties.map((s) => (
              <span key={s} className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark">
                {s}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-ink/50">
          <strong className="text-ink">{(artist.followers + (isFollowing ? 1 : 0)).toLocaleString()}</strong>{' '}
          seguidores · <strong className="text-ink">{works.length}</strong> obras publicadas
        </p>

        <button
          onClick={() => toggleFollow(artist.id)}
          className={`mt-6 rounded-full px-8 py-2.5 text-sm font-semibold ${
            isFollowing ? 'border border-accent/30 bg-accent-light/50 text-accent-dark' : 'bg-accent text-white hover:bg-accent-dark'
          }`}
        >
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
      </div>

      {collections.map((collection) => {
        const collectionWorks = works.filter((w) => w.collectionId === collection.id)
        if (collectionWorks.length === 0) return null
        return (
          <div key={collection.id} id={collection.id} className="mb-16">
            <h2 className="font-serif text-2xl font-medium">{collection.name}</h2>
            <p className="mt-1 max-w-xl text-sm text-ink/50">{collection.description}</p>
            <div className="mt-6 columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
              {collectionWorks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          </div>
        )
      })}

      {soloWorks.length > 0 && (
        <div>
          {collections.length > 0 && (
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-ink/40">Otras obras</h2>
          )}
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
            {soloWorks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
