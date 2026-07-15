'use client'

import { useMemo, useState } from 'react'
import ArtworkCard from '@/components/artwork/ArtworkCard'
import type { Artist, Artwork } from '@/types/artwork'

interface ArtworkCatalogProps {
  artworks: ReadonlyArray<Artwork>
  artist: Pick<Artist, 'name' | 'avatar' | 'flag'>
  styles: ReadonlyArray<string>
}

export default function ArtworkCatalog({ artworks, artist, styles }: ArtworkCatalogProps) {
  const [activeStyle, setActiveStyle] = useState('Todos')
  const styleOptions = useMemo(() => ['Todos', ...styles], [styles])

  const filtered =
    activeStyle === 'Todos' ? artworks : artworks.filter((artwork) => artwork.style === activeStyle)

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="mb-8 font-serif text-3xl font-semibold sm:text-4xl">Obra</h1>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
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

      {filtered.length === 0 ? (
        <p className="text-ink/50">No hay obras con este estilo todavía.</p>
      ) : (
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} artist={artist} />
          ))}
        </div>
      )}
    </div>
  )
}
