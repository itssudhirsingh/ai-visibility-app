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

export default function TermsPage() {
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
        button{cursor:pointer;font-family:inherit}
        button:focus{outline:none}
        .toc-link:hover{color:var(--accent)!important}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.5rem 0 .75rem}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
        .prose ul{padding-left:1.5rem;margin-bottom:1rem}
        .prose li{font-size:.9rem;color:var(--muted);line-height:1.75;margin-bottom:.35rem}
        .prose strong{color:var(--text);font-weight:500}
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
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Legal</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>Terms of<br/><span style={{color:'var(--muted)'}}>Service</span></h1>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:'var(--muted2)'}}>Last updated: 1 June 2026 · Effective: 1 June 2026</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'4rem',padding:'4rem 0 6rem',alignItems:'start'}}>
            <div style={{position:'sticky',top:'120px'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.4rem'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.85rem'}}>Sections</div>
                {[['#t1','Acceptance'],['#t2','Service description'],['#t3','Account terms'],['#t4','Acceptable use'],['#t5','Payment'],['#t6','Cancellation'],['#t7','Disclaimer'],['#t8','Limitation of liability'],['#t9','Governing law']].map(([h,l])=>(
                  <a key={h} href={h} className="toc-link" style={{display:'block',fontSize:'.82rem',color:'var(--muted)',padding:'.3rem 0',borderBottom:'1px solid rgba(255,255,255,.04)',transition:'color .2s'}}>{l}</a>
                ))}
              </div>
            </div>
            <div className="prose">
              <h2 id="t1">1. Acceptance</h2>
              <p>By accessing or using Notion Cue, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
              <h2 id="t2">2. Service description</h2>
              <p>Notion Cue provides AI visibility analysis, AEO scoring, and related tools. We reserve the right to modify or discontinue any part of the service with reasonable notice.</p>
              <h2 id="t3">3. Account terms</h2>
              <p>You must provide accurate information when registering. You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorised access.</p>
              <h2 id="t4">4. Acceptable use</h2>
              <p>You may not use Notion Cue to scan domains you do not own or have permission to analyse, to attempt to reverse-engineer our scoring algorithms, to resell or redistribute data without a written agreement, or to violate any applicable laws.</p>
              <h2 id="t5">5. Payment</h2>
              <p>Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law or as stated in our refund policy. We may change pricing with 30 days' notice.</p>
              <h2 id="t6">6. Cancellation</h2>
              <p>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. You retain access until then.</p>
              <h2 id="t7">7. Disclaimer</h2>
              <p>Notion Cue is provided "as is" without warranties of any kind. We do not guarantee specific outcomes such as citation increases or traffic improvements.</p>
              <h2 id="t8">8. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, Notion Cue's liability for any claim is limited to the amount you paid us in the 12 months preceding the claim.</p>
              <h2 id="t9">9. Governing law</h2>
              <p>These terms are governed by the laws of England and Wales. Disputes shall be resolved in the courts of England and Wales.</p>
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}