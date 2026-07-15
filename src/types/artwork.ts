// SEO override opcional por entidad — escape hatch manual para cuando
// generateMetadata necesite un título/descripción distintos a los generados
// automáticamente. Ninguna obra/colección lo usa todavía.
export interface SeoOverride {
  title?: string
  description?: string
}

export interface Artist {
  id: string
  slug: string
  name: string
  username: string
  country: string
  city: string
  flag: string
  avatar: string
  bio: string
  specialties: string[]
  // --- Campos nuevos (Fase C), sin contenido real todavía ---
  /** URLs de redes confirmadas. Vacío: `username` existe pero no se ha
   * confirmado a qué plataforma/URL corresponde — no se fabrica un link. */
  socials: { platform: string; url: string }[]
  /** Biografía extendida para /sobre (distinta del `bio` breve de una línea
   * usado en el hero de Home). Pendiente de redacción real. */
  biography: string | null
  /** Statement de práctica artística (distinto de bio/biography). Pendiente. */
  statement: string | null
  education: { institution: string; degree?: string; year?: number }[]
  exhibitions: { title: string; venue: string; year: number }[]
  awards: { title: string; year: number }[]
  press: { outlet: string; title: string; url: string; date?: string }[]
  /** Foto de atelier/retrato dedicada, distinta del `avatar` de perfil. */
  featuredImage: string | null
}

export type ArtworkStatus = 'available' | 'sold' | 'unavailable'

export interface Artwork {
  id: string
  artistId: string
  title: string
  /** @deprecated usar `images[0]` — se conserva por compatibilidad con
   * componentes ya migrados (ArtworkCard, ArtworkLightbox, etc.); ambos deben
   * apuntar a la misma imagen hasta que esos componentes se actualicen
   * (Sistema de Diseño, Fase I). */
  image: string
  medium: string
  style: string
  size: string
  year: number
  price?: number
  collectionId?: string
  /** @deprecated usar `status === 'sold'` — se mantiene sincronizado a mano
   * mientras ArtworkCard/ArtworkDetail (Fase I) no migren a `status`. */
  sold?: boolean
  // --- Campos nuevos (Fase C) ---
  slug: string
  /** Debe haber como máximo una obra con `featured: true` — la usa
   * getFeaturedArtwork() para el hero de Home (antes era una constante). */
  featured: boolean
  status: ArtworkStatus
  /** Reservado para ediciones limitadas (prints) — no aplica a los originales
   * de este catálogo todavía, por eso es `undefined` en las 8 obras reales. */
  availability?: { editionSize: number; editionsAvailable: number }
  /** Texto curatorial largo de la obra. Pendiente de redacción real. */
  description: string | null
  /** Resumen de una línea para tarjetas/listados. Pendiente. */
  shortDescription: string | null
  /** Todas las imágenes de la obra; hoy siempre `[image]` (una sola foto por
   * pieza). Ver nota de `image` sobre por qué ambos campos coexisten. */
  images: string[]
  seo?: SeoOverride
  /** Todas las obras se han asumido en USD implícitamente (símbolo `$` en
   * formatPrice) — este campo lo hace explícito en vez de asumido. */
  currency: 'USD'
  /** Cuándo este registro entró al catálogo digital (no la fecha en que se
   * pintó la obra — esa es `year`). Fecha de la migración a este modelo. */
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  artistId: string
  name: string
  description: string
  // --- Campos nuevos (Fase C) ---
  slug: string
  /** Imagen dedicada de portada/hero de la serie. `null`: Joseph no ha
   * elegido una imagen específica — el repositorio usa como fallback la
   * primera obra de la colección (ver getCollectionBySlug). */
  heroImage: string | null
  coverImage: string | null
  /** Resumen corto para tarjetas. Hoy igual a `description` porque el texto
   * curatorial ya es breve (una oración) — se diferenciarán si `description`
   * crece en el futuro. */
  excerpt: string
  featured: boolean
  /** Orden de aparición explícito (1-indexed), no el orden del array. */
  order: number
  seo?: SeoOverride
}
