// Datos reales de Joseph Dayan. Migrado desde src/legacy-data/mockData.js (Vite).
//
// Se retiran, respecto a la fuente original, los campos que solo servían a
// funcionalidad eliminada del Documento Maestro (docs/MASTER-PLAN.md):
// galleryId/followers/verified (galerías y sistema de "seguir"), likes/comments
// (contador social de marketplace) y type/auctionId (sistema de subastas). Las
// 2 obras que hoy no tienen `price` (antes solo ofrecidas por subasta) quedan
// sin precio — no se les inventa uno; su estrategia de venta real se define en
// la Tarea de integración de pagos (docs/MASTER-PLAN.md, sección 17-18).
import type { Artist, Artwork, Collection } from '@/types/artwork'

export const artists: Artist[] = [
  {
    id: 'a9',
    name: 'Joseph Dayan',
    username: '@josephdayanart',
    country: 'Panamá',
    city: 'Ciudad de Panamá',
    flag: '🇵🇦',
    avatar: '/artists/joseph-dayan/perfil-joseph.jpg',
    bio: 'Pintor panameño. Explora el simbolismo, la introspección y la abstracción a través del acrílico y la espátula.',
    specialties: ['Surrealismo', 'Abstracto'],
  },
]

export const artworks: Artwork[] = [
  {
    id: 'w15',
    artistId: 'a9',
    title: 'Nebulosa Dorada',
    image: '/artists/joseph-dayan/nebulosa-dorada.jpg',
    medium: 'Acrílico sobre lienzo',
    style: 'Abstracto',
    size: '40 x 50 cm',
    year: 2025,
    price: 450,
    collectionId: 'col1',
  },
  {
    id: 'w16',
    artistId: 'a9',
    title: 'Siluetas en Armonía',
    image: '/artists/joseph-dayan/siluetas-en-armonia.jpg',
    medium: 'Acrílico sobre lienzo',
    style: 'Contemporáneo',
    size: '100 x 140 cm',
    year: 2024,
    price: 1400,
  },
  {
    id: 'w17',
    artistId: 'a9',
    title: 'Corazón y Razón',
    image: '/artists/joseph-dayan/corazon-y-razon.jpg',
    medium: 'Acrílico sobre lienzo',
    style: 'Surrealismo',
    size: '50 x 70 cm',
    year: 2023,
    price: 680,
    collectionId: 'col2',
  },
  {
    id: 'w18',
    artistId: 'a9',
    title: 'Alcanzando el Horizonte',
    image: '/artists/joseph-dayan/alcanzando-el-horizonte.jpg',
    medium: 'Acrílico sobre lienzo, técnica de espátula',
    style: 'Surrealismo',
    size: '70 x 100 cm',
    year: 2025,
    collectionId: 'col1',
  },
  {
    id: 'w19',
    artistId: 'a9',
    title: 'El Pabellón Escondido',
    image: '/artists/joseph-dayan/el-pabellon-escondido.jpg',
    medium: 'Acrílico sobre lienzo',
    style: 'Realismo',
    size: '60 x 75 cm',
    year: 2022,
    price: 950,
  },
  {
    id: 'w20',
    artistId: 'a9',
    title: 'Barco de Papel',
    image: '/artists/joseph-dayan/barco-de-papel.jpg',
    medium: 'Acrílico sobre lienzo',
    style: 'Minimalismo',
    size: '45 x 60 cm',
    year: 2024,
    price: 520,
  },
  {
    id: 'w21',
    artistId: 'a9',
    title: 'El Filo del Tiempo',
    image: '/artists/joseph-dayan/el-filo-del-tiempo.jpg',
    medium: 'Acrílico y hoja de oro sobre lienzo',
    style: 'Arte Conceptual',
    size: '60 x 90 cm',
    year: 2023,
    collectionId: 'col2',
  },
  {
    id: 'w22',
    artistId: 'a9',
    title: 'Danza de Koi',
    image: '/artists/joseph-dayan/danza-de-koi.jpg',
    medium: 'Acrílico con espátula sobre lienzo',
    style: 'Expresionismo',
    size: '80 x 80 cm',
    year: 2024,
    price: 890,
  },
]

export const collections: Collection[] = [
  {
    id: 'col1',
    artistId: 'a9',
    name: 'Serie Cósmica',
    description:
      'Remolinos de color inspirados en el cosmos: el instante exacto en que la luz vence a la oscuridad.',
  },
  {
    id: 'col2',
    artistId: 'a9',
    name: 'Dualidades',
    description: 'El conflicto entre la razón y la emoción, el tiempo que pasa y las decisiones que definen.',
  },
]

// Sin funciones de acceso aquí a propósito: este módulo es solo la fuente de
// datos cruda. Cualquier código de la app (rutas o componentes) que necesite
// leer obras/artista/colecciones pasa por src/lib/repositories/artworkRepository.ts,
// nunca por este archivo directamente — así el día que esto se mueva a Supabase
// solo cambia el repositorio, no cada página.
