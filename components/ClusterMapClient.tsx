'use client'
import { useState } from 'react'

interface Article {
  title: string
  slug: string
  search_volume_score: number
  aeo_score: number
  primary_keyword: string
}
interface Spoke {
  title: string
  slug: string
  search_volume_score: number
  aeo_score: number
  intent: string
  articles: Article[]
}
interface CannibalRisk {
  topic_a: string
  topic_b: string
  risk: 'low' | 'medium' | 'high'
  fix: string
}
interface ClusterData {
  pillar: { topic: string; slug: string; intent_summary: string; paa_count: number; viable: boolean }
  spokes: Spoke[]
  linking_map: { from_slug: string; to_slug: string; type: string }[]
  cannibalization_risks: CannibalRisk[]
  rollout_plan: { phase_1: string[]; phase_2: string[]; estimated_timeline_weeks: number }
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,0.4)',width:'30px',flexShrink:0}}>{label}</span>
      <div style={{flex:1,height:'4px',background:'rgba(255,255,255,.08)',borderRadius:'100px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${value}%`,background:color,borderRadius:'100px'}} />
      </div>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'rgba(255,255,255,0.75)',width:'22px',textAlign:'right'}}>{value}</span>
    </div>
  )
}

export default function ClusterMapClient() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<ClusterData | null>(null)
  const [expandedSpoke, setExpandedSpoke] = useState<string | null>(null)

  async function generate() {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await fetch('/api/cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong generating your cluster.')
      } else {
        setData(json)
      }
    } catch (e) {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  const riskColor = (r: string) => r === 'high' ? '#f87171' : r === 'medium' ? '#c8f247' : '#4ade80'

  return (
    <div>
      {/* Input */}
      <div style={{display:'flex',gap:'.75rem',maxWidth:'640px',marginBottom:'1rem',flexWrap:'wrap'}}>
        <input
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && generate()}
          placeholder="e.g. content marketing for SaaS"
          style={{flex:1,minWidth:'240px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:'10px',padding:'.85rem 1.1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.85rem',color:'#fff',outline:'none'}}
        />
        <button
          onClick={generate}
          disabled={loading}
          style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',background:loading?'rgba(200,242,71,.4)':'#c8f247',color:'#04030c',border:'none',borderRadius:'10px',padding:'.85rem 1.6rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}
        >
          {loading ? 'Building cluster...' : 'Generate cluster map'}
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
          Researching pillar viability, generating spokes, mapping articles, checking cannibalization risk...
        </div>
      )}

      {data && (
        <div style={{marginTop:'2.5rem'}}>

          {/* Pillar summary */}
          <div style={{background:'rgba(123,108,255,.06)',border:'1px solid rgba(123,108,255,.2)',borderRadius:'14px',padding:'1.5rem',marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.75rem',flexWrap:'wrap'}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#7b6cff',background:'rgba(123,108,255,.12)',border:'1px solid rgba(123,108,255,.25)',padding:'.2rem .55rem',borderRadius:'4px'}}>Pillar</span>
              {data.pillar.viable ? (
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#4ade80',background:'rgba(74,222,128,.1)',border:'1px solid rgba(74,222,128,.25)',padding:'.2rem .55rem',borderRadius:'4px'}}>✓ Viable cluster</span>
              ) : (
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#f87171',background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.25)',padding:'.2rem .55rem',borderRadius:'4px'}}>⚠ Too narrow — consider broadening</span>
              )}
            </div>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.4rem',marginBottom:'.6rem'}}>{data.pillar.topic}</div>
            <div style={{fontSize:'.85rem',color:'rgba(255,255,255,0.75)',lineHeight:1.65,marginBottom:'.75rem'}}>{data.pillar.intent_summary}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'rgba(255,255,255,0.4)'}}>~{data.pillar.paa_count} distinct "People Also Ask" questions detected</div>
          </div>

          {/* Spokes */}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#7b6cff',marginBottom:'1rem'}}>
            {data.spokes.length} Spokes · {data.spokes.reduce((a,s)=>a+s.articles.length,0)} Articles
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'2.5rem'}}>
            {data.spokes.map((spoke, i) => {
              const isOpen = expandedSpoke === spoke.slug
              return (
                <div key={spoke.slug} style={{background:'#100e22',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',overflow:'hidden'}}>
                  <div
                    onClick={()=>setExpandedSpoke(isOpen ? null : spoke.slug)}
                    style={{display:'grid',gridTemplateColumns:'24px 1fr 140px 140px 90px 20px',gap:'1rem',alignItems:'center',padding:'1rem 1.25rem',cursor:'pointer'}}
                  >
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'rgba(255,255,255,0.4)'}}>{String(i+1).padStart(2,'0')}</span>
                    <div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.92rem'}}>{spoke.title}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'rgba(255,255,255,0.4)',marginTop:'.15rem'}}>{spoke.articles.length} articles · {spoke.intent}</div>
                    </div>
                    <ScoreBar label="SEO" value={spoke.search_volume_score} color="linear-gradient(90deg,#22d3ee,#67e8f9)" />
                    <ScoreBar label="AEO" value={spoke.aeo_score} color="linear-gradient(90deg,#c8f247,#a3e635)" />
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'rgba(255,255,255,0.4)',textAlign:'right'}}>{spoke.intent}</span>
                    <span style={{fontSize:'.7rem',color:'rgba(255,255,255,0.4)',transform:isOpen?'rotate(180deg)':'none',transition:'transform .2s',textAlign:'center'}}>▾</span>
                  </div>
                  {isOpen && (
                    <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',padding:'1rem 1.25rem 1.25rem 3.25rem'}}>
                      {spoke.articles.map(article => (
                        <div key={article.slug} style={{display:'grid',gridTemplateColumns:'1fr 140px 140px',gap:'1rem',alignItems:'center',padding:'.6rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                          <div>
                            <div style={{fontSize:'.82rem',color:'#fff'}}>{article.title}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'rgba(255,255,255,0.4)',marginTop:'.1rem'}}>kw: {article.primary_keyword}</div>
                          </div>
                          <ScoreBar label="SEO" value={article.search_volume_score} color="linear-gradient(90deg,#22d3ee,#67e8f9)" />
                          <ScoreBar label="AEO" value={article.aeo_score} color="linear-gradient(90deg,#c8f247,#a3e635)" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Cannibalization risks */}
          {data.cannibalization_risks.length > 0 && (
            <div style={{marginBottom:'2.5rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'#f87171',marginBottom:'1rem'}}>
                ⚠ Cannibalization Risks
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
                {data.cannibalization_risks.map((risk, i) => (
                  <div key={i} style={{background:'#100e22',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'10px',padding:'1rem 1.25rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.5rem',flexWrap:'wrap'}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.06em',textTransform:'uppercase',color:riskColor(risk.risk),background:`${riskColor(risk.risk)}18`,border:`1px solid ${riskColor(risk.risk)}40`,padding:'.18rem .5rem',borderRadius:'4px'}}>{risk.risk} risk</span>
                      <span style={{fontSize:'.82rem',color:'#fff'}}>{risk.topic_a} <span style={{color:'rgba(255,255,255,0.4)'}}>vs</span> {risk.topic_b}</span>
                    </div>
                    <div style={{fontSize:'.8rem',color:'rgba(255,255,255,0.75)',lineHeight:1.5}}>{risk.fix}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rollout plan */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#4ade80',marginBottom:'.75rem'}}>Phase 1 — Launch now</div>
              {data.rollout_plan.phase_1.map(slug => (
                <div key={slug} style={{fontSize:'.8rem',color:'rgba(255,255,255,0.75)',padding:'.3rem 0'}}>→ {slug}</div>
              ))}
            </div>
            <div style={{background:'#100e22',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',padding:'1.25rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#c8f247',marginBottom:'.75rem'}}>
                Phase 2 — Next {data.rollout_plan.estimated_timeline_weeks} weeks
              </div>
              {data.rollout_plan.phase_2.map(slug => (
                <div key={slug} style={{fontSize:'.8rem',color:'rgba(255,255,255,0.75)',padding:'.3rem 0'}}>→ {slug}</div>
              ))}
            </div>
          </div>

        </div>
      )}

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}