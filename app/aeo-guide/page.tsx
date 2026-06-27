// app/resources/aeo-guide/page.tsx — SERVER COMPONENT
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'

export const metadata = {
  title: 'The Complete AEO Guide 2026 — Start Ranking on AI Search',
  description: 'The full guide to Answer Engine Optimisation — how ChatGPT, Gemini, Perplexity, Claude, Grok, and Copilot select sources, and exactly how to optimise your content to get cited by each.',
  openGraph: {
    title: 'The Complete AEO Guide 2026 — Start Ranking on AI Search',
    description: 'Engine-by-engine breakdown of how AI search works and how to optimise for it. BLUF structure, schema, llms.txt, E-E-A-T, content clusters, and more.',
    type: 'article',
  },
}

const TOC = [
  ['#g1', 'What is AEO?'],
  ['#g2', 'Why AEO matters now'],
  ['#g3', 'How LLMs select sources'],
  ['#g4', 'The Notion Cue AEO scoring model'],
  ['#g5', 'Engine-by-engine breakdown'],
  ['#g6', '— ChatGPT'],
  ['#g7', '— Perplexity'],
  ['#g8', '— Gemini'],
  ['#g9', '— Claude'],
  ['#g10', '— Grok'],
  ['#g11', '— Copilot'],
  ['#g12', 'BLUF content structure'],
  ['#g13', 'Schema markup for AI'],
  ['#g14', 'llms.txt and robots.txt setup'],
  ['#g15', 'E-E-A-T for LLMs'],
  ['#g16', 'Content clusters and topical authority'],
  ['#g17', 'Competitor analysis and content gaps'],
  ['#g17b', 'Measuring AEO over time'],
  ['#g19b', 'Common mistakes to avoid'],
  ['#g18', 'Your 30-day AEO action plan'],
  ['#g19', 'Frequently asked questions'],
]

function ToolCTA({ icon, eyebrow, title, desc, href, cta, color }: { icon: string; eyebrow: string; title: string; desc: string; href: string; cta: string; color: string }) {
  return (
    <div style={{background:'var(--card)',border:`1px solid ${color}33`,borderRadius:'14px',padding:'1.5rem',margin:'2rem 0',display:'flex',alignItems:'center',gap:'1.25rem',flexWrap:'wrap'}}>
      <div style={{width:'48px',height:'48px',borderRadius:'12px',background:`${color}18`,border:`1px solid ${color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{icon}</div>
      <div style={{flex:1,minWidth:'200px'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color,marginBottom:'.3rem'}}>{eyebrow}</div>
        <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.3rem',color:'var(--text)'}}>{title}</div>
        <div style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.6}}>{desc}</div>
      </div>
      <a href={href} style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.8rem',background:color,color:'var(--bg)',padding:'.65rem 1.3rem',borderRadius:'100px',whiteSpace:'nowrap'}}>{cta} →</a>
    </div>
  )
}

function EngineCard({ tag, tagColor, share, weighting, citation, optimize }: { tag: string; tagColor: string; share: string; weighting: string; citation: string[]; optimize: string[] }) {
  return (
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem',margin:'1.5rem 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem',flexWrap:'wrap'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:tagColor,background:`${tagColor}18`,border:`1px solid ${tagColor}40`,padding:'.2rem .55rem',borderRadius:'4px'}}>{tag}</span>
        <span style={{fontSize:'.78rem',color:'var(--muted2)'}}>{share}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'#4ade80',marginBottom:'.6rem'}}>How it cites</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {citation.map((t,i)=>(
              <li key={i} style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6,display:'flex',gap:'.5rem'}}><span style={{color:'#4ade80',flexShrink:0}}>•</span>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'.6rem'}}>How to optimise</div>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {optimize.map((t,i)=>(
              <li key={i} style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.6,display:'flex',gap:'.5rem'}}><span style={{color:'var(--accent)',flexShrink:0}}>•</span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,.06)',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'var(--muted2)'}}>
        Score weighting in Notion Cue: <span style={{color:'var(--text)'}}>{weighting}</span>
      </div>
    </div>
  )
}

export default function AEOGuidePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ffffff;--muted:rgba(255,255,255,0.88);--muted2:rgba(255,255,255,0.58);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--green:#4ade80;--rose:#f472b6;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        .toc-link:hover{color:var(--accent)!important}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.75rem 0 .75rem;color:var(--text)}
        .prose h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.1rem;margin:2rem 0 .5rem;color:var(--text)}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
        .prose ul,.prose ol{padding-left:1.5rem;margin-bottom:1rem}
        .prose li{font-size:.9rem;color:var(--muted);line-height:1.75;margin-bottom:.35rem}
        .prose a{color:var(--accent)}
        .prose strong{color:var(--text);font-weight:500}
        .callout{background:rgba(123,108,255,.06);border:1px solid rgba(123,108,255,.2);border-radius:10px;padding:1.1rem 1.4rem;margin:1.5rem 0}
        .callout p{margin:0!important;color:var(--text)!important;font-size:.88rem!important}
        .toc-section-label{font-family:'JetBrains Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted2);padding:.6rem 0 .2rem;margin-top:.4rem}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>
        <SharedHeader />
        <SubNavClient />

        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 3.5rem'}}>

          {/* Hero */}
          <div style={{padding:'6rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Resources</div>
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.95,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              The Complete<br/><span style={{color:'var(--accent)'}}>AEO Guide</span>
            </h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'600px',marginBottom:'1.5rem'}}>
              How ChatGPT, Perplexity, Gemini, Claude, Grok, and Copilot actually select and cite sources — and the exact technical and content changes that improve your odds with each one.
            </p>
            <div style={{display:'flex',gap:'1.2rem',flexWrap:'wrap',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted2)'}}>
              <span>📖 ~5,000 words</span>
              <span>🤖 6 engines covered</span>
              <span>🛠 5 free tools linked</span>
            </div>
          </div>

          {/* Content grid */}
          <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:'4rem',padding:'4rem 0 6rem',alignItems:'start'}}>

            {/* Table of contents */}
            <div style={{position:'sticky',top:'120px'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'1.4rem',maxHeight:'calc(100vh - 160px)',overflowY:'auto'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.5rem'}}>Contents</div>
                {TOC.map(([h,l],i)=>(
                  <a key={h} href={h} className="toc-link" style={{display:'block',fontSize:'.78rem',color:'var(--muted)',padding:'.32rem 0',borderBottom:i<TOC.length-1?'1px solid rgba(255,255,255,.04)':'none',transition:'color .2s'}}>{l}</a>
                ))}
              </div>
            </div>

            {/* Article content */}
            <article className="prose">

              <h2 id="g1">What is AEO?</h2>
              <p>Answer Engine Optimisation (AEO) is the practice of structuring your website content so that large language models choose to cite, quote, or recommend your brand when users ask relevant questions. Where traditional SEO targets search engine ranking algorithms, AEO targets the retrieval and citation patterns of AI systems — a related but distinct discipline with its own signals, its own failure modes, and its own measurement challenges.</p>
              <p>As of 2026, tools like ChatGPT, Perplexity, Gemini, and Grok collectively field over 2 billion queries per day. A growing share of these queries have commercial or research intent — exactly the queries that historically drove organic search traffic. <strong>Brands that are not visible in AI-generated answers are increasingly invisible to modern buyers.</strong> A user who asks ChatGPT "what's the best invoicing tool for freelancers" and never sees your name in the response has, for all practical purposes, never discovered you — regardless of how well you rank on page one of Google for the same query.</p>
              <p>The term itself is still settling. Some practitioners call this GEO (Generative Engine Optimisation), others use AEO interchangeably with "LLM SEO" or "AI search optimisation." The naming hasn't fully converged because the discipline is young enough that even the people building tools for it are still mapping the boundaries of what matters. What's not in dispute is the underlying behaviour: these systems read web content, form a judgment about which sources are worth citing, and that judgment is influenced by identifiable, improvable factors.</p>
              <div className="callout">
                <p>AEO is not a replacement for SEO. It is the next layer. The technical foundations (fast pages, clean markup, authoritative content) remain essential. AEO adds the citation-specific signals on top.</p>
              </div>
              <p>It's worth being precise about what AEO can and cannot do. No technique in this guide guarantees a citation on any specific query — these are probabilistic systems, and the same prompt can return different sources on different days, even with no changes to your site. What AEO practice does is shift the odds meaningfully in your favour across the full population of relevant queries, the same way traditional SEO never guaranteed a #1 ranking but reliably improved the odds of strong visibility across a keyword set.</p>

              <h2 id="g2">Why AEO matters now</h2>
              <p>Three shifts are happening at once. First, AI chat interfaces have crossed from novelty into daily habit for hundreds of millions of people — many of whom now ask ChatGPT or Perplexity a question before they'd ever open Google. Second, AI Overviews and answer boxes are absorbing a growing share of traditional search real estate, meaning even "regular" Google searches increasingly route through an AI-generated summary before a human reads a single blue link. Third, the citation behaviour of these systems is measurable and improvable — it is not a black box you simply hope works in your favour.</p>
              <p>The brands moving fastest on AEO right now are doing so because the category is genuinely new. The tooling, the best practices, and the competitive landscape all still resemble where SEO stood in its earliest years — which means the advantage of acting early is unusually large.</p>
              <p>There's also a structural reason this matters more than it might first appear. Search engines have always shown a ranked list — position ten still gets some clicks, however few. AI engines, by contrast, typically surface a handful of sources, sometimes just one, inside a single synthesised answer. The gap between being cited and not being cited isn't a gradual decline in traffic the way falling from position three to position eight is — it's closer to a binary outcome. You're either part of the answer the user receives, or you don't exist for that query at all.</p>
              <p>This compresses the competitive landscape considerably. Where ten or twenty sites might each capture a meaningful slice of traffic for a competitive keyword in traditional search, an AI answer engine might cite only two or three sources for the equivalent query — and increasingly, just one. The brands that understand and act on this dynamic early are positioning themselves as that default cited source before competitors realise the game has changed.</p>
              <p>There's a measurement dimension worth flagging too. Unlike Google Search Console, which has existed long enough that every marketer has internalised how to read it, there is no equivalent standard dashboard for AI citation tracking yet. Most teams currently have zero visibility into whether their AEO efforts are working — they're optimising blind. Closing that measurement gap is exactly the problem a tool like Notion Cue exists to solve, but the underlying need — visibility into AI citation behaviour — is now a basic requirement for any serious content or marketing team, not a nice-to-have.</p>

              <ToolCTA
                icon="🔍" eyebrow="Start here" title="Get your AEO score in 30 seconds"
                desc="Paste your domain and see exactly how you're cited across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude right now."
                href="/ai-visibility-tool" cta="Run free scan" color="var(--accent)"
              />

              <h2 id="g3">How LLMs select sources</h2>
              <p>Language models do not crawl the web in real time for most queries. Instead, they draw on training data and, for systems with retrieval capabilities (Perplexity, GPT-4o with browse, Gemini), real-time indexed content. In both cases, certain signals make content more likely to be retrieved and cited.</p>
              <ul>
                <li><strong>BLUF structure</strong> — content that answers the query in the first two sentences scores higher in retrieval.</li>
                <li><strong>Structured data</strong> — FAQ, HowTo, and Article schema help models understand content type and extract answers cleanly.</li>
                <li><strong>Authority signals</strong> — backlinks from trusted domains, author credentials, and citation frequency across the web.</li>
                <li><strong>Crawlability</strong> — pages blocked by robots.txt or missing from sitemaps cannot be indexed by AI crawlers.</li>
                <li><strong>llms.txt</strong> — explicitly allowing AI bots signals that your content is available for training and retrieval.</li>
                <li><strong>Topical depth</strong> — domains with multiple interlinked pages on a subject outrank isolated single articles, even when the single article is well-written.</li>
              </ul>
              <p>None of these signals work in isolation. A page with perfect schema markup but no BLUF structure still underperforms, just as flawless prose buried behind a blocked robots.txt is invisible regardless of quality. AEO is the sum of all six factors working together.</p>
              <h3>Training data versus retrieval — a critical distinction</h3>
              <p>It's worth understanding the two fundamentally different ways content reaches an LLM, because they call for different strategies. Training-data citation happens when a model has learned about your brand or content during its training process — this is slow to change, tied to how prominent and well-linked your content was at the time of training, and effectively impossible to influence in the short term for any individual page.</p>
              <p>Retrieval-based citation, used by Perplexity, ChatGPT's browsing mode, and Gemini's search-grounded responses, happens in real time — the model issues something functionally similar to a search query, retrieves a handful of live pages, and synthesises an answer from what it finds. This is the layer where AEO practice has immediate, measurable effect, because it behaves far more like classic information retrieval than like the opaque pattern-matching of pure training-data recall.</p>
              <p>This distinction matters practically: a brand-new page you publish today has zero chance of influencing training-data citation until the next model training run, which could be months away. But that same page can start appearing in retrieval-based citations within days of publishing, provided it's crawlable, well-structured, and topically relevant. Most of the actionable advice in this guide targets the retrieval layer specifically, since that's where near-term improvement is actually achievable.</p>
              <h3>Why volume of mentions isn't the same as quality of mentions</h3>
              <p>A subtlety that trips up teams new to AEO: appearing frequently in AI training data doesn't necessarily translate into favourable citation. A brand can be widely mentioned across the web — in comparison articles, review sites, forum threads — and still receive a citation rate well below what raw mention volume would predict, simply because none of those mentions are structured in a way the model finds clean enough to quote directly. Conversely, a smaller brand with fewer total mentions but tightly BLUF-structured, well-schema'd content often outperforms on direct citation rate. Volume of presence and quality of structure are separate variables, and AEO work is primarily about the second one.</p>

              <h2 id="g4">The Notion Cue AEO scoring model</h2>
              <p>Notion Cue's composite score (0–100) is built from four weighted categories.</p>
              <p><strong>Content structure (35%)</strong> covers BLUF compliance, heading hierarchy, FAQ blocks, and answer density — essentially, how easily a model can extract a clean, quotable answer from your page. This is the single largest weighting because it's also the factor most directly within a content team's control, with the shortest feedback loop between making a change and seeing it reflected in citation behaviour.</p>
              <p><strong>Technical AEO (30%)</strong> includes schema markup completeness, llms.txt status, robots.txt bot allowances, and page speed — the infrastructure that determines whether a model can even access and parse your content correctly. A perfect piece of content sitting behind a misconfigured robots.txt scores zero on retrieval, regardless of how well it would otherwise perform — which is why this category carries weight nearly as high as content structure itself.</p>
              <p><strong>Authority signals (20%)</strong> cover domain authority, citation frequency across LLMs, and E-E-A-T signals — the trust layer that influences whether a model treats your domain as a credible source worth quoting over a competitor's. This category moves more slowly than the first two; authority compounds over months, not days, which is why it carries a smaller but still meaningful weighting.</p>
              <p><strong>Crawlability (15%)</strong> covers sitemap coverage, crawl budget, and bot-specific access — confirming that AI crawlers can physically reach every page you want indexed. It's weighted lowest of the four primarily because, for most established sites, this is a one-time fix rather than an ongoing optimisation surface — once your sitemap and bot access are correctly configured, this score tends to stay stable.</p>
              <p>The composite score is designed to be diagnostic, not just descriptive. A domain scoring 60 overall with a content structure score of 35 and a technical score of 90 has a very different action plan than a domain scoring 60 with the inverse — even though the headline number is identical. The category breakdown is where the actual prioritisation work happens.</p>

              <h2 id="g5">Engine-by-engine: how each AI platform actually works</h2>
              <p>The six sections below break down each major AI engine individually, because treating "AI search" as a single undifferentiated target is one of the most common and costly mistakes in early AEO practice. These systems differ substantially in how they retrieve content, what they weigh most heavily, and how mature their citation behaviour currently is — a tactic that moves the needle on Perplexity can have negligible effect on Claude, and vice versa.</p>
              <h3 id="g6">ChatGPT — how it cites and how to optimise</h3>
              <p>ChatGPT remains the dominant AI chat platform by usage, and it accounts for the largest share of AI-referred traffic of any single engine. Its citation behaviour — both in browsing mode and in baked-in training knowledge — leans heavily on domain authority, structured data, and content that answers a question in the opening lines.</p>
              <p>Because ChatGPT operates in two distinct modes — pure language-model recall and live browsing — your optimisation strategy needs to account for both. Browsing-mode citations behave similarly to Perplexity's retrieval logic, rewarding fast, well-structured, crawlable pages. Training-data recall behaves more like long-term brand-building: the prominence and consistency of how your brand is described across the wider web at training time matters more than any single page's structure.</p>
              <EngineCard
                tag="ChatGPT / GPT-4o" tagColor="#10a37f" share="~94% of AI-referred traffic"
                weighting="High influence across all 4 scoring categories"
                citation={[
                  'Heavily favours content with high domain authority and backlinks',
                  'Browse-enabled responses cite live web sources directly in-line',
                  'Organization schema with clear topical authority gets surfaced more often',
                  'Most commercial-intent queries originate and resolve here',
                ]}
                optimize={[
                  'Lead every page with a direct, 2-sentence answer to the obvious question',
                  'Build backlinks from established, topically-relevant domains',
                  'Add Organization and Article schema sitewide',
                  'Avoid thin pages under 400 words — depth correlates with citation rate',
                ]}
              />

              <h3 id="g7">Perplexity — how it cites and how to optimise</h3>
              <p>Perplexity is a real-time retrieval engine first, a language model second. Nearly every answer it gives is grounded in live web sources it cites explicitly, which makes it the most directly "SEO-like" of the major AI engines — and also the one where technical page health has an outsized, almost immediate effect on citation rate.</p>
              <p>Because Perplexity shows its sources openly as numbered citations, it's also the easiest engine to audit manually — searching your own brand terms there reveals exactly which pages it currently trusts, in a way the more opaque training-data behaviour of other engines doesn't allow.</p>
              <EngineCard
                tag="Perplexity" tagColor="#ff6b35" share="Real-time web retrieval model"
                weighting="Strongest in Technical AEO and Crawlability"
                citation={[
                  'Retrieves and cites live web sources in every answer, with visible source links',
                  'Strongly rewards clean canonical URLs and fast page load',
                  'Penalises JavaScript-heavy pages that block real-time crawling',
                  'Surfaces content structured for scanning — subheadings, bullets, tables',
                ]}
                optimize={[
                  'Ensure Core Web Vitals are in the "Good" range — this engine is latency-sensitive',
                  'Use server-rendered HTML wherever possible, avoid client-only rendering for key content',
                  'Source and link your own factual claims to primary references',
                  'Eliminate duplicate content across parameterised URL variants',
                ]}
              />

              <h3 id="g8">Gemini — how it cites and how to optimise</h3>
              <p>Gemini is deeply integrated with Google's existing knowledge graph and Search Quality Rater guidelines, which means E-E-A-T signals and structured data carry disproportionate weight compared to other engines. If your site already performs well in Google's AI Overviews, Gemini citation tends to follow.</p>
              <p>This overlap with Google's traditional quality signals is genuinely good news for teams with existing SEO investment — Gemini is the engine where prior SEO work translates most directly into AEO performance, with less need for an entirely separate strategy.</p>
              <EngineCard
                tag="Gemini (Google)" tagColor="#4285f4" share="Google-integrated, fastest-growing"
                weighting="Strongest in Authority Signals"
                citation={[
                  "Tied closely to Google's knowledge graph and Search Quality Rater signals",
                  'E-E-A-T and schema markup have outsized influence on citation likelihood',
                  'Favours content aligned with YMYL (Your Money Your Life) quality standards',
                  'Penalises anonymous content with no author attribution',
                ]}
                optimize={[
                  'Add author bylines with linked credentials on every substantive page',
                  'Implement FAQPage, HowTo, and Article schema together, not in isolation',
                  'Ensure pages are not blocked from Google-Extended in robots.txt',
                  'Build out an About page with verifiable company and team information',
                ]}
              />

              <h3 id="g9">Claude — how it cites and how to optimise</h3>
              <p>Claude's citation behaviour leans toward precision and source quality over volume — it tends to favour fewer, more authoritative sources rather than broad coverage. Positive sentiment and clear factual accuracy in existing mentions of your brand correlate with higher Claude citation rates.</p>
              <p>This selectivity means Claude is harder to "win" through sheer content volume — publishing more pages doesn't move the needle the way it might with a more retrieval-heavy engine. What does move it is internal consistency: a domain where every page agrees with every other page on facts, figures, and claims signals the kind of reliability Claude's citation behaviour seems to reward most.</p>
              <EngineCard
                tag="Claude" tagColor="#d97706" share="Precision-weighted citation behaviour"
                weighting="Moderate across Content Structure and Authority"
                citation={[
                  'Favours fewer, higher-quality sources over broad coverage',
                  'Sensitive to factual accuracy and internal consistency within a page',
                  'Rewards content with clear definitional structure — what something is, stated plainly',
                  'Positive existing sentiment toward a brand correlates with citation likelihood',
                ]}
                optimize={[
                  'Keep factual claims internally consistent across every page on your domain',
                  'Open key pages with a clear definition before any narrative or marketing copy',
                  'Audit and correct any outdated or contradictory information sitewide',
                  'Build credible third-party mentions — Claude weighs external corroboration heavily',
                ]}
              />

              <h3 id="g10">Grok — how it cites and how to optimise</h3>
              <p>Grok draws on real-time X (Twitter) data alongside general web search, giving it a distinct bias toward trending and socially-validated content. Coverage here is currently more partial than the other five engines, but growing quickly — early positioning has real upside.</p>
              <p>Because Grok's training and integration are tied closely to the X platform itself, brands with an active, engaged X presence have a structural advantage here that doesn't directly transfer to any of the other five engines — making this the one platform where social strategy and AEO strategy meaningfully overlap.</p>
              <EngineCard
                tag="Grok" tagColor="#1da1f2" share="X-integrated, real-time signals"
                weighting="Lighter weighting — partial coverage, expanding"
                citation={[
                  'Uses real-time X data alongside standard web search',
                  'Social proof and trending content play a larger role than on other engines',
                  'Currently offers partial coverage across most signal categories',
                  'Responds well to recently-updated, timestamped content',
                ]}
                optimize={[
                  'Maintain an active presence on X with links back to key pages',
                  'Keep cornerstone content visibly updated with recent dates',
                  'Encourage genuine social discussion and shares of your content',
                  'Treat this as an emerging-coverage engine — monitor rather than over-invest yet',
                ]}
              />

              <h3 id="g11">Copilot — how it cites and how to optimise</h3>
              <p>Microsoft Copilot blends Bing's traditional search index with conversational AI, meaning classic technical SEO — sitemap health, Bing Webmaster Tools verification, and crawl accessibility — has more direct bearing here than on most other engines.</p>
              <p>Copilot is also the engine most teams neglect, largely because Bing's overall market share in traditional search is smaller than Google's. That neglect is itself an opportunity — competition for Copilot citation is measurably lower than for ChatGPT or Gemini, which means the same optimisation effort often yields a higher relative citation rate simply because fewer competitors have bothered to apply it.</p>
              <EngineCard
                tag="Copilot" tagColor="#7565d9" share="Bing-integrated hybrid search"
                weighting="Moderate, leans on classic technical SEO"
                citation={[
                  'Blends Bing search index results with conversational synthesis',
                  'Classic technical SEO factors carry more weight than on purely generative engines',
                  'Rewards sitemap completeness and verified Bing Webmaster Tools setup',
                  'Currently partial coverage on deeper sentiment and gap-analysis signals',
                ]}
                optimize={[
                  'Verify your domain in Bing Webmaster Tools if you haven\'t already',
                  'Submit a complete, current sitemap.xml and monitor crawl stats there',
                  'Apply the same schema and BLUF practices used for ChatGPT — there\'s strong overlap',
                  'Don\'t neglect this engine assuming it mirrors Google exactly — verify independently',
                ]}
              />

              <h2 id="g12">BLUF content structure</h2>
              <p>BLUF (Bottom Line Up Front) is a writing convention from military communications adapted for AI-optimised content. The rule is simple: state the most important information in the first sentence, then add supporting detail. LLMs weight the first 50–80 words of a passage 4–8x more heavily when deciding whether to cite it.</p>
              <p>For a product page, this means the first sentence should state what the product is, who it is for, and its key value proposition — not a brand story or emotive opener. The same logic applies to blog posts: open with the direct answer to the question implied by the title, then expand into nuance, caveats, and supporting detail afterward.</p>
              <p>This is harder than it sounds in practice. Most existing web copy is written to build narrative tension before revealing the point — a structure that performs poorly with AI retrieval, regardless of how well it reads to a human.</p>
              <h3>What a BLUF rewrite actually looks like</h3>
              <p>Consider a typical "About our service" opening: <em style={{fontStyle:'italic'}}>"Welcome to our platform. We've been in business since 2018 and believe deeply in quality and customer service. Our dedicated team works around the clock to ensure..."</em> By the time a reader — human or model — finishes that paragraph, no concrete information has been conveyed. A BLUF rewrite states the substance immediately: <em style={{fontStyle:'italic'}}>"We help freelance designers send and track invoices in under two minutes, with automatic payment reminders built in."</em> Everything genuinely useful from the original — founding year, team commitment, quality focus — can still appear, just after the core answer rather than before it.</p>
              <h3>BLUF varies by page type</h3>
              <p>Not every page needs identical BLUF treatment. Product and landing pages benefit most from a benefit-led opening — what outcome does the reader get. Documentation and how-to content performs best with a direct, definitional opening — what is this, stated plainly. Blog content built to capture specific search queries often performs best with a question-led structure that mirrors how a person would actually phrase the query to an AI engine. Maintaining all three styles across different page types, rather than forcing one formula everywhere, tends to produce the strongest aggregate citation rate across a domain.</p>

              <ToolCTA
                icon="✍️" eyebrow="Free tool" title="BLUF Builder"
                desc="Paste any URL and get 3 ready-to-use BLUF openings — direct, benefit-led, and question-led — written from your actual page content."
                href="/bluf-builder" cta="Generate BLUF" color="var(--cyan)"
              />

              <h2 id="g13">Schema markup for AI</h2>
              <p>FAQPage schema is the single highest-impact schema type for AI citations. Pages with FAQPage JSON-LD appear in AI Overview citations at 3.2x the rate of equivalent pages without it. HowTo schema is second, particularly for instructional content. Article and BlogPosting schema help models classify content type and extract author credentials.</p>
              <p>Organization schema, applied sitewide, gives every engine a consistent, machine-readable answer to "who is this" — name, logo, contact information, and social profiles — which compounds with E-E-A-T signals over time. BreadcrumbList schema, while less directly tied to citation rate, helps models understand site hierarchy and which pages are pillar versus supporting content.</p>
              <p>The most common failure mode isn't missing schema — it's incomplete or stale schema. A FAQPage block that doesn't match the visible on-page FAQ content, or an Article schema missing a datePublished field, can do more harm than having no schema at all, since it signals inconsistency rather than authority.</p>
              <h3>A practical schema priority order</h3>
              <p>For teams implementing schema for the first time, sequencing matters more than completeness on day one. Start with Organization schema on every page — it's the lowest-effort, highest-leverage addition since it's identical sitewide. Next, add FAQPage schema to any page that already has visible Q&A content, since this requires no new content creation, only markup. Then move to Article or Product schema on your highest-traffic pages specifically, before attempting full sitewide coverage. Trying to implement every schema type across every page simultaneously is the most common reason schema rollouts stall — a partial, correctly-implemented rollout beats an ambitious, half-finished one.</p>

              <h2 id="g14">llms.txt and robots.txt setup</h2>
              <p>Place a plain text file at <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.82em',background:'rgba(255,255,255,.06)',padding:'.15em .4em',borderRadius:'4px'}}>yourdomain.com/llms.txt</code> with bot permission declarations. At minimum, allow GPTBot, PerplexityBot, ClaudeBot, and Google-Extended unless you have a specific reason to block them. A well-formed llms.txt also signals technical maturity to engines that check for it, independent of its functional permissions.</p>
              <p>robots.txt remains equally important and is frequently misconfigured for AI crawlers specifically — many sites correctly allow Googlebot while inadvertently blocking GPTBot or PerplexityBot through an overly broad disallow rule, since these bots were added to robots.txt conventions more recently than traditional search crawlers.</p>
              <h3>The most common configuration mistakes</h3>
              <p>Three patterns account for the majority of AI-crawler misconfiguration seen across real sites. The first is a catch-all <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.82em',background:'rgba(255,255,255,.06)',padding:'.15em .4em',borderRadius:'4px'}}>Disallow: /</code> rule applied without a matching user-agent exception, which blocks every AI bot indiscriminately, often left over from a staging-environment configuration that was never updated for production. The second is an llms.txt file that exists but returns a 404 due to incorrect deployment — common on static site generators where the file wasn't placed in the actual public root directory. The third is allowing crawl access at the robots.txt level while a CDN or WAF rule silently blocks the same bots at the network layer, which means the site appears correctly configured on inspection but is still inaccessible in practice. Testing actual crawler access, not just reading the configuration file, is the only way to catch this third category.</p>

              <ToolCTA
                icon="⚡" eyebrow="Free tool" title="llms.txt Generator"
                desc="Generate a correctly formatted llms.txt file in seconds — pre-configured to allow GPTBot, PerplexityBot, ClaudeBot, and Google-Extended."
                href="/llms-text-generator" cta="Generate file" color="var(--accent)"
              />
              <ToolCTA
                icon="🤖" eyebrow="Free tool" title="Robots.txt Generator"
                desc="Build a robots.txt that correctly allows AI bots without accidentally blocking them through outdated disallow rules."
                href="/resources/robots-txt" cta="Generate file" color="var(--violet)"
              />

              <h2 id="g15">E-E-A-T for LLMs</h2>
              <p>Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) has been adopted informally by multiple LLM evaluation pipelines. Pages with clear author bylines, linked professional credentials, original research, and verifiable citations score higher on authority signals that LLMs use to decide whether to cite a source.</p>
              <p><strong>Experience</strong> shows up as first-hand detail — specific numbers, screenshots, or case studies that couldn't be written without direct involvement. <strong>Expertise</strong> is signalled through author credential markup and depth of topical coverage. <strong>Authoritativeness</strong> comes from backlink quality and external mentions in credible publications. <strong>Trustworthiness</strong> covers the basics often overlooked — SSL, a real privacy policy, transparent company ownership, and accurate, non-exaggerated claims.</p>
              <p>None of these four pillars can be faked convincingly at scale — which is precisely why they remain a durable signal even as AI-generated content becomes harder to detect by surface inspection alone.</p>
              <h3>E-E-A-T compounds — it doesn't switch on overnight</h3>
              <p>Unlike BLUF rewrites or schema additions, which can change a page's citation behaviour within days, E-E-A-T signals accumulate over a longer horizon. A single author bio added today doesn't retroactively create a track record — what matters is the consistent pattern across many pages and over time. Teams that treat E-E-A-T as a one-time checklist item rather than an ongoing practice tend to plateau; the brands seeing the strongest authority-driven citation gains are the ones publishing original research, citing primary sources, and maintaining consistent author attribution as a standing editorial policy, not a single sprint of retrofits.</p>

              <h2 id="g16">Content clusters and topical authority</h2>
              <p>A single excellent article earns one ranking. A well-built content cluster — a pillar page surrounded by interlinked spoke pages covering subtopics — earns topical authority, which is exactly what AI engines look for when deciding which domain to treat as the default source on a subject.</p>
              <p>Clusters also solve a problem isolated articles can't: they let you target both high search-volume commercial terms and the long-tail, specific questions that LLMs are most likely to quote directly, without those pages competing against each other for the same ranking signal.</p>
              <h3>Why clusters specifically help with AI citation</h3>
              <p>Retrieval-based engines like Perplexity and browsing-mode ChatGPT often pull from multiple pages on the same domain when constructing an answer, especially for broader queries — a behaviour that single isolated articles can't take advantage of, since there's nothing else on the domain to corroborate or expand the source. A properly interlinked cluster gives these engines multiple, mutually-reinforcing pages to draw from, which both increases the raw probability of any one page being selected and strengthens the model's confidence in the domain as a credible source for the topic as a whole.</p>

              <ToolCTA
                icon="🪢" eyebrow="Free tool" title="Content Cluster Map Generator"
                desc="Enter a pillar topic and get a full hub-and-spoke map — spokes, articles, and internal linking — scored for both SEO volume and AI citation potential."
                href="/topic-cluster-generator" cta="Build cluster map" color="var(--rose)"
              />

              <h2 id="g17">Competitor analysis and content gaps</h2>
              <p>The fastest way to improve your AEO score is to identify which queries your competitors get cited for that you do not. Running the same prompt set against your domain and competitor domains returns a sorted list of citation opportunities — and these tend to be the lowest-effort, highest-impact fixes available, since the content gap is already validated by a competitor's existing success.</p>
              <p>Prioritise gaps where the competitor's citing page is genuinely weak — thin content, no schema, poor BLUF structure — since these represent openings where a properly optimised page from you can realistically displace them, rather than gaps where the competitor's page is already comprehensive.</p>
              <h3>Reading a gap correctly before acting on it</h3>
              <p>Not every gap is worth closing immediately. Before committing content production resources to a competitor gap, check three things: whether the query genuinely matches your actual product or audience and isn't just adjacent, whether the competing page's strength comes from content quality or from older domain authority that's harder to replicate quickly, and whether the query appears across multiple engines or is isolated to just one — gaps that show up consistently across ChatGPT, Perplexity, and Gemini simultaneously represent a more durable opportunity than a single-engine anomaly.</p>

              <h2 id="g17b">Measuring AEO over time</h2>
              <p>A single scan tells you where you stand today. The real value of AEO measurement comes from tracking trend, not just snapshot — because both the AI engines themselves and your competitors' content are changing continuously, a static one-time audit goes stale faster than most teams expect.</p>
              <h3>What to track week over week</h3>
              <p>Beyond the headline composite score, the metrics worth watching consistently are citation count per engine, sentiment trend, and the specific queries where citation status flips from cited to not-cited or vice versa. A falling composite score with stable per-engine citation counts often indicates a technical regression — a broken schema deploy, a robots.txt change — rather than an actual loss of authority, and the two require very different responses.</p>
              <h3>Setting realistic benchmarks</h3>
              <p>Without an industry benchmark, a raw AEO score is hard to interpret in isolation — a 65 might be excellent in a niche where no competitor has invested in AEO at all, or mediocre in a category where every competitor already scores above 80. Benchmarking against your specific competitive set, not an arbitrary universal target, is what makes the score actionable rather than just a number to watch climb.</p>
              <h3>Avoiding false signal from normal variance</h3>
              <p>Because LLM outputs are inherently probabilistic, expect some week-to-week noise even with no changes on your end — the same prompt run against the same domain can return slightly different citation results from one day to the next. Drawing conclusions from a single data point, especially a single query result, is the most common measurement mistake in early AEO practice. Look for sustained directional trend across multiple scans before treating a change as meaningful, the same discipline experienced SEOs already apply to rank-tracking volatility.</p>

              <h2 id="g19b">Common AEO mistakes worth avoiding</h2>
              <p>A few patterns show up repeatedly across domains that struggle to improve their AEO score despite real effort, and they're worth naming explicitly.</p>
              <p><strong>Optimising for one engine while ignoring the rest.</strong> Teams that fixate exclusively on ChatGPT, often because it's the most visible and widely discussed engine, frequently leave significant Perplexity or Gemini citation opportunity on the table simply because the optimisation priorities genuinely differ between engines, as covered earlier in this guide.</p>
              <p><strong>Treating schema as a one-time technical task.</strong> Schema markup that goes stale — an outdated FAQ block, a missing author field on new content — quietly degrades over time as new pages are published without the same rigor applied at launch. Schema needs to be part of the standing publishing checklist, not a single retrofit project.</p>
              <p><strong>Writing for AI instead of writing better.</strong> Some teams overcorrect into content that reads as mechanically formulaic — robotic BLUF openers stacked one after another with no natural variation. The engines reward clear, genuinely useful content; they don't reward content that's obviously been engineered to game a checklist, and human readers notice the difference even when an algorithm might not flag it directly.</p>
              <p><strong>Expecting linear progress.</strong> AEO score improvement is rarely a smooth upward line. Technical fixes tend to produce a step-change improvement within weeks, while authority-driven gains accumulate gradually and can plateau for stretches before the next meaningful jump. Teams that expect steady weekly gains often abandon effective strategies prematurely, mistaking a normal plateau for a failed approach.</p>

              <h2 id="g18">Your 30-day AEO action plan</h2>
              <p>The sequencing below reflects effort-to-impact ratio, not arbitrary scheduling — earlier weeks target the fixes with the shortest path between action and measurable result, later weeks build the foundations that compound over a longer horizon.</p>
              <h3>Week 1 — Audit</h3>
              <p>Run a full scan of your domain, fix any missing or malformed llms.txt and robots.txt issues immediately — these are the cheapest, highest-leverage fixes available and often take under an hour combined. Document your baseline AEO score and the category breakdown across content structure, technical AEO, authority, and crawlability, since this becomes your reference point for measuring everything that follows. Identify your three lowest-scoring categories specifically — these determine where the rest of the month's effort should concentrate.</p>
              <h3>Week 2 — Structure</h3>
              <p>Rewrite the opening two sentences of your 10 highest-traffic pages using BLUF structure. Add or correct FAQPage and Organization schema sitewide, prioritising pages that already have visible FAQ content but lack the matching schema markup. By the end of this week, your content structure score should show measurable improvement even before any new content has been published, since this is purely a restructuring exercise on existing pages.</p>
              <h3>Week 3 — Authority</h3>
              <p>Add author bylines and credentials where missing. Identify and fix the 3 highest-priority content gaps against your closest competitor, prioritising gaps where the competing page is structurally weak. This is also the right week to audit factual consistency across your domain — contradictory claims between pages actively undermine the authority signals you're trying to build elsewhere.</p>
              <h3>Week 4 — Scale</h3>
              <p>Build one content cluster around your most commercially important topic. Re-scan your domain and compare against your Week 1 baseline to confirm measurable movement. Treat this re-scan as the start of an ongoing cadence rather than a one-time check — weekly or biweekly scans from this point forward let you catch regressions early, particularly after site redesigns or CMS migrations, which are a common and underappreciated cause of AEO score drops.</p>
              <h3>What "done" looks like after 30 days</h3>
              <p>A realistic 30-day outcome is not a transformed AEO score — it's a domain with the technical and structural foundations correctly in place, ready for the slower-moving authority signals to compound from a clean baseline. Teams expecting a dramatic score jump within the first month are usually measuring against the wrong timeline; the real value of this plan is eliminating every fast, fixable issue so that subsequent effort goes entirely toward the harder, longer-horizon work of building genuine authority.</p>

              <h2 id="g19">Frequently asked questions</h2>
              <h3>How long does AEO take to show results?</h3>
              <p>Most domains see measurable citation changes within 3-6 weeks of fixing technical issues like llms.txt and schema. Authority-driven improvements — backlinks, E-E-A-T signals — typically take longer, in the range of 2-4 months, similar to traditional SEO timelines.</p>
              <h3>Does AEO replace SEO?</h3>
              <p>No. AEO builds on the same technical and content foundations as SEO and adds citation-specific signals on top. A site with poor SEO fundamentals will struggle with AEO regardless of how well it implements the practices in this guide.</p>
              <h3>Which engine should I prioritise first?</h3>
              <p>For most brands, ChatGPT and Perplexity offer the highest combined reach and the clearest, most actionable optimisation signals — start there, then extend the same fixes to Gemini and Copilot, which share significant overlap in what they reward.</p>
              <h3>Can I track AEO progress the same way I track SEO rankings?</h3>
              <p>Not with the same tools. Traditional rank trackers have no visibility into AI citation behaviour. This is the specific gap a dedicated AEO scanner addresses — running consistent prompt sets against your domain over time and tracking the resulting citation rate, sentiment, and engine-by-engine breakdown the same way a rank tracker would track keyword position.</p>
              <h3>Do I need separate content for AI engines versus human readers?</h3>
              <p>No, and attempting this is usually counterproductive. The same structural principles that improve AI citation — clear answers up front, accurate facts, genuine depth — also improve human readability and traditional SEO performance. AEO is best understood as writing better, more direct content for everyone, not a separate parallel content stream written exclusively for machines.</p>

            </article>
          </div>
        </div>

        <SharedFooter />
      </div>
    </>
  )
}