import { getAllArtworks, getArtist } from '@/lib/repositories/artworkRepository'
import ArtworkCard from '@/components/artwork/ArtworkCard'
import SpecTable from '@/components/artwork/SpecTable'
import SubscribeForm from '@/components/forms/SubscribeForm'

export default function Home() {
  const artworks = getAllArtworks()
  const artist = getArtist()

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold italic">Joseph Dayan</h1>
      <p className="mt-4 text-sm text-ink/50">Verificación — repositorio de datos:</p>
      <div className="mt-6 max-w-xs">
        <SpecTable artwork={artworks[6]} />
      </div>
      <div className="mt-6 columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} artist={artist} />
        ))}
      </div>
      <div className="mt-10 max-w-xl">
        <SubscribeForm />
      </div>
    </main>
  )
}
