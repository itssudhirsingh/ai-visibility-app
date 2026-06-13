'use client'
import { useRouter, usePathname } from 'next/navigation'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

const SUB_NAV = [
  { label: 'AEO Guide',          href: '/resources/aeo-guide' },
  { label: 'llms.txt Generator', href: '/resources/llms-txt' },
  { label: 'BLUF Templates',     href: '/resources/bluf-templates' },
  { label: 'Blog',               href: '/resources/blog' },
  { label: 'Changelog',          href: '/resources/changelog' },
  { label: 'About',              href: '/resources/about' },
  { label: 'Privacy',            href: '/resources/privacy' },
  { label: 'Terms',              href: '/resources/terms' },
  { label: 'Contact',            href: '/resources/contact' },
]

export default function PrivacyPage() {
  const router = useRouter()
  const path = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(237,233,255,0.22);--accent:#c8f247;--violet:#7b6cff;}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button{cursor:pointer;font-family:inherit}
        button:focus{outline:none}
        .toc-link:hover{color:var(--accent)!important}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.5rem 0 .75rem}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
        .prose ul{padding-left:1.5rem;margin-bottom:1rem}
        .prose li{font-size:.9rem;color:var(--muted);line-height:1.75;margin-bottom:.35rem}
        .prose a{color:var(--accent)}
        .prose strong{color:var(--text);font-weight:500}
        .callout{background:rgba(123,108,255,.06);border:1px solid rgba(123,108,255,.2);border-radius:10px;padding:1.1rem 1.4rem;margin:1.5rem 0}
        .callout p{margin:0!important;color:var(--text)!important;font-size:.88rem!important}
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
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>Privacy<br/><span style={{color:'var(--muted)'}}>Policy</span></h1>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:'var(--muted2)'}}>Last updated: 1 June 2026 · Effective: 1 June 2026</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'4rem',padding:'4rem 0 6rem',alignItems:'start'}}>
            <div style={{position:'sticky',top:'120px'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.4rem'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.85rem'}}>Sections</div>
                {[['#p1','Information we collect'],['#p2','How we use your data'],['#p3','Data sharing'],['#p4','Data retention'],['#p5','Your rights'],['#p6','Cookies'],['#p7','Security'],['#p8','Contact us']].map(([h,l])=>(
                  <a key={h} href={h} className="toc-link" style={{display:'block',fontSize:'.82rem',color:'var(--muted)',padding:'.3rem 0',borderBottom:'1px solid rgba(255,255,255,.04)',transition:'color .2s'}}>{l}</a>
                ))}
              </div>
            </div>
            <div className="prose">
              <p>Notion Cue ("we", "our", "us") is committed to protecting your personal information. This policy explains what data we collect, why we collect it, and how you can control it.</p>
              <h2 id="p1">1. Information we collect</h2>
              <p>We collect the following categories of information when you use Notion Cue.</p>
              <ul>
                <li><strong>Account data</strong> — email address, name, and password (hashed) when you register.</li>
                <li><strong>Usage data</strong> — domains you scan, features you use, pages you visit, and timestamps of activity.</li>
                <li><strong>Payment data</strong> — processed entirely by Stripe. We store only the last 4 digits, card type, and expiry date.</li>
                <li><strong>Technical data</strong> — IP address, browser type, device type, and operating system collected automatically.</li>
              </ul>
              <h2 id="p2">2. How we use your data</h2>
              <p>We use your data only to provide and improve the Notion Cue service.</p>
              <ul>
                <li>Create and manage your account and subscription.</li>
                <li>Run domain scans and return AEO analysis results to you.</li>
                <li>Send weekly digest emails if you have opted in.</li>
                <li>Debug errors and improve product performance.</li>
                <li>Comply with legal obligations.</li>
              </ul>
              <div className="callout"><p>We do not sell your data. We do not share it with advertisers. We do not use it for any purpose outside of operating the Notion Cue service.</p></div>
              <h2 id="p3">3. Data sharing</h2>
              <p>We share data with the following third-party services strictly for operating the product.</p>
              <ul>
                <li><strong>Stripe</strong> — payment processing.</li>
                <li><strong>Supabase</strong> — database hosting (EU servers, GDPR-compliant).</li>
                <li><strong>Vercel</strong> — hosting and edge functions.</li>
                <li><strong>OpenAI</strong> — AI analysis (domain names and scan requests are sent to the API).</li>
              </ul>
              <h2 id="p4">4. Data retention</h2>
              <p>We retain your account data for as long as your account is active. Scan history is retained for 7 days (Free), 90 days (Pro), or 365 days (Agency). When you delete your account, all personal data is permanently deleted within 30 days.</p>
              <h2 id="p5">5. Your rights</h2>
              <p>Under GDPR and equivalent regulations, you have the right to access, correct, export, or delete your data at any time. Email <a href="mailto:privacy@notioncue.com">privacy@notioncue.com</a>.</p>
              <h2 id="p6">6. Cookies</h2>
              <p>We use only essential cookies required for authentication and session management. We do not use advertising cookies or third-party tracking cookies.</p>
              <h2 id="p7">7. Security</h2>
              <p>All data is transmitted over HTTPS. Passwords are hashed using bcrypt. Database access is restricted to Notion Cue infrastructure only. We conduct regular security reviews.</p>
              <h2 id="p8">8. Contact us</h2>
              <p>For privacy-related questions, contact us at <a href="mailto:privacy@notioncue.com">privacy@notioncue.com</a>.</p>
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}