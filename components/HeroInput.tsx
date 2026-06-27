'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  label?: string
}

export default function HeroInput({ label = 'Analyse now' }: Props) {
  const [url, setUrl] = useState('')
  const router = useRouter()

  function go(val: string) {
    const clean = val.trim().replace(/^https?:\/\//, '')
    if (!clean) return
    router.push(`/ai-visibility-tool?url=${encodeURIComponent(clean)}`)
  }

  return (
    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '100px', padding: '.35rem .35rem .35rem 1.4rem' }}>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && go(url)}
        placeholder="https://yourdomain.com"
        type="url"
        autoComplete="off"
        style={{ flex: 1, background: 'transparent', border: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: '#fff', padding: '.5rem 0', outline: 'none' }}
      />
      <button
        onClick={() => go(url)}
        style={{ flexShrink: 0, fontFamily: "'Familjen Grotesk',sans-serif", fontSize: '.8rem', fontWeight: 700, background: '#c8f247', color: '#04030c', border: 'none', borderRadius: '100px', padding: '.65rem 1.4rem', display: 'flex', alignItems: 'center', gap: '.5rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        {label}
      </button>
    </div>
  )
}
