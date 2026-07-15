import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const name = body?.name
  const email = body?.email
  const message = body?.message

  if (!name || !email || !EMAIL_REGEX.test(email) || !message) {
    return NextResponse.json({ error: 'Faltan campos o el correo no es válido.' }, { status: 400 })
  }

  // No hay base de datos en este prototipo: se registra en los logs de la función,
  // visibles desde el dashboard de Vercel (Deployments → Logs) o `vercel logs`.
  console.log(
    `NUEVO CONTACTO Joseph Dayan — ${name} <${email}>: ${message} — ${new Date().toISOString()}`,
  )

  return NextResponse.json({ ok: true })
}
