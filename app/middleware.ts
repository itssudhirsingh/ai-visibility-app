// middleware.ts — runs on every matched request.
//
// Two jobs:
//   1. Refresh the Supabase auth session (keeps cookies valid across
//      server/client boundary — required by @supabase/ssr).
//   2. Gate every tool route behind login: if there's no session and the
//      request is for a tool page, redirect to /login?next=<original path>.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Every page that requires sign-in. Kept as an explicit list (not a
// pattern) so adding/removing a gated tool is a one-line change here,
// not a routing-convention guess.
const PROTECTED_PATHS = [
  '/ai-visibility-tool',
  '/ai-answer-gap-finder',
  '/ai-eeat-checker',
  '/ai-page-speed-analysis-tools',
  '/ai-readability-checker',
  '/ai-schema-markup-generator',
  '/ai-visibility-heatmap',
  '/bluf-builder',
  '/bluf-templates',
  '/llms-text-generator',
  '/llms-txt-live-validator',
  '/robots-txt',
  '/topic-cluster-generator',
]

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  // IMPORTANT: do not run any code between createServerClient and
  // getUser(). A bug here can cause sessions to randomly drop.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets and Next.js internals.
     * This is broader than just the protected paths because the
     * session-refresh half of this middleware needs to run on every
     * navigation so cookies stay fresh, not just on gated pages.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}