// Pipeline de metadatos de imagen (Fase I.0) — mide width/height reales de
// cada foto en public/ y los guarda en data/artwork-image-metadata.generated.json.
// Ese archivo es la única fuente de aspect ratio real que usa el repositorio
// (Fase I.1) — nunca se deriva del campo `size` (medida física del lienzo,
// no coincide con el ratio real del archivo fotografiado).
//
// --generate: sobreescribe el manifest con las mediciones de hoy. Acción
// deliberada, su resultado se commitea como cualquier otro dato.
// --check: vuelve a medir cada archivo real y compara contra el manifest ya
// commiteado (clave Y valor) — detecta tanto imágenes nuevas sin procesar
// como fotos reemplazadas en la misma ruta sin regenerar. Nunca se corre
// --generate automáticamente en un build (ver prebuild/prebuild:next en
// package.json): un build no debe reescribir en silencio un archivo versionado.
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { artworks } from '../src/data/artworks'

const ROOT = join(import.meta.dirname, '..')
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'artwork-image-metadata.generated.json')

type Dimensions = { width: number; height: number }
type Manifest = Record<string, Dimensions>

function collectImagePaths(): string[] {
  const paths = new Set<string>()
  for (const artwork of artworks) {
    for (const src of artwork.images) paths.add(src)
  }
  return [...paths].sort()
}

async function measure(src: string): Promise<Dimensions> {
  const filePath = join(ROOT, 'public', src)
  const { width, height } = await sharp(filePath).metadata()
  if (!width || !height) {
    throw new Error(`No se pudo leer width/height de ${src} (archivo: ${filePath})`)
  }
  return { width, height }
}

async function generate(): Promise<void> {
  const paths = collectImagePaths()
  const manifest: Manifest = {}
  for (const src of paths) {
    manifest[src] = await measure(src)
  }
  const json = JSON.stringify(manifest, null, 2) + '\n'
  writeFileSync(MANIFEST_PATH, json)
  console.log(`Generado ${MANIFEST_PATH} con ${paths.length} imágenes.`)
}

async function check(): Promise<void> {
  const paths = collectImagePaths()

  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Falta ${MANIFEST_PATH}. Corre: npm run images:generate`)
    process.exit(1)
  }

  const manifest: Manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  const problems: string[] = []

  for (const src of paths) {
    const recorded = manifest[src]
    if (!recorded) {
      problems.push(`Falta metadata para ${src}`)
      continue
    }
    const real = await measure(src)
    if (real.width !== recorded.width || real.height !== recorded.height) {
      problems.push(
        `${src}: manifest dice ${recorded.width}x${recorded.height}, archivo real mide ${real.width}x${real.height}`,
      )
    }
  }

  if (problems.length > 0) {
    console.error('El manifest de metadatos de imagen está desactualizado:')
    for (const problem of problems) console.error(`  - ${problem}`)
    console.error('Corre: npm run images:generate')
    process.exit(1)
  }

  console.log(`images:check OK — ${paths.length} imágenes verificadas contra el manifest.`)
}

const mode = process.argv[2]
if (mode === '--generate') {
  await generate()
} else if (mode === '--check') {
  await check()
} else {
  console.error('Uso: tsx scripts/generate-artwork-image-metadata.ts --generate|--check')
  process.exit(1)
}
