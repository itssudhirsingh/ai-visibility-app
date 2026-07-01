'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/superbase/client'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')
  const [loading, setLoading]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [error, setError]               = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  // Supabase sets the recovery session via a PASSWORD_RECOVERY event
  // fired when the page loads after the user clicks the email link.
  // We wait for that event before enabling the form so the updateUser
  // call has a valid session to work with.
  useEffect(() => {
    const supabase = createClient()

    // Check if we already have an active session (e.g. they refreshed
    // the page after the event already fired).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setSessionReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    // Give the user 2 seconds to read the success message, then redirect.
    setTimeout(() => router.push('/ai-visibility-tool'), 2000)
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

          {done ? (
            /* ── Success state ── */
            <div style={{ textAlign:'center' }}>
              <div style={{ width:'48px', height:'48px', margin:'0 auto 1.25rem', borderRadius:'50%', background:'rgba(202,255,69,.08)', border:'1px solid rgba(202,255,69,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#caff45" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.3rem', color:'#fff', marginBottom:'.6rem' }}>
                Password updated
              </h1>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.58)', lineHeight:1.65 }}>
                All good — redirecting you to your dashboard…
              </p>
            </div>

          ) : !sessionReady ? (
            /* ── Waiting for recovery session ── */
            <div style={{ textAlign:'center', padding:'1rem 0' }}>
              <div style={{ width:'32px', height:'32px', margin:'0 auto 1rem', border:'2px solid rgba(202,255,69,.3)', borderTopColor:'#caff45', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.5)' }}>Verifying reset link…</p>
              <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,0.3)', marginTop:'.6rem' }}>
                If this takes more than a few seconds,{' '}
                <Link href="/forgot-password" style={{ color:'rgba(202,255,69,.7)', textDecoration:'none' }}>request a new link</Link>.
              </p>
            </div>

          ) : (
            /* ── New password form ── */
            <>
              <h1 style={{ fontFamily:"'Familjen Grotesk',sans-serif", fontWeight:700, fontSize:'1.5rem', color:'#fff', marginBottom:'.4rem', textAlign:'center' }}>
                Choose a new password
              </h1>
              <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,0.58)', textAlign:'center', marginBottom:'1.75rem' }}>
                Pick something you haven't used before.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={{ display:'block', fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)', marginBottom:'.4rem' }}>
                  New password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{
                    width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:'8px', padding:'.65rem .8rem', color:'#fff', fontSize:'.88rem',
                    fontFamily:"'Epilogue',sans-serif", marginBottom:'1rem', boxSizing:'border-box',
                    transition:'border-color .15s',
                  }}
                />

                {/* Inline strength hint */}
                {password.length > 0 && (
                  <div style={{ display:'flex', gap:'.3rem', marginBottom:'.75rem', marginTop:'-.6rem' }}>
                    {[...Array(4)].map((_, i) => {
                      const filled =
                        i === 0 ? password.length >= 8 :
                        i === 1 ? password.length >= 10 && /[A-Z]/.test(password) :
                        i === 2 ? /[0-9]/.test(password) && /[A-Z]/.test(password) :
                        /[^a-zA-Z0-9]/.test(password) && password.length >= 10
                      const color =
                        filled && i === 3 ? '#caff45' :
                        filled && i >= 2  ? '#4ade80' :
                        filled            ? '#facc15' :
                        'rgba(255,255,255,0.1)'
                      return (
                        <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background:color, transition:'background .2s' }} />
                      )
                    })}
                  </div>
                )}

                <label style={{ display:'block', fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)', marginBottom:'.4rem' }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
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
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}