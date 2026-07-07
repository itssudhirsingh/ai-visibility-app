'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        // After clicking the email link, Supabase bounces through
        // /auth/callback which sets the session, then sends to /reset-password
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      },
    )

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    // Always show the "check email" state regardless of whether the
    // address exists — this prevents email enumeration.
    setSent(true)
  }

  return (
    <div style={{ background:'#04030c', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Epilogue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@600;700&family=Epilogue:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        input:focus { outline: none; border-color: rgba(202,255,69,.5) !important; }
      `}</style>

      <div style={{ width:'100%', maxWidth:'400px' }}>
        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', marginBottom:'2.5rem', textDecoration:'none' }}>
          <span style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#fff' }}>Notion Cue</span>
        </Link>

        <div style={{ background:'#100e22', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'2.25rem' }}>

          {sent ? (
            /* ── Success state ── */
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'48px', height:'48px', margin:'0 auto 1.25rem', borderRadius:'50%', background:'rgba(202,255,69,.08)', border:'1px solid rgba(202,255,69,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#caff45" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="m22 6-10 7L2 6"/>
                </svg>
              </div>
              <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'.6rem' }}>
                Check your email
              </h1>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.58)', lineHeight:1.65, marginBottom:'1.5rem' }}>
                If <strong style={{ color:'#fff' }}>{email}</strong> is registered, you'll receive a password reset link shortly. Check your spam folder if it doesn't arrive.
              </p>
              <Link href="/login" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem', color:'#caff45', textDecoration:'none', letterSpacing:'.04em' }}>
                ← Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Request form ── */
            <>
              <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.5rem', color:'#fff', marginBottom:'.4rem', textAlign:'center' }}>
                Reset your password
              </h1>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.58)', textAlign:'center', marginBottom:'1.75rem', lineHeight:1.55 }}>
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={{ display:'block', fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)', marginBottom:'.4rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:'8px', padding:'.65rem .8rem', color:'#fff', fontSize:'.88rem',
                    fontFamily:"'Epilogue',sans-serif", marginBottom:'1.25rem', boxSizing:'border-box',
                    transition:'border-color .15s',
                  }}
                />

                {error && (
                  <div style={{ background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.25)', borderRadius:'8px', padding:'.6rem .8rem', marginBottom:'1rem', fontSize:'.8rem', color:'#f87171' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width:'100%', padding:'.75rem', borderRadius:'100px', border:'none',
                    background: loading ? 'rgba(202,255,69,0.5)' : '#caff45',
                    color:'#04030c', fontFamily:"'Familjen Grotesk',sans-serif",
                    fontWeight:700, fontSize:'.88rem', cursor: loading ? 'default' : 'pointer',
                    transition:'background .15s',
                  }}
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p style={{ textAlign:'center', fontSize:'.78rem', color:'rgba(255,255,255,0.4)', marginTop:'1.25rem' }}>
                <Link href="/login" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>
                  ← Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}