// app/not-found.tsx — Next.js App Router custom 404
// No 'use client' needed — fully SSR
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

export const metadata = {
  title: '404 — Page Not Found | Notion Cue',
  description: 'This page does not exist. Head back to Notion Cue to track your AI visibility.',
}

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--bg2:#070613;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spinR{to{transform:rotateX(70deg) rotateZ(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .7s cubic-bezier(.16,1,.3,1) both}
        .fade-up-1{animation-delay:.1s}
        .fade-up-2{animation-delay:.22s}
        .fade-up-3{animation-delay:.36s}
        .btn-primary:hover{opacity:.88;transform:translateY(-1px)}
        .btn-secondary:hover{border-color:var(--border-h)!important;color:var(--text)!important}
        .quick-link:hover{border-color:var(--border-h)!important;background:rgba(255,255,255,.03)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)',fontFamily:"'Epilogue',sans-serif",display:'flex',flexDirection:'column'}}>
        <SharedHeader />

        {/* Main 404 content */}
        <main style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'6rem 2rem',position:'relative',overflow:'hidden'}}>

          {/* Background glow */}
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'700px',height:'400px',background:'radial-gradient(ellipse,rgba(123,108,255,.1) 0%,transparent 70%)',pointerEvents:'none'}} />

          {/* Floating orbital — same as hero */}
          <div style={{position:'absolute',right:'8%',top:'50%',transform:'translateY(-50%)',width:'280px',height:'280px',perspective:'900px',display:'flex',alignItems:'center',justifyContent:'center',animation:'floatY 7s ease-in-out infinite',opacity:.35,pointerEvents:'none'}}>
            {[
              {size:'100%',color:'rgba(34,211,238,.25)',dur:'12s',dir:'normal'},
              {size:'72%',color:'rgba(200,242,71,.3)',dur:'9s',dir:'reverse'},
              {size:'50%',color:'rgba(123,108,255,.45)',dur:'7s',dir:'normal'},
            ].map((r,i)=>(
              <div key={i} style={{position:'absolute',width:r.size,height:r.size,borderRadius:'50%',border:`1px solid ${r.color}`,transform:'rotateX(70deg)',animation:`spinR ${r.dur} linear infinite`,animationDirection:r.dir as any}} />
            ))}
            <div style={{position:'relative',zIndex:2,width:'80px',height:'80px',background:'rgba(200,242,71,.08)',border:'1px solid rgba(200,242,71,.3)',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.4rem',color:'var(--accent)',lineHeight:1}}>404</span>
            </div>
          </div>

          <div style={{position:'relative',zIndex:1,maxWidth:'620px',width:'100%'}}>

            {/* Label */}
            <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:'.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--cyan)',border:'1px solid rgba(34,211,238,.2)',background:'rgba(34,211,238,.06)',padding:'.4rem 1rem',borderRadius:'100px',marginBottom:'2rem'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--cyan)',animation:'blink 2s ease-in-out infinite',display:'inline-block'}} />
              Error 404 — Page not found
            </div>

            {/* Heading */}
            <h1 className="fade-up fade-up-1" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.8rem,7vw,5.5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              This page<br/>
              <span style={{WebkitTextStroke:'1.5px rgba(255,255,255,.25)',color:'transparent'}}>doesn't</span><br/>
              <span style={{color:'var(--accent)'}}>exist.</span>
            </h1>

            {/* Description */}
            <p className="fade-up fade-up-2" style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'440px',marginBottom:'2.5rem'}}>
              The URL you followed may be broken, moved, or never existed. Head back and keep tracking your AI visibility.
            </p>

            {/* CTAs */}
            <div className="fade-up fade-up-3" style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'4rem'}}>
              <a href="/" className="btn-primary" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.88rem',background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',padding:'.75rem 1.75rem',transition:'all .2s',display:'inline-flex',alignItems:'center',gap:'.5rem'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 12L9 6M3 12l6 6"/></svg>
                Back to home
              </a>
              <a href="/ai-visibility-tool" className="btn-secondary" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.88rem',background:'transparent',color:'var(--muted)',border:'1px solid var(--border)',borderRadius:'100px',padding:'.75rem 1.75rem',transition:'all .2s'}}>
                Open dashboard
              </a>
            </div>

            {/* Quick links */}
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1rem'}}>
                Popular pages
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'.5rem'}}>
                {[
                  {href:'/aeo-guide',       icon:'📖', label:'AEO Guide',           desc:'Learn AEO fundamentals'},
                  {href:'/blog',            icon:'✍️', label:'Blog',                desc:'Research & case studies'},
                  {href:'/llms-text-generator', icon:'⚡', label:'llms.txt Generator', desc:'Generate your AI file'},
                  {href:'/bluf-templates',  icon:'🎯', label:'BLUF Templates',      desc:'AI-ready content templates'},
                ].map(link=>(
                  <a key={link.href} href={link.href} className="quick-link" style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.85rem 1rem',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'10px',transition:'all .2s'}}>
                    <span style={{fontSize:'1rem',flexShrink:0}}>{link.icon}</span>
                    <div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.85rem',marginBottom:'.1rem'}}>{link.label}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)'}}>{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </main>

        <SharedFooter />
      </div>
    </>
  )
}