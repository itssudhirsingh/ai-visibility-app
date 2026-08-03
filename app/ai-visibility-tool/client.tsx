'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const C = {
  bg:'#04030c',card:'#0d0b1e',card2:'#100e22',
  border:'rgba(255,255,255,0.07)',borderH:'rgba(255,255,255,0.14)',
  text:'#ede9ff',muted:'rgba(255,255,255,0.72)',muted2:'rgba(255,255,255,0.42)',
  lime:'#caff45',violet:'#927cff',cyan:'#45e4ff',amber:'#ffc45c',green:'#52e38e',red:'#f87171',
}

interface Engine { n:string;s:number;sentiment:string;status:string;desc:string;citations:string[] }
interface Comp    { n:string;s:number;mentions:number;gap:string }
interface Fix     { priority:string;title:string;desc:string }
interface SchemaItem { label:string;status:string }
interface Probe   { engine:string;query:string;volume:string;response:string;cited:boolean;position:number|null }
interface Opportunity { query:string;volume:string;competitor:string }
interface Result  {
  score:number;mentions:number;sentiment:string;engines_citing:string;country?:string
  engines:Engine[];comps:Comp[];fixes:Fix[];eeat:Record<string,number>
  schema:SchemaItem[];llms_txt:{exists:boolean;valid:boolean;content:string}
  bluf:{score:number;headline:string;issues:string[]}
  query_probes:Probe[];weekly_trend:{week:string;score:number}[]
  opportunities:Opportunity[]
}

const COUNTRIES = ['Global','United States','United Kingdom','India','Canada','Australia','Germany','France','Singapore','UAE','Netherlands','Brazil','Japan']

const TOOLS_LIST = [
  {label:'Answer Gap Finder',   href:'/ai-answer-gap-finder'},
  {label:'E-E-A-T Checker',    href:'/ai-eeat-checker'},
  {label:'BLUF Builder',       href:'/bluf-builder'},
  {label:'Schema Generator',   href:'/ai-schema-markup-generator'},
  {label:'Topic Cluster Map',  href:'/topic-cluster-generator'},
  {label:'Page Speed AEO',     href:'/ai-page-speed-analysis-tools'},
  {label:'Readability Checker',href:'/ai-readability-checker'},
  {label:'Visibility Heatmap', href:'/ai-visibility-heatmap'},
  {label:'llms.txt Validator', href:'/llms-txt-live-validator'},
  {label:'llms.txt Generator', href:'/llms-text-generator'},
  {label:'Robots.txt Gen',     href:'/robots-txt'},
  {label:'BLUF Templates',     href:'/bluf-templates'},
]

function normalize(d:Partial<Result>):Result {
  return {
    score:d.score??0,mentions:d.mentions??0,sentiment:d.sentiment??'neutral',
    engines_citing:d.engines_citing??'0/6',country:d.country??'Global',
    engines:d.engines??[],comps:d.comps??[],fixes:d.fixes??[],
    eeat:d.eeat??{experience:0,expertise:0,authority:0,trust:0},
    schema:d.schema??[],llms_txt:d.llms_txt??{exists:false,valid:false,content:''},
    bluf:d.bluf??{score:0,headline:'',issues:[]},
    query_probes:d.query_probes??[],weekly_trend:d.weekly_trend??[],
    opportunities:d.opportunities??[],
  }
}

function sc(s:number){ return s>=70?C.green:s>=40?C.lime:C.red }

function Pill({label,color}:{label:string;color:string}){
  return (
    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.06em',
      textTransform:'uppercase',padding:'2px 7px',borderRadius:4,
      background:`${color}15`,border:`1px solid ${color}35`,color,whiteSpace:'nowrap'}}>
      {label}
    </span>
  )
}

function AppInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url,setUrl]         = useState('')
  const [country,setCountry] = useState('Global')
  const [loading,setLoading] = useState(false)
  const [result,setResult]   = useState<Result|null>(null)
  const [resultUrl,setResultUrl] = useState('')
  const [scanError,setScanError] = useState('')
  const [view,setView]       = useState<'overview'|'engines'|'probes'|'competitors'|'technical'|'fixes'>('overview')
  const [recentScans,setRecentScans] = useState<{url:string;score:number}[]>([])
  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [activeProbe,setActiveProbe] = useState(0)

  useEffect(()=>{
    const p = searchParams.get('url')
    if(p){ setUrl(p); runAnalysis(p) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function runAnalysis(inputUrl?:string,inputCountry?:string){
    const target=(inputUrl||url).trim().replace(/^https?:\/\//,'')
    if(!target) return
    const supabase = createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if(!user){ router.push(`/login?next=/ai-visibility-tool?url=${encodeURIComponent(target)}`); return }
    setLoading(true);setView('overview');setScanError('');setSidebarOpen(false)
    try {
      const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:target,country:inputCountry||country})})
      const data = await res.json()
      if(!res.ok||data.error){ setResult(null);setScanError(data.error||`Could not analyse (${res.status}). Try again.`);return }
      const r=normalize(data); setResult(r); setResultUrl(target)
      setRecentScans(prev=>[{url:target,score:r.score},...prev.filter(s=>s.url!==target)].slice(0,5))
    } catch { setResult(null);setScanError('Could not reach the server. Check your connection.') }
    finally { setLoading(false) }
  }

  const NAV = [{id:'overview',label:'Overview'},{id:'engines',label:'6 Engines'},{id:'probes',label:'Query Probes'},{id:'competitors',label:'Competitors'},{id:'technical',label:'Technical'},{id:'fixes',label:'Fix List'}] as const

  return (
    <div style={{display:'flex',height:'calc(100vh - 65px)',overflow:'hidden'}}>
      {/* Sidebar */}
      <div style={{
        width:220,flexShrink:0,borderRight:`1px solid ${C.border}`,display:'flex',
        flexDirection:'column',overflow:'hidden',background:C.bg,
        ...(sidebarOpen?{position:'fixed',inset:0,zIndex:200,width:'100%',background:'rgba(4,3,12,.98)'}:{}),
      }}>
        {sidebarOpen && <button onClick={()=>setSidebarOpen(false)} style={{display:'flex',margin:'1rem',alignSelf:'flex-end',background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:'1.2rem'}}>✕</button>}

        <div style={{padding:'1.25rem 1rem',borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.1em',textTransform:'uppercase',color:C.muted2,marginBottom:'.4rem'}}>Dashboard</div>
          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:C.text,wordBreak:'break-all'}}>{resultUrl||'AI Visibility'}</div>
          {result && <div style={{display:'flex',alignItems:'center',gap:'.4rem',marginTop:'.35rem'}}><div style={{width:7,height:7,borderRadius:'50%',background:sc(result.score)}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:sc(result.score)}}>{result.score}/100</span></div>}
        </div>

        {result && (
          <div style={{padding:'.4rem 0',borderBottom:`1px solid ${C.border}`}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>{setView(n.id as typeof view);setSidebarOpen(false)}}
                style={{width:'100%',textAlign:'left',padding:'.5rem 1rem',background:view===n.id?'rgba(202,255,69,.06)':'transparent',
                  borderLeft:view===n.id?`2px solid ${C.lime}`:'2px solid transparent',
                  border:'none',color:view===n.id?C.lime:C.muted2,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.06em',textTransform:'uppercase',cursor:'pointer'}}>
                {n.label}
              </button>
            ))}
          </div>
        )}

        {recentScans.length>0 && (
          <div style={{padding:'.6rem 1rem',borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'.1em',textTransform:'uppercase',color:C.muted2,marginBottom:'.4rem'}}>Recent</div>
            {recentScans.map((s,i)=>(
              <div key={i} onClick={()=>{setUrl(s.url);runAnalysis(s.url)}}
                style={{display:'flex',justifyContent:'space-between',padding:'.3rem 0',cursor:'pointer',borderBottom:`1px solid rgba(255,255,255,.04)`}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:C.muted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:140}}>{s.url}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:sc(s.score),flexShrink:0,marginLeft:'.4rem'}}>{s.score}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{padding:'.6rem 1rem',flex:1,overflowY:'auto'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'.1em',textTransform:'uppercase',color:C.muted2,marginBottom:'.5rem'}}>14 Free Tools</div>
          {TOOLS_LIST.map(t=>(
            <Link key={t.href} href={t.href} style={{display:'block',padding:'.3rem 0',borderBottom:`1px solid rgba(255,255,255,.04)`,textDecoration:'none'}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.muted2}}>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflowY:'auto',position:'relative'}}>
        {/* Mobile toggle */}
        <button onClick={()=>setSidebarOpen(true)}
          style={{display:'none',position:'fixed',bottom:'1.5rem',left:'1.5rem',zIndex:100,
            width:42,height:42,borderRadius:'50%',background:C.card2,border:`1px solid ${C.border}`,
            color:C.muted,fontSize:'1rem',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          ☰
        </button>

        {/* Scan bar */}
        <div style={{padding:'1.25rem 1.5rem',borderBottom:`1px solid ${C.border}`,background:'rgba(13,11,30,.85)',backdropFilter:'blur(8px)',position:'sticky',top:0,zIndex:10}}>
          <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',alignItems:'center',maxWidth:760}}>
            <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAnalysis()}
              placeholder="yourdomain.com"
              style={{flex:1,minWidth:180,background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,borderRadius:8,padding:'.58rem .85rem',color:C.text,fontSize:'.85rem',fontFamily:"'JetBrains Mono',monospace",outline:'none'}}/>
            <select value={country} onChange={e=>setCountry(e.target.value)}
              style={{background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,borderRadius:8,padding:'.58rem .7rem',color:C.muted2,fontSize:'.75rem',fontFamily:"'JetBrains Mono',monospace",outline:'none',cursor:'pointer'}}>
              {COUNTRIES.map(c=><option key={c} value={c} style={{background:C.card2}}>{c}</option>)}
            </select>
            <button onClick={()=>runAnalysis()} disabled={loading}
              style={{background:loading?'rgba(202,255,69,.4)':C.lime,color:'#07100b',border:'none',borderRadius:8,padding:'.58rem 1.2rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',cursor:loading?'default':'pointer',whiteSpace:'nowrap'}}>
              {loading?'Scanning…':'Scan'}
            </button>
          </div>
        </div>

        <div style={{padding:'1.5rem'}}>
          {/* Loading */}
          {loading && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'4rem 2rem',textAlign:'center',gap:'1rem'}}>
              <div style={{width:36,height:36,border:`2px solid rgba(202,255,69,.2)`,borderTopColor:C.lime,borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.muted2,lineHeight:1.8}}>
                Scanning across ChatGPT · Perplexity · Gemini · Grok · Copilot · Claude…
              </div>
            </div>
          )}

          {/* Error */}
          {!loading&&scanError&&(
            <div style={{maxWidth:500,margin:'3rem auto',textAlign:'center'}}>
              <div style={{color:C.red,fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,marginBottom:'.5rem'}}>Scan failed</div>
              <div style={{fontSize:'.85rem',color:C.muted2,marginBottom:'1rem',lineHeight:1.65}}>{scanError}</div>
              <button onClick={()=>{setScanError('');runAnalysis()}} style={{border:`1px solid ${C.border}`,background:'rgba(255,255,255,.03)',color:C.text,borderRadius:7,padding:'7px 16px',fontSize:'.78rem',cursor:'pointer'}}>Try again</button>
            </div>
          )}

          {/* Empty */}
          {!loading&&!result&&!scanError&&(
            <div style={{maxWidth:520,margin:'2.5rem auto'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',letterSpacing:'-.02em',marginBottom:'.6rem'}}>Is your brand visible to AI?</div>
              <div style={{fontSize:'.9rem',color:C.muted,lineHeight:1.78,marginBottom:'1.5rem'}}>
                Paste any domain. See your AEO score across 6 LLMs, real query probe response text, competitor benchmarks, E-E-A-T signals, and a fix list — in 30 seconds.
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem',marginBottom:'2rem'}}>
                {['notioncue.com','stripe.com','notion.so','linear.app'].map(d=>(
                  <button key={d} onClick={()=>{setUrl(d);runAnalysis(d)}}
                    style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',padding:'.35rem .8rem',borderRadius:6,border:`1px solid ${C.border}`,background:'rgba(255,255,255,.03)',color:C.muted2,cursor:'pointer'}}>
                    {d}
                  </button>
                ))}
              </div>
              <div style={{background:'rgba(146,124,255,.05)',border:`1px solid rgba(146,124,255,.15)`,borderRadius:10,padding:'1rem',fontSize:'.82rem',color:C.muted,lineHeight:1.7}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.violet,marginBottom:'.5rem'}}>vs Ahrefs / Semrush</div>
                {['6 LLMs incl. Grok + Claude','Real AI response text in Query Probes','E-E-A-T audit + BLUF scoring','14 free AEO tools — all in one place'].map((f,i)=>(
                  <div key={i} style={{display:'flex',gap:'.5rem',padding:'.2rem 0'}}><span style={{color:C.lime}}>✓</span>{f}</div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!loading&&result&&(
            <div className="fade-in">

              {/* OVERVIEW */}
              {view==='overview'&&(
                <div>
                  {/* Score row */}
                  <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:'.75rem',marginBottom:'.75rem'}}>
                    <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.5rem',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3.2rem',color:sc(result.score),lineHeight:1,letterSpacing:'-.03em'}}>{result.score}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.1em',textTransform:'uppercase',color:C.muted2,marginTop:'.4rem'}}>AEO Score</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.muted2,marginTop:'.2rem'}}>{result.engines_citing} engines</div>
                      {result.country&&result.country!=='Global'&&<div style={{marginTop:'.4rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:C.muted2,background:'rgba(255,255,255,.04)',border:`1px solid ${C.border}`,borderRadius:4,padding:'2px 6px'}}>{result.country}</div>}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.5rem'}}>
                      {[
                        {l:'Monthly AI mentions',v:String(result.mentions),c:C.lime},
                        {l:'Sentiment',v:result.sentiment,c:result.sentiment==='positive'?C.green:result.sentiment==='negative'?C.red:C.amber},
                        {l:'Engines citing',v:result.engines_citing,c:C.cyan},
                        {l:'BLUF score',v:`${result.bluf?.score??0}/100`,c:C.violet},
                        {l:'llms.txt',v:result.llms_txt?.exists?'Found':'Missing',c:result.llms_txt?.exists?C.green:C.red},
                        {l:'E-E-A-T avg',v:`${Math.round(Object.values(result.eeat).reduce((a,b)=>a+b,0)/4)}/100`,c:sc(Math.round(Object.values(result.eeat).reduce((a,b)=>a+b,0)/4))},
                      ].map(m=>(
                        <div key={m.l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:'.85rem'}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.06em',textTransform:'uppercase',color:C.muted2,marginBottom:'.3rem'}}>{m.l}</div>
                          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.1rem',color:m.c}}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engine mini cards */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'.5rem',marginBottom:'.75rem'}}>
                    {result.engines.map(e=>(
                      <div key={e.n} onClick={()=>setView('engines')}
                        style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:'.75rem .6rem',cursor:'pointer',textAlign:'center'}}>
                        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.25rem',color:sc(e.s),lineHeight:1}}>{e.s}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:C.muted2,margin:'.25rem 0'}}>{e.n}</div>
                        <Pill label={e.status} color={e.status==='CITED'?C.green:e.status==='LOW'?C.amber:C.red}/>
                      </div>
                    ))}
                  </div>

                  {/* Probes preview + Opportunities */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'.75rem'}}>
                    {result.query_probes?.length>0&&(
                      <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.85rem'}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>Query Probes — Real AI Responses</div>
                          <button onClick={()=>setView('probes')} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:C.violet,background:'none',border:'none',cursor:'pointer'}}>All →</button>
                        </div>
                        <div style={{display:'flex',gap:'.35rem',marginBottom:'.75rem',flexWrap:'wrap'}}>
                          {result.query_probes.slice(0,4).map((p,i)=>(
                            <button key={i} onClick={()=>setActiveProbe(i)}
                              style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',padding:'.2rem .55rem',borderRadius:4,
                                border:`1px solid ${activeProbe===i?C.violet+'50':C.border}`,
                                background:activeProbe===i?'rgba(146,124,255,.08)':'transparent',
                                color:activeProbe===i?C.violet:C.muted2,cursor:'pointer'}}>
                              {p.engine}
                            </button>
                          ))}
                        </div>
                        {result.query_probes[activeProbe]&&(()=>{
                          const p=result.query_probes[activeProbe]
                          return (
                            <div>
                              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:C.muted2,marginBottom:'.4rem',lineHeight:1.5}}>
                                Q: <em style={{color:C.text}}>"{p.query}"</em>
                                <span style={{marginLeft:'.4rem',fontSize:'.55rem'}}>(vol:{p.volume})</span>
                              </div>
                              <div style={{background:'rgba(255,255,255,.03)',border:`1px solid ${p.cited?C.green+'25':C.red+'25'}`,borderRadius:8,padding:'.7rem',fontSize:'.78rem',color:C.muted,lineHeight:1.7,position:'relative'}}>
                                <div style={{position:'absolute',top:'.45rem',right:'.5rem'}}><Pill label={p.cited?'CITED':'NOT CITED'} color={p.cited?C.green:C.red}/></div>
                                "{p.response}"
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    {result.opportunities?.length>0&&(
                      <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem'}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.85rem'}}>Citation Gaps — Competitors Winning</div>
                        {result.opportunities.map((o,i)=>(
                          <div key={i} style={{padding:'.55rem 0',borderBottom:i<result.opportunities.length-1?`1px solid ${C.border}`:'none'}}>
                            <div style={{fontSize:'.78rem',color:C.text,marginBottom:'.2rem',lineHeight:1.5}}>"{o.query}"</div>
                            <div style={{display:'flex',gap:'.4rem',alignItems:'center',flexWrap:'wrap'}}>
                              <Pill label={o.volume} color={o.volume==='high'?C.green:o.volume==='medium'?C.amber:C.muted2}/>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.red}}>→ {o.competitor}</span>
                            </div>
                          </div>
                        ))}
                        <button onClick={()=>router.push('/ai-answer-gap-finder')}
                          style={{marginTop:'.75rem',width:'100%',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',
                            padding:'.45rem',borderRadius:6,border:`1px solid rgba(146,124,255,.2)`,
                            background:'rgba(146,124,255,.05)',color:C.violet,cursor:'pointer'}}>
                          Full gap analysis →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* E-E-A-T */}
                  <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem',marginBottom:'.75rem'}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.85rem'}}>E-E-A-T Signals</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.65rem'}}>
                      {Object.entries(result.eeat).map(([k,v])=>(
                        <div key={k}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',textTransform:'capitalize',color:C.muted2}}>{k}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:sc(v)}}>{v}</span>
                          </div>
                          <div style={{height:4,background:'rgba(255,255,255,.07)',borderRadius:100,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${v}%`,background:sc(v),borderRadius:100}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>router.push(`/ai-eeat-checker?url=${encodeURIComponent('https://'+resultUrl)}`)}
                      style={{marginTop:'.75rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.violet,background:'none',border:'none',cursor:'pointer'}}>
                      Full E-E-A-T audit →
                    </button>
                  </div>

                  {/* Tools upsell */}
                  <div style={{background:'rgba(146,124,255,.03)',border:`1px solid rgba(146,124,255,.1)`,borderRadius:12,padding:'1.1rem'}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.violet,marginBottom:'.75rem'}}>12 more free tools to improve this score</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.4rem'}}>
                      {TOOLS_LIST.slice(0,8).map(t=>(
                        <Link key={t.href} href={t.href}
                          style={{padding:'.5rem .65rem',background:'rgba(255,255,255,.03)',border:`1px solid ${C.border}`,borderRadius:7,textDecoration:'none',display:'block'}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.muted2}}>{t.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ENGINES */}
              {view==='engines'&&(
                <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.1rem'}}>Per-Engine Breakdown</div>
                  {result.engines.map(e=>(
                    <div key={e.n} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'.75rem',flexWrap:'wrap'}}>
                        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'2rem',color:sc(e.s),lineHeight:1,minWidth:48}}>{e.s}</div>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.92rem',marginBottom:'.2rem'}}>{e.n}</div>
                          <div style={{display:'flex',gap:'.35rem',flexWrap:'wrap'}}>
                            <Pill label={e.status} color={e.status==='CITED'?C.green:e.status==='LOW'?C.amber:C.red}/>
                            <Pill label={e.sentiment} color={e.sentiment==='positive'?C.green:e.sentiment==='negative'?C.red:C.amber}/>
                          </div>
                        </div>
                        <div style={{height:4,width:100,background:'rgba(255,255,255,.07)',borderRadius:100,overflow:'hidden',flexShrink:0}}>
                          <div style={{height:'100%',width:`${e.s}%`,background:sc(e.s),borderRadius:100}}/>
                        </div>
                      </div>
                      <p style={{fontSize:'.83rem',color:C.muted,lineHeight:1.72,marginBottom:e.citations?.length?'.65rem':0}}>{e.desc}</p>
                      {e.citations?.length>0&&(
                        <div style={{background:'rgba(255,255,255,.02)',border:`1px solid ${C.border}`,borderRadius:8,padding:'.6rem .85rem',fontSize:'.78rem',color:C.muted2,fontStyle:'italic',lineHeight:1.65}}>
                          "{e.citations[0]}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PROBES */}
              {view==='probes'&&(
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.35rem'}}>Query Probes</div>
                  <div style={{fontSize:'.83rem',color:C.muted,lineHeight:1.72,marginBottom:'1.1rem'}}>
                    Real buyer questions fired at each AI engine — showing you the verbatim AI response text and whether your brand is cited.
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                    {result.query_probes.map((p,i)=>(
                      <div key={i} style={{background:C.card2,border:`1px solid ${p.cited?'rgba(82,227,142,.18)':'rgba(248,113,113,.12)'}`,borderRadius:12,padding:'1.1rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.75rem',gap:'1rem',flexWrap:'wrap'}}>
                          <div>
                            <div style={{display:'flex',gap:'.4rem',marginBottom:'.35rem',flexWrap:'wrap'}}>
                              <Pill label={p.engine} color={C.violet}/>
                              <Pill label={`vol:${p.volume}`} color={p.volume==='high'?C.green:p.volume==='medium'?C.amber:C.muted2}/>
                              {p.position&&<Pill label={`pos #${p.position}`} color={C.cyan}/>}
                            </div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.text,lineHeight:1.5}}>"{p.query}"</div>
                          </div>
                          <Pill label={p.cited?'✓ CITED':'✗ NOT CITED'} color={p.cited?C.green:C.red}/>
                        </div>
                        <div style={{background:'rgba(255,255,255,.02)',border:`1px solid ${C.border}`,borderRadius:8,padding:'.85rem',fontSize:'.8rem',color:C.muted,lineHeight:1.75}}>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.52rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.4rem'}}>{p.engine} Response:</div>
                          "{p.response}"
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.opportunities?.length>0&&(
                    <div style={{marginTop:'1.25rem',background:'rgba(248,113,113,.04)',border:`1px solid rgba(248,113,113,.12)`,borderRadius:12,padding:'1.1rem'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.red,marginBottom:'.75rem'}}>⚠ Opportunity Gaps</div>
                      {result.opportunities.map((o,i)=>(
                        <div key={i} style={{padding:'.55rem 0',borderBottom:i<result.opportunities.length-1?`1px solid ${C.border}`:'none',display:'flex',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
                          <div style={{fontSize:'.8rem',color:C.text}}>"{o.query}"</div>
                          <div style={{display:'flex',gap:'.4rem',alignItems:'center',flexShrink:0}}>
                            <Pill label={o.volume} color={o.volume==='high'?C.green:C.amber}/>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:C.red}}>{o.competitor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COMPETITORS */}
              {view==='competitors'&&(
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.85rem'}}>Competitor Benchmark</div>
                  <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,overflow:'hidden',marginBottom:'.75rem'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 70px 80px 1fr',padding:'.65rem 1.1rem',borderBottom:`1px solid ${C.border}`,background:'rgba(255,255,255,.02)'}}>
                      {['Domain','Score','Mentions','Key Gap'].map(h=>(
                        <div key={h} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2}}>{h}</div>
                      ))}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 70px 80px 1fr',padding:'.75rem 1.1rem',borderBottom:`1px solid ${C.border}`,background:'rgba(202,255,69,.025)'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.lime}}>{resultUrl} <span style={{fontSize:'.55rem',color:C.muted2}}>(you)</span></div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:sc(result.score)}}>{result.score}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.muted}}>{String(result.mentions)}</div>
                      <div style={{fontSize:'.75rem',color:C.muted}}>—</div>
                    </div>
                    {result.comps.map((c,i)=>(
                      <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 70px 80px 1fr',padding:'.75rem 1.1rem',borderBottom:i<result.comps.length-1?`1px solid ${C.border}`:'none'}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.text}}>{c.n}</div>
                        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:sc(c.s)}}>{c.s}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:C.muted}}>{String(c.mentions)}</div>
                        <div style={{fontSize:'.75rem',color:c.s>result.score?C.red:C.green,lineHeight:1.5}}>{c.gap}</div>
                      </div>
                    ))}
                  </div>
                  {/* Bar chart */}
                  <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem'}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.85rem'}}>Score comparison</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
                      {[{n:resultUrl,s:result.score,you:true},...result.comps.map(c=>({n:c.n,s:c.s,you:false}))].map((c,i)=>(
                        <div key={i}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.2rem'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:c.you?C.lime:C.muted2}}>{c.n}{c.you&&' (you)'}</span>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:sc(c.s)}}>{c.s}</span>
                          </div>
                          <div style={{height:7,background:'rgba(255,255,255,.07)',borderRadius:100,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${c.s}%`,background:c.you?C.lime:sc(c.s),borderRadius:100}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TECHNICAL */}
              {view==='technical'&&(
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.85rem'}}>Technical AEO Signals</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'.5rem',marginBottom:'.75rem'}}>
                    {result.schema.map((s,i)=>(
                      <div key={i} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:9,padding:'.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'.82rem',color:C.text}}>{s.label}</span>
                        <Pill label={s.status==='pass'?'✓ Pass':'✗ Fail'} color={s.status==='pass'?C.green:C.red}/>
                      </div>
                    ))}
                  </div>
                  <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem',marginBottom:'.75rem'}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.75rem'}}>llms.txt</div>
                    <div style={{display:'flex',gap:'.4rem',marginBottom:'.65rem',flexWrap:'wrap'}}>
                      <Pill label={result.llms_txt.exists?'File found':'File missing'} color={result.llms_txt.exists?C.green:C.red}/>
                      {result.llms_txt.valid&&<Pill label="Valid" color={C.green}/>}
                    </div>
                    {result.llms_txt.content?(
                      <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:C.muted2,lineHeight:1.65,background:'rgba(255,255,255,.02)',border:`1px solid ${C.border}`,borderRadius:7,padding:'.75rem',overflowX:'auto',maxHeight:140,margin:0}}>{result.llms_txt.content}</pre>
                    ):(
                      <div style={{fontSize:'.8rem',color:C.muted2}}>No llms.txt found. <Link href="/llms-text-generator" style={{color:C.violet,textDecoration:'none'}}>Generate free →</Link></div>
                    )}
                  </div>
                  <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.1rem'}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',letterSpacing:'.08em',textTransform:'uppercase',color:C.muted2,marginBottom:'.65rem'}}>BLUF Analysis</div>
                    <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'.6rem'}}>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.6rem',color:sc(result.bluf.score)}}>{result.bluf.score}</div>
                      <div><div style={{fontSize:'.82rem',color:C.text,marginBottom:'.15rem'}}>{result.bluf.headline}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:C.muted2}}>BLUF Score /100</div></div>
                    </div>
                    {result.bluf.issues?.map((iss,i)=>(
                      <div key={i} style={{fontSize:'.78rem',color:C.red,display:'flex',gap:'.45rem',marginBottom:'.25rem'}}><span>✗</span>{iss}</div>
                    ))}
                    <Link href="/bluf-builder" style={{display:'inline-block',marginTop:'.65rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:C.violet,border:`1px solid rgba(146,124,255,.2)`,borderRadius:5,padding:'.35rem .75rem',textDecoration:'none'}}>Generate BLUF rewrites →</Link>
                  </div>
                </div>
              )}

              {/* FIXES */}
              {view==='fixes'&&(
                <div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.85rem'}}>Prioritised Fix List</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
                    {result.fixes.map((f,i)=>(
                      <div key={i} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:11,padding:'1rem 1.1rem',display:'flex',gap:'.85rem',alignItems:'flex-start'}}>
                        <div style={{flexShrink:0,marginTop:2}}><Pill label={f.priority} color={f.priority==='HIGH'?C.red:f.priority==='MED'?C.amber:C.muted2}/></div>
                        <div>
                          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.88rem',marginBottom:'.25rem'}}>{f.title}</div>
                          <div style={{fontSize:'.8rem',color:C.muted,lineHeight:1.65}}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AIVisibilityClient() {
  return (
    <Suspense fallback={
      <div style={{height:'calc(100vh - 65px)',display:'flex',alignItems:'center',justifyContent:'center',background:'#04030c'}}>
        <div style={{width:32,height:32,border:'2px solid rgba(202,255,69,.2)',borderTopColor:'#caff45',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
      </div>
    }>
      <AppInner/>
    </Suspense>
  )
}