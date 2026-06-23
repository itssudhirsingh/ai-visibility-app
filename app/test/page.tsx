'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ── DATA ──
const MARQUEE = ['ChatGPT Citations','Perplexity Mentions','Gemini Visibility','Grok Indexing','Bing Copilot','Claude AI','AEO Score','BLUF Content','llms.txt','E-E-A-T Signals','Schema Validation','Citation Tracking']

const STEPS = [
  { icon:'🔗', title:'Paste your URL', desc:'Enter any domain or page URL. We analyse your site architecture, content structure, schema markup, and llms.txt status.' },
  { icon:'🤖', title:'We query 6 LLMs', desc:'Our engine fires thousands of niche prompts across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude to check where your brand appears.' },
  { icon:'📊', title:'Get your AEO score', desc:'Receive a full breakdown — citation frequency, sentiment, competitor gaps, and a prioritised fix list to improve your AI visibility fast.' },
  { icon:'🚀', title:'Track weekly changes', desc:'Monitor your AI presence over time with weekly automated scans, email alerts when citations change, and competitor benchmark reports.' },
]

const FEATURES = [
  { icon:'🧠', title:'LLM Citation Tracking', desc:'Monitor how often and in what context your domain is cited across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Updated daily.', tag:'Core', bg:'rgba(200,242,71,.08)', bc:'rgba(200,242,71,.2)' },
  { icon:'📈', title:'AEO Score', desc:'A single composite score from 0–100 measuring your overall AI engine visibility, built from citation frequency, sentiment, authority, and content structure.', tag:'Scoring', bg:'rgba(123,108,255,.08)', bc:'rgba(123,108,255,.2)' },
  { icon:'🔍', title:'Content Gap Analysis', desc:"Discover which questions your competitors get cited for that you don't. Get a prioritised list of BLUF-structured content topics to close the gap.", tag:'Strategy', bg:'rgba(34,211,238,.08)', bc:'rgba(34,211,238,.2)' },
  { icon:'⚡', title:'llms.txt Validator', desc:'Check if your llms.txt file exists, is correctly formatted, and is being respected by major crawlers. Get a one-click fix template if issues are found.', tag:'Technical', bg:'rgba(244,114,182,.08)', bc:'rgba(244,114,182,.2)' },
  { icon:'🏆', title:'Competitor Benchmarking', desc:'Add up to 10 competitor domains and see how your AI visibility score compares across every LLM, keyword category, and content vertical.', tag:'Intelligence', bg:'rgba(74,222,128,.08)', bc:'rgba(74,222,128,.2)' },
  { icon:'📬', title:'Weekly Alert Reports', desc:'Receive a curated email digest every Monday with changes in your citation count, new competitor movements, and the top 3 action items for that week.', tag:'Monitoring', bg:'rgba(251,191,36,.08)', bc:'rgba(251,191,36,.2)' },
]

const MATRIX_ROWS = [
  { feat:'Citation tracking', desc:'How often your URL appears in answers',   cells:['Full','Full','Full','Partial','Full','Partial'] },
  { feat:'Sentiment analysis', desc:'Positive / neutral / negative tone',     cells:['Full','Full','Full','Full','Partial','Partial'] },
  { feat:'Competitor gap detection', desc:'Queries where rivals appear, you don\'t', cells:['Full','Full','Full','Soon','Full','Soon'] },
  { feat:'llms.txt crawl check', desc:'Whether your AI allowlist is respected',cells:['Full','Partial','Full','Soon','Partial','Full'] },
  { feat:'BLUF content scoring', desc:'How well your content answers directly', cells:['Full','Full','Full','Full','Full','Full'] },
  { feat:'Weekly trend tracking', desc:'Citation delta week-over-week',        cells:['Full','Full','Full','Partial','Full','Partial'] },
  { feat:'Real-time query probing', desc:'Live prompt testing against your niche',cells:['Full','Partial','Full','Soon','Partial','Soon'] },
]

const LLM_HEADS = [
  { abbr:'GPT', name:'ChatGPT', color:'#10a37f' },
  { abbr:'G',   name:'Gemini',  color:'#4285f4' },
  { abbr:'Px',  name:'Perplexity', color:'#ff6b35' },
  { abbr:'Gk',  name:'Grok',    color:'#1da1f2' },
  { abbr:'Co',  name:'Copilot', color:'#6756d8' },
  { abbr:'Cl',  name:'Claude',  color:'#d97706' },
]

const LLM_CARDS = [
  { abbr:'GPT', name:'ChatGPT', share:'~94% of AI-referred traffic', score:'Full', color:'#10a37f', bg:'rgba(16,163,127,.12)', bc:'rgba(16,163,127,.25)', desc:'The dominant AI chat platform. Heavily influenced by domain authority, structured data, and BLUF-formatted content.', tags:['Citations','Sentiment','Gaps','BLUF'] },
  { abbr:'G', name:'Gemini', share:'Google-integrated, growing fast', score:'Full', color:'#4285f4', bg:'rgba(66,133,244,.12)', bc:'rgba(66,133,244,.25)', desc:"Deeply tied to Google's knowledge graph. E-E-A-T and schema markup have outsized influence on Gemini citations.", tags:['E-E-A-T','Schema','Sentiment','Gaps'] },
  { abbr:'Px', name:'Perplexity', share:'Real-time web retrieval model', score:'Full', color:'#ff6b35', bg:'rgba(255,107,53,.12)', bc:'rgba(255,107,53,.25)', desc:'Retrieves and cites live web sources in every answer. Sites with clear canonical structure and fast load rank disproportionately well.', tags:['Citations','Real-time','Canonical','BLUF'] },
  { abbr:'Gk', name:'Grok', share:'X / Twitter realtime signals', score:'Partial', color:'#1da1f2', bg:'rgba(29,161,242,.12)', bc:'rgba(29,161,242,.25)', desc:'Uses realtime X data and web search. Social proof and trending content play a bigger role here than on other platforms.', tags:['Social Signals','Trending','Partial'] },
]

const PLANS = [
  { plan:'Free', price:'0', desc:'Perfect for checking your own site and seeing where you stand.', features:['1 domain scan per day','AEO score for 3 LLMs','Basic citation count','llms.txt validator','7-day history'], cta:'Get started free', featured:false },
  { plan:'Pro', price:'49', desc:'For SEO professionals managing client sites and their own brands.', features:['10 domains included','All 6 LLMs tracked daily','Full citation context + sentiment','Competitor benchmarking (up to 5)','Content gap analysis','Weekly email digest reports','90-day history','CSV/PDF exports'], cta:'Start 14-day free trial', featured:true },
  { plan:'Agency', price:'149', desc:'For agencies managing multiple client accounts at scale.', features:['Unlimited domains','All 6 LLMs + custom prompt testing','White-label reports for clients','Unlimited competitor tracking','API access (coming soon)','Priority Slack support','365-day history'], cta:'Contact sales', featured:false },
]

const FAQS = [
  { q:'What exactly is AEO and why does it matter now?', a:'AEO (Answer Engine Optimisation) is the practice of making your content visible and citable within AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. As more users skip Google and go straight to AI assistants for answers, being cited in those answers is becoming as important as ranking on page one.' },
  { q:'How do you check if an LLM has cited my site?', a:'We run thousands of relevant prompts across each LLM engine, spanning categories relevant to your niche. We record whether your domain appears in the response, the context it appears in, and the sentiment of the mention.' },
  { q:'Is this different from tracking AI Overviews in Google Search Console?', a:"Yes. GSC tracks your visibility in Google's traditional search results. Notion Cue tracks your visibility in standalone AI chat tools like ChatGPT, Perplexity, and Gemini that have hundreds of millions of direct users who never go near Google Search." },
  { q:'What is llms.txt and why should I care?', a:'llms.txt is an emerging standard (similar to robots.txt) that tells AI crawlers how to access and use your content. Sites with a well-structured llms.txt file signal authority and crawlability to LLM training pipelines.' },
  { q:'Can I track competitor domains on the free plan?', a:'Competitor tracking is available on Pro and Agency plans. The free plan allows you to scan your own domain and see how you compare to the industry average in your niche.' },
]

// ── CELL BADGE ──
function CellBadge({ val }: { val: string }) {
  if (val === 'Full')    return <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'#4ade80',background:'rgba(74,222,128,.08)',border:'1px solid rgba(74,222,128,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Full</span>
  if (val === 'Partial') return <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--accent)',background:'rgba(200,242,71,.08)',border:'1px solid rgba(200,242,71,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Partial</span>
  return <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--muted2)',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',padding:'.2rem .55rem',borderRadius:'4px'}}>Soon</span>
}

// ── LLM BAR ──
function LLMBar({ name, color, pct, status }: { name:string; color:string; pct:number; status:string }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), 200); return () => clearTimeout(t) }, [pct])
  return (
    <div style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.5rem .75rem',background:'rgba(255,255,255,.02)',borderRadius:'7px',fontSize:'.75rem'}}>
      <span style={{width:'6px',height:'6px',borderRadius:'50%',background:color,flexShrink:0}} />
      <span style={{color:'var(--muted)',width:'82px',flexShrink:0}}>{name}</span>
      <div style={{flex:1,height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'100px',overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:'100px',background:`linear-gradient(90deg,${color},${color}aa)`,width:`${w}%`,transition:'width 1.2s cubic-bezier(.16,1,.3,1)'}} />
      </div>
      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.65rem',color:'var(--muted2)',width:'28px',textAlign:'right'}}>{pct}%</span>
      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'.58rem',padding:'.15rem .45rem',borderRadius:'3px',color:status==='Found'?'#4ade80':status==='Partial'?'var(--amber)':'var(--muted2)',background:status==='Found'?'rgba(74,222,128,.08)':status==='Partial'?'rgba(251,191,36,.08)':'rgba(255,255,255,.03)',border:`1px solid ${status==='Found'?'rgba(74,222,128,.2)':status==='Partial'?'rgba(251,191,36,.2)':'var(--border)'}`}}>{status}</span>
    </div>
  )
}

// ── MAIN COMPONENT ──
export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [scanState, setScanState] = useState<'idle'|'scanning'|'done'>('idle')
  const [ctaScanState, setCtaScanState] = useState<'idle'|'scanning'|'done'>('idle')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  // ── 3D NODE CANVAS ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, animId = 0
    let mx = 0, my = 0
    interface Pt3 { x3:number; y3:number; z3:number; vx:number; vy:number; vz:number; size:number; pulse:number }
    let nodes: Pt3[] = []

    function resize() {
      W = canvas!.width = window.innerWidth
      H = canvas!.height = window.innerHeight
      mx = W / 2; my = H / 2
      initNodes()
    }

    function initNodes() {
      const count = Math.min(Math.floor((W * H) / 14000), 80)
      nodes = Array.from({ length: count }, () => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const r = 180 + Math.random() * 200
        return {
          x3: r * Math.sin(phi) * Math.cos(theta),
          y3: r * Math.sin(phi) * Math.sin(theta),
          z3: r * Math.cos(phi),
          vx: (Math.random() - .5) * .3,
          vy: (Math.random() - .5) * .3,
          vz: (Math.random() - .5) * .3,
          size: Math.random() * 2.5 + .5,
          pulse: Math.random() * Math.PI * 2,
        }
      })
    }

    function project(n: Pt3) {
      const fov = 600
      const scale = fov / (fov + n.z3 + 400)
      return { x: W / 2 + n.x3 * scale, y: H / 2 + n.y3 * scale, scale, depth: (n.z3 + 400) / 800 }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      nodes.forEach(n => {
        n.x3 += n.vx; n.y3 += n.vy; n.z3 += n.vz
        n.pulse += .025
        const cos = Math.cos(.0008), sin = Math.sin(.0008)
        const nx = n.x3 * cos + n.z3 * sin
        n.z3 = -n.x3 * sin + n.z3 * cos
        n.x3 = nx
        if (Math.hypot(n.x3, n.y3, n.z3) > 400) { n.vx *= -1; n.vy *= -1; n.vz *= -1 }
      })

      const projected = nodes.map(n => ({ n, ...project(n) })).sort((a, b) => a.depth - b.depth)

      projected.forEach((a, i) => {
        projected.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 140) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(103,86,216,${(1 - d / 140) * .35 * Math.min(a.depth, b.depth)})`
            ctx.lineWidth = .6; ctx.stroke()
          }
        })
      })

      projected.forEach(p => {
        const pulse = .6 + .4 * Math.sin(p.n.pulse)
        const alpha = p.depth * .9 * pulse
        const r = p.n.size * p.scale * 2.5
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        grad.addColorStop(0, `rgba(108,143,0,${alpha * .28})`); grad.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.5, r), 0, Math.PI * 2)
        ctx.fillStyle = p.depth > .65 ? `rgba(108,143,0,${alpha})` : `rgba(103,86,216,${alpha * 1.2})`
        ctx.fill()
      })

      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 280)
      mg.addColorStop(0, 'rgba(103,86,216,0.08)'); mg.addColorStop(1, 'transparent')
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H)

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // ── SCROLL REVEAL ──
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') })
    }, { threshold: 0.08 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // ── 3D TILT ──
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const surfaces = document.querySelectorAll<HTMLElement>(
      '.feat-card,.price-card,.llm-detail-card,.fix-card,.fix-check-card,.evidence-card,.how-step'
    )
    const handlers = Array.from(surfaces).map(s => {
      const move = (e: PointerEvent) => {
        const r = s.getBoundingClientRect()
        s.style.setProperty('--tilt-x', `${(-(e.clientY - r.top) / r.height - .5) * 6}deg`)
        s.style.setProperty('--tilt-y', `${((e.clientX - r.left) / r.width - .5) * 6}deg`)
      }
      const leave = () => { s.style.removeProperty('--tilt-x'); s.style.removeProperty('--tilt-y') }
      s.addEventListener('pointermove', move)
      s.addEventListener('pointerleave', leave)
      return { s, move, leave }
    })
    return () => handlers.forEach(({ s, move, leave }) => {
      s.removeEventListener('pointermove', move)
      s.removeEventListener('pointerleave', leave)
    })
  }, [])

  function go(val: string, which: 'hero'|'cta') {
    const clean = val.trim().replace(/^https?:\/\//, '')
    if (!clean) return
    const setter = which === 'hero' ? setScanState : setCtaScanState
    setter('scanning')
    setTimeout(() => { setter('done'); setTimeout(() => { setter('idle'); router.push(`/ai-visibility-tool?url=${encodeURIComponent(clean)}`) }, 2000) }, 1800)
  }

  function scanLabel(state: 'idle'|'scanning'|'done', label: string) {
    if (state === 'scanning') return 'Scanning...'
    if (state === 'done') return '✦ Score: 74/100'
    return label
  }

  const scanBg = (state: 'idle'|'scanning'|'done') =>
    state === 'scanning' ? '#555' : state === 'done' ? 'var(--violet)' : 'var(--accent)'
  const scanColor = (state: 'idle'|'scanning'|'done') =>
    state === 'done' ? '#fff' : 'var(--bg)'

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#f7f9fc;--bg2:#eef3f8;--card:#fff;
          --border:rgba(25,48,76,.13);--border-h:rgba(25,48,76,.28);
          --text:#142033;--muted:rgba(20,32,51,.72);--muted2:rgba(20,32,51,.48);
          --accent:#6c8f00;--violet:#6756d8;--cyan:#0089a5;--rose:#c94f87;
          --white:#142033;--amber:#d97706;
        }
        html{scroll-behavior:smooth}
        body{
          background:
            linear-gradient(rgba(38,68,105,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(38,68,105,.035) 1px,transparent 1px),
            var(--bg);
          background-size:64px 64px;
          color:var(--text);
          font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden;
        }
        body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");background-size:200px;pointer-events:none;z-index:9000;opacity:.14}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes lineGrow{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:.6}}
        @keyframes orbitSpin{to{transform:rotateX(72deg) rotateZ(378deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .reveal{opacity:0;transform:translateY(36px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
        .reveal.in{opacity:1;transform:none}
        .reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}
        .feat-card,.price-card,.llm-detail-card,.fix-card,.fix-check-card,.evidence-card,.how-step{
          background-color:rgba(255,255,255,.9);
          border-color:rgba(25,48,76,.13);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 22px 58px rgba(48,70,100,.1);
          transform-style:preserve-3d;
          transition:transform .32s cubic-bezier(.16,1,.3,1),border-color .25s,box-shadow .3s;
        }
        .feat-card:hover,.price-card:hover,.llm-detail-card:hover,.fix-card:hover,.fix-check-card:hover,.evidence-card:hover,.how-step:hover{
          transform:translateY(-8px) translateZ(26px) rotateX(var(--tilt-x,2deg)) rotateY(var(--tilt-y,-2deg));
          border-color:rgba(108,143,0,.36)!important;
          background-color:#fff!important;
          box-shadow:0 32px 90px rgba(48,70,100,.16),0 0 0 1px rgba(108,143,0,.06);
        }
        .feat-card:hover .feat-title{color:var(--accent)}
        .how-step:hover{padding-left:.75rem}
        .how-step:hover .step-icon{background:rgba(108,143,0,.1)!important;border-color:rgba(108,143,0,.3)!important}
        .how-step:hover .step-title{color:var(--accent)}
        .nav-link:hover{color:var(--text)!important}
        .footer-link:hover{color:var(--accent)!important}
        .faq-q:hover{color:var(--accent)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(25,48,76,.2);border-radius:2px}
        @media(max-width:1024px){.nav-links-wrap{display:none!important}}
        @media(max-width:768px){
          .how-grid{grid-template-columns:1fr!important}
          .features-grid{grid-template-columns:1fr 1fr!important}
          .pricing-grid{grid-template-columns:1fr!important;max-width:440px!important;margin-left:auto!important;margin-right:auto!important}
          .stats-grid{grid-template-columns:1fr 1fr!important}
          .matrix-head-row,.matrix-row{grid-template-columns:2fr repeat(3,1fr)!important}
          .matrix-llm-head:nth-child(n+5),.matrix-cell:nth-child(n+5){display:none!important}
          .llm-cards-row{grid-template-columns:1fr 1fr!important}
          .evidence-grid{grid-template-columns:1fr!important}
          .trust-bar{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)',fontFamily:"'Epilogue',sans-serif"}}>

        {/* ── NAV ── */}
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:800,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.4rem 3.5rem',background:'rgba(255,255,255,.84)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',boxShadow:'0 12px 36px rgba(48,70,100,.09)'}}>
          <a href="/" style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',color:'var(--text)',textDecoration:'none'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'linear-gradient(135deg,var(--violet),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:700,color:'#fff'}}>A</div>
            Notion Cue
          </a>
          <ul className="nav-links-wrap" style={{display:'flex',gap:'2rem',listStyle:'none'}}>
            {[['How it works','#how'],['Features','#features'],['Dashboard','#dashboard'],['Matrix','#matrix'],['Results','#results'],['Pricing','#pricing']].map(([l,h])=>(
              <li key={l}><a href={h} className="nav-link" style={{fontSize:'.82rem',color:'var(--muted)',textDecoration:'none',transition:'color .2s'}}>{l}</a></li>
            ))}
          </ul>
          <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
            <button onClick={()=>router.push('/ai-visibility-tool')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:600,padding:'.55rem 1.2rem',border:'1px solid var(--border)',borderRadius:'100px',background:'transparent',color:'var(--muted)',cursor:'pointer',transition:'all .2s'}}>Log in</button>
            <button onClick={()=>router.push('/ai-visibility-tool')} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,padding:'.55rem 1.3rem',borderRadius:'100px',border:'none',background:'var(--accent)',color:'#fff',cursor:'pointer',transition:'all .2s'}}>Start free</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 5rem',position:'relative',overflow:'hidden',textAlign:'center',background:'radial-gradient(circle at 50% 44%,rgba(103,86,216,.1),transparent 48%)'}}>
          <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.6}} />
          <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 72% 62% at 50% 50%,transparent 20%,rgba(247,249,252,.56) 72%,var(--bg) 100%)',pointerEvents:'none'}} />

          {/* Dimensional orb */}
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(72vw,620px)',height:'min(72vw,620px)',zIndex:0,pointerEvents:'none'}}>
            {[{s:'100%',c:'rgba(0,137,165,.34)',d:'18s',dir:'normal'},{s:'68%',c:'rgba(20,32,51,.18)',d:'13s',dir:'reverse'},{s:'42%',c:'rgba(20,32,51,.12)',d:'9s',dir:'normal'}].map((r,i)=>(
              <div key={i} style={{position:'absolute',top:'50%',left:'50%',width:r.s,height:r.s,transform:`translate(-50%,-50%) rotateX(72deg)`,borderRadius:'50%',border:`1px solid ${r.c}`,animation:`orbitSpin ${r.d} linear infinite`,animationDirection:r.dir as any}} />
            ))}
          </div>

          <div style={{position:'relative',zIndex:2,maxWidth:'780px',filter:'drop-shadow(0 25px 70px rgba(55,76,105,.1))'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--cyan)',border:'1px solid rgba(0,137,165,.2)',background:'rgba(255,255,255,.82)',boxShadow:'inset 0 1px 0 rgba(255,255,255,.8),0 16px 50px rgba(48,70,100,.12)',padding:'.4rem 1rem',borderRadius:'100px',marginBottom:'2rem'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--cyan)',animation:'blink 2s ease-in-out infinite',display:'inline-block'}} />
              Now tracking ChatGPT, Gemini, Perplexity &amp; Grok
            </div>

            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(3rem,7vw,6.5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.5rem',color:'var(--text)',textShadow:'0 12px 36px rgba(55,76,105,.12)'}}>
              Is your site<br/>
              <span style={{WebkitTextStroke:'1.5px rgba(20,32,51,.38)',color:'transparent'}}>visible</span> to<br/>
              <span style={{color:'var(--accent)'}}>AI engines?</span>
            </h1>

            <p style={{fontSize:'clamp(.95rem,2vw,1.15rem)',color:'var(--muted)',lineHeight:1.75,maxWidth:'540px',margin:'0 auto 2.5rem'}}>
              Notion Cue tracks how often your website gets cited, mentioned, and recommended by large language models. Paste your URL and get your AI visibility score in seconds.
            </p>

            {/* URL Input */}
            <div style={{display:'flex',maxWidth:'620px',margin:'0 auto 1.25rem',background:'rgba(255,255,255,.82)',border:'1px solid rgba(25,48,76,.2)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem',boxShadow:'inset 0 1px 0 rgba(255,255,255,.8),0 16px 50px rgba(48,70,100,.12)',transition:'border-color .25s,box-shadow .25s'}}>
              <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(url,'hero')}
                placeholder="https://yourdomain.com" type="url" autoComplete="off"
                style={{flex:1,background:'transparent',border:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.82rem',color:'var(--text)',padding:'.5rem 0',outline:'none'}} />
              <button onClick={()=>go(url,'hero')} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,background:scanBg(scanState),color:scanColor(scanState),border:'none',borderRadius:'100px',padding:'.65rem 1.4rem',cursor:'pointer',transition:'all .2s',display:'flex',alignItems:'center',gap:'.5rem',whiteSpace:'nowrap'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                {scanLabel(scanState, 'Analyse now')}
              </button>
            </div>

            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',color:'var(--muted2)',display:'flex',alignItems:'center',justifyContent:'center',gap:'1.2rem',flexWrap:'wrap'}}>
              {['Free forever plan','No credit card needed','Results in <30 seconds'].map(t=>(
                <span key={t} style={{display:'flex',alignItems:'center',gap:'.35rem'}}><span style={{color:'var(--accent)'}}>✦</span>{t}</span>
              ))}
            </div>
          </div>

          <div style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',zIndex:2,opacity:.3,animation:'pulse 2.5s ease-in-out infinite'}}>
            <div style={{width:'1px',height:'50px',background:'linear-gradient(to bottom,transparent,var(--muted))',animation:'lineGrow 2s ease-in-out infinite'}} />
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'rgba(238,243,248,.8)',padding:'1rem 0'}}>
          <div style={{display:'flex',width:'max-content',animation:'marquee 28s linear infinite'}}>
            {[...MARQUEE,...MARQUEE].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'1.2rem',padding:'0 2.5rem',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--accent)',display:'inline-block'}} />{t}
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'rgba(238,243,248,.8)'}}>
          {[
            {num:'2.4',suf:'B',label:'AI queries processed daily across tracked LLMs'},
            {num:'94',suf:'%',label:'Of top-cited domains have structured AEO signals'},
            {num:'6',suf:'x',label:'More organic trust from AI-cited pages vs non-cited'},
            {num:'30',suf:'s',label:'Average time to get your full AI visibility report'},
          ].map((s,i)=>(
            <div key={i} style={{padding:'3rem 2.5rem',borderRight:i<3?'1px solid var(--border)':'none',position:'relative',overflow:'hidden',transition:'background .3s',cursor:'default'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.2rem,3.5vw,3.5rem)',lineHeight:1,color:'var(--text)',letterSpacing:'-.02em',marginBottom:'.4rem'}}>
                {s.num}<span style={{color:'var(--accent)',fontSize:'.6em'}}>{s.suf}</span>
              </div>
              <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div className="how-grid reveal" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
                01 — How it works<span style={{width:'32px',height:'1px',background:'var(--border)',display:'inline-block'}} />
              </div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
                From URL to<br/><span style={{color:'var(--muted)'}}>full AI audit</span><br/>in seconds.
              </h2>
              <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px',marginBottom:'3rem'}}>No integrations. No API keys. Just paste your domain and we run a deep scan across every major LLM.</p>
              <div>
                {STEPS.map((step,i)=>(
                  <div key={i} className="how-step" style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:'1.5rem',padding:'1.75rem 0',borderBottom:'1px solid var(--border)',borderTop:i===0?'1px solid var(--border)':'none',transition:'all .25s',cursor:'default',background:'rgba(255,255,255,.9)',borderLeft:'none',borderRight:'none',borderRadius:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'.25rem'}}>
                      <div className="step-icon" style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(103,86,216,.1)',border:'1px solid rgba(103,86,216,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.95rem',transition:'all .25s',boxShadow:'inset 0 1px 0 rgba(255,255,255,.12),0 12px 30px rgba(0,0,0,.08)',transform:'translateZ(20px)'}}>{step.icon}</div>
                    </div>
                    <div>
                      <div className="step-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.05rem',marginBottom:'.3rem',transition:'color .2s'}}>{step.title}</div>
                      <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.65}}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock dashboard card */}
            <div>
              <div style={{background:'rgba(255,255,255,.9)',border:'1px solid rgba(25,48,76,.13)',borderRadius:'16px',overflow:'hidden',boxShadow:'inset 0 1px 0 rgba(255,255,255,.9),0 40px 80px rgba(48,70,100,.18)',animation:'floatY 7s ease-in-out infinite',transformStyle:'preserve-3d',transform:'rotateX(1deg)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.9rem 1.25rem',borderBottom:'1px solid var(--border)',background:'#edf2f7'}}>
                  <div style={{display:'flex',gap:'.4rem'}}>
                    {['#ff5f57','#febc2e','#28c840'].map(c=><div key={c} style={{width:'9px',height:'9px',borderRadius:'50%',background:c}} />)}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>Notion Cue — AI Visibility Report</div>
                </div>
                <div style={{padding:'1.25rem',background:'#fff'}}>
                  <div style={{background:'rgba(25,48,76,.035)',border:'1px solid var(--border)',borderRadius:'8px',padding:'.55rem 1rem',marginBottom:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted)',display:'flex',alignItems:'center',gap:'.75rem'}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                    <span style={{color:'var(--accent)'}}>thedressoutlet.com</span>&nbsp;—&nbsp;<span>Last scan: 2 min ago</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.6rem',marginBottom:'1rem'}}>
                    {[{val:'74',lbl:'AEO Score',c:'var(--accent)'},{val:'2.8K',lbl:'Citations',c:'var(--cyan)'},{val:'4/6',lbl:'LLMs Found',c:'var(--violet)'}].map(m=>(
                      <div key={m.lbl} style={{background:'rgba(25,48,76,.035)',border:'1px solid var(--border)',borderRadius:'10px',padding:'.85rem .75rem',textAlign:'center'}}>
                        <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.5rem',lineHeight:1,display:'block',marginBottom:'.15rem',color:m.c}}>{m.val}</span>
                        <span style={{fontSize:'.62rem',color:'var(--muted2)',letterSpacing:'.06em'}}>{m.lbl}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.4rem'}}>
                    <LLMBar name="ChatGPT"   color="#10a37f" pct={88} status="Found" />
                    <LLMBar name="Gemini"    color="#4285f4" pct={61} status="Found" />
                    <LLMBar name="Perplexity" color="#ff6b35" pct={74} status="Found" />
                    <LLMBar name="Copilot"   color="#6756d8" pct={45} status="Partial" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FEATURES ── */}
        <section id="features" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div className="reveal" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>02 — Features</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>Everything your<br/><span style={{color:'var(--muted)'}}>AEO strategy needs.</span></h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>Built for SEO professionals who know the next frontier of search is already here.</p>
          </div>
          <div className="features-grid reveal reveal-d1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'16px',overflow:'hidden',border:'1px solid var(--border)',perspective:'1400px'}}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feat-card" style={{padding:'2.5rem 2rem',cursor:'default',border:'none',borderRadius:0,position:'relative',overflow:'hidden'}}>
                <div className="feat-icon" style={{width:'46px',height:'46px',borderRadius:'12px',marginBottom:'1.4rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',background:f.bg,border:`1px solid ${f.bc}`,boxShadow:'inset 0 1px 0 rgba(255,255,255,.12),0 12px 30px rgba(0,0,0,.08)',transform:'translateZ(20px)'}}>{f.icon}</div>
                <div className="feat-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem',marginBottom:'.5rem',transition:'color .2s'}}>{f.title}</div>
                <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{f.desc}</div>
                <span style={{display:'inline-block',marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(103,86,216,.08)',border:'1px solid rgba(103,86,216,.18)',borderRadius:'4px',padding:'.25rem .6rem'}}>{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── MATRIX ── */}
        <section id="matrix" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div className="reveal" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'end',marginBottom:'3rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>04 — Engine Matrix</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>Deep-scan coverage<br/><span style={{color:'var(--muted)'}}>across every LLM.</span></h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75}}>We probe each engine's own retrieval logic, citation behaviour, and content preference so you know exactly where you stand.</p>
          </div>

          {/* Matrix table */}
          <div className="reveal reveal-d1" style={{border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',marginBottom:'2.5rem',background:'rgba(255,255,255,.9)',boxShadow:'0 38px 100px rgba(48,70,100,.16)',transform:'rotateX(1deg)',transformStyle:'preserve-3d'}}>
            {/* Header */}
            <div className="matrix-head-row" style={{display:'grid',gridTemplateColumns:'2fr repeat(6,1fr)',background:'#edf2f7',borderBottom:'1px solid var(--border)'}}>
              <div style={{padding:'1rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)',borderRight:'1px solid var(--border)'}}>Capability</div>
              {LLM_HEADS.map(h=>(
                <div key={h.name} style={{padding:'.75rem .5rem',display:'flex',alignItems:'center',justifyContent:'center',borderRight:'1px solid var(--border)'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.3rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',letterSpacing:'.06em'}}>
                    <div style={{width:'30px',height:'30px',borderRadius:'8px',background:'rgba(25,48,76,.035)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.62rem',fontWeight:700,color:h.color}}>{h.abbr}</div>
                    {h.name}
                  </div>
                </div>
              ))}
            </div>
            {MATRIX_ROWS.map((row,i)=>(
              <div key={i} className="matrix-row" style={{display:'grid',gridTemplateColumns:'2fr repeat(6,1fr)',borderBottom:i<MATRIX_ROWS.length-1?'1px solid var(--border)':'none',transition:'background .2s',cursor:'default'}}>
                <div style={{padding:'.9rem 1.25rem',fontSize:'.82rem',color:'var(--text)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:'.15rem'}}>
                  {row.feat}
                  <span style={{fontSize:'.68rem',color:'var(--muted2)',fontFamily:"'JetBrains Mono',monospace"}}>{row.desc}</span>
                </div>
                {row.cells.map((c,j)=>(
                  <div key={j} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'.9rem .5rem',borderRight:j<5?'1px solid var(--border)':'none',background:'rgba(25,48,76,.015)'}}>
                    <CellBadge val={c} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* LLM detail cards */}
          <div className="llm-cards-row reveal reveal-d2" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',perspective:'1400px'}}>
            {LLM_CARDS.map(card=>(
              <div key={card.name} className="llm-detail-card" style={{padding:'1.5rem',cursor:'default',borderRadius:'12px',border:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'.75rem',marginBottom:'1rem'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'9px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',fontWeight:700,color:card.color,background:card.bg,border:`1px solid ${card.bc}`,boxShadow:'inset 0 1px 0 rgba(255,255,255,.12),0 12px 30px rgba(0,0,0,.08)',transform:'translateZ(20px)'}}>{card.abbr}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem',marginBottom:'.15rem'}}>{card.name}</div>
                    <div style={{fontSize:'.68rem',color:'var(--muted2)',fontFamily:"'JetBrains Mono',monospace"}}>{card.share}</div>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:card.score==='Full'?'#4ade80':'var(--muted2)'}}>{card.score}</div>
                </div>
                <div style={{fontSize:'.78rem',color:'var(--muted)',lineHeight:1.65,marginBottom:'1rem'}}>{card.desc}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'.35rem'}}>
                  {card.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.06em',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.2rem .5rem',borderRadius:'4px'}}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── PRICING ── */}
        <section id="pricing" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div className="reveal">
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>08 — Pricing</div>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>Simple, transparent<br/><span style={{color:'var(--muted)'}}>pricing.</span></h2>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'3.5rem'}}>Start free. Scale when you need. No lock-in.</p>
          </div>
          <div className="pricing-grid reveal reveal-d1" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',textAlign:'left',perspective:'1400px'}}>
            {PLANS.map(p=>(
              <div key={p.plan} className="price-card" style={{border:`1px solid ${p.featured?'rgba(108,143,0,.35)':'var(--border)'}`,borderRadius:'16px',padding:'2.5rem 2rem',position:'relative',background:p.featured?'#f8fbea':'rgba(255,255,255,.9)'}}>
                {p.featured&&<span style={{position:'absolute',top:'1.25rem',right:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'#fff',background:'var(--accent)',padding:'.25rem .6rem',borderRadius:'4px',fontWeight:600}}>Most Popular</span>}
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
                <button onClick={()=>router.push('/ai-visibility-tool')} style={{width:'100%',padding:'.85rem',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',letterSpacing:'.04em',border:p.featured?'none':'1px solid var(--border)',background:p.featured?'var(--accent)':'transparent',color:p.featured?'#fff':'var(--text)',cursor:'pointer',transition:'all .22s'}}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FAQ ── */}
        <section style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div className="reveal">
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>09 — FAQ</div>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'3rem'}}>Common <span style={{color:'var(--muted)'}}>questions.</span></h2>
          </div>
          <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'left'}}>
            {FAQS.map((f,i)=>(
              <div key={i} className="faq-item" style={{borderTop:'1px solid var(--border)',padding:'1.5rem 0',borderBottom:i===FAQS.length-1?'1px solid var(--border)':'none',background:'rgba(255,255,255,.9)',paddingLeft:'1rem',paddingRight:'1rem',borderLeft:'none',borderRight:'none',borderRadius:0,boxShadow:'none',cursor:'default'}}>
                <div onClick={()=>setOpenFaq(openFaq===i?null:i)} className="faq-q" style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:500,fontSize:'1rem',gap:'1rem',cursor:'pointer',transition:'color .2s'}}>
                  {f.q}
                  <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'50%',border:`1px solid ${openFaq===i?'var(--accent)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.65rem',color:openFaq===i?'var(--accent)':'var(--muted)',transform:openFaq===i?'rotate(180deg)':'none',transition:'all .25s'}}>▾</span>
                </div>
                {openFaq===i&&<div style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.75,paddingTop:'.85rem'}}>{f.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{background:'rgba(238,243,248,.8)',borderTop:'1px solid var(--border)',padding:'8rem 3.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(103,86,216,.08) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div className="reveal" style={{position:'relative',zIndex:1,maxWidth:'680px',margin:'0 auto'}}>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,5vw,4.5rem)',lineHeight:1,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              Start tracking your<br/><span style={{color:'var(--accent)'}}>AI visibility</span> today.
            </h2>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2.5rem'}}>Over 3,400 SEO professionals already know where they stand in AI search. Do you?</p>
            <div style={{display:'flex',maxWidth:'520px',margin:'0 auto',background:'rgba(255,255,255,.82)',border:'1px solid rgba(25,48,76,.2)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem',boxShadow:'inset 0 1px 0 rgba(255,255,255,.8),0 16px 50px rgba(48,70,100,.12)'}}>
              <input value={ctaUrl} onChange={e=>setCtaUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go(ctaUrl,'cta')}
                placeholder="https://yourdomain.com" type="url"
                style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.8rem',color:'var(--text)',padding:'.5rem 0'}} />
              <button onClick={()=>go(ctaUrl,'cta')} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.82rem',fontWeight:700,background:scanBg(ctaScanState),color:scanColor(ctaScanState),border:'none',borderRadius:'100px',padding:'.7rem 1.5rem',cursor:'pointer',transition:'all .2s'}}>
                {scanLabel(ctaScanState, 'Analyse free')}
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:'1px solid var(--border)',padding:'3rem 3.5rem',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2rem',background:'#eef3f8'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'var(--text)',marginBottom:'.75rem'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'6px',background:'linear-gradient(135deg,var(--violet),var(--accent))'}} />
              Notion Cue
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
                {col.links.map(l=><li key={l}><a href="#" className="footer-link" style={{fontSize:'.82rem',color:'var(--muted)',textDecoration:'none',transition:'color .2s'}}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </footer>
        <div style={{borderTop:'1px solid var(--border)',padding:'1.5rem 3.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#eef3f8'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>© 2026 <span style={{color:'var(--muted)'}}>Notion Cue</span> — AI Visibility Intelligence Platform</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>Built for the next era of search.</span>
        </div>

      </div>
    </>
  )
}