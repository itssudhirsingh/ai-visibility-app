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

const ENTRIES = [
  {date:'Jun 2026',v:'v1.4.0',vc:'rgba(200,242,71,.08)',vbc:'rgba(200,242,71,.25)',vtc:'var(--accent)',latest:true,title:'Grok integration + AI Acquisition Report',changes:['Added Grok (xAI) citation tracking to all dashboard plans.','New AI Acquisition Report panel showing session-level data from AI-referred traffic.','BLUF Optimizer now generates 3 rewrite variations per page type.','Improved scan speed by 40% through parallel LLM probing.','Weekly email digest now includes competitor movement alerts.']},
  {date:'May 2026',v:'v1.3.0',vc:'rgba(123,108,255,.08)',vbc:'rgba(123,108,255,.25)',vtc:'var(--violet)',latest:false,title:'E-E-A-T Radar + Schema Validator',changes:['E-E-A-T score breakdown with radar chart and per-pillar scores.','Schema markup validator checking 12 schema types for completeness.','Content gap table now shows query intent classification.','Agency plan: white-label PDF report export with custom branding.','llms.txt generator added to Resources section.']},
  {date:'Apr 2026',v:'v1.2.0',vc:'rgba(34,211,238,.08)',vbc:'rgba(34,211,238,.25)',vtc:'var(--cyan)',latest:false,title:'Competitor benchmarking launch',changes:['Add up to 10 competitor domains and compare AEO scores side-by-side.','Citation gap analysis: queries where competitors appear but you don\'t.','30-day citation trend chart now visible on dashboard overview.','Claude AI integration for natural-language report summaries.']},
  {date:'Mar 2026',v:'v1.1.0',vc:'rgba(255,255,255,.03)',vbc:'var(--border)',vtc:'var(--muted2)',latest:false,title:'Perplexity + Copilot tracking added',changes:['Expanded LLM coverage from 3 to 5 engines (added Perplexity and Bing Copilot).','Sentiment analysis now available on all plans.','Technical audit section: llms.txt validation and robots.txt AI-bot check.','Pro plan: CSV export for all citation and gap data.']},
  {date:'Feb 2026',v:'v1.0.0',vc:'rgba(255,255,255,.03)',vbc:'var(--border)',vtc:'var(--muted2)',latest:false,title:'Notion Cue public launch',changes:['Initial launch with ChatGPT, Gemini, and Claude citation tracking.','AEO score (0–100) composite metric across all tracked engines.','Free tier: 1 domain scan per day, 3 LLMs, 7-day history.','Pro tier: 10 domains, 5 LLMs, weekly digest, 90-day history.']},
]

export default function ChangelogPage() {
  const router = useRouter()
  const path = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;}
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
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>Changelog</h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Every update, improvement, and new feature — documented as it ships.</p>
          </div>

          <div style={{padding:'4rem 0 6rem'}}>
            {ENTRIES.map((item,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:'2rem',padding:'2rem 0',borderBottom:'1px solid var(--border)',borderTop:i===0?'1px solid var(--border)':'none'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted2)',paddingTop:'.2rem'}}>{item.date}</div>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'.4rem'}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',padding:'.2rem .55rem',borderRadius:'4px',border:'1px solid',borderColor:item.vbc,background:item.vc,color:item.vtc}}>{item.v}</span>
                    {item.latest&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--accent)'}}>Latest</span>}
                  </div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',marginBottom:'.65rem'}}>{item.title}</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'.35rem'}}>
                    {item.changes.map((c,ci)=>(
                      <div key={ci} style={{display:'flex',alignItems:'flex-start',gap:'.5rem',fontSize:'.82rem',color:'var(--muted)'}}>
                        <span style={{color:'var(--muted2)',flexShrink:0,marginTop:'.05rem'}}>–</span>{c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}