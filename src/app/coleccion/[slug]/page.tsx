import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllCollections,
  getCollectionBySlug,
  getArtworksByCollection,
  getArtist,
} from '@/lib/repositories/artworkRepository'
import ArtworkCard from '@/components/artwork/ArtworkCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) return {}

  return {
    title: `${collection.name} — Joseph Dayan`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)
  if (!collection) notFound()

  const artworks = getArtworksByCollection(slug)
  const artist = getArtist()

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold">{collection.name}</h1>
        <p className="mt-4 text-lg text-ink/60">{collection.description}</p>
      </div>

      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} artist={artist} />
        ))}
      </div>
    </div>
  )
}
