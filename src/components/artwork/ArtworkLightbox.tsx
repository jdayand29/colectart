'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ArtworkLightboxProps {
  src: string
  alt: string
}

export default function ArtworkLightbox({ src, alt }: ArtworkLightboxProps) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <button
        onClick={() => setZoomed(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl"
        aria-label="Ampliar imagen"
      >
        <Image src={src} alt={alt} width={1000} height={1000} className="w-full object-cover" priority />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          ⤢ Ampliar
        </span>
      </button>

      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/90 p-6"
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={1600}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
