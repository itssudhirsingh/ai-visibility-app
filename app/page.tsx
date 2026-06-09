'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
 // tell TypeScript canvas is definitely not null from here
  const safeCanvas = canvas
    let W = 0, H = 0, animId = 0
    interface NodeType { x3:number;y3:number;z3:number;vx:number;vy:number;vz:number;size:number;pulse:number }
    let nodes: NodeType[] = []
    let mx = 0, my = 0

function resize() { W = (canvas as HTMLCanvasElement).width = window.innerWidth; H = (canvas as HTMLCanvasElement).height = window.innerHeight }
    function initNodes() {
      const count = Math.min(Math.floor((W*H)/14000), 80)
      nodes = Array.from({length:count}, () => {
        const theta = Math.random()*Math.PI*2
        const phi = Math.acos(2*Math.random()-1)
        const r = 180+Math.random()*200
        return { x3:r*Math.sin(phi)*Math.cos(theta), y3:r*Math.sin(phi)*Math.sin(theta), z3:r*Math.cos(phi),
          vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, vz:(Math.random()-.5)*.3,
          size:Math.random()*2.5+.5, pulse:Math.random()*Math.PI*2 }
      })
    }
    function project(n: NodeType) {
      const fov=600, scale=fov/(fov+n.z3+400)
      return { x:W/2+n.x3*scale, y:H/2+n.y3*scale, scale, depth:(n.z3+400)/800 }
    }
    function draw() {
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n => {
        n.x3+=n.vx; n.y3+=n.vy; n.z3+=n.vz; n.pulse+=.025
        const cos=Math.cos(.0008), sin=Math.sin(.0008)
        const nx=n.x3*cos+n.z3*sin, nz=-n.x3*sin+n.z3*cos
        n.x3=nx; n.z3=nz
        if(Math.sqrt(n.x3**2+n.y3**2+n.z3**2)>400){n.vx*=-1;n.vy*=-1;n.vz*=-1}
      })
      const proj = nodes.map(n=>({node:n,...project(n)})).sort((a,b)=>a.depth-b.depth)
      for(let i=0;i<proj.length;i++) for(let j=i+1;j<proj.length;j++) {
        const a=proj[i],b=proj[j]
        const d=Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2)
        if(d<140){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y)
          ctx.strokeStyle=`rgba(123,108,255,${(1-d/140)*.35*Math.min(a.depth,b.depth)})`
          ctx.lineWidth=.6; ctx.stroke()
        }
      }
      proj.forEach(p => {
        const pulse=.6+.4*Math.sin(p.node.pulse), alpha=p.depth*.9*pulse, r=p.node.size*p.scale*2.5
        const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4)
        grad.addColorStop(0,`rgba(200,242,71,${alpha*.25})`); grad.addColorStop(1,'transparent')
        ctx.beginPath(); ctx.arc(p.x,p.y,r*4,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(.5,r),0,Math.PI*2)
        ctx.fillStyle=p.depth>.65?`rgba(200,242,71,${alpha})`:`rgba(123,108,255,${alpha*1.2})`; ctx.fill()
      })
      const mg=ctx.createRadialGradient(mx,my,0,mx,my,280)
      mg.addColorStop(0,'rgba(123,108,255,0.06)'); mg.addColorStop(1,'transparent')
      ctx.fillStyle=mg; ctx.fillRect(0,0,W,H)
      animId=requestAnimationFrame(draw)
    }
    resize(); initNodes(); mx=W/2; my=H/2
    window.addEventListener('resize',()=>{resize();initNodes()})
    window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY})
    requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  function handleAnalyze(inputUrl: string) {
    const val = inputUrl.trim().replace(/^https?:\/\//,'')
    if (!val) return
    router.push(`/dashboard?url=${encodeURIComponent(val)}`)
  }

  const faqs = [
    { q:'What exactly is AEO and why does it matter now?', a:'AEO (Answer Engine Optimisation) is the practice of making your content visible and citable within AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. As more users skip Google and go straight to AI assistants for answers, being cited in those answers is becoming as important as ranking on page one.' },
    { q:'How do you check if an LLM has cited my site?', a:'We run thousands of relevant prompts across each LLM engine, spanning categories relevant to your niche. We record whether your domain appears in the response, the context it appears in, and the sentiment of the mention.' },
    { q:'Is this different from tracking AI Overviews in Google Search Console?', a:"Yes. GSC tracks your visibility in Google's traditional search results. AEOvision tracks your visibility in standalone AI chat tools like ChatGPT, Perplexity, and Gemini that have hundreds of millions of direct users who never go near Google Search." },
    { q:'What is llms.txt and why should I care?', a:'llms.txt is an emerging standard (similar to robots.txt) that tells AI crawlers how to access and use your content. Sites with a well-structured llms.txt file signal authority and crawlability to LLM training pipelines.' },
    { q:'Can I track competitor domains on the free plan?', a:'Competitor tracking is available on Pro and Agency plans. The free plan allows you to scan your own domain and see how you compare to the industry average in your niche.' },
  ]

  const features = [
    {icon:'🧠',bg:'rgba(200,242,71,.08)',bc:'rgba(200,242,71,.2)',title:'LLM Citation Tracking',desc:'Monitor how often and in what context your domain is cited across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Updated daily.',tag:'Core'},
    {icon:'📈',bg:'rgba(123,108,255,.08)',bc:'rgba(123,108,255,.2)',title:'AEO Score',desc:'A single composite score from 0–100 measuring your overall AI engine visibility, built from citation frequency, sentiment, authority, and content structure signals.',tag:'Scoring'},
    {icon:'🔍',bg:'rgba(34,211,238,.08)',bc:'rgba(34,211,238,.2)',title:'Content Gap Analysis',desc:"Discover which questions your competitors get cited for that you don't. Get a prioritised list of BLUF-structured content topics to close the gap.",tag:'Strategy'},
    {icon:'⚡',bg:'rgba(244,114,182,.08)',bc:'rgba(244,114,182,.2)',title:'llms.txt Validator',desc:'Check if your llms.txt file exists, is correctly formatted, and is being respected by major crawlers. Get a one-click fix template if issues are found.',tag:'Technical'},
    {icon:'🏆',bg:'rgba(74,222,128,.08)',bc:'rgba(74,222,128,.2)',title:'Competitor Benchmarking',desc:'Add up to 10 competitor domains and see how your AI visibility score compares across every LLM, keyword category, and content vertical.',tag:'Intelligence'},
    {icon:'📬',bg:'rgba(251,191,36,.08)',bc:'rgba(251,191,36,.2)',title:'Weekly Alert Reports',desc:'Receive a curated email digest every Monday with changes in your citation count, new competitor movements, and the top 3 action items for that week.',tag:'Monitoring'},
  ]

  const plans = [
    {plan:'Free',price:'0',desc:'Perfect for checking your own site and seeing where you stand.',features:['1 domain scan per day','AEO score for 3 LLMs','Basic citation count','llms.txt validator','7-day history'],cta:'Get started free',featured:false},
    {plan:'Pro',price:'49',desc:'For SEO professionals managing client sites and their own brands.',features:['10 domains included','All 6 LLMs tracked daily','Full citation context + sentiment','Competitor benchmarking (up to 5)','Content gap analysis','Weekly email digest reports','90-day history','CSV/PDF exports'],cta:'Start 14-day free trial',featured:true},
    {plan:'Agency',price:'149',desc:'For agencies managing multiple client accounts at scale.',features:['Unlimited domains','All 6 LLMs + custom prompt testing','White-label reports for clients','Unlimited competitor tracking','API access (coming soon)','Priority Slack support','365-day history'],cta:'Contact sales',featured:false},
  ]

  const marqueeItems = ['ChatGPT Citations','Perplexity Mentions','Gemini Visibility','Grok Indexing','Bing Copilot','Claude AI','AEO Score','BLUF Content','llms.txt','E-E-A-T Signals','Schema Validation','Citation Tracking']

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
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes lineGrow{
          0%{transform:scaleY(0);transform-origin:top}
          50%{transform:scaleY(1);transform-origin:top}
          51%{transform:scaleY(1);transform-origin:bottom}
          100%{transform:scaleY(0);transform-origin:bottom}
        }
        .fu{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
        .fu1{animation-delay:.1s}.fu2{animation-delay:.2s}.fu3{animation-delay:.35s}
        a{color:inherit;}
        nav a:hover{color:var(--text) !important}
        .feat:hover{background:#13112a !important}
        .pcard:hover{transform:translateY(-4px);border-color:var(--border-h) !important}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)',fontFamily:"'Epilogue',sans-serif"}}>

        {/* ── NAV ── */}
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:800,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.4rem 3.5rem',background:'rgba(4,3,12,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',color:'#fff',textDecoration:'none'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,#7b6cff,#c8f247)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:700,color:'#fff'}}>A</div>
            AEOvision
          </a>
          <div style={{display:'flex',gap:'2rem'}}>
            {[['How it works','#how-it-works'],['Features','#features'],['Pricing','#pricing']].map(([l,h]) => (
              <a key={l} href={h} style={{fontSize:'.82rem',color:'var(--muted)',textDecoration:'none',transition:'color .2s'}}>{l}</a>
            ))}
          </div>
          <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
            <button onClick={() => router.push('/dashboard')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:600,padding:'.55rem 1.2rem',border:'1px solid var(--border)',borderRadius:'100px',background:'transparent',color:'var(--muted)',cursor:'pointer',transition:'all .2s'}}>Log in</button>
            <button onClick={() => router.push('/dashboard')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,padding:'.55rem 1.3rem',borderRadius:'100px',border:'none',cursor:'pointer',background:'var(--accent)',color:'var(--bg)',transition:'all .2s'}}>Start free</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 5rem',position:'relative',overflow:'hidden',textAlign:'center'}}>
          <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}} />
          <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,3,12,.8) 70%, #04030c 100%)',pointerEvents:'none'}} />

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
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleAnalyze(url)}
                placeholder="https://yourdomain.com"
                type="url"
                autoComplete="off"
                style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.82rem',color:'var(--text)',padding:'.5rem 0'}}
              />
              <button onClick={() => handleAnalyze(url)} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.65rem 1.4rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'.5rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Analyse now
              </button>
            </div>

            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',color:'var(--muted2)',display:'flex',alignItems:'center',justifyContent:'center',gap:'1.2rem',flexWrap:'wrap'}}>
              {['Free forever plan','No credit card needed','Results in <30 seconds'].map(t => (
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

        {/* ── MARQUEE ── */}
        <div style={{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'var(--bg2)',padding:'1rem 0'}}>
          <div style={{display:'flex',width:'max-content',animation:'marquee 28s linear infinite'}}>
            {[...marqueeItems,...marqueeItems].map((t,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'1.2rem',padding:'0 2.5rem',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--accent)',display:'inline-block'}} />{t}
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
          {[
            {num:'2.4',suf:'B',label:'AI queries processed daily across tracked LLMs'},
            {num:'94',suf:'%',label:'Of top-cited domains have structured AEO signals'},
            {num:'6',suf:'x',label:'More organic trust from AI-cited pages vs non-cited'},
            {num:'30',suf:'s',label:'Average time to get your full AI visibility report'},
          ].map((s,i) => (
            <div key={i} style={{padding:'3rem 2.5rem',borderRight:i<3?'1px solid var(--border)':'none'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.2rem,3.5vw,3.5rem)',lineHeight:1,color:'#fff',letterSpacing:'-.02em',marginBottom:'.4rem'}}>
                {s.num}<span style={{color:'var(--accent)',fontSize:'.6em'}}>{s.suf}</span>
              </div>
              <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
                01 — How it works<span style={{width:'32px',height:'1px',background:'var(--border)',display:'inline-block'}} />
              </div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
                From URL to<br/><span style={{color:'var(--muted)'}}>full AI audit</span><br/>in seconds.
              </h2>
              <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px',marginBottom:'3rem'}}>No integrations, no API keys. Just paste your domain and we run a deep scan across every major LLM.</p>
              <div style={{display:'flex',flexDirection:'column'}}>
                {[
                  {icon:'🔗',title:'Paste your URL',desc:'Enter any domain or specific page URL. We analyse your entire site architecture, content structure, schema markup, and llms.txt status.'},
                  {icon:'🤖',title:'We query 6 LLMs',desc:'Our engine fires thousands of niche prompts across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude to check where your brand appears.'},
                  {icon:'📊',title:'Get your AEO score',desc:'Receive a full breakdown — citation frequency, sentiment, competitor gaps, and a prioritised fix list to improve your AI visibility fast.'},
                  {icon:'🚀',title:'Track weekly changes',desc:'Monitor your AI presence over time with weekly automated scans, email alerts when citations change, and competitor benchmark reports.'},
                ].map((step,i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:'1.5rem',padding:'1.75rem 0',borderBottom:'1px solid var(--border)',borderTop:i===0?'1px solid var(--border)':'none'}}>
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

            {/* Mock card */}
            <div>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'16px',overflow:'hidden',boxShadow:'0 40px 80px rgba(0,0,0,.6)',animation:'floatY 7s ease-in-out infinite'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.9rem 1.25rem',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
                  <div style={{display:'flex',gap:'.4rem'}}>
                    {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:'9px',height:'9px',borderRadius:'50%',background:c}} />)}
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>AEOvision — AI Visibility Report</span>
                </div>
                <div style={{padding:'1.25rem'}}>
                  <div style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',borderRadius:'8px',padding:'.55rem 1rem',marginBottom:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:'.75rem'}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    <span style={{color:'var(--accent)'}}>thedressoutlet.com</span>
                    <span style={{color:'var(--muted2)'}}>— Last scan: 2 min ago</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.6rem',marginBottom:'1rem'}}>
                    {[{val:'74',color:'var(--accent)',lbl:'AEO Score'},{val:'2.8K',color:'var(--cyan)',lbl:'Citations'},{val:'4/6',color:'var(--violet)',lbl:'LLMs Found'}].map(s=>(
                      <div key={s.lbl} style={{background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',borderRadius:'10px',padding:'.85rem .75rem',textAlign:'center'}}>
                        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',lineHeight:1,display:'block',marginBottom:'.15rem',color:s.color}}>{s.val}</span>
                        <span style={{fontSize:'.62rem',color:'var(--muted2)',letterSpacing:'.06em'}}>{s.lbl}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
                    {[{name:'ChatGPT',pct:88,color:'#10a37f'},{name:'Gemini',pct:61,color:'#4285f4'},{name:'Perplexity',pct:74,color:'#ff6b35'},{name:'Copilot',pct:45,color:'#7b6cff'}].map(e=>(
                      <div key={e.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.5rem .75rem',background:'rgba(255,255,255,.02)',borderRadius:'7px',fontSize:'.75rem'}}>
                        <span style={{color:'var(--muted)',display:'flex',alignItems:'center',gap:'.5rem'}}>
                          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:e.color,flexShrink:0,display:'inline-block'}} />{e.name}
                        </span>
                        <div style={{flex:1,margin:'0 .75rem',height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'100px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${e.pct}%`,background:e.color,borderRadius:'100px'}} />
                        </div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted)'}}>{e.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FEATURES ── */}
        <section id="features" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>02 — Features</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
                Everything your<br/><span style={{color:'var(--muted)'}}>AEO strategy needs.</span>
              </h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>Built for SEO professionals who know that the next frontier of search is already here.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'16px',overflow:'hidden',border:'1px solid var(--border)'}}>
            {features.map((f,i) => (
              <div key={i} className="feat" style={{background:'var(--card)',padding:'2.5rem 2rem',transition:'background .3s',cursor:'default'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'12px',marginBottom:'1.4rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',border:`1px solid ${f.bc}`,background:f.bg}}>{f.icon}</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem',marginBottom:'.5rem'}}>{f.title}</div>
                <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{f.desc}</div>
                <span style={{display:'inline-block',marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.08)',border:'1px solid rgba(123,108,255,.18)',borderRadius:'4px',padding:'.25rem .6rem'}}>{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── PRICING ── */}
        <section id="pricing" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>08 — Pricing</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
            Simple, transparent<br/><span style={{color:'var(--muted)'}}>pricing.</span>
          </h2>
          <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'3.5rem'}}>Start free. Scale when you need. No lock-in.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',textAlign:'left'}}>
            {plans.map((p,i) => (
              <div key={i} className="pcard" style={{
                background: p.featured ? 'linear-gradient(160deg,rgba(200,242,71,.04),#100e22)' : 'var(--card)',
                border:`1px solid ${p.featured?'rgba(200,242,71,.35)':'var(--border)'}`,
                borderRadius:'16px',padding:'2.5rem 2rem',position:'relative',transition:'all .3s'
              }}>
                {p.featured && <span style={{position:'absolute',top:'1.25rem',right:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--bg)',background:'var(--accent)',padding:'.25rem .6rem',borderRadius:'4px',fontWeight:600}}>Most Popular</span>}
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.75rem'}}>{p.plan}</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3rem',lineHeight:1,letterSpacing:'-.02em',marginBottom:'.25rem'}}>
                  <sup style={{fontSize:'1.2rem',color:'var(--muted)',verticalAlign:'super'}}>$</sup>{p.price}
                  <span style={{fontSize:'1rem',color:'var(--muted)'}}>/mo</span>
                </div>
                <div style={{fontSize:'.82rem',color:'var(--muted)',marginBottom:'1.75rem'}}>{p.desc}</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.65rem',marginBottom:'2rem'}}>
                  {p.features.map(f => (
                    <li key={f} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.85rem',color:'var(--muted)',lineHeight:1.5}}>
                      <span style={{color:'var(--accent)',fontSize:'.75rem',flexShrink:0,marginTop:'.1rem'}}>✦</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/dashboard')} style={{width:'100%',padding:'.85rem',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',letterSpacing:'.04em',cursor:'pointer',border:`1px solid ${p.featured?'transparent':'var(--border)'}`,background:p.featured?'var(--accent)':'transparent',color:p.featured?'var(--bg)':'var(--text)',transition:'all .22s'}}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FAQ ── */}
        <section style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>09 — FAQ</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'3rem'}}>
            Common <span style={{color:'var(--muted)'}}>questions.</span>
          </h2>
          <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'left'}}>
            {faqs.map((f,i) => (
              <div key={i} style={{borderTop:'1px solid var(--border)',padding:'1.5rem 0',borderBottom:i===faqs.length-1?'1px solid var(--border)':'none'}}>
                <div onClick={() => setOpenFaq(openFaq===i?null:i)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:500,fontSize:'1rem',color:'var(--text)',gap:'1rem',cursor:'pointer'}}>
                  {f.q}
                  <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'50%',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',color:'var(--muted)',transform:openFaq===i?'rotate(180deg)':'none',transition:'transform .25s'}}>▾</span>
                </div>
                {openFaq===i && <div style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.75,paddingTop:'.85rem'}}>{f.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'8rem 3.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(123,108,255,.12) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:1,maxWidth:'680px',margin:'0 auto'}}>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,5vw,4.5rem)',lineHeight:1,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              Start tracking your<br/><span style={{color:'var(--accent)'}}>AI visibility</span> today.
            </h2>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2.5rem'}}>Over 3,400 SEO professionals already know where they stand in AI search. Do you?</p>
            <div style={{display:'flex',maxWidth:'520px',margin:'0 auto',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border-h)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem'}}>
              <input
                value={ctaUrl}
                onChange={e => setCtaUrl(e.target.value)}
                onKeyDown={e => e.key==='Enter' && handleAnalyze(ctaUrl)}
                placeholder="https://yourdomain.com"
                type="url"
                style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.8rem',color:'var(--text)',padding:'.5rem 0'}}
              />
              <button onClick={() => handleAnalyze(ctaUrl)} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.82rem',fontWeight:700,background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.7rem 1.5rem',cursor:'pointer'}}>
                Analyse free
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:'1px solid var(--border)',padding:'3rem 3.5rem',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2rem'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff',marginBottom:'.75rem'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'6px',background:'linear-gradient(135deg,#7b6cff,#c8f247)'}} />
              AEOvision
            </div>
            <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6,maxWidth:'200px'}}>AI visibility intelligence for the next era of search.</div>
          </div>
          {[
            {title:'Product',links:['How it works','Features','Dashboard','Pricing','API (coming soon)']},
            {title:'Resources',links:['AEO Guide','llms.txt Generator','BLUF Content Templates','Blog','Changelog']},
            {title:'Company',links:['About','Privacy Policy','Terms of Service','Contact']},
          ].map(col => (
            <div key={col.title}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>{col.title}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.6rem'}}>
                {col.links.map(l => <li key={l}><a href="#" style={{fontSize:'.82rem',color:'var(--muted)',textDecoration:'none'}}>{l}</a></li>)}
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