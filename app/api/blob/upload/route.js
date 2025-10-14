import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing BLOB_READ_WRITE_TOKEN' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename') || `upload-${Date.now()}`

    const blob = await put(`vehicles/${Date.now()}-${filename}`, request.body, {
      access: 'public',
      token,
    })

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}