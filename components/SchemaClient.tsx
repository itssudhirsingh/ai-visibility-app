'use client'
import { useState } from 'react'

const SCHEMA_TYPES = ['Auto-detect','FAQPage','Organization','Article','Product','HowTo','BreadcrumbList','WebSite']

export function SchemaClient() {
  const [url, setUrl] = useState('')
  const [schemaType, setSchemaType] = useState('Auto-detect')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)
  const [copiedIdx, setCopiedIdx] = useState<number|null>(null)

  async function run() {
    if (!url.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/ai-schema-markup-generator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, schema_type: schemaType === 'Auto-detect' ? null : schemaType }) })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  function copy(schema: any, idx: number) {
    const code = `<script type="application/ld+json">\n${JSON.stringify(schema.json_ld, null, 2)}\n</script>`
    navigator.clipboard.writeText(code)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  const priorityColor = (p: string) => p==='HIGH'?'#f87171':p==='MED'?'#c8f247':'rgba(255,255,255,.4)'

  return (
    <div>
      <div style={{display:'flex',gap:'.75rem',maxWidth:'740px',marginBottom:'1rem',flexWrap:'wrap'}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="https://yourdomain.com/page" style={{flex:1,minWidth:'220px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}} />
        <select value={schemaType} onChange={e=>setSchemaType(e.target.value)} style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:'#fff',outline:'none',cursor:'pointer'}}>
          {SCHEMA_TYPES.map(t=><option key={t} value={t} style={{background:'#100e22'}}>{t}</option>)}
        </select>
        <button onClick={run} disabled={loading} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}>
          {loading ? 'Generating...' : 'Generate schema'}
        </button>
      </div>

      {error && <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.25)',borderRadius:'10px',padding:'.85rem 1.1rem',color:'#f87171',fontSize:'.85rem',marginBottom:'1.5rem',maxWidth:'640px'}}>{error}</div>}
      {loading && <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,.4)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',padding:'2rem 0'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c8f247',animation:'blink 1s ease-in-out infinite',display:'inline-block'}} />Reading page content, generating schema markup...</div>}

      {data && (
        <div style={{marginTop:'2rem'}}>
          {/* Page type + impact */}
          <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#7b6cff',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.25)',padding:'.2rem .55rem',borderRadius:'4px'}}>{data.page_type}</span>
            <span style={{fontSize:'.85rem',color:'rgba(255,255,255,.75)'}}>{data.aeo_impact}</span>
          </div>

          {/* Schema cards */}
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {data.schemas?.map((schema: any, i: number) => (
              <div key={i} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'1rem 1.25rem',borderBottom:'1px solid rgba(255,255,255,.07)',flexWrap:'wrap'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',textTransform:'uppercase',color:priorityColor(schema.priority),background:`${priorityColor(schema.priority)}18`,border:`1px solid ${priorityColor(schema.priority)}40`,padding:'.15rem .45rem',borderRadius:'4px'}}>{schema.priority}</span>
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',flex:1}}>{schema.type}</span>
                  <span style={{fontSize:'.78rem',color:'rgba(255,255,255,.5)'}}>{schema.reason}</span>
                  <button onClick={()=>copy(schema,i)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',background:'none',border:'1px solid rgba(255,255,255,.15)',borderRadius:'6px',color:copiedIdx===i?'#4ade80':'rgba(255,255,255,.6)',cursor:'pointer',padding:'.3rem .7rem',whiteSpace:'nowrap'}}>
                    {copiedIdx===i ? '✓ Copied' : 'Copy JSON-LD'}
                  </button>
                </div>
                <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',lineHeight:1.7,color:'rgba(255,255,255,.65)',padding:'1.25rem',overflowX:'auto',maxHeight:'300px',margin:0}}>
                  {`<script type="application/ld+json">\n${JSON.stringify(schema.json_ld, null, 2)}\n</script>`}
                </pre>
              </div>
            ))}
          </div>

          {data.implementation_note && (
            <div style={{marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'rgba(255,255,255,.4)',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'8px',padding:'.65rem 1rem'}}>
              💡 {data.implementation_note}
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}