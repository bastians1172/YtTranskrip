// app/api/translate/route.ts
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content, lang } = body

  if (!content) {
    return new Response(JSON.stringify({ error: 'Missing content' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const flaskRes = await fetch('http://localhost:5000/translate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, lang }),
    })

    const data = await flaskRes.json()

    if (!flaskRes.ok) {
      return new Response(JSON.stringify({ error: data.error || 'Flask error' }), {
        status: flaskRes.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ result: data.translated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in Next.js API:', err)
    return new Response(JSON.stringify({ error: 'Internal proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
