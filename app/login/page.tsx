'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/ai-visibility-tool'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setLoading(false)

    if (signInError) {
      const rawMsg = typeof signInError.message === 'string'
        ? signInError.message
        : JSON.stringify(signInError.message)

      const msg = rawMsg.toLowerCase()
      setError(
        msg.includes('invalid login credentials') || msg.includes('invalid email or password')
          ? 'Incorrect email or password.'
          : msg.includes('email not confirmed')
          ? 'Please confirm your email before signing in. Check your inbox.'
          : msg.includes('rate limit') || msg.includes('too many requests')
          ? 'Too many attempts. Please wait a moment and try again.'
          : rawMsg || 'Something went wrong. Please try again.'
      )
      return
    }

    router.push(next)
    router.refresh()
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
    }
    // On success, Supabase redirects the browser away — no further
    // local state update needed.
  }

  return (
    <div style={{ background:'#04030c', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Epilogue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Epilogue:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', marginBottom:'2.5rem', textDecoration:'none' }}>
          <span style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#fff' }}>Notion Cue</span>
        </Link>

        <div style={{ background:'#100e22', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'2.25rem' }}>
          <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.5rem', color:'#fff', marginBottom:'.4rem', textAlign:'center' }}>
            Welcome back
          </h1>
          <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.58)', textAlign:'center', marginBottom:'1.75rem' }}>
            Sign in to run AI visibility scans.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'.6rem',
              padding:'.7rem', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.12)',
              background:'rgba(255,255,255,0.03)', color:'#fff', fontFamily:"'Epilogue',sans-serif",
              fontSize:'.85rem', fontWeight:500, cursor: googleLoading ? 'default' : 'pointer',
              opacity: googleLoading ? .6 : 1, marginBottom:'1.25rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.14c-.22-.69-.35-1.42-.35-2.14s.13-1.45.35-2.14V7.02H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.98z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1.25rem' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', color:'rgba(255,255,255,0.38)', letterSpacing:'.08em' }}>OR</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display:'block', fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)', marginBottom:'.4rem' }}>
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:'8px', padding:'.65rem .8rem', color:'#fff', fontSize:'.88rem',
                fontFamily:"'Epilogue',sans-serif", marginBottom:'1rem', boxSizing:'border-box',
              }}
            />

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'.4rem' }}>
              <label style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)' }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:'8px', padding:'.65rem .8rem', color:'#fff', fontSize:'.88rem',
                fontFamily:"'Epilogue',sans-serif", marginBottom:'1.25rem', boxSizing:'border-box',
              }}
            />

            {error && (
              <div style={{ background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.25)', borderRadius:'8px', padding:'.6rem .8rem', marginBottom:'1.1rem', fontSize:'.8rem', color:'#f87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width:'100%', padding:'.75rem', borderRadius:'100px', border:'none',
                background: loading ? 'rgba(202,255,69,0.5)' : '#caff45', color:'#04030c',
                fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'.88rem',
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', fontSize:'.82rem', color:'rgba(255,255,255,0.5)', marginTop:'1.5rem' }}>
          Don&apos;t have an account?{' '}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} style={{ color:'#caff45', textDecoration:'none', fontWeight:500 }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ background:'#04030c', minHeight:'100vh' }} />}>
      <LoginForm />
    </Suspense>
  )
}