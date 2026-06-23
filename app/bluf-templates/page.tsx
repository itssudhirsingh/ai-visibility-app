'use client'
import { useState } from 'react'
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

export default function BLUFTemplatesPage() {
  const router = useRouter()
  const path = usePathname()
  const [copied, setCopied] = useState('')

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(()=>setCopied(''),2000)
  }

  const templates = [
    {name:'Homepage / About',tag:'General',sentence:'[Brand] is a [category] [business type] that [core value proposition] for [target audience], [key differentiator].',body:'Founded in [year], [Brand] [brief origin story / expertise note]. [Supporting detail about product range / geography / scale].',use:'Use on: homepage hero, About page intro, Google Business description, llms.txt description field.'},
    {name:'Product / Category Page',tag:'E-commerce',sentence:'[Brand] sells [product type] in [size/variant range], priced from [price range], with [shipping/delivery offer].',body:'Our [collection name] includes [number] styles across [subcategories]. [Key material/quality note]. [Return policy or trust signal].',use:'Use on: collection pages, category descriptions, product meta descriptions, shopping feed titles.'},
    {name:'Blog / Guide Post',tag:'Content',sentence:'[Topic] is [definition/direct answer in one sentence].',body:'This guide covers [main points 1, 2, 3] and is intended for [audience]. [Why this matters / context sentence]. [Author credential or source note].',use:'Use on: blog post introductions, FAQ answers, knowledge base articles, how-to guides.'},
    {name:'Service / SaaS Page',tag:'B2B / SaaS',sentence:'[Product] is a [category] tool that helps [audience] [achieve outcome] by [mechanism], starting at [price/free tier].',body:'[Differentiating feature 1]. [Key integration or compatibility note]. [Social proof — customer count, rating, or notable client].',use:'Use on: feature pages, pricing sections, landing page hero, app store descriptions.'},
    {name:'FAQ Answer',tag:'Schema-ready',sentence:'Q: [Direct question]\nA: [Answer in one sentence, 15-25 words max].',body:'[1-2 supporting sentences with detail]. [Link to related resource or product if relevant]. [Date or version note if time-sensitive].',use:'Use on: FAQ pages with FAQPage schema, support articles, product description accordions.'},
    {name:'Comparison / Versus',tag:'Decision content',sentence:'[Option A] is better for [use case A], while [Option B] is better for [use case B].',body:'[Option A] [key advantage] but [key limitation]. [Option B] [key advantage] but [key limitation]. [Recommendation sentence for typical buyer].',use:'Use on: comparison blog posts, versus landing pages, review content, buying guides.'},
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#04030c;--card:#100e22;--border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);--text:#ede9ff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);--accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--green:#4ade80}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        button{cursor:pointer;font-family:inherit;border:none}
        button:focus{outline:none}
        .tmpl-card:hover{border-color:var(--border-h)!important}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
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
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Tools</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>BLUF Content<br/><span style={{color:'var(--accent)'}}>Templates</span></h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Ready-to-use templates for AI-optimised content structure. Each template puts the answer first — the pattern LLMs use to decide what to cite.</p>
          </div>

          <div style={{padding:'4rem 0 6rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1.25rem',marginBottom:'3rem'}}>
              {templates.map((t,i)=>(
                <div key={i} className="tmpl-card" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',transition:'border-color .25s'}}>
                  <div style={{padding:'1.25rem 1.5rem',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,255,255,.02)'}}>
                    <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem'}}>{t.name}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.06em',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.2rem .5rem',borderRadius:'4px',background:'rgba(255,255,255,.02)'}}>{t.tag}</span>
                  </div>
                  <div style={{padding:'1.5rem'}}>
                    <div style={{background:'#0a0818',borderRadius:'8px',padding:'1rem',fontSize:'.78rem',lineHeight:1.7,color:'var(--muted)',marginBottom:'1rem',border:'1px solid var(--border)'}}>
                      <span style={{color:'var(--green)',display:'block',padding:'.5rem .75rem',background:'rgba(74,222,128,.05)',borderLeft:'2px solid var(--green)',borderRadius:'0 6px 6px 0',marginBottom:'.5rem',whiteSpace:'pre-wrap'}}>{t.sentence}</span>
                      {t.body}
                    </div>
                    <div style={{fontSize:'.78rem',color:'var(--muted)',lineHeight:1.6,marginBottom:'.85rem'}}>{t.use}</div>
                    <button onClick={()=>copy(t.sentence+'\n'+t.body,'tmpl'+i)} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.75rem',fontWeight:600,padding:'.5rem 1rem',border:'1px solid var(--border)',borderRadius:'100px',background:'transparent',color:'var(--muted)',cursor:'pointer',transition:'all .2s'}}>
                      {copied==='tmpl'+i?'Copied!':'Copy template'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{height:'1px',background:'var(--border)',marginBottom:'2.5rem'}} />
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.65rem'}}>Why BLUF works for AI</div>
            <div style={{maxWidth:'680px'}}>
              <p className="prose" style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.85,marginBottom:'1rem'}}>Large language models parse content to find the most directly useful answer to a user query. Studies show that LLMs weight the first 50–80 words of a passage 4–8x more heavily than the rest of the document when deciding whether to cite it. BLUF structure aligns your content with this retrieval pattern — putting the answer exactly where the model looks first.</p>
              <p className="prose" style={{fontSize:'.93rem',color:'var(--muted)',lineHeight:1.85}}>The templates above follow three rules. The answer comes first. The answer is specific (numbers, names, ranges — not vague generalisations). Supporting detail comes after in a separate sentence or paragraph so the model can extract cleanly.</p>
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}