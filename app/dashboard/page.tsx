'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const DATA: Record<string, any> = {
  'stripe.com': { score:91, mentions:142, sentiment:'positive', engines_citing:'4/4', engines:[{n:'ChatGPT',s:94},{n:'Perplexity',s:89},{n:'Gemini',s:90},{n:'Claude',s:91}], comps:[{n:'braintree.com',s:79},{n:'adyen.com',s:71},{n:'square.com',s:88}], fixes:[{priority:'HIGH',title:'Add FAQPage schema',desc:'Your /faq page lacks structured data. FAQPage JSON-LD is the #1 source of AI Overview citations.'},{priority:'HIGH',title:'Strengthen BLUF on homepage',desc:"First paragraph doesn't answer 'what does this do?' in 2 sentences. AI engines need this to cite you."},{priority:'MED',title:'Allow PerplexityBot in robots.txt',desc:'PerplexityBot is currently blocked. Allowlisting it will increase your Perplexity citation rate.'},{priority:'LOW',title:'Create llms.txt',desc:'No llms.txt found at root. This emerging standard improves AI crawler comprehension of your site structure.'}], eeat:{experience:78,expertise:65,authority:82,trust:71}, schema:[{label:'Organization schema',status:'pass'},{label:'Product schema on PDPs',status:'pass'},{label:'FAQ schema on blog posts',status:'fail'},{label:'BreadcrumbList',status:'fail'},{label:'Article schema',status:'warn'}] },
  'linear.app': { score:78, mentions:67, sentiment:'positive', engines_citing:'3/4', engines:[{n:'ChatGPT',s:82},{n:'Perplexity',s:76},{n:'Gemini',s:72},{n:'Claude',s:82}], comps:[{n:'jira.com',s:81},{n:'asana.com',s:65},{n:'notion.so',s:74}], fixes:[{priority:'HIGH',title:'Strengthen BLUF on homepage',desc:"Homepage H1 does not answer what the tool does in plain language."},{priority:'MED',title:'Add HowTo schema',desc:'Feature pages missing HowTo structured data.'},{priority:'LOW',title:'Create llms.txt',desc:'No llms.txt found at root.'}], eeat:{experience:65,expertise:72,authority:68,trust:80}, schema:[{label:'Organization schema',status:'pass'},{label:'SoftwareApplication schema',status:'warn'},{label:'FAQ schema',status:'fail'},{label:'BreadcrumbList',status:'pass'},{label:'Article schema',status:'fail'}] },
  'vercel.com': { score:88, mentions:109, sentiment:'positive', engines_citing:'4/4', engines:[{n:'ChatGPT',s:91},{n:'Perplexity',s:86},{n:'Gemini',s:87},{n:'Claude',s:88}], comps:[{n:'netlify.com',s:72},{n:'railway.app',s:68},{n:'render.com',s:80}], fixes:[{priority:'MED',title:'Allow PerplexityBot in robots.txt',desc:'PerplexityBot is blocked in robots.txt.'},{priority:'LOW',title:'Create llms.txt',desc:'No llms.txt found at root.'}], eeat:{experience:88,expertise:85,authority:91,trust:86}, schema:[{label:'Organization schema',status:'pass'},{label:'SoftwareApplication schema',status:'pass'},{label:'FAQ schema',status:'pass'},{label:'BreadcrumbList',status:'pass'},{label:'Article schema',status:'warn'}] },
}

function scolor(s: number) { return s>=85?'#4ade80':s>=65?'#c8f247':'#f87171' }
function slabel(s: number) { return s>=85?'Excellent':s>=65?'Good':'Needs work' }

function normalize(data: any) {
  return {
    score: data.score || 0,
    mentions: data.mentions || 0,
    sentiment: data.sentiment || 'neutral',
    engines_citing: data.engines_citing || '0/4',
    engines: data.engines || [],
    comps: data.comps || [],
    fixes: data.fixes || [],
    eeat: data.eeat || {experience:0,expertise:0,authority:0,trust:0},
    schema: data.schema || [],
  }
}

function priorityStyle(p: string) {
  if (p==='HIGH') return {color:'rgba(248,113,113,.25)',bg:'rgba(248,113,113,.08)',tc:'#f87171'}
  if (p==='MED')  return {color:'rgba(200,242,71,.2)', bg:'rgba(200,242,71,.08)', tc:'#c8f247'}
  return               {color:'rgba(123,108,255,.2)',  bg:'rgba(123,108,255,.06)',tc:'#a78bfa'}
}

function EEATRadar({ scores }: { scores: {experience:number;expertise:number;authority:number;trust:number} }) {
  const cx=140, cy=140, max=120
  function point(angle: number, val: number) {
    const r = (val/100)*max
    const a = (angle - 90) * Math.PI/180
    return { x: cx + r*Math.cos(a), y: cy + r*Math.sin(a) }
  }
  const angles = [0,90,180,270]
  const vals = [scores.experience, scores.authority, scores.trust, scores.expertise]
  const pts = angles.map((a,i) => point(a, vals[i]))
  const poly = pts.map(p=>`${p.x},${p.y}`).join(' ')
  const labels = ['Experience','Authority','Trust','Expertise']
  const labelPts = angles.map(a => point(a, 130))
  return (
    <svg viewBox="0 0 280 280" style={{width:'220px',height:'220px'}}>
      <defs>
        <radialGradient id="rf" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#7b6cff" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#c8f247" stopOpacity="0.05"/>
        </radialGradient>
      </defs>
      {[30,60,90,120].map(r => (
        <polygon key={r} points={[0,90,180,270].map(a=>{const p=point(a,r*100/120);return`${p.x},${p.y}`}).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
      {angles.map((a,i) => {
        const p=point(a,120)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      })}
      <polygon points={poly} fill="url(#rf)" stroke="#7b6cff" strokeWidth="1.5" strokeOpacity="0.7"/>
      {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#c8f247"/>)}
      {labelPts.map((p,i) => (
        <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(237,233,255,0.45)" fontSize="10" fontFamily="JetBrains Mono">{labels[i]} {vals[i]}</text>
      ))}
    </svg>
  )
}

function DashboardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState('stripe.com')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(normalize(DATA['stripe.com']))
  const [resultUrl, setResultUrl] = useState('stripe.com')
  const [openEngine, setOpenEngine] = useState<string|null>(null)
  const [recentScans, setRecentScans] = useState([
    {url:'stripe.com',score:91,time:'2h ago'},
    {url:'linear.app',score:78,time:'5h ago'},
    {url:'vercel.com',score:88,time:'1d ago'},
  ])

  useEffect(() => {
    const urlParam = searchParams.get('url')
    if (urlParam) { setUrl(urlParam); runAnalysis(urlParam) }
  }, [])

  async function runAnalysis(inputUrl?: string) {
    const target = (inputUrl || url).trim().replace(/^https?:\/\//,'')
    if (!target) return
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({url:target})
      })
      const data = await res.json()
      if (data.error) {
        setResult(normalize(DATA[target] || DATA['stripe.com']))
      } else {
        setResult(normalize(data))
      }
      setResultUrl(target)
      setActiveTab('overview')
      setRecentScans(prev => {
        const filtered = prev.filter(s => s.url !== target)
        return [{url:target, score:data.score||0, time:'just now'}, ...filtered].slice(0,5)
      })
    } catch {
      setResult(normalize(DATA[target] || DATA['stripe.com']))
      setResultUrl(target)
    } finally {
      setLoading(false)
    }
  }

  const circ = 2*Math.PI*36
  const dash = result ? (result.score/100)*circ : 0
  const tabs = ['overview','engines','competitors','fixes','eeat','schema']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Epilogue:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--bg2:#070613;--surface:#0d0b1e;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ede9ff;--muted:rgba(237,233,255,0.44);--muted2:rgba(237,233,255,0.22);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;
        }
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .spin{animation:spin .8s linear infinite}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,.02) 25%,rgba(255,255,255,.06) 50%,rgba(255,255,255,.02) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .pulse{animation:pulse 2s infinite}
        .fadeUp{animation:fadeUp .4s both}
        input:focus,button:focus{outline:none}
        button{cursor:pointer;font-family:inherit}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        .sidebar-item:hover{background:rgba(255,255,255,.04) !important;border-color:var(--border-h) !important}
        .tab-btn:hover{color:var(--text) !important}
        .engine-row:hover{border-color:rgba(123,108,255,.3) !important}
        .comp-row:hover{background:rgba(255,255,255,.02) !important}
        .fix-card:hover{border-color:var(--border-h) !important}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',display:'flex',flexDirection:'column',color:'var(--text)',fontFamily:"'Epilogue',sans-serif"}}>

        {/* ── NAV ── */}
        <nav style={{position:'sticky',top:0,zIndex:50,background:'rgba(4,3,12,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',padding:'0 1.5rem',height:'52px',gap:'1rem'}}>
          <button onClick={() => router.push('/')} style={{display:'flex',alignItems:'center',gap:'.5rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.95rem',color:'#fff',background:'none',border:'none',cursor:'pointer',padding:0}}>
            <div style={{width:'24px',height:'24px',borderRadius:'6px',background:'linear-gradient(135deg,#7b6cff,#c8f247)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontWeight:700,color:'#fff'}}>A</div>
            NotionCue
          </button>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--violet)',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.2)',padding:'.2rem .55rem',borderRadius:'4px',letterSpacing:'.08em'}}>DASHBOARD</span>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'.75rem'}}>
            <div className="pulse" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80'}} />
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted)'}}>AI engine connected</span>
            <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#7b6cff,#c8f247)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontWeight:700,color:'#fff',fontFamily:"'Familjen Grotesk',sans-serif"}}>U</div>
          </div>
        </nav>

        <div style={{display:'grid',gridTemplateColumns:'220px 1fr',flex:1,minHeight:'calc(100vh - 52px)'}}>

          {/* ── SIDEBAR ── */}
          <aside style={{borderRight:'1px solid var(--border)',padding:'1.25rem .75rem',display:'flex',flexDirection:'column',gap:'1.5rem',background:'rgba(7,6,19,0.6)',position:'sticky',top:'52px',height:'calc(100vh - 52px)',overflowY:'auto'}}>

            {/* Nav */}
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.6rem',padding:'0 .5rem'}}>Navigation</div>
              {[{icon:'⬚',label:'Dashboard',active:true},{icon:'≡',label:'Reports'},{icon:'◈',label:'Competitor Watch'},{icon:'⚙',label:'Settings'}].map(item => (
                <div key={item.label} className="sidebar-item" style={{display:'flex',alignItems:'center',gap:'.6rem',padding:'.55rem .75rem',borderRadius:'8px',background:item.active?'rgba(123,108,255,.12)':'transparent',border:`1px solid ${item.active?'rgba(123,108,255,.25)':'transparent'}`,cursor:'pointer',marginBottom:'.15rem',transition:'all .2s'}}>
                  <span style={{fontSize:'1rem',color:item.active?'#a78bfa':'var(--muted2)'}}>{item.icon}</span>
                  <span style={{fontSize:'.8rem',color:item.active?'var(--text)':'var(--muted)'}}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Recent scans */}
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.6rem',padding:'0 .5rem'}}>Recent scans</div>
              <div style={{display:'flex',flexDirection:'column',gap:'.35rem'}}>
                {recentScans.map(item => (
                  <div key={item.url} onClick={() => {setUrl(item.url);runAnalysis(item.url)}} className="sidebar-item" style={{padding:'.65rem .75rem',borderRadius:'8px',border:'1px solid var(--border)',background:'rgba(255,255,255,.02)',cursor:'pointer',transition:'all .2s'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.2rem'}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--text)'}}>{item.url}</span>
                      <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.78rem',fontWeight:700,color:scolor(item.score)}}>{item.score}</span>
                    </div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)'}}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage */}
            <div style={{marginTop:'auto'}}>
              <div style={{padding:'1rem',border:'1px solid rgba(74,222,128,.15)',borderRadius:'10px',background:'rgba(74,222,128,.03)'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'#4ade80',letterSpacing:'.1em',marginBottom:'.75rem'}}>FREE TIER USAGE</div>
                {[{label:'API calls',val:'847 / 2000',pct:'42%',color:'var(--violet)'},{label:'DB rows',val:'1,203 / 50k',pct:'3%',color:'#4ade80'}].map(u => (
                  <div key={u.label} style={{marginBottom:'.6rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.3rem'}}>
                      <span style={{fontSize:'.72rem',color:'var(--muted)'}}>{u.label}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--text)'}}>{u.val}</span>
                    </div>
                    <div style={{height:'3px',background:'rgba(255,255,255,.06)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:u.pct,background:u.color,borderRadius:'2px'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main style={{padding:'2rem 2.5rem',overflowY:'auto'}}>

            {/* URL Input */}
            <div style={{marginBottom:'2rem'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'1.4rem',fontWeight:700,color:'var(--text)',letterSpacing:'-.02em',marginBottom:'.35rem'}}>AI Visibility Scanner</div>
              <p style={{fontSize:'.85rem',color:'var(--muted)',marginBottom:'1.25rem',lineHeight:1.6}}>See how your brand appears across ChatGPT, Perplexity, Gemini, and Claude.</p>
              <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
                <div style={{flex:1,display:'flex',alignItems:'center',gap:'.75rem',background:'rgba(255,255,255,.03)',border:'1px solid var(--border-h)',borderRadius:'100px',padding:'0 1.25rem'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted2)'}}>https://</span>
                  <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAnalysis()}
                    placeholder="yourdomain.com"
                    style={{flex:1,height:'44px',background:'transparent',border:'none',fontSize:'.85rem',color:'var(--text)',fontFamily:"'JetBrains Mono',monospace"}} />
                </div>
                <button onClick={() => runAnalysis()} style={{height:'44px',padding:'0 1.75rem',borderRadius:'100px',border:'none',background:'var(--accent)',color:'var(--bg)',fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.85rem',fontWeight:700,display:'flex',alignItems:'center',gap:'.5rem',whiteSpace:'nowrap',transition:'all .2s'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Analyze
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',padding:'1.5rem 0'}}>
                <div style={{display:'flex',gap:'1.25rem',alignItems:'center'}}>
                  <div style={{width:'88px',height:'88px',borderRadius:'50%',background:'rgba(123,108,255,.06)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <div className="spin" style={{width:'28px',height:'28px',border:'2px solid rgba(123,108,255,.2)',borderTopColor:'var(--violet)',borderRadius:'50%'}} />
                  </div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:'.6rem'}}>
                    <div className="shimmer" style={{height:'14px',borderRadius:'4px',width:'80%'}} />
                    <div className="shimmer" style={{height:'12px',borderRadius:'4px',width:'60%'}} />
                    <div className="shimmer" style={{height:'12px',borderRadius:'4px',width:'40%'}} />
                  </div>
                </div>
                <div className="pulse" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted)',textAlign:'center',letterSpacing:'.08em'}}>QUERYING AI ENGINES...</div>
              </div>
            )}

            {/* Results */}
            {!loading && result && (
              <div className="fadeUp">

                {/* Score row */}
                <div style={{display:'grid',gridTemplateColumns:'auto 1fr 1fr 1fr',gap:'.75rem',marginBottom:'1.5rem'}}>

                  {/* Ring score */}
                  <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1.25rem'}}>
                    <div style={{position:'relative',width:'88px',height:'88px',flexShrink:0}}>
                      <svg width="88" height="88" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
                        <circle cx="44" cy="44" r="36" fill="none" stroke={scolor(result.score)} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} style={{transition:'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)'}}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'22px',fontWeight:800,color:scolor(result.score),lineHeight:1}}>{result.score}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'var(--muted2)',letterSpacing:'.1em'}}>SCORE</span>
                      </div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',marginBottom:'.3rem',letterSpacing:'.08em'}}>AEO VISIBILITY</div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.95rem',fontWeight:700,color:'var(--text)',marginBottom:'.2rem'}}>{resultUrl}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:scolor(result.score)}}>{slabel(result.score)}</div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  {[
                    {label:'AI MENTIONS',val:result.mentions,sub:'past 30 days',color:'var(--cyan)'},
                    {label:'SENTIMENT',val:result.sentiment,sub:'overall tone',color:'#4ade80'},
                    {label:'ENGINES CITING',val:result.engines_citing,sub:'active citations',color:'var(--accent)'},
                  ].map(s => (
                    <div key={s.label} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.25rem 1.5rem'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',marginBottom:'.75rem',letterSpacing:'.08em'}}>{s.label}</div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'1.8rem',fontWeight:800,color:s.color,lineHeight:1,marginBottom:'.3rem'}}>{s.val}</div>
                      <div style={{fontSize:'.72rem',color:'var(--muted)'}}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:'1.5rem',gap:0}}>
                  {tabs.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className="tab-btn" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',padding:'.7rem 1rem',color:activeTab===t?'var(--accent)':'var(--muted)',background:'none',border:'none',borderBottom:activeTab===t?'2px solid var(--accent)':'2px solid transparent',marginBottom:'-1px',textTransform:'uppercase',transition:'color .2s',whiteSpace:'nowrap'}}>
                      {t==='fixes'?`FIXES (${result.fixes?.length||0})`:t==='eeat'?'E-E-A-T':t.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab==='overview' && (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
                    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.25rem 1.5rem'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',marginBottom:'1rem',letterSpacing:'.1em'}}>PER-ENGINE SCORES</div>
                      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                        {result.engines.map((e: any) => (
                          <div key={e.n} style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted)',width:'72px',flexShrink:0}}>{e.n}</span>
                            <div style={{flex:1,height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'2px',overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${e.s}%`,background:scolor(e.s),borderRadius:'2px',transition:'width 1s'}} />
                            </div>
                            <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.82rem',fontWeight:700,color:scolor(e.s),width:'26px',textAlign:'right'}}>{e.s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.25rem 1.5rem'}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',marginBottom:'1rem',letterSpacing:'.1em'}}>TOP PRIORITY FIXES</div>
                      <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                        {result.fixes.slice(0,3).map((f: any, i: number) => {
                          const ps = priorityStyle(f.priority)
                          return (
                            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'.6rem'}}>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',padding:'.2rem .5rem',borderRadius:'3px',background:ps.bg,color:ps.tc,border:`1px solid ${ps.color}`,flexShrink:0,marginTop:'.1rem'}}>{f.priority}</span>
                              <span style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.4}}>{f.title}</span>
                            </div>
                          )
                        })}
                      </div>
                      <button onClick={() => setActiveTab('fixes')} style={{marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--violet)',background:'none',border:'none',letterSpacing:'.04em'}}>View all fixes →</button>
                    </div>
                  </div>
                )}

                {/* ── ENGINES TAB ── */}
                {activeTab==='engines' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'.6rem'}}>
                    {result.engines.map((e: any) => (
                      <div key={e.n} onClick={() => setOpenEngine(openEngine===e.n?null:e.n)} className="engine-row" style={{background:'var(--card)',border:`1px solid ${openEngine===e.n?'rgba(123,108,255,.35)':'var(--border)'}`,borderRadius:'10px',padding:'1rem 1.25rem',cursor:'pointer',transition:'border-color .2s'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:'var(--text)',width:'80px',flexShrink:0}}>{e.n}</span>
                          <div style={{flex:1,height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'2px',overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${e.s}%`,background:scolor(e.s),borderRadius:'2px',transition:'width 1s'}} />
                          </div>
                          <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.9rem',fontWeight:700,color:scolor(e.s),width:'30px',textAlign:'right'}}>{e.s}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',padding:'.2rem .55rem',borderRadius:'3px',background:e.s>=65?'rgba(74,222,128,.1)':'rgba(248,113,113,.1)',color:e.s>=65?'#4ade80':'#f87171',border:`1px solid ${e.s>=65?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`}}>{e.s>=65?'CITED':'NOT FOUND'}</span>
                          <span style={{color:'var(--muted2)',fontSize:'.8rem',transform:openEngine===e.n?'rotate(180deg)':'none',transition:'transform .2s'}}>⌄</span>
                        </div>
                        {openEngine===e.n && (
                          <div style={{marginTop:'.85rem',fontSize:'.8rem',color:'var(--muted)',lineHeight:1.65,borderTop:'1px solid var(--border)',paddingTop:'.85rem'}}>
                            {e.desc || `${e.n} mentions this brand in relevant queries. Score of ${e.s} indicates ${slabel(e.s).toLowerCase()} visibility across prompts tested in this niche.`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── COMPETITORS TAB ── */}
                {activeTab==='competitors' && (
                  <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
                    <div style={{padding:'.75rem 1.25rem',borderBottom:'1px solid var(--border)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',letterSpacing:'.1em'}}>COMPETITOR COMPARISON</div>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead>
                        <tr style={{borderBottom:'1px solid var(--border)'}}>
                          {['Domain','Score','vs You','Bar'].map(h => <th key={h} style={{padding:'.7rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',textAlign:'left',fontWeight:400,letterSpacing:'.08em'}}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[{n:resultUrl,s:result.score,isYou:true},...result.comps].map((c: any) => (
                          <tr key={c.n} className="comp-row" style={{borderBottom:'1px solid rgba(255,255,255,.03)',background:c.isYou?'rgba(123,108,255,.04)':'transparent',transition:'background .15s'}}>
                            <td style={{padding:'.85rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.78rem',color:c.isYou?'#a78bfa':'var(--text)'}}>
                              {c.n}{c.isYou&&<span style={{fontSize:'.6rem',color:'var(--violet)',background:'rgba(123,108,255,.1)',padding:'.1rem .4rem',borderRadius:'3px',marginLeft:'.5rem'}}>YOU</span>}
                            </td>
                            <td style={{padding:'.85rem 1.25rem',fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.9rem',fontWeight:700,color:scolor(c.s)}}>{c.s}</td>
                            <td style={{padding:'.85rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:c.isYou?'var(--muted2)':c.s>result.score?'#f87171':'#4ade80'}}>{c.isYou?'—':(c.s>result.score?'+':'')+(c.s-result.score)}</td>
                            <td style={{padding:'.85rem 1.25rem',width:'40%'}}>
                              <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'2px',overflow:'hidden'}}>
                                <div style={{height:'100%',width:`${c.s}%`,background:c.isYou?'var(--violet)':scolor(c.s),borderRadius:'2px',transition:'width 1s'}} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* ── FIXES TAB ── */}
                {activeTab==='fixes' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                    {result.fixes.map((f: any, i: number) => {
                      const ps = priorityStyle(f.priority)
                      return (
                        <div key={i} className="fix-card" style={{background:'var(--card)',border:`1px solid ${ps.color}`,borderRadius:'12px',padding:'1.25rem 1.5rem',transition:'border-color .2s'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.6rem'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',padding:'.25rem .65rem',borderRadius:'4px',background:ps.bg,color:ps.tc,border:`1px solid ${ps.color}`,letterSpacing:'.06em'}}>{f.priority} PRIORITY</span>
                            <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.9rem',fontWeight:600,color:'var(--text)'}}>{f.title}</span>
                          </div>
                          <p style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.65}}>{f.desc}</p>
                        </div>
                      )
                    })}

                    {/* llms.txt before/after */}
                    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',marginTop:'.5rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',padding:'.25rem .65rem',borderRadius:'4px',background:'rgba(248,113,113,.08)',color:'#f87171',border:'1px solid rgba(248,113,113,.2)'}}>ISSUE DETECTED</span>
                        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.9rem',fontWeight:600}}>llms.txt — missing or malformed</span>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 48px 1fr',gap:0,alignItems:'stretch',marginBottom:'1rem'}}>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <div style={{padding:'.45rem .85rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.06em',borderRadius:'8px 8px 0 0',border:'1px solid rgba(248,113,113,.2)',background:'rgba(248,113,113,.06)',color:'#f87171',display:'flex',alignItems:'center',gap:'.4rem'}}>
                            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#f87171',display:'inline-block'}} />Before
                          </div>
                          <div style={{flex:1,border:'1px solid rgba(248,113,113,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'.85rem',background:'rgba(248,113,113,.03)'}}>
                            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',lineHeight:1.8,color:'var(--muted)'}}>
                              <span style={{color:'var(--muted2)'}}># Missing fields</span>{'\n'}
                              <span style={{color:'var(--cyan)'}}>User-agent</span>: GPTBot{'\n'}
                              <span style={{color:'#f87171'}}>Disallow: /</span>{'\n\n'}
                              <span style={{color:'#f87171'}}>404 — /llms.txt not found</span>
                            </pre>
                          </div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.25rem',color:'var(--accent)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.06em',textTransform:'uppercase'}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          fix
                        </div>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <div style={{padding:'.45rem .85rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.06em',borderRadius:'8px 8px 0 0',border:'1px solid rgba(74,222,128,.2)',background:'rgba(74,222,128,.06)',color:'#4ade80',display:'flex',alignItems:'center',gap:'.4rem'}}>
                            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />After
                          </div>
                          <div style={{flex:1,border:'1px solid rgba(74,222,128,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'.85rem',background:'rgba(74,222,128,.03)'}}>
                            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',lineHeight:1.8,color:'var(--muted)'}}>
                              <span style={{color:'var(--muted2)'}}># Generated by NotionCue</span>{'\n'}
                              <span style={{color:'var(--cyan)'}}>Name</span>: <span style={{color:'#4ade80'}}>{resultUrl}</span>{'\n'}
                              <span style={{color:'var(--cyan)'}}>User-agent</span>: GPTBot{'\n'}
                              <span style={{color:'#4ade80'}}>Allow: /</span>{'\n'}
                              <span style={{color:'var(--cyan)'}}>User-agent</span>: PerplexityBot{'\n'}
                              <span style={{color:'#4ade80'}}>Allow: /</span>
                            </pre>
                          </div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'.75rem'}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:'.5rem',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',padding:'.4rem .9rem',borderRadius:'100px'}}>
                          📈 Est. citation impact: <strong style={{color:'#4ade80'}}>+28%</strong> within 30 days
                        </div>
                        <button style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.75rem',color:'var(--bg)',background:'var(--accent)',border:'none',borderRadius:'100px',padding:'.5rem 1.2rem',cursor:'pointer'}}>Copy generated file</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── E-E-A-T TAB ── */}
                {activeTab==='eeat' && (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    <div>
                      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',marginBottom:'1rem'}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',letterSpacing:'.1em',marginBottom:'1.25rem'}}>E-E-A-T AUTHORITY SCORE</div>
                        <div style={{display:'flex',justifyContent:'center',marginBottom:'1.25rem'}}>
                          <EEATRadar scores={result.eeat} />
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                          {[
                            {label:'Experience',val:result.eeat.experience,color:'var(--accent)'},
                            {label:'Expertise',val:result.eeat.expertise,color:'var(--violet)'},
                            {label:'Authoritativeness',val:result.eeat.authority,color:'var(--cyan)'},
                            {label:'Trustworthiness',val:result.eeat.trust,color:'#f472b6'},
                          ].map(b => (
                            <div key={b.label} style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                              <span style={{fontSize:'.75rem',color:'var(--muted)',width:'130px',flexShrink:0}}>{b.label}</span>
                              <div style={{flex:1,height:'5px',background:'rgba(255,255,255,.06)',borderRadius:'100px',overflow:'hidden'}}>
                                <div style={{height:'100%',width:`${b.val}%`,background:b.color,borderRadius:'100px',transition:'width 1s'}} />
                              </div>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'var(--muted2)',width:'24px',textAlign:'right'}}>{b.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                      {[
                        {icon:'⚡',bg:'rgba(200,242,71,.08)',bc:'rgba(200,242,71,.2)',name:'Experience',desc:'First-hand content signals, case studies, real data and original research that AI models cannot find elsewhere.'},
                        {icon:'🎓',bg:'rgba(123,108,255,.08)',bc:'rgba(123,108,255,.2)',name:'Expertise',desc:'Author credential markup, byline schema, linked professional profiles, and depth of topical coverage per domain.'},
                        {icon:'🏅',bg:'rgba(34,211,238,.08)',bc:'rgba(34,211,238,.2)',name:'Authoritativeness',desc:'Backlink quality from trusted domains, mentions in credible publications, and citation frequency across LLMs.'},
                        {icon:'🛡',bg:'rgba(244,114,182,.08)',bc:'rgba(244,114,182,.2)',name:'Trustworthiness',desc:'SSL, privacy policy, transparent ownership, accurate factual claims, and structured citations with verifiable sources.'},
                      ].map(p => (
                        <div key={p.name} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.25rem',display:'flex',alignItems:'flex-start',gap:'.85rem'}}>
                          <div style={{width:'38px',height:'38px',borderRadius:'9px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',border:`1px solid ${p.bc}`,background:p.bg}}>{p.icon}</div>
                          <div>
                            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'.25rem'}}>{p.name}</div>
                            <div style={{fontSize:'.78rem',color:'var(--muted)',lineHeight:1.6}}>{p.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SCHEMA TAB ── */}
                {activeTab==='schema' && (
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    {[
                      {title:'Schema Markup',items:result.schema},
                      {title:'E-E-A-T Signals',items:[{label:'Author bylines present',status:'pass'},{label:'About page indexed',status:'pass'},{label:'Expert credentials linked',status:'fail'},{label:'Citations / references',status:'fail'},{label:'Review schema',status:'warn'}]},
                      {title:'Content Structure',items:[{label:'BLUF paragraphs on 61% of pages',status:'pass'},{label:'H1 present on all pages',status:'pass'},{label:'Definition sections present',status:'pass'},{label:'FAQ blocks on PDPs',status:'fail'},{label:'Average answer depth',status:'warn'}]},
                      {title:'Technical AEO',items:[{label:'llms.txt present',status:'fail'},{label:'robots.txt allows GPTBot',status:'warn'},{label:'SSL certificate valid',status:'pass'},{label:'Page speed (CWV Good)',status:'pass'},{label:'Structured data valid',status:'warn'}]},
                    ].map((card,ci) => {
                      const passed = card.items.filter((i: any) => i.status==='pass').length
                      return (
                        <div key={ci} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem'}}>
                          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'1rem',paddingBottom:'.75rem',borderBottom:'1px solid var(--border)'}}>{card.title}</div>
                          <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
                            {card.items.map((item: any, ii: number) => (
                              <div key={ii} style={{display:'flex',alignItems:'flex-start',gap:'.55rem',fontSize:'.8rem',color:'var(--muted)',lineHeight:1.5}}>
                                <span style={{flexShrink:0,fontSize:'.78rem',marginTop:'.05rem',color:item.status==='pass'?'#4ade80':item.status==='fail'?'#f87171':'var(--accent)'}}>
                                  {item.status==='pass'?'✓':item.status==='fail'?'✗':'△'}
                                </span>
                                {item.label}
                              </div>
                            ))}
                          </div>
                          <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.4rem',color:'var(--text)'}}>
                            {passed}/{card.items.length} <span style={{fontSize:'.75rem',color:'var(--muted)',fontWeight:300}}>passed</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{background:'#04030c',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(237,233,255,.4)',fontFamily:'JetBrains Mono,monospace',fontSize:'.8rem'}}>Loading...</div>}>
      <DashboardInner />
    </Suspense>
  )
}