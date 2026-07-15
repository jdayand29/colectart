// Única puerta de entrada a los datos de obras/artista/colecciones. Hoy lee de
// src/data/artworks.ts (arrays en memoria); el día que esto migre a Supabase
// (docs/MASTER-PLAN.md, sección 14 y 24), solo este archivo cambia — ninguna
// ruta ni componente debería importar src/data/artworks.ts directamente.
//
// Regla de la Fase C: nunca se devuelve la referencia interna de un array
// (ReadonlyArray + copia defensiva) ni de un objeto individual (spread) —
// ningún consumidor puede mutar los datos "reales" por accidente.
import { artists, artworks, collections } from '@/data/artworks'
import type { Artist, Artwork, Collection } from '@/types/artwork'

export function getAllArtworks(): ReadonlyArray<Artwork> {
  return [...artworks]
}

// `slug` (ej. "corazon-y-razon") es el identificador público estable en URLs;
// `id` (ej. "w17") es el identificador interno, útil el día que exista una
// base de datos real con claves primarias — nunca se expone en una ruta.
export function getArtworkBySlug(slug: string): Artwork | undefined {
  const artwork = artworks.find((w) => w.slug === slug)
  return artwork ? { ...artwork } : undefined
}

export function getAllCollections(): ReadonlyArray<Collection> {
  return [...collections].sort((a, b) => a.order - b.order)
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) return undefined

  // heroImage/coverImage son null hasta que Joseph elija una imagen de
  // portada dedicada para la serie — mientras tanto, se usa la primera obra
  // de la colección como fallback razonable (no inventado: es una imagen real
  // ya asociada a esa colección).
  const fallbackImage = artworks.find((w) => w.collectionId === collection.id)?.image ?? null

  return {
    ...collection,
    heroImage: collection.heroImage ?? fallbackImage,
    coverImage: collection.coverImage ?? fallbackImage,
  }
}

export function getArtworksByCollection(collectionSlug: string): ReadonlyArray<Artwork> {
  const collection = collections.find((c) => c.slug === collectionSlug)
  if (!collection) return []
  return artworks.filter((w) => w.collectionId === collection.id).map((w) => ({ ...w }))
}

// Estilos realmente presentes en el catálogo actual, no la taxonomía completa
// de src/data/styles.ts (19 movimientos, la mayoría sin ninguna obra) — evita
// mostrar chips de filtro vacíos.
export function getArtworkStyles(): ReadonlyArray<string> {
  return [...new Set(artworks.map((w) => w.style))].sort()
}

// Sitio de un solo artista: no hay parámetro de búsqueda, siempre es Joseph.
export function getArtist(): Artist {
  return { ...artists[0] }
}

// Curaduría manual del hero de Home: exactamente una obra debe tener
// `featured: true` en los datos (ver src/data/artworks.ts). Si por error
// ninguna o más de una lo tuviera, cae de forma segura a la primera obra del
// catálogo en vez de romper la Home.
export function getFeaturedArtwork(): Artwork {
  const featured = artworks.find((w) => w.featured)
  return { ...(featured ?? artworks[0]) }
}

// "Relacionadas" = misma colección primero (si la obra pertenece a una); si
// no, otras obras del mismo estilo. Excluye siempre la obra actual. Regla
// simple y explícita, no un ranking inventado — se revisita si el catálogo
// crece lo suficiente para necesitar algo más sofisticado.
export function getRelatedArtworks(slug: string, limit = 4): ReadonlyArray<Artwork> {
  const current = getArtworkBySlug(slug)
  if (!current) return []

  const sameCollection = current.collectionId
    ? artworks.filter((w) => w.collectionId === current.collectionId && w.slug !== slug)
    : []

  if (sameCollection.length > 0) {
    return sameCollection.slice(0, limit).map((w) => ({ ...w }))
  }

  return artworks
    .filter((w) => w.style === current.style && w.slug !== slug)
    .slice(0, limit)
    .map((w) => ({ ...w }))
}
