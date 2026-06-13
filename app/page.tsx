'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

const MARQUEE = ['ChatGPT Citations','Perplexity Mentions','Gemini Visibility','Grok Indexing','Bing Copilot','Claude AI','AEO Score','BLUF Content','llms.txt','E-E-A-T Signals','Schema Validation','Citation Tracking']

const FAQS = [
  { q:'What exactly is AEO and why does it matter now?', a:'AEO (Answer Engine Optimisation) is the practice of making your content visible and citable within AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. As more users skip Google and go straight to AI assistants for answers, being cited in those answers is becoming as important as ranking on page one.' },
  { q:'How do you check if an LLM has cited my site?', a:'We run thousands of relevant prompts across each LLM engine, spanning categories relevant to your niche. We record whether your domain appears in the response, the context it appears in, and the sentiment of the mention.' },
  { q:'Is this different from tracking AI Overviews in Google Search Console?', a:"Yes. GSC tracks your visibility in Google's traditional search results. Notion Cue tracks your visibility in standalone AI chat tools like ChatGPT, Perplexity, and Gemini that have hundreds of millions of direct users who never go near Google Search." },
  { q:'What is llms.txt and why should I care?', a:'llms.txt is an emerging standard (similar to robots.txt) that tells AI crawlers how to access and use your content. Sites with a well-structured llms.txt file signal authority and crawlability to LLM training pipelines.' },
  { q:'Can I track competitor domains on the free plan?', a:'Competitor tracking is available on Pro and Agency plans. The free plan allows you to scan your own domain and see how you compare to the industry average in your niche.' },
]

const FEATURES = [
  { icon:'🧠', title:'LLM Citation Tracking', desc:'Monitor how often and in what context your domain is cited across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Updated daily.', tag:'Core', c:'rgba(200,242,71,.2)' },
  { icon:'📈', title:'AEO Score', desc:'A single composite score from 0–100 measuring your overall AI engine visibility, built from citation frequency, sentiment, authority, and content structure signals.', tag:'Scoring', c:'rgba(123,108,255,.2)' },
  { icon:'🔍', title:'Content Gap Analysis', desc:"Discover which questions your competitors get cited for that you don't. Get a prioritised list of BLUF-structured content topics to close the gap.", tag:'Strategy', c:'rgba(34,211,238,.2)' },
  { icon:'⚡', title:'llms.txt Validator', desc:'Check if your llms.txt file exists, is correctly formatted, and is being respected by major crawlers. Get a one-click fix template if issues are found.', tag:'Technical', c:'rgba(244,114,182,.2)' },
  { icon:'🏆', title:'Competitor Benchmarking', desc:'Add up to 10 competitor domains and see how your AI visibility score compares across every LLM, keyword category, and content vertical.', tag:'Intelligence', c:'rgba(74,222,128,.2)' },
  { icon:'📬', title:'Weekly Alert Reports', desc:'Receive a curated email digest every Monday with changes in your citation count, new competitor movements, and the top 3 action items for that week.', tag:'Monitoring', c:'rgba(251,191,36,.2)' },
]

const PLANS = [
  { plan:'Free', price:'0', desc:'Perfect for checking your own site and seeing where you stand.', features:['1 domain scan per day','AEO score for 3 LLMs','Basic citation count','llms.txt validator','7-day history'], cta:'Get started free', featured:false },
  { plan:'Pro', price:'49', desc:'For SEO professionals managing client sites and their own brands.', features:['10 domains included','All 6 LLMs tracked daily','Full citation context + sentiment','Competitor benchmarking (up to 5)','Content gap analysis','Weekly email digest reports','90-day history','CSV/PDF exports'], cta:'Start 14-day free trial', featured:true },
  { plan:'Agency', price:'149', desc:'For agencies managing multiple client accounts at scale.', features:['Unlimited domains','All 6 LLMs + custom prompt testing','White-label reports for clients','Unlimited competitor tracking','API access (coming soon)','Priority Slack support','365-day history'], cta:'Contact sales', featured:false },
]

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, animId = 0
    interface Pt { x:number; y:number; z:number; vx:number; vy:number }
    let pts: Pt[] = []

    function resize() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
      pts = Array.from({length: Math.min(70, Math.floor(W*H/18000))}, () => ({
        x: Math.random()*W, y: Math.random()*H, z: Math.random(),
        vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.15
      }))
    }

    function draw() {
      ctx.clearRect(0,0,W,H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if(p.x<0||p.x>W) p.vx*=-1
        if(p.y<0||p.y>H) p.vy*=-1
      })
      for(let a=0; a<pts.length; a++) {
        for(let b=a+1; b<pts.length; b++) {
          const A=pts[a], B=pts[b]
          const d=Math.hypot(A.x-B.x, A.y-B.y)
          if(d<130) {
            ctx.strokeStyle=`rgba(123,108,255,${(1-d/130)*.18})`
            ctx.lineWidth=.8
            ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke()
          }
        }
        const p=pts[a]
        ctx.fillStyle=`rgba(200,242,71,${.1+p.z*.25})`
        ctx.beginPath(); ctx.arc(p.x,p.y,1+p.z*1.8,0,Math.PI*2); ctx.fill()
      }
      animId=requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  function go(inputUrl: string) {
    const val = inputUrl.trim().replace(/^https?:\/\//,'')
    if (!val) return
    router.push(`/dashboard?url=${encodeURIComponent(val)}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--bg2:#070613;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes lineGrow{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spinR{to{transform:rotateX(70deg) rotateZ(360deg)}}
        .fu{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
        .fu1{animation-delay:.1s}.fu2{animation-delay:.2s}.fu3{animation-delay:.35s}
        a{color:inherit;text-decoration:none}
        input:focus,button:focus{outline:none}
        button{cursor:pointer;font-family:inherit}
        .nav-link:hover{color:var(--text)!important}
        .feat-card:hover{background:rgba(255,255,255,.03)!important}
        .feat-card:hover .feat-title{color:var(--accent)}
        .price-card{transition:all .3s}
        .price-card:hover{transform:translateY(-4px);border-color:var(--border-h)!important}
        .stat-cell{position:relative;overflow:hidden;transition:background .3s}
        .faq-q:hover{color:var(--accent)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)',fontFamily:"'Epilogue',sans-serif"}}>

        {/* NAV */}
        <SharedHeader />
    
        {/* HERO */}
        <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 5rem',position:'relative',overflow:'hidden',textAlign:'center'}}>
          <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.6}} />
          <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 80% 60% at 50% 50%,transparent 30%,rgba(4,3,12,.85) 70%,#04030c 100%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:2,maxWidth:'780px'}}>
            <div className="fu" style={{display:'inline-flex',alignItems:'center',gap:'.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--cyan)',border:'1px solid rgba(34,211,238,.2)',background:'rgba(34,211,238,.06)',padding:'.4rem 1rem',borderRadius:'100px',marginBottom:'2rem'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--cyan)',animation:'blink 2s ease-in-out infinite',display:'inline-block'}} />
              Now tracking ChatGPT, Gemini, Perplexity &amp; Grok
            </div>
            <h1 className="fu fu1" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(3rem,7vw,6.5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.5rem'}}>
              Is your site<br/>
              <span style={{WebkitTextStroke:'1.5px rgba(237,233,255,.3)',color:'transparent'}}>visible</span> to<br/>
              <span style={{color:'var(--accent)'}}>AI engines?</span>
            </h1>
            <p className="fu fu2" style={{fontSize:'clamp(.95rem,2vw,1.15rem)',color:'var(--muted)',lineHeight:1.75,maxWidth:'540px',margin:'0 auto 2.5rem'}}>
              Notion Cue tracks how often your website gets cited, mentioned, and recommended by large language models. Paste your URL and get your AI visibility score in seconds.
            </p>
            <div className="fu fu3" style={{display:'flex',maxWidth:'620px',margin:'0 auto 1.25rem',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border-h)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem'}}>
              <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(url)}
                placeholder="https://yourdomain.com" type="url" autoComplete="off"
                style={{flex:1,background:'transparent',border:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.82rem',color:'var(--text)',padding:'.5rem 0',outline:'none'}} />
              <button onClick={()=>go(url)} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.65rem 1.4rem',display:'flex',alignItems:'center',gap:'.5rem',whiteSpace:'nowrap'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Analyse now
              </button>
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',color:'var(--muted2)',display:'flex',alignItems:'center',justifyContent:'center',gap:'1.2rem',flexWrap:'wrap'}}>
              {['Free forever plan','No credit card needed','Results in <30 seconds'].map(t=>(
                <span key={t} style={{display:'flex',alignItems:'center',gap:'.35rem'}}>
                  <span style={{color:'var(--accent)'}}>✦</span>{t}
                </span>
              ))}
            </div>
          </div>
          <div style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',zIndex:2,opacity:.3}}>
            <div style={{width:'1px',height:'50px',background:'linear-gradient(to bottom,transparent,var(--muted))',animation:'lineGrow 2s ease-in-out infinite'}} />
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'var(--bg2)',padding:'1rem 0'}}>
          <div style={{display:'flex',width:'max-content',animation:'marquee 28s linear infinite'}}>
            {[...MARQUEE,...MARQUEE].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'1.2rem',padding:'0 2.5rem',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--accent)',display:'inline-block'}} />{t}
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
          {[
            {num:'2.4',suf:'B',label:'AI queries processed daily across tracked LLMs'},
            {num:'94',suf:'%',label:'Of top-cited domains have structured AEO signals'},
            {num:'6',suf:'x',label:'More organic trust from AI-cited pages vs non-cited'},
            {num:'30',suf:'s',label:'Average time to get your full AI visibility report'},
          ].map((s,i)=>(
            <div key={i} className="stat-cell" style={{padding:'3rem 2.5rem',borderRight:i<3?'1px solid var(--border)':'none'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.2rem,3.5vw,3.5rem)',lineHeight:1,color:'#fff',letterSpacing:'-.02em',marginBottom:'.4rem'}}>
                {s.num}<span style={{color:'var(--accent)',fontSize:'.6em'}}>{s.suf}</span>
              </div>
              <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
                01 — How it works<span style={{width:'32px',height:'1px',background:'var(--border)',display:'inline-block'}} />
              </div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
                From URL to<br/><span style={{color:'var(--muted)'}}>full AI audit</span><br/>in seconds.
              </h2>
              <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px',marginBottom:'3rem'}}>No integrations. No API keys. Just paste your domain and we run a deep scan across every major LLM.</p>
              <div>
                {[
                  {icon:'🔗',title:'Paste your URL',desc:'Enter any domain or specific page URL. We analyse your entire site architecture, content structure, schema markup, and llms.txt status.'},
                  {icon:'🤖',title:'We query 6 LLMs',desc:'Our engine fires thousands of niche prompts across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude to check where your brand appears.'},
                  {icon:'📊',title:'Get your AEO score',desc:'Receive a full breakdown — citation frequency, sentiment, competitor gaps, and a prioritised fix list to improve your AI visibility fast.'},
                  {icon:'🚀',title:'Track weekly changes',desc:'Monitor your AI presence over time with weekly automated scans, email alerts when citations change, and competitor benchmark reports.'},
                ].map((step,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:'1.5rem',padding:'1.75rem 0',borderBottom:'1px solid var(--border)',borderTop:i===0?'1px solid var(--border)':'none',transition:'all .25s'}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'.25rem'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.95rem'}}>{step.icon}</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.05rem',marginBottom:'.3rem'}}>{step.title}</div>
                      <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.65}}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orbital widget */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:'360px',height:'360px',position:'relative',perspective:'900px',display:'flex',alignItems:'center',justifyContent:'center',animation:'floatY 7s ease-in-out infinite'}}>
                {[{size:'100%',color:'rgba(34,211,238,.2)',dur:'12s',dir:'normal'},{size:'72%',color:'rgba(200,242,71,.3)',dur:'9s',dir:'reverse'},{size:'50%',color:'rgba(123,108,255,.4)',dur:'7s',dir:'normal'}].map((r,i)=>(
                  <div key={i} style={{position:'absolute',width:r.size,height:r.size,borderRadius:'50%',border:`1px solid ${r.color}`,transform:'rotateX(70deg)',animation:`spinR ${r.dur} linear infinite`,animationDirection:r.dir as any}} />
                ))}
                <div style={{position:'relative',zIndex:2,width:'100px',height:'100px',background:'rgba(200,242,71,.1)',border:'1px solid rgba(200,242,71,.4)',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 60px rgba(200,242,71,.15)'}}>
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.8rem',color:'var(--accent)',lineHeight:1}}>91</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:'var(--muted2)',letterSpacing:'.1em'}}>AEO SCORE</span>
                </div>
                {[{label:'ChatGPT',top:'-10px',left:'50%',transform:'translateX(-50%)'},{label:'Perplexity',top:'50%',right:'-20px',transform:'translateY(-50%)'},{label:'Gemini',bottom:'-10px',left:'50%',transform:'translateX(-50%)'},{label:'Claude',top:'50%',left:'-20px',transform:'translateY(-50%)'}].map((l,i)=>(
                  <div key={i} style={{position:'absolute',top:l.top,bottom:l.bottom,left:l.left,right:l.right,transform:l.transform,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted)',padding:'.3rem .6rem',background:'rgba(9,17,28,.9)',border:'1px solid var(--border)',borderRadius:'4px',whiteSpace:'nowrap'}}>{l.label}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* FEATURES */}
        <section id="features" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>02 — Features</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
                Everything your<br/><span style={{color:'var(--muted)'}}>AEO strategy needs.</span>
              </h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>Built for SEO professionals who know the next frontier of search is already here.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'16px',overflow:'hidden',border:'1px solid var(--border)'}}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feat-card" style={{background:'var(--card)',padding:'2.5rem 2rem',transition:'background .3s',cursor:'default'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'12px',marginBottom:'1.4rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',border:`1px solid ${f.c}`,background:f.c.replace('.2',',.08)')}}>{f.icon}</div>
                <div className="feat-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem',marginBottom:'.5rem',transition:'color .2s'}}>{f.title}</div>
                <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{f.desc}</div>
                <span style={{display:'inline-block',marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.08)',border:'1px solid rgba(123,108,255,.18)',borderRadius:'4px',padding:'.25rem .6rem'}}>{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />
{/* ── DIVIDER ── */}
<div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

{/* ── 04 ENGINE MATRIX ── */}
<section id="matrix" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
    <div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>04 — Engine Matrix</div>
      <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
        Deep-scan coverage<br/><span style={{color:'var(--muted)'}}>across every LLM.</span>
      </h2>
    </div>
    <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>We don't just check one AI. We probe each engine's own retrieval logic, citation behaviour, and content preference — so you know exactly where you stand on every platform your customers use.</p>
  </div>

  {/* Matrix table */}
  <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'16px',overflow:'hidden',marginBottom:'2rem'}}>
    {/* Header */}
    <div style={{display:'grid',gridTemplateColumns:'1fr repeat(6,80px)',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
      <div style={{padding:'1rem 1.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)'}}>Capability</div>
      {[{l:'ChatGPT',c:'#10a37f'},{l:'Gemini',c:'#4285f4'},{l:'Perplexity',c:'#ff6b35'},{l:'Grok',c:'#1da1f2'},{l:'Copilot',c:'#7565d9'},{l:'Claude',c:'#d97706'}].map(e=>(
        <div key={e.l} style={{padding:'.75rem .5rem',textAlign:'center',borderLeft:'1px solid var(--border)'}}>
          <div style={{width:'28px',height:'28px',borderRadius:'7px',background:`${e.c}22`,border:`1px solid ${e.c}44`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto .4rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',fontWeight:700,color:e.c}}>{e.l.slice(0,2)}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',lineHeight:1.2}}>{e.l}</div>
        </div>
      ))}
    </div>

    {/* Rows */}
    {[
      {feat:'Citation tracking',desc:'How often your URL appears in answers',vals:['Full','Full','Full','Partial','Full','Partial']},
      {feat:'Sentiment analysis',desc:'Positive / neutral / negative mention tone',vals:['Full','Full','Full','Full','Partial','Partial']},
      {feat:'Competitor gap detection',desc:"Queries where rivals appear but you don't",vals:['Full','Full','Full','Soon','Full','Soon']},
      {feat:'llms.txt crawl check',desc:'Whether your AI allowlist is respected',vals:['Full','Partial','Full','Soon','Partial','Full']},
      {feat:'BLUF content scoring',desc:'How well your content answers directly',vals:['Full','Full','Full','Full','Full','Full']},
      {feat:'Weekly trend tracking',desc:'Citation delta week-over-week',vals:['Full','Full','Full','Partial','Full','Partial']},
      {feat:'Real-time query probing',desc:'Live prompt testing against your niche',vals:['Full','Partial','Full','Soon','Partial','Soon']},
    ].map((row,i)=>(
      <div key={i} style={{display:'grid',gridTemplateColumns:'1fr repeat(6,80px)',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
        <div style={{padding:'1rem 1.5rem'}}>
          <div style={{fontSize:'.85rem',color:'var(--text)',fontWeight:400,marginBottom:'.2rem'}}>{row.feat}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>{row.desc}</div>
        </div>
        {row.vals.map((v,vi)=>(
          <div key={vi} style={{display:'flex',alignItems:'center',justifyContent:'center',borderLeft:'1px solid rgba(255,255,255,.04)'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',fontWeight:600,padding:'.25rem .5rem',borderRadius:'4px',
              color:v==='Full'?'#4ade80':v==='Partial'?'var(--accent)':'var(--muted)',
              background:v==='Full'?'rgba(74,222,128,.08)':v==='Partial'?'rgba(200,242,71,.08)':'rgba(255,255,255,.04)',
              border:`1px solid ${v==='Full'?'rgba(74,222,128,.2)':v==='Partial'?'rgba(200,242,71,.2)':'rgba(255,255,255,.08)'}`
            }}>{v}</span>
          </div>
        ))}
      </div>
    ))}
  </div>

  {/* LLM detail cards */}
  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
    {[
      {icon:'GPT',c:'#10a37f',name:'ChatGPT',share:'~94% of AI-referred traffic',desc:'The dominant AI chat platform. Heavily influenced by domain authority, structured data, and BLUF-formatted content. Most commercial intent queries originate here.',tags:['Citations','Sentiment','Gaps','BLUF']},
      {icon:'G',c:'#4285f4',name:'Gemini',share:'Google-integrated, growing fast',desc:"Deeply tied to Google's knowledge graph and Search Quality Rater signals. E-E-A-T and schema markup have outsized influence on Gemini citations.",tags:['E-E-A-T','Schema','Sentiment','Gaps']},
      {icon:'Px',c:'#ff6b35',name:'Perplexity',share:'Real-time web retrieval model',desc:'Retrieves and cites live web sources in every answer. Sites with clear canonical structure, fast load, and cited sources rank disproportionately well here.',tags:['Citations','Real-time','Canonical','BLUF']},
      {icon:'Gk',c:'#1da1f2',name:'Grok',share:'X / Twitter realtime signals',desc:'Uses realtime X (Twitter) data and web search. Social proof and trending content play a bigger role here than on other platforms. Partial coverage, expanding soon.',tags:['Social Signals','Trending','Partial']},
    ].map((e,i)=>(
      <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.5rem',transition:'all .3s',cursor:'default'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'9px',background:`${e.c}18`,border:`1px solid ${e.c}40`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',fontWeight:700,color:e.c,flexShrink:0}}>{e.icon}</div>
          <div>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem'}}>{e.name}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--muted2)'}}>{e.share}</div>
          </div>
        </div>
        <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.65,marginBottom:'1rem'}}>{e.desc}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'.3rem'}}>
          {e.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.2rem .5rem',borderRadius:'4px'}}>{t}</span>)}
        </div>
      </div>
    ))}
  </div>
</section>

<div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

{/* ── 05 FIX & OPTIMISE ── */}
<section id="fix" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
    <div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>05 — Fix &amp; Optimise</div>
      <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
        From audit<br/><span style={{color:'var(--muted)'}}>to action.</span>
      </h2>
    </div>
    <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>Notion Cue doesn't just surface problems. Every issue comes with a one-click fix, a before/after preview, and an estimated citation impact so you know what to prioritise first.</p>
  </div>

  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>

    {/* Before/After llms.txt */}
    <div style={{gridColumn:'span 2',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#f87171',background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Issue detected</span>
        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem'}}>llms.txt — malformed or missing</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 60px 1fr',gap:0,marginBottom:'1.25rem',alignItems:'stretch'}}>
        {/* Before */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'.55rem .9rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',letterSpacing:'.07em',display:'flex',alignItems:'center',gap:'.5rem',borderRadius:'8px 8px 0 0',border:'1px solid rgba(248,113,113,.2)',background:'rgba(248,113,113,.06)',color:'#f87171'}}>
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#f87171',display:'inline-block'}} />Before — what AI crawlers see
          </div>
          <div style={{flex:1,border:'1px solid rgba(248,113,113,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'1rem',background:'rgba(248,113,113,.03)'}}>
            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',lineHeight:1.8,color:'var(--muted)'}}>
              <span style={{color:'var(--muted2)'}}># Missing required fields{'\n'}</span>
              <span style={{color:'var(--cyan)'}}>User-agent</span>: GPTBot{'\n'}
              <span style={{color:'#f87171'}}>Disallow: /{'\n\n'}</span>
              <span style={{color:'var(--muted2)'}}># No llms.txt present at root{'\n'}</span>
              <span style={{color:'#f87171'}}>404 — /llms.txt not found{'\n\n'}</span>
              <span style={{color:'var(--muted2)'}}># AI crawlers blocked or confused{'\n'}</span>
              <span style={{color:'#f87171'}}>No schema context provided</span>
            </pre>
          </div>
        </div>
        {/* Arrow */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.3rem',color:'var(--accent)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.06em',textTransform:'uppercase'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Auto-fix
        </div>
        {/* After */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'.55rem .9rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',letterSpacing:'.07em',display:'flex',alignItems:'center',gap:'.5rem',borderRadius:'8px 8px 0 0',border:'1px solid rgba(74,222,128,.2)',background:'rgba(74,222,128,.06)',color:'#4ade80'}}>
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />After — Notion Cue generated
          </div>
          <div style={{flex:1,border:'1px solid rgba(74,222,128,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'1rem',background:'rgba(74,222,128,.03)'}}>
            <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',lineHeight:1.8,color:'var(--muted)'}}>
              <span style={{color:'var(--muted2)'}}># llms.txt — generated by Notion Cue{'\n'}</span>
              <span style={{color:'var(--cyan)'}}>Name</span>: <span style={{color:'#4ade80'}}>The Dress Outlet{'\n'}</span>
              <span style={{color:'var(--cyan)'}}>Description</span>: <span style={{color:'#4ade80'}}>US women's fashion retailer{'\n'}</span>
              <span style={{color:'var(--cyan)'}}>Contact</span>: <span style={{color:'#4ade80'}}>seo@thedressoutlet.com{'\n\n'}</span>
              <span style={{color:'var(--cyan)'}}>User-agent</span>: GPTBot{'\n'}
              <span style={{color:'#4ade80'}}>Allow: /{'\n\n'}</span>
              <span style={{color:'var(--cyan)'}}>User-agent</span>: Google-Extended{'\n'}
              <span style={{color:'#4ade80'}}>Allow: /collections/{'\n'}</span>
              <span style={{color:'#4ade80'}}>Allow: /blogs/</span>
            </pre>
          </div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'.75rem'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:'.5rem',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',padding:'.45rem 1rem',borderRadius:'100px'}}>
          📈 Est. citation impact: <strong style={{color:'#4ade80'}}>+28%</strong> within 30 days.
        </div>
        <button style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.75rem',color:'var(--bg)',background:'var(--accent)',border:'none',borderRadius:'100px',padding:'.5rem 1.2rem',cursor:'pointer'}}>Copy generated file</button>
      </div>
    </div>

    {/* Before/After BLUF */}
    <div style={{gridColumn:'span 2',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',background:'rgba(200,242,71,.08)',border:'1px solid rgba(200,242,71,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Optimise</span>
        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem'}}>BLUF structure — content not AI-answer-ready</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 60px 1fr',gap:0,marginBottom:'1.25rem',alignItems:'stretch'}}>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'.55rem .9rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',display:'flex',alignItems:'center',gap:'.5rem',borderRadius:'8px 8px 0 0',border:'1px solid rgba(248,113,113,.2)',background:'rgba(248,113,113,.06)',color:'#f87171'}}>
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#f87171',display:'inline-block'}} />Before — buries the answer
          </div>
          <div style={{flex:1,border:'1px solid rgba(248,113,113,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'1rem',background:'rgba(248,113,113,.02)'}}>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.4rem'}}>About Our Evening Dresses</div>
            <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.6,marginBottom:'.5rem'}}>Welcome to The Dress Outlet, where we have been selling dresses since 1998. Our store was founded with a passion for fashion and we believe every woman deserves to feel beautiful. We carry a wide range of styles across many categories that you might find interesting to browse through...</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',color:'#f87171'}}>⚠ Answer appears at paragraph 4 — AI stops reading at paragraph 1.</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'.3rem',color:'var(--accent)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',letterSpacing:'.06em',textTransform:'uppercase'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          BLUF fix
        </div>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'.55rem .9rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',display:'flex',alignItems:'center',gap:'.5rem',borderRadius:'8px 8px 0 0',border:'1px solid rgba(74,222,128,.2)',background:'rgba(74,222,128,.06)',color:'#4ade80'}}>
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />After — answer-first structure
          </div>
          <div style={{flex:1,border:'1px solid rgba(74,222,128,.2)',borderTop:'none',borderRadius:'0 0 8px 8px',padding:'1rem',background:'rgba(74,222,128,.02)'}}>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.4rem'}}>Evening Dresses at The Dress Outlet</div>
            <div style={{fontSize:'.8rem',color:'#4ade80',lineHeight:1.6,padding:'.5rem .75rem',background:'rgba(74,222,128,.06)',borderLeft:'2px solid #4ade80',borderRadius:'0 6px 6px 0',marginBottom:'.4rem'}}>The Dress Outlet sells formal and semi-formal evening dresses in sizes 0–30, priced from $49 to $299, with free shipping on orders over $75.</div>
            <div style={{fontSize:'.75rem',color:'var(--muted)',lineHeight:1.6}}>Founded in 1998, we specialise in occasion wear with new arrivals added weekly across ball gowns, cocktail dresses, and plus-size formal options...</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',color:'#4ade80',marginTop:'.6rem'}}>✦ Answer in sentence 1 — AI cites this directly.</div>
          </div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'.75rem'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:'.5rem',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',padding:'.45rem 1rem',borderRadius:'100px'}}>
          📈 Est. citation impact: <strong style={{color:'#4ade80'}}>+41%</strong> for product category queries.
        </div>
        <button style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.75rem',color:'var(--bg)',background:'var(--accent)',border:'none',borderRadius:'100px',padding:'.5rem 1.2rem',cursor:'pointer'}}>Apply BLUF template</button>
      </div>
    </div>

    {/* Checklist cards */}
    {[
      {title:'Schema Markup',items:[{s:'pass',t:'Organization schema present.'},{s:'pass',t:'Product schema on PDPs.'},{s:'fail',t:'FAQ schema missing on blog posts.'},{s:'fail',t:'BreadcrumbList not implemented.'},{s:'warn',t:'Article schema incomplete.'}],score:'3/5'},
      {title:'E-E-A-T Signals',items:[{s:'pass',t:'Author bylines present.'},{s:'pass',t:'About page indexed.'},{s:'fail',t:'No expert credentials linked.'},{s:'fail',t:'Citations / references missing.'},{s:'warn',t:'Review schema partial.'}],score:'2/5'},
      {title:'Content Structure',items:[{s:'pass',t:'BLUF paragraphs on 61% of pages.'},{s:'pass',t:'H1 present on all pages.'},{s:'pass',t:'Definition sections present.'},{s:'fail',t:'FAQ blocks sparse on PDPs.'},{s:'warn',t:'Average answer depth: low.'}],score:'3/5'},
    ].map((card,i)=>(
      <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem'}}>
        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',marginBottom:'1.25rem',paddingBottom:'.75rem',borderBottom:'1px solid var(--border)'}}>{card.title}</div>
        <div style={{display:'flex',flexDirection:'column',gap:'.55rem',marginBottom:'1.25rem'}}>
          {card.items.map((item,ii)=>(
            <div key={ii} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>
              <span style={{flexShrink:0,color:item.s==='pass'?'#4ade80':item.s==='fail'?'#f87171':'var(--accent)',marginTop:'.05rem'}}>
                {item.s==='pass'?'✓':item.s==='fail'?'✗':'△'}
              </span>
              {item.t}
            </div>
          ))}
        </div>
        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.6rem',color:'var(--text)'}}>
          {card.score} <span style={{fontSize:'.78rem',color:'var(--muted)',fontWeight:300}}>passed</span>
        </div>
      </div>
    ))}
  </div>
</section>

<div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

{/* ── 06 E-E-A-T & AUTHORITY ── */}
<section id="eeat" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
    <div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>06 — Authority &amp; E-E-A-T</div>
      <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
        AI engines rank<br/><span style={{color:'var(--muted)'}}>trusted sources</span><br/>first.
      </h2>
      <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px',marginBottom:'2.5rem'}}>Every major LLM uses authority signals to decide whose content to cite. Notion Cue audits all four pillars of E-E-A-T and scores how you appear to AI crawlers.</p>
      <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
        {[
          {icon:'⚡',bg:'rgba(200,242,71,.08)',bc:'rgba(200,242,71,.2)',name:'Experience',desc:'First-hand content signals, case studies, real data and original research that AI models cannot find elsewhere.'},
          {icon:'🎓',bg:'rgba(123,108,255,.08)',bc:'rgba(123,108,255,.2)',name:'Expertise',desc:'Author credential markup, byline schema, linked professional profiles, and depth of topical coverage per domain.'},
          {icon:'🏅',bg:'rgba(34,211,238,.08)',bc:'rgba(34,211,238,.2)',name:'Authoritativeness',desc:'Backlink quality from trusted domains, mentions in credible publications, and citation frequency across LLMs.'},
          {icon:'🛡',bg:'rgba(244,114,182,.08)',bc:'rgba(244,114,182,.2)',name:'Trustworthiness',desc:'SSL, privacy policy, transparent ownership, accurate factual claims, and structured citations with verifiable sources.'},
        ].map((p,i)=>(
          <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'1rem'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',border:`1px solid ${p.bc}`,background:p.bg}}>{p.icon}</div>
            <div>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'.25rem'}}>{p.name}</div>
              <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6}}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* E-E-A-T Score Card */}
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'16px',padding:'2rem'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem'}}>E-E-A-T Authority Score</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.06em'}}>thedressoutlet.com</div>
      </div>
      <div style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
        <svg viewBox="0 0 280 280" style={{width:'240px',height:'240px'}}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#7b6cff" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#c8f247" stopOpacity="0.08"/>
            </radialGradient>
          </defs>
          <polygon points="140,40 240,110 200,220 80,220 40,110" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <polygon points="140,75 210,122 183,197 97,197 70,122" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <polygon points="140,110 180,134 166,174 114,174 100,134" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <line x1="140" y1="140" x2="140" y2="40"  stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="140" y1="140" x2="240" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="140" y1="140" x2="200" y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="140" y1="140" x2="80"  y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <line x1="140" y1="140" x2="40"  y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          <polygon points="140,62 218,116 189,206 91,206 62,116" fill="url(#radarFill)" stroke="#7b6cff" strokeWidth="1.5" strokeOpacity="0.7"/>
          <circle cx="140" cy="62"  r="4" fill="#c8f247"/>
          <circle cx="218" cy="116" r="4" fill="#c8f247"/>
          <circle cx="189" cy="206" r="4" fill="#c8f247"/>
          <circle cx="91"  cy="206" r="4" fill="#c8f247"/>
          <circle cx="62"  cy="116" r="4" fill="#c8f247"/>
          <text x="140" y="32"  textAnchor="middle" fill="rgba(237,233,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">Experience 78</text>
          <text x="252" y="108" textAnchor="start"  fill="rgba(237,233,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">Auth. 82</text>
          <text x="205" y="236" textAnchor="middle" fill="rgba(237,233,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">Trust 71</text>
          <text x="75"  y="236" textAnchor="middle" fill="rgba(237,233,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">Exp. 65</text>
          <text x="28"  y="108" textAnchor="end"    fill="rgba(237,233,255,0.5)" fontSize="11" fontFamily="JetBrains Mono">BLUF 74</text>
        </svg>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
        {[{l:'Experience',w:'78%',c:'linear-gradient(90deg,var(--accent),#a3e635)',v:'78'},{l:'Expertise',w:'65%',c:'linear-gradient(90deg,var(--violet),#a78bfa)',v:'65'},{l:'Authoritativeness',w:'82%',c:'linear-gradient(90deg,var(--cyan),#67e8f9)',v:'82'},{l:'Trustworthiness',w:'71%',c:'linear-gradient(90deg,var(--rose),#f9a8d4)',v:'71'}].map(b=>(
          <div key={b.l} style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <span style={{fontSize:'.75rem',color:'var(--muted)',width:'130px',flexShrink:0}}>{b.l}</span>
            <div style={{flex:1,height:'5px',background:'rgba(255,255,255,.06)',borderRadius:'100px',overflow:'hidden'}}>
              <div style={{height:'100%',width:b.w,background:b.c,borderRadius:'100px'}} />
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'var(--muted2)',width:'20px',textAlign:'right'}}>{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

<div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

{/* ── 07 EVIDENCE / SOCIAL PROOF ── */}
<section id="results" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
  <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem',display:'flex',justifyContent:'center'}}>07 — Evidence</div>
    <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'.75rem'}}>
      Numbers from<br/><span style={{color:'var(--muted)'}}>real users.</span>
    </h2>
    <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75}}>Aggregated from 3,400+ domains scanned in the last 90 days.</p>
  </div>

  {/* Stats bar */}
  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',marginBottom:'3rem'}}>
    {[{num:'40%',label:'Average citation growth for Pro users in 60 days.'},{num:'3.2x',label:'More LLM citations after implementing llms.txt fixes.'},{num:'89%',label:'Of users found at least one critical AEO issue on first scan.'},{num:'22 days',label:'Average time to see measurable citation improvement after fixes.'}].map((s,i)=>(
      <div key={i} style={{padding:'2.5rem 2rem',textAlign:'center',borderRight:i<3?'1px solid var(--border)':'none'}}>
        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3rem',lineHeight:1,letterSpacing:'-.02em',color:'var(--accent)',marginBottom:'.5rem'}}>{s.num}</div>
        <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.5,maxWidth:'160px',margin:'0 auto'}}>{s.label}</div>
      </div>
    ))}
  </div>

  {/* Testimonial cards */}
  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'4rem'}}>
    {[
      {tag:'E-commerce · Fashion',tagC:'var(--accent)',tagBC:'rgba(200,242,71,.2)',tagBg:'rgba(200,242,71,.06)',quote:'"Within 3 weeks of fixing our llms.txt and adding BLUF paragraphs to category pages, ChatGPT started citing us for \'best evening dresses\' queries. Traffic from AI sources went from near-zero to 33K sessions per month."',initials:'SS',gradC:'linear-gradient(135deg,var(--violet),var(--accent))',name:'Sudhir Singh',role:'Senior SEO Manager · The Dress Outlet',metric:'+340%',metricL:'AI traffic'},
      {tag:'EdTech · International',tagC:'var(--cyan)',tagBC:'rgba(34,211,238,.2)',tagBg:'rgba(34,211,238,.06)',quote:'"We manage SEO for 35 global education domains. Notion Cue gave us the first clear picture of which domains were being cited by Gemini and which weren\'t — it changed how we briefed content teams in every region."',initials:'AM',gradC:'linear-gradient(135deg,#4285f4,var(--cyan))',name:'Arun Mehta',role:'Head of SEO · Global Education Group',metric:'35',metricL:'Domains tracked'},
      {tag:'Agency · Multi-client',tagC:'var(--rose)',tagBC:'rgba(244,114,182,.2)',tagBg:'rgba(244,114,182,.06)',quote:'"Every client asks about AI search now. Notion Cue lets me show them a score on day one, a fix list by day three, and measurable citation growth in the monthly report. It\'s become a core part of our SEO audits."',initials:'PK',gradC:'linear-gradient(135deg,var(--rose),#fb923c)',name:'Priya Kapoor',role:'Founder · Digital Growth Agency',metric:'18',metricL:'Client accounts'},
    ].map((c,i)=>(
      <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem',display:'flex',flexDirection:'column',gap:'1.25rem',transition:'all .3s'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:c.tagC,border:`1px solid ${c.tagBC}`,background:c.tagBg,padding:'.25rem .65rem',borderRadius:'5px',alignSelf:'flex-start'}}>{c.tag}</span>
        <div style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.75,fontStyle:'italic',flex:1}}>{c.quote}</div>
        <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'50%',background:c.gradC,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:700,color:'#fff',flexShrink:0}}>{c.initials}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem'}}>{c.name}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--muted2)'}}>{c.role}</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.2rem',color:'var(--accent)'}}>{c.metric}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)'}}>{c.metricL}</div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Tool Intelligence */}
  <div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1rem'}}>
      <div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.4rem'}}>Tool Intelligence</div>
        <h3 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.6rem',letterSpacing:'-.02em'}}>What each AI engine<br/><span style={{color:'var(--muted)'}}>actually rewards.</span></h3>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
      {[
        {dot:'#10a37f',bc:'rgba(16,163,127,.25)',name:'ChatGPT / GPT-4o',good:['Content answers a question in the first 2 sentences.','Page has high domain authority (DA 40+) and backlinks.','Organization schema with niche topical authority signals.'],bad:['Burying answers in long preamble paragraphs.','Pages with thin content under 400 words.']},
        {dot:'#4285f4',bc:'rgba(66,133,244,.25)',name:'Gemini (Google)',good:['Full E-E-A-T signals: author schema, credentials, about page.','Structured data with FAQPage, HowTo, and Article schema.","Content aligned with Google\'s YMYL quality standards.'],bad:['Anonymous content with no author attribution.','Pages blocked from Google-Extended in robots.txt.']},
        {dot:'#ff6b35',bc:'rgba(255,107,53,.25)',name:'Perplexity',good:['Clean canonical URLs with fast load (CWV: Good).','Factual claims are sourced and linked to primary references.','Content is structured for scanning: subheadings, bullets, tables.'],bad:['JavaScript-rendered content that blocks real-time crawling.','Duplicate content across multiple parameterised URLs.']},
      ].map((card,i)=>(
        <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.65rem',padding:'1.1rem 1.25rem',borderBottom:`1px solid ${card.bc}`,background:'rgba(255,255,255,.02)'}}>
            <span style={{width:'8px',height:'8px',borderRadius:'50%',background:card.dot,boxShadow:`0 0 10px ${card.dot}`,flexShrink:0,display:'inline-block'}} />
            <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem'}}>{card.name}</span>
          </div>
          <div style={{padding:'1.25rem'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#4ade80',marginBottom:'.6rem'}}>Best cited when...</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.45rem',marginBottom:'1.1rem'}}>
              {card.good.map((t,ii)=>(
                <li key={ii} style={{display:'flex',alignItems:'flex-start',gap:'.5rem',fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>
                  <span style={{color:'#4ade80',flexShrink:0,marginTop:'.1rem'}}>✓</span>{t}
                </li>
              ))}
            </ul>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#f87171',marginBottom:'.6rem'}}>Avoid...</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.45rem'}}>
              {card.bad.map((t,ii)=>(
                <li key={ii} style={{display:'flex',alignItems:'flex-start',gap:'.5rem',fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>
                  <span style={{color:'#f87171',flexShrink:0,marginTop:'.1rem'}}>✗</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />
        {/* PRICING */}
        <section id="pricing" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>03 — Pricing</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
            Simple, transparent<br/><span style={{color:'var(--muted)'}}>pricing.</span>
          </h2>
          <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'3.5rem'}}>Start free. Scale when you need. No lock-in.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',textAlign:'left'}}>
            {PLANS.map((p,i)=>(
              <div key={i} className="price-card" style={{background:p.featured?'linear-gradient(160deg,rgba(200,242,71,.04),#100e22)':'var(--card)',border:`1px solid ${p.featured?'rgba(200,242,71,.35)':'var(--border)'}`,borderRadius:'16px',padding:'2.5rem 2rem',position:'relative'}}>
                {p.featured&&<span style={{position:'absolute',top:'1.25rem',right:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--bg)',background:'var(--accent)',padding:'.25rem .6rem',borderRadius:'4px',fontWeight:600}}>Most Popular</span>}
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.75rem'}}>{p.plan}</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3rem',lineHeight:1,letterSpacing:'-.02em',marginBottom:'.25rem'}}>
                  <sup style={{fontSize:'1.2rem',color:'var(--muted)',verticalAlign:'super'}}>$</sup>{p.price}<span style={{fontSize:'1rem',color:'var(--muted)'}}>/mo</span>
                </div>
                <div style={{fontSize:'.82rem',color:'var(--muted)',marginBottom:'1.75rem'}}>{p.desc}</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.65rem',marginBottom:'2rem'}}>
                  {p.features.map(f=>(
                    <li key={f} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.85rem',color:'var(--muted)',lineHeight:1.5}}>
                      <span style={{color:'var(--accent)',fontSize:'.75rem',flexShrink:0,marginTop:'.1rem'}}>✦</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={()=>router.push('/dashboard')} style={{width:'100%',padding:'.85rem',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',letterSpacing:'.04em',border:`1px solid ${p.featured?'transparent':'var(--border)'}`,background:p.featured?'var(--accent)':'transparent',color:p.featured?'var(--bg)':'var(--text)',transition:'all .22s'}}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* FAQ */}
        <section style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>04 — FAQ</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'3rem'}}>
            Common <span style={{color:'var(--muted)'}}>questions.</span>
          </h2>
          <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'left'}}>
            {FAQS.map((f,i)=>(
              <div key={i} style={{borderTop:'1px solid var(--border)',padding:'1.5rem 0',borderBottom:i===FAQS.length-1?'1px solid var(--border)':'none'}}>
                <div onClick={()=>setOpenFaq(openFaq===i?null:i)} className="faq-q" style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:500,fontSize:'1rem',gap:'1rem',cursor:'pointer',transition:'color .2s'}}>
                  {f.q}
                  <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'50%',border:`1px solid ${openFaq===i?'var(--accent)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',color:openFaq===i?'var(--accent)':'var(--muted)',transform:openFaq===i?'rotate(180deg)':'none',transition:'all .25s'}}>▾</span>
                </div>
                {openFaq===i&&<div style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.75,paddingTop:'.85rem'}}>{f.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'8rem 3.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(123,108,255,.12) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:1,maxWidth:'680px',margin:'0 auto'}}>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,5vw,4.5rem)',lineHeight:1,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              Start tracking your<br/><span style={{color:'var(--accent)'}}>AI visibility</span> today.
            </h2>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2.5rem'}}>Over 3,400 SEO professionals already know where they stand in AI search. Do you?</p>
            <div style={{display:'flex',maxWidth:'520px',margin:'0 auto',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border-h)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem'}}>
              <input value={ctaUrl} onChange={e=>setCtaUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(ctaUrl)}
                placeholder="https://yourdomain.com" type="url"
                style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.8rem',color:'var(--text)',padding:'.5rem 0'}} />
              <button onClick={()=>go(ctaUrl)} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.82rem',fontWeight:700,background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.7rem 1.5rem'}}>Analyse free</button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <SharedFooter />
        
        <div style={{borderTop:'1px solid var(--border)',padding:'1.5rem 3.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>© 2026 <span style={{color:'var(--muted)'}}>Notion Cue</span> — AI Visibility Intelligence Platform</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>Built for the next era of search.</span>
        </div>
      </div>
    </>
  )
}