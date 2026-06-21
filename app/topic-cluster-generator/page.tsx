// app/cluster-map/page.tsx — SERVER COMPONENT
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import ClusterMapClient from '@/components/ClusterMapClient'

export const metadata = {
  title: 'AI Content Cluster Map Generator — Notion Cue',
  description: 'Build a complete hub-and-spoke content cluster scored for both SEO search volume and AI citation potential. Free tool — enter a topic, get a full content map.',
  openGraph: {
    title: 'AI Content Cluster Map Generator',
    description: 'Generate pillar pages, spokes, and articles scored for AEO and SEO in one map.',
    type: 'website',
  },
}

export default function ClusterMapPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is this different from keyword research tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional keyword tools group phrases by shared words or shared ranking URLs. This tool maps topics by semantic relevance and search intent, then scores every resulting page for AI citation potential alongside standard SEO metrics."
        }
      },
      {
        "@type": "Question",
        "name": "How many spokes and articles should a cluster have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This tool generates 5 spokes with 5-7 articles each as a strong starting structure — large enough to establish topical depth, small enough to execute without overextending content production."
        }
      },
      {
        "@type": "Question",
        "name": "Does a higher AEO score guarantee an AI citation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No tool can guarantee citation — AEO score reflects citation potential based on intent type and structural fit, not a promise. Actual citation also depends on execution: BLUF structure, schema markup, page authority, and crawlability."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — generate cluster maps for any topic at no cost. Full Notion Cue accounts add saved cluster history, competitor cluster comparison, and direct integration with the AEO scoring dashboard."
        }
      }
    ]
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
          --text:#ffffff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        input:focus,button:focus{outline:none}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.5rem;letter-spacing:-.02em;margin:2.5rem 0 .75rem;color:var(--text)}
        .prose h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.1rem;margin:2rem 0 .5rem;color:var(--text)}
        .prose p{font-size:.93rem;color:var(--muted);line-height:1.85;margin-bottom:1rem}
        .prose ul,.prose ol{padding-left:1.5rem;margin-bottom:1rem}
        .prose li{font-size:.9rem;color:var(--muted);line-height:1.75;margin-bottom:.35rem}
        .prose strong{color:var(--text);font-weight:500}
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
              Content Cluster<br/><span style={{color:'var(--accent)'}}>Map Generator</span>
            </h1>
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'600px'}}>
              Enter a pillar topic and get a full hub-and-spoke content map — spokes, articles, internal linking structure, and cannibalization risks. Every page scored for both traditional SEO volume and AI citation potential.
            </p>
          </div>

          {/* Tool */}
          <div style={{padding:'3rem 0 4rem',borderBottom:'1px solid var(--border)'}}>
            <ClusterMapClient />
          </div>

          {/* ── SEO/AEO CONTENT — static SSR for indexing ── */}
          <article className="prose" style={{padding:'5rem 0 6rem',maxWidth:'820px'}}>

            <h2 id="what-is">What is a content cluster?</h2>
            <p>A content cluster is a group of related pages organised around one core topic — a pillar page that covers the subject broadly, linked to a set of spoke pages that each go deep on a specific subtopic. Instead of publishing standalone articles that compete with each other for the same keywords, a cluster builds a connected web of content that search engines and AI engines can read as a single source of authority.</p>
            <p>Where a single article earns one ranking, a well-built cluster earns topical authority — and topical authority is exactly what AI engines like ChatGPT, Perplexity, and Gemini look for when deciding which domain to cite in an answer.</p>

            <h2 id="how-it-works">How the Content Cluster Map Generator works</h2>
            <p>Enter a single pillar topic and the tool runs a four-step process automatically:</p>
            <ul>
              <li><strong>Pillar validation</strong> — checks whether the topic has enough fragmented search intent (multiple content types ranking on page one) to justify a full cluster, rather than a single article.</li>
              <li><strong>Spoke generation</strong> — identifies 5 distinct subtopics that each deserve their own page, based on semantic relevance to the pillar rather than simple keyword matching.</li>
              <li><strong>Article mapping</strong> — expands every spoke into 5-7 specific article ideas, each with a primary keyword target.</li>
              <li><strong>Linking and risk audit</strong> — builds the internal link map between pillar, spokes, and articles, and flags any topics at risk of cannibalising each other's rankings.</li>
            </ul>

            <h2 id="seo-vs-aeo">Why every page gets two scores: SEO and AEO</h2>
            <p>Most clustering tools score topics by search volume alone. That misses half the picture in 2026. A topic can have high search volume but low AI citation potential — broad commercial terms that LLMs rarely quote directly, sending users to a results page instead of a specific answer. The reverse is also common: specific how-to or comparison content with modest search volume that LLMs cite constantly because it answers a question cleanly in the first two sentences.</p>
            <p>The Content Cluster Map Generator scores every spoke and article on both dimensions independently:</p>
            <ul>
              <li><strong>SEO score</strong> — estimated relative search volume and competitive ranking potential in traditional search.</li>
              <li><strong>AEO score</strong> — estimated likelihood that AI engines cite or quote content built around this topic, based on intent type, content structure fit, and how directly the topic answers a specific question.</li>
            </ul>
            <p>A strong cluster strategy targets a mix of both — high-SEO spokes to drive traffic volume, and high-AEO articles to build the citation signals that compound into AI search visibility over time.</p>

            <h2 id="cannibalization">Avoiding keyword cannibalization</h2>
            <p>Cannibalization happens when two or more pages on the same site target the same search intent. Search engines and AI engines can't tell which page you want ranked, so they split authority across all of them — and none performs as well as one consolidated page would. The tool flags cannibalization risk automatically by comparing intent overlap between spokes and articles, and suggests whether to consolidate, differentiate, or restructure the affected pages before you publish.</p>

            <h2 id="rollout">Rolling out a cluster in phases</h2>
            <p>Publishing an entire cluster at once is rarely the right move. The recommended approach is to launch the pillar page alongside the three highest-priority spokes first, submit those URLs to Google Search Console immediately, then roll out the remaining spokes over the following weeks. Once everything is live, an internal link audit ensures no spoke is left orphaned — a page with no inbound links from the rest of the cluster earns none of the pillar's authority, regardless of how good the content itself is.</p>

            <h2 id="faq">Frequently asked questions</h2>

            <h3>How is this different from keyword research tools?</h3>
            <p>Traditional keyword tools group phrases by shared words or shared ranking URLs. This tool maps topics by semantic relevance and search intent, then scores every resulting page for AI citation potential alongside standard SEO metrics — a layer most keyword tools don't address at all.</p>

            <h3>How many spokes and articles should a cluster have?</h3>
            <p>This tool generates 5 spokes with 5-7 articles each as a strong starting structure — large enough to establish topical depth, small enough to execute without overextending content production. Clusters can grow over time as new subtopics emerge.</p>

            <h3>Does a higher AEO score guarantee an AI citation?</h3>
            <p>No tool can guarantee citation — AEO score reflects citation potential based on intent type and structural fit, not a promise. Actual citation also depends on execution: BLUF structure, schema markup, page authority, and crawlability all affect whether an AI engine ultimately cites a given page.</p>

            <h3>Is this tool free to use?</h3>
            <p>Yes — generate cluster maps for any topic at no cost. Full Notion Cue accounts add saved cluster history, competitor cluster comparison, and direct integration with the AEO scoring dashboard.</p>

          </article>

        </div>

        <SharedFooter />
      </div>
    </>
  )
}