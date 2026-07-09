import Anthropic from '@anthropic-ai/sdk'

// Catálogo resumido para que el asistente recomiende solo obras reales del prototipo.
const CATALOG = {
  artistas: [
    { id: 'a1', nombre: 'Camila Reyes', ciudad: 'Ciudad de México', pais: 'México', estilos: ['Impresionismo', 'Surrealismo'], galeria: 'Galería Turner' },
    { id: 'a2', nombre: 'Haruto Sato', ciudad: 'Kioto', pais: 'Japón', estilos: ['Minimalismo', 'Impresionismo'], galeria: 'Kyoto Modern Gallery' },
    { id: 'a3', nombre: 'Amara Nwosu', ciudad: 'Lagos', pais: 'Nigeria', estilos: ['Abstracto', 'Arte Conceptual'], galeria: 'Lagos Contemporary' },
    { id: 'a4', nombre: 'Luca Ferrari', ciudad: 'Florencia', pais: 'Italia', estilos: ['Realismo', 'Renacentista'], galeria: null },
    { id: 'a5', nombre: 'Sofía Martínez', ciudad: 'Buenos Aires', pais: 'Argentina', estilos: ['Arte Digital', 'Surrealismo', 'Fotografía'], galeria: null },
    { id: 'a6', nombre: 'Min-jun Park', ciudad: 'Seúl', pais: 'Corea del Sur', estilos: ['Minimalismo', 'Contemporáneo'], galeria: null },
    { id: 'a7', nombre: 'Chloé Dubois', ciudad: 'París', pais: 'Francia', estilos: ['Impresionismo', 'Realismo'], galeria: 'Atelier Dubois' },
    { id: 'a8', nombre: 'Diego Farias', ciudad: 'São Paulo', pais: 'Brasil', estilos: ['Arte Urbano', 'Pop Art'], galeria: 'São Paulo Street Collective' },
  ],
  galerias: [
    { id: 'g1', nombre: 'Galería Turner', ciudad: 'Ciudad de México', pais: 'México' },
    { id: 'g2', nombre: 'Kyoto Modern Gallery', ciudad: 'Kioto', pais: 'Japón' },
    { id: 'g3', nombre: 'Lagos Contemporary', ciudad: 'Lagos', pais: 'Nigeria' },
    { id: 'g4', nombre: 'Atelier Dubois', ciudad: 'París', pais: 'Francia' },
    { id: 'g5', nombre: 'São Paulo Street Collective', ciudad: 'São Paulo', pais: 'Brasil' },
  ],
  obras: [
    { id: 'w1', titulo: 'Memorias de Xochimilco', artista: 'Camila Reyes', estilo: 'Impresionismo', tipo: 'venta directa', precio: 1850, url: '/obra/w1' },
    { id: 'w2', titulo: 'Silencio de invierno', artista: 'Haruto Sato', estilo: 'Minimalismo', tipo: 'venta directa', precio: 920, vendida: true, url: '/obra/w2' },
    { id: 'w3', titulo: 'Raíces tejidas', artista: 'Amara Nwosu', estilo: 'Abstracto', tipo: 'subasta', pujaActual: 680, url: '/obra/w3' },
    { id: 'w4', titulo: 'Torso en reposo', artista: 'Luca Ferrari', estilo: 'Realismo', tipo: 'subasta', pujaActual: 3900, url: '/obra/w4' },
    { id: 'w5', titulo: 'Fragmentos digitales #7', artista: 'Sofía Martínez', estilo: 'Arte Digital', tipo: 'venta directa', precio: 640, url: '/obra/w5' },
    { id: 'w6', titulo: 'Trazo 遠い山', artista: 'Min-jun Park', estilo: 'Minimalismo', tipo: 'venta directa', precio: 1200, url: '/obra/w6' },
    { id: 'w7', titulo: 'Retrato de una tarde', artista: 'Chloé Dubois', estilo: 'Impresionismo', tipo: 'subasta', pujaActual: 2650, url: '/obra/w7' },
    { id: 'w8', titulo: 'Concreto vivo', artista: 'Diego Farias', estilo: 'Arte Urbano', tipo: 'venta directa', precio: 780, url: '/obra/w8' },
    { id: 'w9', titulo: 'Jardín flotante', artista: 'Camila Reyes', estilo: 'Surrealismo', tipo: 'venta directa', precio: 2100, url: '/obra/w9' },
    { id: 'w10', titulo: 'Estanque de otoño', artista: 'Haruto Sato', estilo: 'Impresionismo', tipo: 'subasta', pujaActual: 300, url: '/obra/w10' },
    { id: 'w11', titulo: 'Ciudad fantasma', artista: 'Sofía Martínez', estilo: 'Surrealismo', tipo: 'venta directa', precio: 550, url: '/obra/w11' },
    { id: 'w12', titulo: 'Vacío y forma', artista: 'Min-jun Park', estilo: 'Minimalismo', tipo: 'venta directa', precio: 890, url: '/obra/w12' },
    { id: 'w13', titulo: 'Rosetón de Notre-Dame', artista: 'Chloé Dubois', estilo: 'Gótico', tipo: 'venta directa', precio: 1650, url: '/obra/w13' },
    { id: 'w14', titulo: 'Figuras fracturadas', artista: 'Luca Ferrari', estilo: 'Cubismo', tipo: 'venta directa', precio: 1400, url: '/obra/w14' },
  ],
}

const SYSTEM_PROMPT = `Eres el asistente de compras de ColectArt, un marketplace de arte donde artistas y galerías de todo el mundo venden obras (a precio fijo o en subasta).

Tu trabajo es ayudar al usuario a encontrar obras, artistas o galerías según lo que te diga: su presupuesto, el estilo que busca (cubismo, impresionismo, abstracto, etc.), el país o ciudad que le interesa, o si busca una galería específica.

Reglas:
- Responde siempre en español, de forma breve y cálida (máximo 3-4 frases más la lista de recomendaciones).
- Solo recomienda obras, artistas o galerías que existan en este catálogo (no inventes nada fuera de él):
${JSON.stringify(CATALOG, null, 2)}
- Cuando recomiendes una obra, incluye su título, artista, precio (o puja actual si es subasta), y su URL relativa (ej. /obra/w1) en una línea aparte para que se pueda mostrar como enlace.
- Si preguntan por un país o ciudad, menciona qué artistas y galerías hay ahí.
- Si el presupuesto no alcanza para ninguna obra de venta directa, sugiere la más cercana o una subasta con puja baja.
- Si no tienes suficiente información, haz una pregunta corta para acotar la búsqueda (presupuesto, estilo o ciudad).`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'El servidor no tiene configurada ANTHROPIC_API_KEY.' })
    return
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Falta el historial de mensajes.' })
    return
  }

  // Límite defensivo: solo los últimos 12 turnos, y recorte de longitud por mensaje.
  const trimmed = messages.slice(-12).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000),
  }))

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: trimmed,
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    res.status(200).json({ reply: textBlock ? textBlock.text : 'No pude generar una respuesta.' })
  } catch (err) {
    console.error('Error llamando a Claude:', err)
    res.status(500).json({ error: 'Hubo un problema al hablar con el asistente. Intenta de nuevo.' })
  }
}
