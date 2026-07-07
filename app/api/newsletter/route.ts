import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json()

    // ── Validate ──────────────────────────────────────────────────────────
    const clean = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return Response.json({ error: 'Server not configured.' }, { status: 500 })
    }

    // Service-role client bypasses RLS — safe because this only runs server-side
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    })

    // ── Insert (idempotent via unique email) ─────────────────────────────────
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: clean, source: source || 'unknown' })

    if (error) {
      // 23505 = unique_violation → already subscribed, treat as success
      if (error.code === '23505') {
        return Response.json({ ok: true, already: true })
      }
      console.error('Newsletter insert error:', error)
      return Response.json({ error: 'Could not subscribe. Try again.' }, { status: 500 })
    }

    return Response.json({ ok: true, already: false })
  } catch (err) {
    console.error('Newsletter route error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}