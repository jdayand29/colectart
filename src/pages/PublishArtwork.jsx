import { useState } from 'react'
import { Link } from 'react-router-dom'
import { artStyles } from '../data/styles'
import ImageEditor from '../components/ImageEditor'

export default function PublishArtwork() {
  const [saleType, setSaleType] = useState('sale')
  const [submitted, setSubmitted] = useState(false)
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        {image && (
          <img src={image} alt="Tu obra publicada" className="mx-auto mb-6 max-h-64 rounded-2xl object-cover shadow-card" />
        )}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <h1 className="font-serif text-2xl font-semibold mb-2">¡Obra publicada!</h1>
        <p className="text-sm text-ink/60 mb-6">
          En la versión completa, tu obra aparecería ahora en el feed global y en tu perfil.
        </p>
        <Link to="/" className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
          Volver al feed
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold mb-2">Publicar una obra</h1>
      <p className="text-ink/60 mb-8">
        Prototipo — este formulario no guarda datos reales todavía, solo muestra el flujo.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!image) {
            setImageError('Agrega una foto de tu obra antes de publicar.')
            return
          }
          setImageError('')
          setSubmitted(true)
        }}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Título de la obra</label>
          <input required className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="Ej. Amanecer en la costa" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Foto de la obra</label>
          <ImageEditor value={image} onChange={setImage} />
          {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Técnica</label>
            <input required className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="Óleo sobre lienzo" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tamaño</label>
            <input required className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="60 x 80 cm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Estilo / movimiento</label>
            <select required className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
              <option value="">Selecciona un estilo</option>
              {artStyles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Año</label>
            <input required type="number" defaultValue={2026} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            ¿Cómo quieres vender esta obra? <span className="font-normal text-ink/40">(tú decides, es opcional)</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSaleType('sale')}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${
                saleType === 'sale' ? 'border-accent bg-accent text-white' : 'border-ink/15'
              }`}
            >
              Precio fijo
            </button>
            <button
              type="button"
              onClick={() => setSaleType('auction')}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${
                saleType === 'auction' ? 'border-accent bg-accent text-white' : 'border-ink/15'
              }`}
            >
              Subasta (opcional)
            </button>
          </div>
        </div>

        {saleType === 'sale' ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Precio (USD)</label>
            <input required type="number" className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="1200" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Precio inicial (USD)</label>
              <input required type="number" className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" placeholder="500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Duración</label>
              <select className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm">
                <option>24 horas</option>
                <option>3 días</option>
                <option>7 días</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark">
          Publicar obra
        </button>
      </form>
    </div>
  )
}
