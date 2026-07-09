function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    image.src = url
  })
}

function getRadianAngle(degrees) {
  return (degrees * Math.PI) / 180
}

function rotatedSize(width, height, rotation) {
  const rad = getRadianAngle(rotation)
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  }
}

export function buildFilterCss({ brightness, contrast, saturation }) {
  return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
}

export async function getCroppedImage(imageSrc, pixelCrop, rotation, filterCss) {
  const image = await createImage(imageSrc)

  const rotateCanvas = document.createElement('canvas')
  const rotateCtx = rotateCanvas.getContext('2d')
  const { width: bw, height: bh } = rotatedSize(image.width, image.height, rotation)
  rotateCanvas.width = bw
  rotateCanvas.height = bh

  rotateCtx.translate(bw / 2, bh / 2)
  rotateCtx.rotate(getRadianAngle(rotation))
  rotateCtx.translate(-image.width / 2, -image.height / 2)
  rotateCtx.drawImage(image, 0, 0)

  const cropCanvas = document.createElement('canvas')
  cropCanvas.width = pixelCrop.width
  cropCanvas.height = pixelCrop.height
  const cropCtx = cropCanvas.getContext('2d')
  cropCtx.drawImage(
    rotateCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  const finalCanvas = document.createElement('canvas')
  finalCanvas.width = pixelCrop.width
  finalCanvas.height = pixelCrop.height
  const finalCtx = finalCanvas.getContext('2d')
  finalCtx.filter = filterCss
  finalCtx.drawImage(cropCanvas, 0, 0)

  return finalCanvas.toDataURL('image/jpeg', 0.9)
}
