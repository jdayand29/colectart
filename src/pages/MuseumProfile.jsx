import { useParams } from 'react-router-dom'
import { getMuseum } from '../data/mockData'
import { useAppState } from '../store/AppState'
import ArtworkCard from '../components/ArtworkCard'

export default function MuseumProfile() {
  const { id } = useParams()
  const { artworks } = useAppState()
  const museum = getMuseum(id)

  if (!museum) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-ink/60">Museo no encontrado.</div>
  }

  const exhibited = artworks.filter((w) => w.exhibitedAt === museum.id)

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <img src={museum.image} alt={museum.name} className="h-24 w-24 rounded-2xl object-cover" />
        <div className="flex-1">
          <span className="mb-1 inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark">
            Museo
          </span>
          <h1 className="font-serif text-2xl font-semibold">{museum.name}</h1>
          <p className="text-sm text-ink/50 mb-2">
            {museum.flag} {museum.city}, {museum.country} · Fundado en {museum.founded}
          </p>
          <p className="text-sm text-ink/70 max-w-md">{museum.description}</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-ink/50 uppercase tracking-wide">Obras exhibidas aquí</h2>
      {exhibited.length === 0 ? (
        <p className="text-ink/50">Todavía no hay obras del catálogo vinculadas a este museo.</p>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink/40">
            Estas obras se pueden comprar directamente con el artista — el museo es solo su historial de exhibición.
          </p>
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
            {exhibited.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
