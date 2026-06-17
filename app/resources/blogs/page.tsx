'use client'
import { useRouter, usePathname } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import { BLOG_POSTS } from '../posts'

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/aeo-guide' },
  { label: 'llms.txt Generator', href: '/llms-text-generator' },
  { label: 'Robots.txt Generator', href: '/robots-txt' },
  { label: 'BLUF Templates',     href: '/bluf-templates' },
  { label: 'Blog',               href: '/blog' },
  { label: 'Changelog',          href: '/changelog' },
  { label: 'About',              href: '/about' },
  { label: 'Privacy',            href: '/privacy' },
  { label: 'Terms',              href: '/terms' },
  { label: 'Contact',            href: '/contact' },
]

const FILTERS = ['All', 'AEO Strategy', 'Technical', 'Case Studies', 'LLM Updates']

export default function BlogPage() {
  const router = useRouter()
  const path = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--green:#4ade80}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button{cursor:pointer;font-family:inherit}
        button:focus{outline:none}
        a{color:inherit;text-decoration:none}
        .blog-card{transition:all .25s;cursor:pointer;display:block}
        .blog-card:hover{border-color:var(--border-h)!important;transform:translateY(-4px)}
        .blog-card:hover .blog-title{color:var(--accent)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />

        <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--border)',padding:'.6rem 3.5rem',display:'flex',gap:0,overflowX:'auto',marginTop:'65px'}}>
          {SUB_NAV.map(n=>(
            <button key={n.href} onClick={()=>router.push(n.href)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.55rem 1rem',background:'none',border:'none',borderBottom:path===n.href?'2px solid var(--accent)':'2px solid transparent',color:path===n.href?'var(--accent)':'var(--muted)',whiteSpace:'nowrap',transition:'all .2s'}}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 3.5rem'}}>
          <div style={{padding:'6rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Resources — Blog</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>AEO &amp; AI Search<br/><span style={{color:'var(--muted)'}}>Insights</span></h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Deep dives on Answer Engine Optimisation, LLM citation strategies, and the future of AI-driven discovery.</p>
          </div>

          <div style={{padding:'4rem 0 6rem'}}>
            {/* Filter pills */}
            <div style={{display:'flex',gap:'.5rem',marginBottom:'2rem',flexWrap:'wrap'}}>
              {FILTERS.map((f,i)=>(
                <button key={f} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',padding:'.4rem .9rem',borderRadius:'6px',border:'1px solid var(--border)',background:i===0?'var(--accent)':'transparent',color:i===0?'var(--bg)':'var(--muted)',cursor:'pointer',transition:'all .2s'}}>{f}</button>
              ))}
            </div>

            {/* Grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem'}}>
              {BLOG_POSTS.map((p,i)=>(
                <a key={i} href={`/resources/blog/${p.slug}`} className="blog-card" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
                  <div style={{height:'140px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.2rem',borderBottom:'1px solid var(--border)',background:p.bg}}>{p.emoji}</div>
                  <div style={{padding:'1.4rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'.65rem',marginBottom:'.65rem',flexWrap:'wrap'}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.08)',border:'1px solid rgba(123,108,255,.18)',padding:'.2rem .55rem',borderRadius:'4px'}}>{p.tag}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--muted2)'}}>{p.date}</span>
                    </div>
                    <div className="blog-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',lineHeight:1.25,marginBottom:'.5rem',transition:'color .2s',color:'var(--text)'}}>{p.title}</div>
                    <div style={{fontSize:'.78rem',color:'var(--muted)',lineHeight:1.6,marginBottom:'.85rem'}}>{p.excerpt}</div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--accent)',letterSpacing:'.06em'}}>{p.read} →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}