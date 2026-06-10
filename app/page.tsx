'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MARQUEE = ['ChatGPT Citations','Perplexity Mentions','Gemini Visibility','Grok Indexing','Bing Copilot','Claude AI','AEO Score','BLUF Content','llms.txt','E-E-A-T Signals','Schema Validation','Citation Tracking']

const FAQS = [
  { q:'What exactly is AEO and why does it matter now?', a:'AEO (Answer Engine Optimisation) is the practice of making your content visible and citable within AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. As more users skip Google and go straight to AI assistants for answers, being cited in those answers is becoming as important as ranking on page one.' },
  { q:'How do you check if an LLM has cited my site?', a:'We run thousands of relevant prompts across each LLM engine, spanning categories relevant to your niche. We record whether your domain appears in the response, the context it appears in, and the sentiment of the mention.' },
  { q:'Is this different from tracking AI Overviews in Google Search Console?', a:"Yes. GSC tracks your visibility in Google's traditional search results. AEOvision tracks your visibility in standalone AI chat tools like ChatGPT, Perplexity, and Gemini that have hundreds of millions of direct users who never go near Google Search." },
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
          --text:#ede9ff;--muted:rgba(237,233,255,0.44);--muted2:rgba(237,233,255,0.22);
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
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:800,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.4rem 3.5rem',background:'rgba(4,3,12,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',color:'#fff'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#7b6cff,#c8f247)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:700,color:'#fff'}}>A</div>
            AEOvision
          </a>
          <div style={{display:'flex',gap:'2rem'}}>
            {[['How it works','#how-it-works'],['Features','#features'],['Pricing','#pricing']].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{fontSize:'.82rem',color:'var(--muted)',transition:'color .2s'}}>{l}</a>
            ))}
          </div>
          <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
            <button onClick={()=>router.push('/dashboard')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:600,padding:'.55rem 1.2rem',border:'1px solid var(--border)',borderRadius:'100px',background:'transparent',color:'var(--muted)',transition:'all .2s'}}>Log in</button>
            <button onClick={()=>router.push('/dashboard')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,padding:'.55rem 1.3rem',borderRadius:'100px',border:'none',background:'var(--accent)',color:'var(--bg)'}}>Start free</button>
          </div>
        </nav>

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
              AEOvision tracks how often your website gets cited, mentioned, and recommended by large language models. Paste your URL and get your AI visibility score in seconds.
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
        <footer style={{borderTop:'1px solid var(--border)',padding:'3rem 3.5rem',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2rem'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff',marginBottom:'.75rem'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'6px',background:'linear-gradient(135deg,#7b6cff,#c8f247)'}} />AEOvision
            </div>
            <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6,maxWidth:'200px'}}>AI visibility intelligence for the next era of search.</div>
          </div>
          {[
            {title:'Product',links:['How it works','Features','Dashboard','Pricing','API (coming soon)']},
            {title:'Resources',links:['AEO Guide','llms.txt Generator','BLUF Content Templates','Blog','Changelog']},
            {title:'Company',links:['About','Privacy Policy','Terms of Service','Contact']},
          ].map(col=>(
            <div key={col.title}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>{col.title}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.6rem'}}>
                {col.links.map(l=><li key={l}><a href="#" style={{fontSize:'.82rem',color:'var(--muted)'}}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </footer>
        <div style={{borderTop:'1px solid var(--border)',padding:'1.5rem 3.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>© 2026 <span style={{color:'var(--muted)'}}>AEOvision</span> — AI Visibility Intelligence Platform</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>Built for the next era of search.</span>
        </div>
      </div>
    </>
  )
}