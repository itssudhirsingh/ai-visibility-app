'use client'
import { useRouter, usePathname } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

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

export default function ContactPage() {
  const router = useRouter()
  const path = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button,input,textarea,select{font-family:inherit;cursor:pointer}
        input:focus,textarea:focus,select:focus,button:focus{outline:none}
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
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>Get in<br/><span style={{color:'var(--accent)'}}>touch.</span></h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Questions about pricing, the product, or a partnership? We read every message.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',padding:'4rem 0 6rem',alignItems:'start'}}>
            {/* Form */}
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem',display:'flex',flexDirection:'column',gap:'1.1rem'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                {[{l:'First name',ph:'Jane'},{l:'Last name',ph:'Smith'}].map(f=>(
                  <div key={f.l} style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                    <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{f.l}</label>
                    <input placeholder={f.ph} style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border-h)',borderRadius:'8px',padding:'.65rem 1rem',color:'var(--text)',fontSize:'.85rem'}} />
                  </div>
                ))}
              </div>
              {[{l:'Email',ph:'jane@company.com',t:'email'},{l:'Company website',ph:'yoursite.com',t:'text'}].map(f=>(
                <div key={f.l} style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{f.l}</label>
                  <input type={f.t} placeholder={f.ph} style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border-h)',borderRadius:'8px',padding:'.65rem 1rem',color:'var(--text)',fontSize:'.85rem'}} />
                </div>
              ))}
              <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>Subject</label>
                <select style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border-h)',borderRadius:'8px',padding:'.65rem 1rem',color:'var(--text)',fontSize:'.85rem'}}>
                  {['General question','Pricing / sales','Bug report','Partnership','Press / media'].map(o=><option key={o} style={{background:'#100e22'}}>{o}</option>)}
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>Message</label>
                <textarea rows={5} placeholder="Tell us what you need..." style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border-h)',borderRadius:'8px',padding:'.75rem 1rem',color:'var(--text)',fontSize:'.85rem',resize:'vertical',fontFamily:'inherit'}} />
              </div>
              <button style={{width:'100%',padding:'.85rem',background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem'}}>Send message</button>
            </div>

            {/* Contact info */}
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {[
                {icon:'✉️',title:'Email',val:'hello@notioncue.com',sub:'We reply within 24 hours.'},
                {icon:'💬',title:'Live chat',val:'Available on the dashboard',sub:'Pro and Agency plan users get priority support.'},
                {icon:'🐦',title:'Twitter / X',val:'@notioncue',sub:'For product updates and quick questions.'},
              ].map((c,i)=>(
                <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.5rem',display:'flex',gap:'1.1rem',alignItems:'flex-start'}}>
                  <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>{c.icon}</div>
                  <div>
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'.2rem'}}>{c.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:'var(--accent)',marginBottom:'.25rem'}}>{c.val}</div>
                    <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.5}}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}