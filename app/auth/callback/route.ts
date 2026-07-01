// app/auth/callback/route.ts — handles three redirect types from Supabase:
//   1. Google OAuth  (arrives with ?code=...)
//   2. Email confirmation (arrives with ?code=...)
//   3. Password reset  (arrives with ?token_hash=...&type=recovery)
// All three exchange their token for a session, then redirect to `next`.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/superbase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type')           // 'recovery', 'signup', etc.
  const next       = searchParams.get('next') ?? '/ai-visibility-tool'

  const supabase = await createClient()

  // ── Password reset / email-confirmation via token_hash ──────────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as 'recovery' | 'email' })
    if (!error) {
      // For recovery, `next` is /reset-password (set by forgot-password page).
      // For email confirmation, `next` is wherever they were heading.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // ── OAuth / email-confirmation via PKCE code ─────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send back to login with an error flag.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}