'use client'
import { useState } from 'react'

export function ReadabilityClient() {
  const [mode, setMode] = useState<'url'|'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  async function run() {
    if (mode === 'url' && !url.trim()) return
    if (mode === 'text' && !text.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const body = mode === 'url' ? { url } : { text }
      const res = await fetch('/api/readability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const gradeColor = (g: string) => ({'A':'#4ade80','B':'#c8f247','C':'#fb923c','D':'#f87171','F':'#ef4444'}[g]||'#c8f247')
  const scoreColor = (s: number) => s >= 70 ? '#4ade80' : s >= 40 ? '#c8f247' : '#f87171'
  const issueColor = (t: string) => t==='critical' ? '#f87171' : t==='warning' ? '#c8f247' : '#22d3ee'

  return (
    <div>
      {/* Mode toggle */}
      <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem'}}>
        {(['url','text'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.45rem 1rem',borderRadius:'8px',border:`1px solid ${mode===m?'rgba(200,242,71,.4)':'rgba(255,255,255,.1)'}`,background:mode===m?'rgba(200,242,71,.08)':'transparent',color:mode===m?'#c8f247':'rgba(255,255,255,.5)',cursor:'pointer'}}>
            {m==='url'?'Paste URL':'Paste text'}
          </button>
        ))}
      </div>

      <div style={{display:'flex',gap:'.75rem',maxWidth:'640px',marginBottom:'1rem',flexWrap:'wrap',alignItems:'flex-start'}}>
        {mode === 'url'
          ? <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="https://yourdomain.com/page" style={{flex:1,minWidth:'220px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}} />
          : <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your page content here..." rows={5} style={{flex:1,minWidth:'220px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.82rem',color:'#fff',outline:'none',resize:'vertical'}} />
        }
        <button onClick={run} disabled={loading} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}>
          {loading ? 'Analysing...' : 'Score readability'}
        </button>
      </div>

      {error && <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.25)',borderRadius:'10px',padding:'.85rem 1.1rem',color:'#f87171',fontSize:'.85rem',marginBottom:'1.5rem',maxWidth:'640px'}}>{error}</div>}
      {loading && <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,.4)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',padding:'2rem 0'}}><span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c8f247',animation:'blink 1s ease-in-out infinite',display:'inline-block'}} />Scoring AI readability across 5 dimensions...</div>}

      {data && (
        <div style={{marginTop:'2rem'}}>
          {/* Score header */}
          <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:'1.25rem',marginBottom:'1.5rem'}}>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3rem',color:gradeColor(data.grade),lineHeight:1}}>{data.grade}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,.4)',marginTop:'.3rem'}}>{data.overall_score}/100</div>
            </div>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem'}}>
              <div style={{fontSize:'.9rem',color:'rgba(255,255,255,.75)',lineHeight:1.7,marginBottom:'.75rem'}}>{data.summary}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>
                {data.keyword_clusters?.map((k: string) => <span key={k} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,.4)',border:'1px solid rgba(255,255,255,.1)',padding:'.15rem .5rem',borderRadius:'4px'}}>{k}</span>)}
              </div>
            </div>
          </div>

          {/* Score bars */}
          <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'14px',padding:'1.5rem',marginBottom:'1.25rem'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:'1.1rem'}}>Score breakdown</div>
            <div style={{display:'flex',flexDirection:'column',gap:'.85rem'}}>
              {[
                {label:'BLUF structure',val:data.scores?.bluf_score},
                {label:'Answer density',val:data.scores?.answer_density},
                {label:'Content structure',val:data.scores?.structure_score},
                {label:'Sentence clarity',val:data.scores?.sentence_clarity},
                {label:'FAQ / Q&A presence',val:data.scores?.faq_presence},
              ].map(s=>(
                <div key={s.label} style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                  <span style={{fontSize:'.78rem',color:'rgba(255,255,255,.7)',width:'150px',flexShrink:0}}>{s.label}</span>
                  <div style={{flex:1,height:'5px',background:'rgba(255,255,255,.07)',borderRadius:'100px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${s.val||0}%`,background:`linear-gradient(90deg,${scoreColor(s.val||0)},${scoreColor(s.val||0)}99)`,borderRadius:'100px'}} />
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'rgba(255,255,255,.5)',width:'28px',textAlign:'right'}}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1.25rem'}}>
            {data.issues?.map((issue: any, i: number) => (
              <div key={i} style={{background:'#100e22',border:'1px solid rgba(255,255,255,.07)',borderRadius:'10px',padding:'.9rem 1.1rem',display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',textTransform:'uppercase',color:issueColor(issue.type),background:`${issueColor(issue.type)}18`,border:`1px solid ${issueColor(issue.type)}40`,padding:'.15rem .45rem',borderRadius:'4px',flexShrink:0,marginTop:'.1rem'}}>{issue.type}</span>
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.2rem'}}>{issue.title}</div>
                  <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.6)',lineHeight:1.55}}>{issue.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rewrite suggestion */}
          {data.rewrite_suggestion && (
            <div style={{background:'rgba(74,222,128,.04)',border:'1px solid rgba(74,222,128,.2)',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.75rem'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#4ade80'}}>✦ BLUF rewrite suggestion</span>
                <button onClick={()=>{navigator.clipboard.writeText(data.rewrite_suggestion);setCopied(true);setTimeout(()=>setCopied(false),1800)}} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',background:'none',border:'none',color:copied?'#4ade80':'rgba(255,255,255,.4)',cursor:'pointer'}}>{copied?'✓ Copied':'Copy'}</button>
              </div>
              <p style={{fontSize:'.88rem',color:'#fff',lineHeight:1.7}}>{data.rewrite_suggestion}</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}