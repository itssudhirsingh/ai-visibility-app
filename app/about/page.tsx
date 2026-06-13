'use client'
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

export default function AboutPage() {
  const router = useRouter()
  const path = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);--accent:#c8f247;--violet:#7b6cff;}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button{cursor:pointer;font-family:inherit}
        button:focus{outline:none}
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
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Company</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>We built the tool<br/><span style={{color:'var(--accent)'}}>we needed.</span></h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Notion Cue started as an internal tool for a small SEO team trying to understand why some clients showed up in AI answers and others didn't.</p>
          </div>

          <div style={{padding:'4rem 0 6rem',display:'flex',flexDirection:'column',gap:'4rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
              {[{val:'3,400',suf:'+',lbl:'SEO professionals'},{val:'2.1',suf:'M',lbl:'Scans run to date'},{val:'6',suf:'',lbl:'LLMs tracked'},{val:'Feb',suf:' 2026',lbl:'Founded'}].map((s,i)=>(
                <div key={i} style={{padding:'2rem 1.75rem',borderRight:i<3?'1px solid var(--border)':'none',textAlign:'center'}}>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'2.4rem',lineHeight:1,color:'#fff',letterSpacing:'-.02em',marginBottom:'.35rem'}}>{s.val}<span style={{color:'var(--accent)',fontSize:'.6em'}}>{s.suf}</span></div>
                  <div style={{fontSize:'.78rem',color:'var(--muted)',lineHeight:1.5}}>{s.lbl}</div>
                </div>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem'}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.65rem'}}>Our values</div>
                {[{title:'Transparency',desc:"We show our methodology. Our scoring model is documented publicly. We don't make claims we can't back up with data."},{title:'Practitioner-first',desc:'Built by SEO practitioners for SEO practitioners. Every feature exists because a real SEO professional needed it to do their job better.'},{title:'Privacy by design',desc:"We don't sell data. We don't run ads. Our business model is subscription revenue, which means our incentives are aligned with yours."}].map((v,i)=>(
                  <div key={i} style={{padding:'1.25rem 0',borderBottom:i<2?'1px solid var(--border)':'none'}}>
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem',marginBottom:'.35rem'}}>{v.title}</div>
                    <div style={{fontSize:'.9rem',color:'var(--muted)',lineHeight:1.7}}>{v.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.65rem'}}>Backed by</div>
                <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.75rem'}}>
                  <p style={{fontSize:'.9rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'1rem'}}>Notion Cue is bootstrapped and profitable. We are not venture-backed. This means we build for our users, not for a growth-at-all-costs exit timeline.</p>
                  <div style={{height:'1px',background:'var(--border)',margin:'1rem 0'}} />
                  <p style={{fontSize:'.9rem',color:'var(--muted)',lineHeight:1.75,margin:0}}>Revenue comes from subscriptions. No ads, no data brokering, no affiliate marketing. If the product doesn't help you, you cancel. That's the only accountability mechanism we want.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}