'use client'
import { useState } from 'react'

interface BlufOption {
  angle: string
  label: string
  text: string
  word_count: number
}
interface BlufData {
  source_url: string
  content_fetched: boolean
  page_summary: string
  options: BlufOption[]
}

const ANGLE_COLOR: Record<string, string> = {
  'direct': '#22d3ee',
  'benefit-led': '#c8f247',
  'question-led': '#f472b6',
}

export default function BlufBuilderClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<BlufData | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  async function generate() {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch('/api/bluf-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong generating your BLUF summaries.')
      } else {
        setData(json)
      }
    } catch (e) {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string, idx: number) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  return (
    <div>
      {/* Input */}
      <div style={{display:'flex',gap:'.75rem',maxWidth:'640px',marginBottom:'1rem',flexWrap:'wrap'}}>
        <input
          value={url}
          onChange={e=>setUrl(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && generate()}
          placeholder="https://yourdomain.com/page"
          style={{flex:1,minWidth:'240px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}
        >
          {loading ? 'Writing BLUFs...' : 'Generate 3 BLUF options'}
        </button>
      </div>

      {error && (
        <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.25)',borderRadius:'10px',padding:'.85rem 1.1rem',color:'#f87171',fontSize:'.85rem',marginBottom:'1.5rem',maxWidth:'640px'}}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,0.4)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',padding:'2rem 0'}}>
          <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c8f247',animation:'blink 1s ease-in-out infinite',display:'inline-block'}} />
          Reading the page, drafting 3 angles...
        </div>
      )}

      {data && (
        <div style={{marginTop:'2rem'}}>

          {/* Source summary */}
          <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'1.75rem',flexWrap:'wrap'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#7b6cff',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.25)',padding:'.2rem .55rem',borderRadius:'4px'}}>
              {data.content_fetched ? '✓ Page content read' : '⚠ Inferred from URL'}
            </span>
            <span style={{fontSize:'.82rem',color:'rgba(255,255,255,0.75)'}}>{data.page_summary}</span>
          </div>

          {/* 3 options */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
            {data.options.map((opt, i) => {
              const color = ANGLE_COLOR[opt.angle] || '#c8f247'
              return (
                <div key={opt.angle} style={{background:'#100e22',border:`1px solid ${color}33`,borderRadius:'14px',padding:'1.5rem',display:'flex',flexDirection:'column'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color,background:`${color}18`,border:`1px solid ${color}40`,padding:'.2rem .55rem',borderRadius:'4px',alignSelf:'flex-start',marginBottom:'1rem'}}>
                    {opt.label}
                  </span>
                  <p style={{fontSize:'.92rem',color:'#fff',lineHeight:1.65,flex:1,marginBottom:'1.25rem'}}>
                    {opt.text}
                  </p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:'.85rem'}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'rgba(255,255,255,0.4)'}}>{opt.word_count} words</span>
                    <button
                      onClick={()=>copyText(opt.text, i)}
                      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.04em',background:'none',border:'none',color: copiedIdx===i ? '#4ade80' : color,cursor:'pointer',padding:'.2rem .4rem'}}
                    >
                      {copiedIdx===i ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}