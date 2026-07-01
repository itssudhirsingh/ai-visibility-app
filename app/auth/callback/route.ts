// app/auth/callback/route.ts — handles the redirect back from Google OAuth
// and from email-confirmation links. Exchanges the auth code for a session,
// then redirects to wherever the user was originally trying to go.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/superbase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/ai-visibility-tool'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send them to login with an error flag rather
  // than silently landing on a gated page with no session.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}