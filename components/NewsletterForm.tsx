'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    const trimmed = email.trim()
    // Basic client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'blog' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Try again.')
        return
      }

      setStatus('success')
      setMessage(data.already ? "You're already subscribed!" : 'Subscribed — check your inbox.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const disabled = status === 'loading'

  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          disabled={disabled}
          placeholder="your@email.com"
          aria-label="Email address"
          style={{
            background: 'rgba(255,255,255,.05)',
            border: `1px solid ${status === 'error' ? 'rgba(255,116,116,.5)' : 'var(--line2)'}`,
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: '12px',
            color: 'var(--text)',
            fontFamily: "'JetBrains Mono',monospace",
            width: 200,
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          style={{
            background: 'var(--lime)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            fontWeight: 500,
            cursor: disabled ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {status === 'loading' ? 'Joining…' : status === 'success' ? 'Done ✓' : 'Subscribe'}
        </button>
      </div>
      {message && (
        <div
          style={{
            marginTop: 8,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            color: status === 'success' ? '#52e38e' : '#ff7474',
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}