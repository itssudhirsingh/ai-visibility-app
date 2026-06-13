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

export default function AEOGuidePage() {
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
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        .toc-link:hover{color:var(--accent)!important}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.5rem 0 .75rem}
        .prose h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.1rem;margin:2rem 0 .5rem}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
        .prose ul,.prose ol{padding-left:1.5rem;margin-bottom:1rem}
        .prose li{font-size:.9rem;color:var(--muted);line-height:1.75;margin-bottom:.35rem}
        .prose a{color:var(--accent)}
        .prose strong{color:var(--text);font-weight:500}
        .callout{background:rgba(123,108,255,.06);border:1px solid rgba(123,108,255,.2);border-radius:10px;padding:1.1rem 1.4rem;margin:1.5rem 0}
        .callout p{margin:0!important;color:var(--text)!important;font-size:.88rem!important}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />

        {/* Sub-nav */}
        <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--border)',padding:'.6rem 3.5rem',display:'flex',gap:0,overflowX:'auto',marginTop:'65px'}}>
          {SUB_NAV.map(n=>(
            <button key={n.href} onClick={()=>router.push(n.href)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.55rem 1rem',background:'none',border:'none',borderBottom:path===n.href?'2px solid var(--accent)':'2px solid transparent',color:path===n.href?'var(--accent)':'var(--muted)',whiteSpace:'nowrap',transition:'all .2s'}}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 3.5rem'}}>
          <div style={{padding:'6rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Resources</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>The Complete<br/><span style={{color:'var(--accent)'}}>AEO Guide</span></h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'520px'}}>Everything you need to understand Answer Engine Optimisation and get your content cited by ChatGPT, Gemini, Perplexity, and every major LLM.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'4rem',padding:'4rem 0 6rem',alignItems:'start'}}>
            <div style={{position:'sticky',top:'120px'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.4rem'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.85rem'}}>Contents</div>
                {[['#g1','What is AEO?'],['#g2','How LLMs select sources'],['#g3','The AEO scoring model'],['#g4','BLUF content structure'],['#g5','Schema markup for AI'],['#g6','llms.txt setup'],['#g7','E-E-A-T for LLMs'],['#g8','Competitor analysis']].map(([h,l])=>(
                  <a key={h} href={h} className="toc-link" style={{display:'block',fontSize:'.82rem',color:'var(--muted)',padding:'.3rem 0',borderBottom:'1px solid rgba(255,255,255,.04)',transition:'color .2s'}}>{l}</a>
                ))}
              </div>
            </div>
            <div className="prose">
              <h2 id="g1">What is AEO?</h2>
              <p>Answer Engine Optimisation (AEO) is the practice of structuring your website content so that large language models choose to cite, quote, or recommend your brand when users ask relevant questions. Where traditional SEO targets search engine ranking algorithms, AEO targets the retrieval and citation patterns of AI systems.</p>
              <p>As of 2026, tools like ChatGPT, Perplexity, Gemini, and Grok collectively field over 2 billion queries per day. A growing share of these queries have commercial or research intent — exactly the queries that historically drove organic search traffic. <strong>Brands that are not visible in AI-generated answers are increasingly invisible to modern buyers.</strong></p>
              <div className="callout"><p>AEO is not a replacement for SEO. It is the next layer. The technical foundations (fast pages, clean markup, authoritative content) remain essential. AEO adds the citation-specific signals on top.</p></div>
              <h2 id="g2">How LLMs select sources</h2>
              <p>Language models do not crawl the web in real time for most queries. Instead, they draw on training data and, for systems with retrieval capabilities (Perplexity, GPT-4o with browse, Gemini), real-time indexed content. In both cases, certain signals make content more likely to be retrieved and cited.</p>
              <ul>
                <li><strong>BLUF structure</strong> — content that answers the query in the first two sentences scores higher in retrieval.</li>
                <li><strong>Structured data</strong> — FAQ, HowTo, and Article schema help models understand content type and extract answers cleanly.</li>
                <li><strong>Authority signals</strong> — backlinks from trusted domains, author credentials, and citation frequency across the web.</li>
                <li><strong>Crawlability</strong> — pages blocked by robots.txt or missing from sitemaps cannot be indexed by AI crawlers.</li>
                <li><strong>llms.txt</strong> — explicitly allowing AI bots signals that your content is available for training and retrieval.</li>
              </ul>
              <h2 id="g3">The AEO scoring model</h2>
              <p>Notion Cue's composite score (0–100) is built from four weighted categories. Content structure accounts for 35% of the score and covers BLUF compliance, heading hierarchy, FAQ blocks, and answer density. Technical AEO covers 30% and includes schema markup completeness, llms.txt status, robots.txt bot allowances, and page speed. Authority signals account for 20% and cover domain authority, citation frequency across LLMs, and E-E-A-T signals. Crawlability makes up the remaining 15% and covers sitemap coverage, crawl budget, and bot-specific access.</p>
              <h2 id="g4">BLUF content structure</h2>
              <p>BLUF (Bottom Line Up Front) is a writing convention from military communications adapted for AI-optimised content. The rule is simple: state the most important information in the first sentence, then add supporting detail. LLMs weight the first 50–80 words of a passage 4–8x more heavily when deciding whether to cite it.</p>
              <p>For a product page, this means the first sentence should state what the product is, who it is for, and its key value proposition — not a brand story or emotive opener.</p>
              <h2 id="g5">Schema markup for AI</h2>
              <p>FAQPage schema is the single highest-impact schema type for AI citations. Pages with FAQPage JSON-LD appear in AI Overview citations at 3.2x the rate of equivalent pages without it. HowTo schema is second, particularly for instructional content. Article and BlogPosting schema help models classify content type and extract author credentials.</p>
              <h2 id="g6">llms.txt setup</h2>
              <p>Place a plain text file at <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.82em',background:'rgba(255,255,255,.06)',padding:'.15em .4em',borderRadius:'4px'}}>yourdomain.com/llms.txt</code> with bot permission declarations. Use the generator in the llms.txt tab to create your file. At minimum, allow GPTBot, PerplexityBot, and Google-Extended unless you have a specific reason to block them.</p>
              <h2 id="g7">E-E-A-T for LLMs</h2>
              <p>Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) has been adopted informally by multiple LLM evaluation pipelines. Pages with clear author bylines, linked professional credentials, original research, and verifiable citations score higher on authority signals that LLMs use to decide whether to cite a source.</p>
              <h2 id="g8">Competitor analysis</h2>
              <p>The fastest way to improve your AEO score is to identify which queries your competitors get cited for that you do not. Notion Cue's content gap analysis runs the same prompt set against your domain and competitor domains and returns a sorted list of citation opportunities ranked by search volume and commercial intent.</p>
            </div>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}