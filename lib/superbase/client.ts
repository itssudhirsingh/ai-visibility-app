// lib/supabase/client.ts — Supabase client for use in Client Components
// ('use client' files). Uses the public anon key; safe to expose to the
// browser, RLS policies do the real access control.

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}