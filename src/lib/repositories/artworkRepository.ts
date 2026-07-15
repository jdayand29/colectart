// Única puerta de entrada a los datos de obras/artista/colecciones. Hoy lee de
// src/data/artworks.ts (arrays en memoria); el día que esto migre a Supabase
// (docs/MASTER-PLAN.md, sección 14 y 24), solo este archivo cambia — ninguna
// ruta ni componente debería importar src/data/artworks.ts directamente.
import { artists, artworks, collections } from '@/data/artworks'
import type { Artist, Artwork, Collection } from '@/types/artwork'

export function getAllArtworks(): Artwork[] {
  return artworks
}

// El campo `id` (ej. "w15") ya funciona como slug de URL hoy. Si en el futuro
// se introduce un campo `slug` propio, solo cambia esta función.
export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((w) => w.id === slug)
}

export function getAllCollections(): Collection[] {
  return collections
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.id === slug)
}

export function getArtworksByCollection(collectionSlug: string): Artwork[] {
  return artworks.filter((w) => w.collectionId === collectionSlug)
}

// Sitio de un solo artista: no hay parámetro de búsqueda, siempre es Joseph.
export function getArtist(): Artist {
  return artists[0]
}

// Curaduría manual para el hero de la Home — cambiar este id es la forma de
// que Joseph elija qué obra protagoniza el sitio en un momento dado. No es un
// campo `featured` en los datos: con un solo artista y un catálogo pequeño,
// una constante explícita es más simple y más fácil de razonar que un flag.
const FEATURED_ARTWORK_ID = 'w15'

export function getFeaturedArtwork(): Artwork {
  return getArtworkBySlug(FEATURED_ARTWORK_ID) ?? artworks[0]
}
