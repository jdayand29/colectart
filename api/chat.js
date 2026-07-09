import Anthropic from '@anthropic-ai/sdk'

// Catálogo real para que el asistente recomiende solo artistas y obras que existen de verdad.
// Esto crecerá a medida que se sumen artistas reales a ColectArt.
const CATALOG = {
  artistas: [
    {
      id: 'a9',
      nombre: 'Joseph Dayan',
      ciudad: 'Ciudad de Panamá',
      pais: 'Panamá',
      estilos: ['Surrealismo', 'Abstracto'],
      galeria: null,
    },
  ],
  galerias: [],
  obras: [
    { id: 'w15', titulo: 'Nebulosa Dorada', artista: 'Joseph Dayan', estilo: 'Abstracto', tipo: 'venta directa', precio: 450, url: '/obra/w15' },
    { id: 'w16', titulo: 'Siluetas en Armonía', artista: 'Joseph Dayan', estilo: 'Contemporáneo', tipo: 'venta directa', precio: 1400, url: '/obra/w16' },
    { id: 'w17', titulo: 'Corazón y Razón', artista: 'Joseph Dayan', estilo: 'Surrealismo', tipo: 'venta directa', precio: 680, url: '/obra/w17' },
    { id: 'w18', titulo: 'Alcanzando el Horizonte', artista: 'Joseph Dayan', estilo: 'Surrealismo', tipo: 'subasta', pujaActual: 1250, url: '/obra/w18' },
    { id: 'w19', titulo: 'El Pabellón Escondido', artista: 'Joseph Dayan', estilo: 'Realismo', tipo: 'venta directa', precio: 950, url: '/obra/w19' },
    { id: 'w20', titulo: 'Barco de Papel', artista: 'Joseph Dayan', estilo: 'Minimalismo', tipo: 'venta directa', precio: 520, url: '/obra/w20' },
    { id: 'w21', titulo: 'El Filo del Tiempo', artista: 'Joseph Dayan', estilo: 'Arte Conceptual', tipo: 'subasta', pujaActual: 980, url: '/obra/w21' },
    { id: 'w22', titulo: 'Danza de Koi', artista: 'Joseph Dayan', estilo: 'Expresionismo', tipo: 'venta directa', precio: 890, url: '/obra/w22' },
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
