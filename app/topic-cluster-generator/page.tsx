// app/topic-cluster-generator/page.tsx — SERVER COMPONENT
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'
import SubNavClient from '@/components/SubNavClient'
import ClusterMapClient from '@/components/ClusterMapClient'
import ClusterFAQClient from '../../components/ClusterFAQClient'

export const metadata = {
  title: 'AI Content Cluster Map Generator — Notion Cue',
  description: 'Build a complete hub-and-spoke content cluster scored for both SEO search volume and AI citation potential. Free tool — enter a topic, get a full content map.',
  openGraph: {
    title: 'AI Content Cluster Map Generator',
    description: 'Generate pillar pages, spokes, and articles scored for AEO and SEO in one map.',
    type: 'website',
  },
}

const HOW_STEPS = [
  { n: '01', icon: '🎯', title: 'Pillar validation', desc: 'Checks whether the topic has enough fragmented search intent — multiple content types ranking on page one — to justify a full cluster, rather than a single article.' },
  { n: '02', icon: '🪢', title: 'Spoke generation', desc: 'Identifies five distinct subtopics that each deserve their own page, based on semantic relevance to the pillar rather than simple keyword matching.' },
  { n: '03', icon: '📄', title: 'Article mapping', desc: 'Expands every spoke into 5–7 specific article ideas, each with a primary keyword target ready to brief or write.' },
  { n: '04', icon: '🔗', title: 'Linking & risk audit', desc: "Builds the internal link map between pillar, spokes, and articles, and flags any topics at risk of cannibalising each other's rankings." },
]

const FAQS = [
  { q: 'How is this different from keyword research tools?', a: 'Traditional keyword tools group phrases by shared words or shared ranking URLs. This tool maps topics by semantic relevance and search intent, then scores every resulting page for AI citation potential alongside standard SEO metrics — a layer most keyword tools don\'t address at all.' },
  { q: 'How many spokes and articles should a cluster have?', a: 'This tool generates 5 spokes with 5–7 articles each as a strong starting structure — large enough to establish topical depth, small enough to execute without overextending content production. Clusters can grow over time as new subtopics emerge.' },
  { q: 'What is keyword cannibalization and why does it matter?', a: 'Cannibalization happens when several pages target the same intent. Search engines and AI engines can\'t tell which page you actually want to rank, so they split signals across all of them — and none performs as well as one strong page would. The fix is usually to consolidate the weakest pages or narrow one to a more specific subtopic.' },
  { q: 'Should I publish the whole cluster at once?', a: 'No — roll out in phases. Launch the pillar page plus your three highest-priority spokes first, submit those URLs to Search Console immediately, then publish the rest over the following two to three weeks. Audit internal links once everything is live so no spoke is left orphaned.' },
  { q: 'Does a higher AEO score guarantee an AI citation?', a: 'No tool can guarantee citation — AEO score reflects citation potential based on intent type and structural fit, not a promise. Actual citation also depends on execution: BLUF structure, schema markup, page authority, and crawlability all affect whether an AI engine ultimately cites a given page.' },
  { q: 'Is this tool free to use?', a: 'Yes — generate cluster maps for any topic at no cost. Full Notion Cue accounts add saved cluster history, competitor cluster comparison, and direct integration with the AEO scoring dashboard.' },
]

export default function ClusterMapPage() {
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
          --text:#ffffff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;--green:#4ade80;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        input:focus,button:focus{outline:none}
        .step-card:hover{background:rgba(255,255,255,.03)!important;border-color:var(--border-h)!important}
        .step-card:hover .step-icon{transform:scale(1.08)}
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
          <div style={{padding:'3rem 0 5rem',borderBottom:'1px solid var(--border)'}}>
            <ClusterMapClient />
          </div>

          {/* ── WHAT IS A CLUSTER — intro + visual diagram ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>What it is</div>
                <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                  One pillar.<br/><span style={{color:'var(--muted)'}}>A web of authority.</span>
                </h2>
                <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8,marginBottom:'1rem'}}>
                  A content cluster is a group of related pages built around one core topic — a pillar page that covers the subject broadly, linked to spoke pages that each go deep on a subtopic. Instead of articles competing with each other, you get a connected web search engines and AI engines read as a single source of authority.
                </p>
                <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                  A single article earns one ranking. A well-built cluster earns <strong style={{color:'var(--text)',fontWeight:500}}>topical authority</strong> — exactly what ChatGPT, Perplexity, and Gemini look for when deciding which domain to cite.
                </p>
              </div>

              {/* Visual hub-and-spoke diagram */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg viewBox="0 0 320 320" style={{width:'100%',maxWidth:'320px'}}>
                  {/* connecting lines */}
                  <line x1="160" y1="160" x2="160" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  <line x1="160" y1="160" x2="265" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  <line x1="160" y1="160" x2="280" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  <line x1="160" y1="160" x2="160" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  <line x1="160" y1="160" x2="40" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  <line x1="160" y1="160" x2="55" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
                  {/* lateral link example */}
                  <line x1="265" y1="95" x2="280" y2="220" stroke="rgba(123,108,255,0.25)" strokeWidth="1" strokeDasharray="3 3"/>

                  {/* spokes */}
                  {[[160,40],[265,95],[280,220],[160,280],[40,220],[55,95]].map(([x,y],i)=>(
                    <g key={i}>
                      <circle cx={x} cy={y} r="22" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"/>
                    </g>
                  ))}

                  {/* pillar center */}
                  <circle cx="160" cy="160" r="38" fill="rgba(200,242,71,0.1)" stroke="var(--accent)" strokeWidth="2"/>
                  <text x="160" y="155" textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="0.05em">PILLAR</text>
                  <text x="160" y="168" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="JetBrains Mono">hub page</text>
                </svg>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS — numbered step cards ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2.5rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>How it works</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',maxWidth:'600px'}}>
                One topic in.<br/><span style={{color:'var(--muted)'}}>A full content map out.</span>
              </h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'var(--border)',borderRadius:'16px',overflow:'hidden',border:'1px solid var(--border)'}}>
              {HOW_STEPS.map(step=>(
                <div key={step.n} className="step-card" style={{background:'var(--card)',padding:'2rem 1.5rem',transition:'all .25s'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
                    <span className="step-icon" style={{fontSize:'1.3rem',transition:'transform .25s',display:'inline-block'}}>{step.icon}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted2)'}}>{step.n}</span>
                  </div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',marginBottom:'.6rem'}}>{step.title}</div>
                  <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.65}}>{step.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SEO vs AEO — comparison cards ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2.5rem',maxWidth:'700px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Why two scores</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                Search volume and<br/><span style={{color:'var(--muted)'}}>citation potential aren't the same thing.</span>
              </h2>
              <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                A topic can have high search volume but low AI citation potential — broad commercial terms LLMs rarely quote directly. The reverse is common too: specific how-to content with modest volume that LLMs cite constantly because it answers a question cleanly in the first two sentences.
              </p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
              <div style={{background:'var(--card)',border:'1px solid rgba(34,211,238,.2)',borderRadius:'14px',padding:'2rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'1rem'}}>
                  <span style={{width:'10px',height:'10px',borderRadius:'50%',background:'var(--cyan)',display:'inline-block'}} />
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.1rem'}}>SEO score</span>
                </div>
                <p style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.7,marginBottom:'1.25rem'}}>
                  Estimated relative search volume and competitive ranking potential in traditional search results.
                </p>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'var(--muted2)',borderTop:'1px solid var(--border)',paddingTop:'1rem'}}>
                  Drives → <span style={{color:'var(--cyan)'}}>traffic volume</span>
                </div>
              </div>

              <div style={{background:'var(--card)',border:'1px solid rgba(200,242,71,.25)',borderRadius:'14px',padding:'2rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'1rem'}}>
                  <span style={{width:'10px',height:'10px',borderRadius:'50%',background:'var(--accent)',display:'inline-block'}} />
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.1rem'}}>AEO score</span>
                </div>
                <p style={{fontSize:'.88rem',color:'var(--muted)',lineHeight:1.7,marginBottom:'1.25rem'}}>
                  Estimated likelihood that AI engines cite or quote this content, based on intent type and how directly the topic answers a specific question.
                </p>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',color:'var(--muted2)',borderTop:'1px solid var(--border)',paddingTop:'1rem'}}>
                  Drives → <span style={{color:'var(--accent)'}}>AI citation signals</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── CANNIBALIZATION + ROLLOUT — compact side by side ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem'}}>
                <div style={{fontSize:'1.3rem',marginBottom:'1rem'}}>⚠️</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',marginBottom:'.75rem'}}>Avoiding cannibalization</div>
                <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.75}}>
                  When two pages target the same intent, engines split authority across both — and neither ranks as well as one consolidated page would. The tool flags overlap automatically and suggests whether to consolidate, differentiate, or restructure before you publish.
                </p>
              </div>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'2rem'}}>
                <div style={{fontSize:'1.3rem',marginBottom:'1rem'}}>🚀</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.05rem',marginBottom:'.75rem'}}>Rolling out in phases</div>
                <p style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.75}}>
                  Launch the pillar with your top 3 spokes first, submit to Search Console immediately, then roll out the rest over following weeks. Audit internal links after — an orphaned spoke earns none of the pillar's authority.
                </p>
              </div>
            </div>
          </section>

          {/* ── HOW AI IDENTIFIES CLUSTERS — method cards ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2.5rem',maxWidth:'700px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>The methods</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                How AI decides<br/><span style={{color:'var(--muted)'}}>what belongs together.</span>
              </h2>
              <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                Traditional clustering groups keywords by shared words — string matching. AI clustering groups by shared meaning. Three methods do the heavy lifting:
              </p>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem'}}>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--cyan)',background:'rgba(34,211,238,.08)',border:'1px solid rgba(34,211,238,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Signal-based</span>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',margin:'1rem 0 .6rem'}}>SERP-based clustering</div>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7}}>
                  Groups keywords by the URLs already ranking for them. If Google consistently surfaces the same pages for two different queries, those queries usually belong in the same cluster — a strong signal, though one to treat as a signal rather than an absolute rule.
                </p>
              </div>

              <div style={{background:'var(--card)',border:'1px solid rgba(200,242,71,.2)',borderRadius:'14px',padding:'1.75rem'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',background:'rgba(200,242,71,.08)',border:'1px solid rgba(200,242,71,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>What we use</span>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',margin:'1rem 0 .6rem'}}>Semantic embedding clustering</div>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7}}>
                  Uses the same vector-embedding language models that power ChatGPT and Claude to find deeper conceptual links. It recognises that two topics belong together even when they share zero keywords — reading context, not characters.
                </p>
              </div>

              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--rose)',background:'rgba(244,114,182,.08)',border:'1px solid rgba(244,114,182,.2)',padding:'.2rem .55rem',borderRadius:'4px'}}>Intent-based</span>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',margin:'1rem 0 .6rem'}}>Intent clustering</div>
                <p style={{fontSize:'.83rem',color:'var(--muted)',lineHeight:1.7}}>
                  Goes past raw search volume to group keywords by what the searcher actually wants — information, a comparison, or a solution. Keeps the cluster aligned with the full buyer journey instead of over-indexing on whatever has the biggest volume.
                </p>
              </div>
            </div>
          </section>

          {/* ── LINKING MAP EXAMPLE — real table ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2rem',maxWidth:'700px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>The output</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                A linking map,<br/><span style={{color:'var(--muted)'}}>built before you write a word.</span>
              </h2>
              <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                Every spoke links back to the pillar. The pillar links out to every spoke. Lateral links connect spokes where a reader on one page has obvious reasons to land on another. Mapping this first keeps the cluster coherent as it scales.
              </p>
            </div>

            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'1.4fr 1.2fr 1fr 1.4fr',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
                {['Target keyword','Target URL','Parent pillar','Lateral spoke links'].map(h=>(
                  <div key={h} style={{padding:'.85rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{h}</div>
                ))}
              </div>
              {[
                {kw:'Content marketing for SaaS', url:'/content-marketing-saas', parent:'—', lateral:'all spokes', pillar:true},
                {kw:'SaaS content strategy', url:'/saas-content-strategy', parent:'/content-marketing-saas', lateral:'SaaS blog best practices, B2B SaaS SEO', pillar:false},
                {kw:'Content marketing ROI for SaaS', url:'/content-marketing-roi-saas', parent:'/content-marketing-saas', lateral:'SaaS content strategy', pillar:false},
              ].map((row,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'1.4fr 1.2fr 1fr 1.4fr',borderBottom:i<2?'1px solid rgba(255,255,255,.04)':'none'}}>
                  <div style={{padding:'.9rem 1.25rem',fontSize:'.82rem',color:row.pillar?'var(--accent)':'var(--text)',fontWeight:row.pillar?600:400}}>{row.kw}</div>
                  <div style={{padding:'.9rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--cyan)'}}>{row.url}</div>
                  <div style={{padding:'.9rem 1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.72rem',color:'var(--muted2)'}}>{row.parent}</div>
                  <div style={{padding:'.9rem 1.25rem',fontSize:'.78rem',color:'var(--muted)'}}>{row.lateral}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── HYBRID APPROACH — split callout ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
              <div style={{background:'rgba(123,108,255,.05)',border:'1px solid rgba(123,108,255,.25)',borderRadius:'14px',padding:'2.25rem'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'1rem'}}>What AI handles</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.7rem'}}>
                  {['Research and data parsing across hundreds of pages','Semantic mapping of pillar, spokes, and articles','First-draft outlining and keyword targeting','Cannibalization detection across the whole library'].map(t=>(
                    <li key={t} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.85rem',color:'var(--muted)',lineHeight:1.6}}>
                      <span style={{color:'var(--violet)',flexShrink:0,marginTop:'.1rem'}}>✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{background:'rgba(200,242,71,.05)',border:'1px solid rgba(200,242,71,.25)',borderRadius:'14px',padding:'2.25rem'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--accent)',marginBottom:'1rem'}}>What stays yours</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.7rem'}}>
                  {['Editorial direction and which spokes actually ship','Original research, data, and real customer examples','Business priorities and final publish decisions','A point of view a model can\'t manufacture on its own'].map(t=>(
                    <li key={t} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.85rem',color:'var(--muted)',lineHeight:1.6}}>
                      <span style={{color:'var(--accent)',flexShrink:0,marginTop:'.1rem'}}>✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.75rem',color:'var(--muted2)',lineHeight:1.7,textAlign:'center',marginTop:'1.5rem'}}>
              The durable approach is hybrid. Neither half is optional.
            </p>
          </section>

          {/* ── MEASURING ROI — stat cards ── */}
          <section style={{padding:'5rem 0',borderBottom:'1px solid var(--border)'}}>
            <div style={{marginBottom:'2.5rem',maxWidth:'700px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>Measuring it</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,3vw,2.6rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem'}}>
                What to track once<br/><span style={{color:'var(--muted)'}}>the cluster is live.</span>
              </h2>
              <p style={{fontSize:'.95rem',color:'var(--muted)',lineHeight:1.8}}>
                Don't obsess over single-keyword wobble. Track the cluster as a group, and set expectations early — organic results are gradual.
              </p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem'}}>
              {[
                {label:'Topical authority', desc:'Rising average position for the cluster as a whole — not one keyword in isolation.', icon:'📈'},
                {label:'Internal link engagement', desc:'Whether readers actually move through the pathways you built between pillar and spokes.', icon:'🧭'},
                {label:'4–6 month horizon', desc:'Typical time for a new cluster to establish real authority — sometimes longer in competitive niches.', icon:'⏳'},
              ].map(s=>(
                <div key={s.label} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.75rem',textAlign:'center'}}>
                  <div style={{fontSize:'1.5rem',marginBottom:'.85rem'}}>{s.icon}</div>
                  <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',marginBottom:'.6rem'}}>{s.label}</div>
                  <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.65}}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ — accordion, matches homepage pattern ── */}
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