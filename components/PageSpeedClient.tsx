'use client'
import { useState } from 'react'

export function PageSpeedClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)

  async function run() {
    if (!url.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/page-speed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error — please try again.') }
    finally { setLoading(false) }
  }

  const scoreColor = (s: number) => s >= 70 ? '#4ade80' : s >= 40 ? '#c8f247' : '#f87171'
  const impactColor = (i: string) => i === 'high' ? '#f87171' : i === 'medium' ? '#c8f247' : '#4ade80'

  return (
    <div>
      <div style={{display:'flex',gap:'.75rem',maxWidth:'640px',marginBottom:'1rem',flexWrap:'wrap'}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="https://yourdomain.com" style={{flex:1,minWidth:'220px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}} />
        <button onClick={run} disabled={loading} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}>
          {loading ? 'Checking...' : 'Check speed impact'}
        </button>
      </div>
      {error && <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.25)',borderRadius:'10px',padding:'.85rem 1.1rem',color:'#f87171',fontSize:'.85rem',marginBottom:'1.5rem',maxWidth:'640px'}}>{error}</div>}
      {loading && <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,.4)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',padding:'2rem 0'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c8f247',animation:'blink 1s ease-in-out infinite',display:'inline-block'}} />Fetching Core Web Vitals, translating to AEO impact...</div>}

      {data && (
        <div style={{marginTop:'2rem'}}>
          {data.psi_error && <div style={{background:'rgba(200,242,71,.06)',border:'1px solid rgba(200,242,71,.2)',borderRadius:'8px',padding:'.65rem 1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'#c8f247',marginBottom:'1.5rem'}}>{data.psi_error}</div>}

          {/* Score + Summary */}
          <div style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:'1.25rem',marginBottom:'1.5rem'}}>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'2.8rem',color:scoreColor(data.aeo_speed_score),lineHeight:1}}>{data.aeo_speed_score}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,.4)',letterSpacing:'.08em',marginTop:'.4rem'}}>AEO SPEED SCORE</div>
            </div>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem'}}>
              <div style={{fontSize:'.9rem',color:'rgba(255,255,255,.75)',lineHeight:1.7}}>{data.summary}</div>
            </div>
          </div>

          {/* CWV metrics */}
          {data.cwv && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.75rem',marginBottom:'1.5rem'}}>
              {[
                {label:'Performance',val:data.cwv.performance+'/100',score:data.cwv.performance/100},
                {label:'LCP',val:data.cwv.lcp,score:data.cwv.lcp_score},
                {label:'CLS',val:data.cwv.cls,score:data.cwv.cls_score},
                {label:'TTFB',val:data.cwv.ttfb,score:data.cwv.ttfb_score},
              ].map(m=>(
                <div key={m.label} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1rem',textAlign:'center'}}>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.2rem',color:scoreColor(Math.round(m.score*100)),marginBottom:'.25rem'}}>{m.val}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,.4)'}}>{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Engine impact */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.75rem',marginBottom:'1.5rem'}}>
            {data.engine_impact?.map((e: any) => (
              <div key={e.engine} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1.1rem'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.5rem'}}>
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.88rem'}}>{e.engine}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',textTransform:'uppercase',color:impactColor(e.impact),background:`${impactColor(e.impact)}18`,border:`1px solid ${impactColor(e.impact)}40`,padding:'.15rem .45rem',borderRadius:'4px'}}>{e.impact}</span>
                </div>
                <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)',lineHeight:1.55}}>{e.reason}</div>
              </div>
            ))}
          </div>

          {/* Fixes */}
          <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
            {data.fixes?.map((f: any, i: number) => (
              <div key={i} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1rem 1.25rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',textTransform:'uppercase',color:f.priority==='HIGH'?'#f87171':'#c8f247',background:f.priority==='HIGH'?'rgba(248,113,113,.08)':'rgba(200,242,71,.08)',border:`1px solid ${f.priority==='HIGH'?'rgba(248,113,113,.25)':'rgba(200,242,71,.25)'}`,padding:'.15rem .45rem',borderRadius:'4px',flexShrink:0,marginTop:'.1rem'}}>{f.priority}</span>
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.88rem',marginBottom:'.25rem'}}>{f.title}</div>
                  <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)',lineHeight:1.55,marginBottom:'.3rem'}}>{f.desc}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'#4ade80'}}>{f.aeo_gain}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}