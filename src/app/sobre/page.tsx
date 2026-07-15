import type { Metadata } from 'next'
import Image from 'next/image'
import { getArtist } from '@/lib/repositories/artworkRepository'

export const metadata: Metadata = {
  title: 'Sobre Joseph Dayan',
  description: 'Pintor panameño. Simbolismo, introspección y abstracción en acrílico y espátula.',
}

export default function SobrePage() {
  const artist = getArtist()

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-center">
      <Image
        src={artist.avatar}
        alt={artist.name}
        width={160}
        height={160}
        className="mx-auto h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
      />

      <h1 className="mt-6 font-serif text-4xl font-medium sm:text-5xl">{artist.name}</h1>
      <p className="mt-1 text-sm text-ink/40">{artist.username}</p>
      <p className="mt-1 text-sm text-ink/50">
        {artist.flag} {artist.city}, {artist.country}
      </p>

      <p className="mt-5 text-ink/70">{artist.bio}</p>

      {artist.specialties.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {artist.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-dark"
            >
              {specialty}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
