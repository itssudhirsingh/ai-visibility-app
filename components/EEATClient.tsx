'use client'
import { useState } from 'react'

export function EEATClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)

  async function run() {
    if (!url.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/eeat-audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const verdictColor = (v: string) => v==='pass'?'#4ade80':v==='warn'?'#c8f247':'#f87171'
  const verdictLabel = (v: string) => v==='pass'?'Pass':v==='warn'?'Warn':'Fail'
  const readinessColor = (r: string) => r==='good'?'#4ade80':r==='fair'?'#c8f247':'#f87171'
  const effortColor = (e: string) => e==='low'?'#4ade80':e==='med'?'#c8f247':'#f87171'

  const PILLARS = ['experience','expertise','authoritativeness','trustworthiness']
  const PILLAR_LABELS: Record<string,string> = {experience:'Experience',expertise:'Expertise',authoritativeness:'Authoritativeness',trustworthiness:'Trustworthiness'}
  const PILLAR_ICONS: Record<string,string> = {experience:'⚡',expertise:'🎓',authoritativeness:'🏅',trustworthiness:'🛡'}

  return (
    <div>
      <div style={{display:'flex',gap:'.75rem',maxWidth:'640px',marginBottom:'1rem',flexWrap:'wrap'}}>
        <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="https://yourdomain.com" style={{flex:1,minWidth:'220px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}} />
        <button onClick={run} disabled={loading} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}>
          {loading ? 'Auditing...' : 'Run E-E-A-T audit'}
        </button>
      </div>
      {error && <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.25)',borderRadius:'10px',padding:'.85rem 1.1rem',color:'#f87171',fontSize:'.85rem',marginBottom:'1.5rem',maxWidth:'640px'}}>{error}</div>}
      {loading && <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,.4)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',padding:'2rem 0'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c8f247',animation:'blink 1s ease-in-out infinite',display:'inline-block'}} />Auditing Experience, Expertise, Authoritativeness, Trustworthiness...</div>}

      {data && (
        <div style={{marginTop:'2rem'}}>
          {/* Score + summary */}
          <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:'1.25rem',marginBottom:'1.5rem'}}>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'2.8rem',color:data.overall_score>=70?'#4ade80':data.overall_score>=40?'#c8f247':'#f87171',lineHeight:1}}>{data.overall_score}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,.4)',letterSpacing:'.08em',marginTop:'.4rem',textAlign:'center'}}>E-E-A-T SCORE</div>
            </div>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem'}}>
              <div style={{fontSize:'.9rem',color:'rgba(255,255,255,.75)',lineHeight:1.7,marginBottom:'1rem'}}>{data.summary}</div>
              <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                {Object.entries(data.ai_engine_readiness||{}).filter(([k])=>k!=='reason').map(([eng,r])=>(
                  <span key={eng} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:readinessColor(r as string),background:`${readinessColor(r as string)}18`,border:`1px solid ${readinessColor(r as string)}40`,padding:'.2rem .5rem',borderRadius:'4px'}}>{eng}: {r as string}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 pillars */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {PILLARS.map(p=>{
              const pillar = data.pillars?.[p]
              if (!pillar) return null
              return (
                <div key={p} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.25rem'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.85rem'}}>
                    <span style={{fontSize:'1.1rem'}}>{PILLAR_ICONS[p]}</span>
                    <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',flex:1}}>{PILLAR_LABELS[p]}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',textTransform:'uppercase',color:verdictColor(pillar.verdict),background:`${verdictColor(pillar.verdict)}18`,border:`1px solid ${verdictColor(pillar.verdict)}40`,padding:'.15rem .45rem',borderRadius:'4px'}}>{verdictLabel(pillar.verdict)}</span>
                    <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:verdictColor(pillar.verdict)}}>{pillar.score}</span>
                  </div>
                  {pillar.found?.length > 0 && (
                    <div style={{marginBottom:'.6rem'}}>
                      {pillar.found.map((f: string,i: number)=><div key={i} style={{fontSize:'.78rem',color:'#4ade80',display:'flex',gap:'.4rem',alignItems:'flex-start',marginBottom:'.25rem'}}><span style={{flexShrink:0}}>✓</span>{f}</div>)}
                    </div>
                  )}
                  {pillar.missing?.length > 0 && (
                    <div style={{marginBottom:'.75rem'}}>
                      {pillar.missing.map((m: string,i: number)=><div key={i} style={{fontSize:'.78rem',color:'#f87171',display:'flex',gap:'.4rem',alignItems:'flex-start',marginBottom:'.25rem'}}><span style={{flexShrink:0}}>✗</span>{m}</div>)}
                    </div>
                  )}
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'#c8f247',background:'rgba(200,242,71,.06)',border:'1px solid rgba(200,242,71,.15)',borderRadius:'6px',padding:'.5rem .75rem'}}>→ {pillar.fix}</div>
                </div>
              )
            })}
          </div>

          {/* Quick wins */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:'.75rem'}}>Quick wins</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
              {data.quick_wins?.map((w: any,i: number)=>(
                <div key={i} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'1rem 1.25rem',display:'flex',gap:'1rem',alignItems:'flex-start',flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:'200px'}}>
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.25rem'}}>{w.title}</div>
                    <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)',lineHeight:1.55}}>{w.desc}</div>
                  </div>
                  <div style={{display:'flex',gap:'.4rem',flexShrink:0}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:effortColor(w.effort),background:`${effortColor(w.effort)}18`,border:`1px solid ${effortColor(w.effort)}40`,padding:'.15rem .45rem',borderRadius:'4px'}}>effort: {w.effort}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:effortColor(w.impact),background:`${effortColor(w.impact)}18`,border:`1px solid ${effortColor(w.impact)}40`,padding:'.15rem .45rem',borderRadius:'4px'}}>impact: {w.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}