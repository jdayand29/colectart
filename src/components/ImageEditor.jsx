import { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { buildFilterCss, getCroppedImage } from '../utils/cropImage'

export default function ImageEditor({ value, onChange }) {
  const [rawImage, setRawImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const galleryInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setRawImage(url)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
  }

  const onCropComplete = useCallback((_area, areaPixels) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  async function applyEdit() {
    if (!rawImage || !croppedAreaPixels) return
    const filterCss = buildFilterCss({ brightness, contrast, saturation })
    const dataUrl = await getCroppedImage(rawImage, croppedAreaPixels, rotation, filterCss)
    onChange(dataUrl)
    setRawImage(null)
  }

  function reset() {
    setRawImage(null)
    onChange(null)
  }

  const mediaFilter = buildFilterCss({ brightness, contrast, saturation })

  // Ya hay una imagen final aplicada — mostrar preview con opción de cambiarla.
  if (value && !rawImage) {
    return (
      <div>
        <img src={value} alt="Vista previa de la obra" className="w-full rounded-xl object-cover" style={{ maxHeight: 320 }} />
        <button
          type="button"
          onClick={reset}
          className="mt-2 text-xs text-ink/40 underline hover:text-ink"
        >
          Cambiar imagen
        </button>
      </div>
    )
  }

  // Editando una imagen recién capturada/subida.
  if (rawImage) {
    return (
      <div>
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-ink/5">
          <Cropper
            image={rawImage}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            style={{ mediaStyle: { filter: mediaFilter } }}
          />
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-xs text-ink/50">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-xs text-ink/50">Rotación</label>
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="shrink-0 rounded-full border border-ink/15 px-2 py-1 text-xs hover:bg-ink/5"
            >
              ⟳ 90°
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-xs text-ink/50">Brillo</label>
            <input
              type="range"
              min={50}
              max={150}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-xs text-ink/50">Contraste</label>
            <input
              type="range"
              min={50}
              max={150}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-xs text-ink/50">Saturación</label>
            <input
              type="range"
              min={0}
              max={200}
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setRawImage(null)}
            className="flex-1 rounded-full border border-ink/20 py-2 text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={applyEdit}
            className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            Usar esta imagen
          </button>
        </div>
      </div>
    )
  }

  // Sin imagen todavía — elegir fuente.
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink/20 py-6 text-sm hover:bg-ink/5"
      >
        <span className="text-2xl">📷</span>
        Tomar foto
      </button>
      <button
        type="button"
        onClick={() => galleryInputRef.current?.click()}
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink/20 py-6 text-sm hover:bg-ink/5"
      >
        <span className="text-2xl">🖼️</span>
        Subir desde galería
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}
