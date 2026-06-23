'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  ctaOnly?: boolean
}

export default function HeroClient({ ctaOnly = false }: Props) {
  const [url, setUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (ctaOnly) return
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
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1 })
      for(let a=0; a<pts.length; a++) {
        for(let b=a+1; b<pts.length; b++) {
          const A=pts[a], B=pts[b]
          const d=Math.hypot(A.x-B.x, A.y-B.y)
          if(d<130) { ctx.strokeStyle=`rgba(123,108,255,${(1-d/130)*.18})`; ctx.lineWidth=.8; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke() }
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
  }, [ctaOnly])

  function go(val: string) {
    const clean = val.trim().replace(/^https?:\/\//, '')
    if (!clean) return
    router.push(`/dashboard?url=${encodeURIComponent(clean)}`)
  }

  const inputBox = (
    <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.16)',borderRadius:'100px',padding:'.35rem .35rem .35rem 1.4rem'}}>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && go(url)}
        placeholder="https://yourdomain.com"
        type="url"
        autoComplete="off"
        style={{flex:1,background:'transparent',border:'none',fontFamily:"'JetBrains Mono',monospace",fontSize:'.82rem',color:'#fff',padding:'.5rem 0',outline:'none'}}
      />
      <button
        onClick={() => go(url)}
        style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.8rem',fontWeight:700,background:'#c8f247',color:'#04030c',border:'none',borderRadius:'100px',padding:'.65rem 1.4rem',display:'flex',alignItems:'center',gap:'.5rem',whiteSpace:'nowrap',cursor:'pointer'}}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        {ctaOnly ? 'Analyse free' : 'Analyse now'}
      </button>
    </div>
  )

  // CTA-only mode — just the input bar
  if (ctaOnly) {
    return (
      <div style={{maxWidth:'520px',margin:'0 auto'}}>
        {inputBox}
      </div>
    )
  }

  // Full hero mode
  return (
    <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 5rem',position:'relative',overflow:'hidden',textAlign:'center'}}>
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:.6}} />
      <div style={{position:'absolute',inset:0,zIndex:1,background:'radial-gradient(ellipse 80% 60% at 50% 50%,transparent 30%,rgba(4,3,12,.85) 70%,#04030c 100%)',pointerEvents:'none'}} />
      <div style={{position:'relative',zIndex:2,maxWidth:'780px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'#22d3ee',border:'1px solid rgba(34,211,238,.2)',background:'rgba(34,211,238,.06)',padding:'.4rem 1rem',borderRadius:'100px',marginBottom:'2rem'}}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22d3ee',animation:'blink 2s ease-in-out infinite',display:'inline-block'}} />
          Now tracking ChatGPT, Gemini, Perplexity &amp; Grok
        </div>
        <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(3rem,7vw,6.5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.5rem'}}>
          Is your site<br/>
          <span style={{WebkitTextStroke:'1.5px rgba(255,255,255,.3)',color:'transparent'}}>visible</span> to<br/>
          <span style={{color:'#c8f247'}}>AI engines?</span>
        </h1>
        <p style={{fontSize:'clamp(.95rem,2vw,1.15rem)',color:'rgba(255,255,255,0.88)',lineHeight:1.75,maxWidth:'540px',margin:'0 auto 2.5rem'}}>
          Notion Cue tracks how often your website gets cited, mentioned, and recommended by large language models. Paste your URL and get your AI visibility score in seconds.
        </p>
        <div style={{maxWidth:'620px',margin:'0 auto 1.25rem'}}>
          {inputBox}
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',color:'rgba(255,255,255,0.58)',display:'flex',alignItems:'center',justifyContent:'center',gap:'1.2rem',flexWrap:'wrap'}}>
          {['Free forever plan','No credit card needed','Results in <30 seconds'].map(t=>(
            <span key={t} style={{display:'flex',alignItems:'center',gap:'.35rem'}}>
              <span style={{color:'#c8f247'}}>✦</span>{t}
            </span>
          ))}
        </div>
      </div>
      <div style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',zIndex:2,opacity:.3}}>
        <div style={{width:'1px',height:'50px',background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.88))',animation:'lineGrow 2s ease-in-out infinite'}} />
      </div>
    </section>
  )
}