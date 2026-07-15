import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getAllArtworks,
  getArtworkBySlug,
  getArtist,
  getAllCollections,
} from '@/lib/repositories/artworkRepository'
import SpecTable from '@/components/artwork/SpecTable'
import ArtworkLightbox from '@/components/artwork/ArtworkLightbox'
import { formatPrice } from '@/utils/formatPrice'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllArtworks().map((artwork) => ({ slug: artwork.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) return {}

  const title = `${artwork.title} — Joseph Dayan`
  const description = `${artwork.medium}, ${artwork.year}. ${artwork.size}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: artwork.image }],
    },
  }
}

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params
  const artwork = getArtworkBySlug(slug)
  if (!artwork) notFound()

  const artist = getArtist()
  // artwork.collectionId referencia el `id` interno de la colección (no su
  // slug) — se resuelve buscando en getAllCollections(), sin agregar una
  // función nueva al repositorio (getCollectionBySlug es solo por slug).
  const collection = artwork.collectionId
    ? getAllCollections().find((c) => c.id === artwork.collectionId)
    : undefined

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="grid gap-8 md:grid-cols-2">
        <ArtworkLightbox src={artwork.image} alt={artwork.title} />

        <div>
          <Link href="/sobre" className="mb-4 flex items-center gap-3">
            <Image
              src={artist.avatar}
              alt={artist.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{artist.name}</p>
              <p className="text-xs text-ink/50">
                {artist.flag} {artist.city}, {artist.country}
              </p>
            </div>
          </Link>

          {collection && (
            <Link
              href={`/coleccion/${collection.slug}`}
              className="mb-3 flex w-fit items-center gap-2 rounded-full bg-accent-light px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-ink/10"
            >
              Parte de la colección &ldquo;{collection.name}&rdquo; →
            </Link>
          )}

          <span className="mb-2 block w-fit rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark">
            {artwork.style}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold">{artwork.title}</h1>

          <SpecTable artwork={artwork} />

          <div className="rounded-3xl bg-white p-6 shadow-card">
            {artwork.sold ? (
              <p className="rounded-full bg-ink/5 px-4 py-2 text-center text-sm text-ink/60">
                Esta obra ya fue vendida
              </p>
            ) : artwork.price != null ? (
              <>
                <p className="text-sm text-ink/60">Precio</p>
                <p className="mb-4 font-serif text-3xl font-semibold">{formatPrice(artwork.price)}</p>
                <Link
                  href="/adquirir"
                  className="block w-full rounded-full bg-accent py-2.5 text-center text-sm font-semibold text-white hover:bg-accent-dark"
                >
                  Adquirir esta obra
                </Link>
              </>
            ) : (
              <p className="rounded-full bg-ink/5 px-4 py-2 text-center text-sm text-ink/60">
                Actualmente no disponible
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
