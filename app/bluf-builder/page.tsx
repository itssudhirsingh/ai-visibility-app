// app/bluf-builder/page.tsx — SERVER COMPONENT
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import BlufBuilderClient from '@/components/BlufBuilderClient'
import ClusterFAQClient from '@/components/ClusterFAQClient'

export const metadata = {
  title: 'BLUF Builder — AI-Ready Summary Generator — Notion Cue',
  description: 'Paste any URL and get 3 BLUF-optimised summaries — direct, benefit-led, and question-led. Free tool to write the opening lines AI engines actually quote.',
  openGraph: {
    title: 'BLUF Builder — AI-Ready Summary Generator',
    description: 'Generate 3 angled, 30-50 word BLUF summaries from any URL, written for how AI engines read and cite content.',
    type: 'website',
  },
}

const FAQS = [
  { q: 'What is a BLUF summary?', a: 'BLUF stands for Bottom Line Up Front — a writing convention where you state the most important information in the first sentence, then add supporting detail. AI engines weight the first 50-80 words of a passage far more heavily when deciding whether to cite it, so a strong BLUF opening directly improves citation odds.' },
  { q: 'Why three different versions?', a: 'Different pages call for different openings. A direct summary suits a product or documentation page. A benefit-led summary suits a landing page where the reader cares about outcome first. A question-led summary suits content built to match how people actually phrase questions to ChatGPT or Perplexity. Having all three lets you pick — or test — what fits.' },
  { q: 'Does it read my actual page content?', a: 'Yes — the tool fetches and reads the live page at the URL you provide. If the page can\'t be fetched (blocked, requires login, etc.), it falls back to inferring from the domain and URL structure, and tells you clearly which mode was used.' },
  { q: 'Where should I use the generated BLUF text?', a: 'Use it as the opening sentence or two of the relevant page — a homepage hero, a product description, or the first paragraph of an article. The goal is for a reader, and an AI engine scanning the page, to get the core answer immediately without scrolling.' },
  { q: 'Is this tool free?', a: 'Yes, completely free with no signup required for individual use. Full Notion Cue accounts add saved BLUF history and direct integration with your AEO scoring dashboard.' },
]

export default function BlufBuilderPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        input:focus,button:focus{outline:none}
        .example-card:hover{border-color:var(--border-h)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />
        <SubNavClient />

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 3.5rem'}}>

          {/* Hero */}
          <div style={{padding:'6rem 0 3rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Tools</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,4.5rem)',lineHeight:1,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              BLUF<br/><span style={{color:'var(--accent)'}}>Builder</span>
            </h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'600px'}}>
              Paste a URL. Get 3 conversational, 30–50 word summaries written the way AI engines actually like to quote — direct, benefit-led, and question-led. Pick the one that fits, copy it in.
            </p>
          </div>

          {/* Tool */}
          <div style={{padding:'3rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <BlufBuilderClient />
          </div>

          {/* ── WHAT IS BLUF — intro ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Why it matters</div>
                <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                  AI stops reading<br/><span style={{color:'var(--muted)'}}>after the first two sentences.</span>
                </h2>
                <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8,marginBottom:'1rem'}}>
                  BLUF — Bottom Line Up Front — means stating the most important information first, then adding supporting detail after. It's a convention from military communications, and it maps almost exactly onto how large language models decide what to cite.
                </p>
                <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                  LLMs weight the first 50–80 words of a passage <strong style={{color:'var(--text)',fontWeight:500}}>4–8x more heavily</strong> when deciding whether to quote it. A page that buries its answer in paragraph four gets skipped — even if the content underneath is excellent.
                </p>
              </div>

              {/* Before/after visual */}
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div style={{background:'var(--card)',border:'1px solid rgba(248,113,113,.2)',borderRadius:'12px',padding:'1.25rem'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.06em',textTransform:'uppercase',color:'#f87171'}}>✗ Buries the answer</span>
                  <p style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6,marginTop:'.6rem'}}>
                    "Welcome to our platform. We've been in business since 2018 and believe in quality. Our team works hard every day to..."
                  </p>
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <span style={{color:'var(--accent)',fontSize:'1.2rem'}}>↓</span>
                </div>
                <div style={{background:'var(--card)',border:'1px solid rgba(74,222,128,.25)',borderRadius:'12px',padding:'1.25rem'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.06em',textTransform:'uppercase',color:'#4ade80'}}>✓ Answer-first</span>
                  <p style={{fontSize:'.82rem',color:'var(--text)',lineHeight:1.6,marginTop:'.6rem'}}>
                    "We help small teams manage invoices in under 5 minutes, with automatic reminders so you never chase a late payment again."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── THE 3 ANGLES — explained ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2.5rem',maxWidth:'700px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>The 3 angles</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                Same page,<br/><span style={{color:'var(--muted)'}}>three honest ways to open it.</span>
              </h2>
              <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                There's no single "correct" BLUF — the right opening depends on what the page is and who's landing on it. Every generation gives you all three so you can pick, or test which performs.
              </p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem'}}>
              <div className="example-card" style={{background:'var(--card)',border:'1px solid rgba(34,211,238,.2)',borderRadius:'14px',padding:'1.75rem',transition:'border-color .2s'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--cyan)',background:'rgba(34,211,238,.08)',border:'1px solid rgba(34,211,238,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Direct</span>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7,marginTop:'1rem'}}>
                  States plainly what the page or product is and does. No fluff, fact-first. Best for product pages, documentation, and anywhere the reader just needs the definition fast.
                </p>
              </div>
              <div className="example-card" style={{background:'var(--card)',border:'1px solid rgba(200,242,71,.2)',borderRadius:'14px',padding:'1.75rem',transition:'border-color .2s'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',background:'rgba(200,242,71,.08)',border:'1px solid rgba(200,242,71,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Benefit-led</span>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7,marginTop:'1rem'}}>
                  Opens with the outcome for the reader, not the product description. Best for landing pages and anywhere "what's in it for me" matters more than "what is this."
                </p>
              </div>
              <div className="example-card" style={{background:'var(--card)',border:'1px solid rgba(244,114,182,.2)',borderRadius:'14px',padding:'1.75rem',transition:'border-color .2s'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--rose)',background:'rgba(244,114,182,.08)',border:'1px solid rgba(244,114,182,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Question-led</span>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7,marginTop:'1rem'}}>
                  Implicitly answers the exact question a searcher is asking when they land here. Best for blog posts and content built to match how people phrase queries to AI engines.
                </p>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{padding:'5rem 0 6rem'}}>
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>FAQ</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em'}}>
                Common <span style={{color:'var(--muted)'}}>questions.</span>
              </h2>
            </div>
            <ClusterFAQClient faqs={FAQS} />
          </section>

        </div>

        <SharedFooter />
      </div>
    </>
  )
}