// Datos reales de ColectArt. A medida que se sumen artistas y coleccionistas reales,
// esta será la fuente que crezca (o se reemplace por una base de datos real).

export const artists = [
  {
    id: 'a9',
    name: 'Joseph Dayan',
    username: '@josephdayanart',
    country: 'Panamá',
    city: 'Ciudad de Panamá',
    flag: '🇵🇦',
    galleryId: null,
    avatar: '/artists/joseph-dayan/perfil-joseph.jpg',
    bio: 'Pintor panameño. Explora el simbolismo, la introspección y la abstracción a través del acrílico y la espátula.',
    followers: 512,
    verified: false,
    specialties: ['Surrealismo', 'Abstracto'],
  },
]

const now = Date.now()
const hours = (h) => h * 60 * 60 * 1000

export const artworks = [
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
    likes: 58,
    comments: 6,
    type: 'sale',
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
    likes: 91,
    comments: 12,
    type: 'sale',
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
    likes: 74,
    comments: 9,
    type: 'sale',
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
    likes: 103,
    comments: 14,
    type: 'auction',
    auctionId: 'auc5',
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
    likes: 66,
    comments: 8,
    type: 'sale',
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
    likes: 47,
    comments: 5,
    type: 'sale',
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
    likes: 88,
    comments: 11,
    type: 'auction',
    auctionId: 'auc6',
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
    likes: 79,
    comments: 10,
    type: 'sale',
  },
]

export const galleries = []

export const collections = [
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

export const museums = []

export const auctions = [
  {
    id: 'auc5',
    artworkId: 'w18',
    startPrice: 900,
    currentBid: 1250,
    currentBidder: 'arte_coleccionista',
    endTime: now + hours(18),
    bidHistory: [
      { bidder: 'panama_arte', amount: 900, time: now - hours(26) },
      { bidder: 'arte_coleccionista', amount: 1100, time: now - hours(10) },
      { bidder: 'arte_coleccionista', amount: 1250, time: now - hours(3) },
    ],
  },
  {
    id: 'auc6',
    artworkId: 'w21',
    startPrice: 700,
    currentBid: 980,
    currentBidder: 'galeria_pty',
    endTime: now + hours(6),
    bidHistory: [
      { bidder: 'coleccion_privada', amount: 700, time: now - hours(15) },
      { bidder: 'galeria_pty', amount: 980, time: now - hours(4) },
    ],
  },
]

export function getArtist(id) {
  return artists.find((a) => a.id === id)
}

export function getArtwork(id) {
  return artworks.find((w) => w.id === id)
}

export function getAuction(id) {
  return auctions.find((au) => au.id === id)
}

export function getArtworksByArtist(artistId) {
  return artworks.filter((w) => w.artistId === artistId)
}

export function getGallery(id) {
  return galleries.find((g) => g.id === id)
}

export function getArtistsByGallery(galleryId) {
  return artists.filter((a) => a.galleryId === galleryId)
}

export function getMuseum(id) {
  return museums.find((m) => m.id === id)
}

export function getCollection(id) {
  return collections.find((c) => c.id === id)
}

export function getCollectionsByArtist(artistId) {
  return collections.filter((c) => c.artistId === artistId)
}
