'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'llms.txt Generator', href: '/resources/llms-txt' },
  { label: 'BLUF Templates',     href: '/resources/bluf-templates' },
  { label: 'Blog',               href: '/resources/blog' },
  { label: 'Changelog',          href: '/resources/changelog' },
  { label: 'About',              href: '/resources/about' },
  { label: 'Privacy',            href: '/resources/privacy' },
  { label: 'Terms',              href: '/resources/terms' },
  { label: 'Contact',            href: '/resources/contact' },
]

interface ValidationItem { check: string; pass: boolean; note: string }
interface GeneratedData {
  company_name: string
  tagline: string
  category: string
  llms_txt: string
  llms_full_txt: string
  validation: ValidationItem[]
  topics: string[]
  aeo_lift: number
  engines_helped: number
}

type TabId = 'standard' | 'full' | 'validation' | 'deploy'

export default function LLMSTxtPage() {
  const router  = useRouter()
  const path    = usePathname()

  const [form, setForm] = useState({
    name:'', domain:'', desc:'', email:'', lang:'en',
    gpt:true, gem:true, plex:true, claude:true, cop:true,
    allow:'', disallow:'',
  })
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<GeneratedData | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('standard')
  const [copied,    setCopied]    = useState('')
  const [error,     setError]     = useState('')
  const [step,      setStep]      = useState(0)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(''), 2200)
  }

  function download(text: string, filename: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    a.download = filename; a.click()
  }

  // Step-by-step loading animation
  async function animateSteps() {
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 900))
      setStep(i)
    }
  }

  async function generate() {
    const domain = form.domain.trim().replace(/^https?:\/\//, '')
    if (!domain) { setError('Enter a domain to continue'); return }
    setError(''); setResult(null); setLoading(true); setStep(0)
    animateSteps()

    try {
      const res = await fetch('/api/generate-llms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, domain }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setResult(data)
      setActiveTab('standard')
    } catch (e) {
      setError('Failed to generate. Please try again.')
    }
    setLoading(false); setStep(0)
  }

  const steps = [
    'Researching domain...',
    'Identifying key pages & topics...',
    'Writing BLUF descriptions...',
    'Building llms.txt file...',
  ]

  const TABS: { id: TabId; label: string }[] = [
    { id: 'standard',   label: 'llms.txt' },
    { id: 'full',       label: 'llms-full.txt' },
    { id: 'validation', label: 'Validation' },
    { id: 'deploy',     label: 'Deploy guide' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--green:#4ade80;--red:#f87171;--amber:#fbbf24;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button,input,textarea,select{font-family:inherit;cursor:pointer}
        input:focus,textarea:focus,select:focus,button:focus{outline:none}
        input[type=checkbox]{width:14px;height:14px;accent-color:var(--accent)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .spin{animation:spin .8s linear infinite}
        .shimmer{background:linear-gradient(90deg,rgba(255,255,255,.02) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.02) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .fadeIn{animation:fadeUp .35s both}
        .tab-btn:hover{color:var(--text)!important}
        .form-input{background:rgba(255,255,255,.04);border:1px solid var(--border-h);border-radius:8px;padding:.65rem 1rem;color:var(--text);font-size:.82rem;font-family:'JetBrains Mono',monospace;width:100%;transition:border-color .2s}
        .form-input:focus{border-color:var(--accent)}
        .copy-btn:hover{border-color:var(--accent)!important;color:var(--accent)!important}
        .dl-btn:hover{background:rgba(200,242,71,.15)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--border)',padding:'.6rem 3.5rem',display:'flex',gap:0,overflowX:'auto',marginTop:'65px'}}>
          {SUB_NAV.map(n => (
            <button key={n.href} onClick={() => router.push(n.href)}
              style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.55rem 1rem',background:'none',border:'none',borderBottom:path===n.href?'2px solid var(--accent)':'2px solid transparent',color:path===n.href?'var(--accent)':'var(--muted)',whiteSpace:'nowrap',transition:'all .2s'}}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 3.5rem'}}>

          {/* Hero */}
          <div style={{padding:'6rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>AI-Powered Tool</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              llms.txt<br/><span style={{color:'var(--accent)'}}>Generator</span>
            </h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'560px',marginBottom:'1.5rem'}}>
              Enter your domain and our AI researches your site, writes BLUF descriptions for every key page, and generates a production-ready llms.txt file — in seconds.
            </p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
              {['ChatGPT','Perplexity','Claude','Gemini','Grok'].map(e => (
                <span key={e} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.25rem .65rem',borderRadius:'100px'}}>
                  ✓ {e}
                </span>
              ))}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'420px 1fr',gap:'2rem',padding:'4rem 0 6rem',alignItems:'start'}}>

            {/* ── FORM ── */}
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem',display:'flex',flexDirection:'column',gap:'1.25rem',position:'sticky',top:'130px'}}>

              {/* Quick fill */}
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.5rem'}}>Quick examples</div>
                <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
                  {['notioncue.com','stripe.com','linear.app','vercel.com'].map(d => (
                    <button key={d} onClick={() => setForm(p => ({...p, domain:d}))}
                      style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',borderRadius:'4px',padding:'.25rem .6rem'}}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{height:'1px',background:'var(--border)'}} />
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem'}}>Site information</div>

              {/* Domain — primary field */}
              <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>
                  Domain <span style={{color:'var(--accent)'}}>*</span>
                </label>
                <input className="form-input" placeholder="yourdomain.com"
                  value={form.domain} onChange={e => setForm(p => ({...p, domain:e.target.value}))}
                  onKeyDown={e => e.key==='Enter' && generate()} />
              </div>

              {[
                {id:'name',   label:'Site name (optional)',        placeholder:'Notion Cue'},
                {id:'desc',   label:'One-line description (optional)', placeholder:'AI visibility platform for SEO teams'},
                {id:'email',  label:'Contact email (optional)',    placeholder:'hello@yourdomain.com'},
              ].map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder}
                    value={(form as any)[f.id]} onChange={e => setForm(p => ({...p,[f.id]:e.target.value}))} />
                </div>
              ))}

              <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>Language</label>
                <select className="form-input" value={form.lang} onChange={e => setForm(p => ({...p, lang:e.target.value}))}>
                  {[['en','English'],['es','Spanish'],['fr','French'],['de','German'],['ja','Japanese'],['zh','Chinese']].map(([v,l]) => (
                    <option key={v} value={v} style={{background:'#100e22'}}>{l}</option>
                  ))}
                </select>
              </div>

              <div style={{height:'1px',background:'var(--border)'}} />
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem'}}>AI bot permissions</div>
              <div style={{fontSize:'.78rem',color:'var(--muted2)',marginTop:'-.5rem'}}>Checked = allow to crawl</div>

              {[
                {key:'gpt',   label:'GPTBot — OpenAI / ChatGPT'},
                {key:'gem',   label:'Google-Extended — Gemini'},
                {key:'plex',  label:'PerplexityBot — Perplexity'},
                {key:'claude',label:'ClaudeBot — Anthropic / Claude'},
                {key:'cop',   label:'bingbot — Microsoft / Copilot'},
              ].map(b => (
                <label key={b.key} style={{display:'flex',alignItems:'center',gap:'.75rem',cursor:'pointer',fontSize:'.85rem',color:'var(--muted)'}}>
                  <input type="checkbox" checked={(form as any)[b.key]} onChange={e => setForm(p => ({...p,[b.key]:e.target.checked}))} />
                  {b.label}
                </label>
              ))}

              <div style={{height:'1px',background:'var(--border)'}} />

              {[
                {id:'allow',    label:'Allowed paths (one per line)',  placeholder:'/\n/blog\n/products'},
                {id:'disallow', label:'Blocked paths (one per line)',   placeholder:'/admin\n/private'},
              ].map(f => (
                <div key={f.id} style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{f.label}</label>
                  <textarea className="form-input" placeholder={f.placeholder} rows={3}
                    value={(form as any)[f.id]} onChange={e => setForm(p => ({...p,[f.id]:e.target.value}))}
                    style={{resize:'vertical'}} />
                </div>
              ))}

              {error && (
                <div style={{padding:'.65rem 1rem',background:'rgba(248,113,113,.07)',border:'1px solid rgba(248,113,113,.2)',borderRadius:'8px',fontSize:'.8rem',color:'var(--red)',fontFamily:"'JetBrains Mono',monospace"}}>
                  {error}
                </div>
              )}

              <button onClick={generate} disabled={loading}
                style={{width:'100%',padding:'.85rem',background:loading?'rgba(200,242,71,.4)':'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.9rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'.6rem',transition:'background .2s'}}>
                {loading && <div className="spin" style={{width:'14px',height:'14px',border:'2px solid rgba(4,3,12,.3)',borderTopColor:'var(--bg)',borderRadius:'50%'}} />}
                {loading ? steps[step-1] || 'Generating...' : 'Generate with AI →'}
              </button>
            </div>

            {/* ── OUTPUT ── */}
            <div>

              {/* Loading state */}
              {loading && (
                <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem',marginBottom:'1.5rem'}}>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',marginBottom:'1.25rem'}}>
                    AI is researching {form.domain || 'your domain'}...
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
                    {steps.map((s,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'.75rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:i<step?'var(--green)':i===step-1?'var(--accent)':'var(--muted2)',transition:'color .3s'}}>
                        {i < step ? (
                          <span style={{width:'16px',height:'16px',display:'grid',placeItems:'center',borderRadius:'50%',background:'rgba(74,222,128,.1)',border:'1px solid rgba(74,222,128,.3)',fontSize:'9px',color:'var(--green)',flexShrink:0}}>✓</span>
                        ) : i === step-1 ? (
                          <div className="spin" style={{width:'16px',height:'16px',border:'1.5px solid rgba(200,242,71,.2)',borderTopColor:'var(--accent)',borderRadius:'50%',flexShrink:0}} />
                        ) : (
                          <span style={{width:'16px',height:'16px',display:'grid',placeItems:'center',borderRadius:'50%',background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',fontSize:'9px',color:'var(--muted2)',flexShrink:0}}>○</span>
                        )}
                        {s}
                      </div>
                    ))}
                  </div>
                  {/* Shimmer bars */}
                  <div style={{marginTop:'1.5rem',display:'flex',flexDirection:'column',gap:'.5rem'}}>
                    {[85,65,75,55].map((w,i) => (
                      <div key={i} className="shimmer" style={{height:'10px',borderRadius:'5px',width:`${w}%`}} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && !result && (
                <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'3rem',textAlign:'center',minHeight:'360px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
                  <div style={{width:'52px',height:'52px',display:'grid',placeItems:'center',background:'rgba(200,242,71,.07)',border:'1px solid rgba(200,242,71,.15)',borderRadius:'12px',fontSize:'22px'}}>📄</div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem'}}>Your llms.txt will appear here</div>
                  <p style={{fontSize:'.85rem',color:'var(--muted2)',maxWidth:'320px',lineHeight:1.6}}>Enter your domain, configure bot permissions, and click Generate. AI will research your site and write the file for you.</p>
                </div>
              )}

              {/* Results */}
              {!loading && result && (
                <div className="fadeIn">

                  {/* Score cards */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.75rem',marginBottom:'1.25rem'}}>
                    {[
                      {label:'AEO Score Lift',   val:`+${result.aeo_lift || 12}`,        sub:'estimated points', color:'var(--accent)'},
                      {label:'Engines Helped',   val:result.engines_helped || 5,          sub:'AI search engines', color:'var(--cyan)'},
                      {label:'Spec Compliance',  val:'VALID',                              sub:'llms.txt standard', color:'var(--green)'},
                    ].map(c => (
                      <div key={c.label} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1rem'}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.6rem'}}>{c.label}</div>
                        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'1.6rem',fontWeight:700,color:c.color,lineHeight:1}}>{c.val}</div>
                        <div style={{fontSize:'.75rem',color:'var(--muted2)',marginTop:'.25rem'}}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Company summary */}
                  <div style={{padding:'.85rem 1.1rem',background:'rgba(123,108,255,.05)',border:'1px solid rgba(123,108,255,.15)',borderRadius:'10px',marginBottom:'1.25rem',fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6}}>
                    <strong style={{color:'var(--violet)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em'}}>AI RESEARCH — </strong>
                    <strong style={{color:'var(--text)'}}>{result.company_name}</strong>
                    {result.category && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',marginLeft:'.5rem',border:'1px solid var(--border)',padding:'.15rem .45rem',borderRadius:'3px'}}>{result.category}</span>}
                    <br/>{result.tagline}
                  </div>

                  {/* Tabs */}
                  <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border)',marginBottom:'1.25rem'}}>
                    {TABS.map(t => (
                      <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
                        style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.6rem .9rem',background:'none',border:'none',borderBottom:activeTab===t.id?'2px solid var(--accent)':'2px solid transparent',color:activeTab===t.id?'var(--accent)':'var(--muted2)',marginBottom:'-1px',transition:'color .2s',whiteSpace:'nowrap'}}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab: llms.txt */}
                  {activeTab==='standard' && (
                    <div style={{background:'#0a0818',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.75rem 1.1rem',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--accent)'}}>llms.txt</span>
                        <div style={{display:'flex',gap:'.5rem'}}>
                          <button className="copy-btn" onClick={() => copy(result.llms_txt,'std')}
                            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',background:'none',border:'1px solid var(--border)',padding:'.3rem .7rem',borderRadius:'4px',transition:'all .2s'}}>
                            {copied==='std'?'Copied!':'Copy'}
                          </button>
                          <button className="dl-btn" onClick={() => download(result.llms_txt,'llms.txt')}
                            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--accent)',background:'rgba(200,242,71,.06)',border:'1px solid rgba(200,242,71,.2)',padding:'.3rem .7rem',borderRadius:'4px',transition:'all .2s'}}>
                            ↓ Download
                          </button>
                        </div>
                      </div>
                      <pre style={{padding:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',lineHeight:1.85,color:'var(--muted)',maxHeight:'480px',overflowY:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
                        {result.llms_txt}
                      </pre>
                    </div>
                  )}

                  {/* Tab: llms-full.txt */}
                  {activeTab==='full' && (
                    <div style={{background:'#0a0818',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.75rem 1.1rem',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--violet)'}}>llms-full.txt</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.15rem .45rem',borderRadius:'3px'}}>EXTENDED</span>
                        </div>
                        <div style={{display:'flex',gap:'.5rem'}}>
                          <button className="copy-btn" onClick={() => copy(result.llms_full_txt,'full')}
                            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',background:'none',border:'1px solid var(--border)',padding:'.3rem .7rem',borderRadius:'4px',transition:'all .2s'}}>
                            {copied==='full'?'Copied!':'Copy'}
                          </button>
                          <button className="dl-btn" onClick={() => download(result.llms_full_txt,'llms-full.txt')}
                            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--violet)',background:'rgba(123,108,255,.06)',border:'1px solid rgba(123,108,255,.2)',padding:'.3rem .7rem',borderRadius:'4px',transition:'all .2s'}}>
                            ↓ Download
                          </button>
                        </div>
                      </div>
                      <pre style={{padding:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',lineHeight:1.85,color:'var(--muted)',maxHeight:'480px',overflowY:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
                        {result.llms_full_txt}
                      </pre>
                    </div>
                  )}

                  {/* Tab: Validation */}
                  {activeTab==='validation' && (
                    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
                      <div style={{padding:'1rem 1.25rem',borderBottom:'1px solid var(--border)',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem'}}>
                        Spec validation
                      </div>
                      <div style={{padding:'0 1.25rem'}}>
                        {(result.validation || []).map((v, i) => (
                          <div key={i} style={{display:'grid',gridTemplateColumns:'28px 1fr auto',gap:'10px',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,.05)',alignItems:'center'}}>
                            <span style={{width:'24px',height:'24px',display:'grid',placeItems:'center',borderRadius:'5px',background:v.pass?'rgba(74,222,128,.08)':'rgba(248,113,113,.08)',color:v.pass?'var(--green)':'var(--red)',fontSize:'11px'}}>
                              {v.pass?'✓':'×'}
                            </span>
                            <div>
                              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:500,fontSize:'.82rem',marginBottom:'2px'}}>{v.check}</div>
                              <div style={{fontSize:'.72rem',color:'var(--muted2)'}}>{v.note}</div>
                            </div>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',padding:'.2rem .5rem',border:`1px solid ${v.pass?'rgba(74,222,128,.2)':'rgba(248,113,113,.2)'}`,background:v.pass?'rgba(74,222,128,.06)':'rgba(248,113,113,.06)',borderRadius:'4px',color:v.pass?'var(--green)':'var(--red)'}}>
                              {v.pass?'PASS':'FAIL'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab: Deploy guide */}
                  {activeTab==='deploy' && (
                    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'.25rem'}}>Deploy to {form.domain || 'your domain'}</div>
                      {([
                        {n:'01',color:'var(--accent)',  title:'Download llms.txt',     body:'Click the Download button on the llms.txt tab. The filename must be exactly llms.txt.'},
                        {n:'02',color:'var(--cyan)',    title:'Upload to domain root', body:'For Next.js: place in your /public folder. It will be served at your domain root automatically.'},
                        {n:'03',color:'var(--violet)',  title:'Verify it is live',     body:'Visit https://' + (form.domain || 'yourdomain.com') + '/llms.txt in your browser. Should return plain text, not HTML.'},
                        {n:'04',color:'var(--green)',   title:'Re-run your AEO scan',  body:'Go back to the dashboard and re-scan ' + (form.domain || 'your domain') + ' to see the score improvement.'},
                      ] as {n:string;color:string;title:string;body:string}[]).map(s => (
                        <div key={s.n} style={{display:'grid',gridTemplateColumns:'36px 1fr',gap:'1rem',padding:'1rem',border:'1px solid var(--border)',borderRadius:'10px',background:'rgba(255,255,255,.02)'}}>
                          <span style={{width:'32px',height:'32px',display:'grid',placeItems:'center',borderRadius:'7px',background:'rgba(255,255,255,.04)',color:s.color,fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',fontWeight:500,flexShrink:0}}>{s.n}</span>
                          <div>
                            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.88rem',marginBottom:'.3rem'}}>{s.title}</div>
                            <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.6}}>{s.body}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Re-generate row */}
                  <div style={{display:'flex',gap:'.6rem',marginTop:'1rem',justifyContent:'flex-end'}}>
                    <button onClick={() => setResult(null)}
                      style={{border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',borderRadius:'100px',padding:'.6rem 1.1rem',fontSize:'.78rem',fontFamily:"'JetBrains Mono',monospace"}}>
                      ← Clear
                    </button>
                    <button onClick={generate}
                      style={{background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.6rem 1.1rem',fontSize:'.78rem',fontWeight:700,fontFamily:"'Familjen Grotesk',sans-serif"}}>
                      Re-generate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}