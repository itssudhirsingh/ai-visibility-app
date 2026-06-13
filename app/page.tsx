// app/page.tsx — SERVER COMPONENT (no 'use client')
import { Suspense } from 'react'
import HeroClient from '@/components/HeroClient'
import FAQClient from '@/components/FAQClient'
import SharedHeader from '@/components/SharedHeader'
import SharedFooter from '@/components/SharedFooter'

// All static data lives here in the server component
const MARQUEE = ['ChatGPT Citations','Perplexity Mentions','Gemini Visibility','Grok Indexing','Bing Copilot','Claude AI','AEO Score','BLUF Content','llms.txt','E-E-A-T Signals','Schema Validation','Citation Tracking']

const FEATURES = [
  { icon:'🧠', title:'LLM Citation Tracking', desc:'Monitor how often and in what context your domain is cited across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Updated daily.', tag:'Core', c:'rgba(200,242,71,.2)' },
  { icon:'📈', title:'AEO Score', desc:'A single composite score from 0–100 measuring your overall AI engine visibility, built from citation frequency, sentiment, authority, and content structure signals.', tag:'Scoring', c:'rgba(123,108,255,.2)' },
  { icon:'🔍', title:'Content Gap Analysis', desc:"Discover which questions your competitors get cited for that you don't. Get a prioritised list of BLUF-structured content topics to close the gap.", tag:'Strategy', c:'rgba(34,211,238,.2)' },
  { icon:'⚡', title:'llms.txt Validator', desc:'Check if your llms.txt file exists, is correctly formatted, and is being respected by major crawlers. Get a one-click fix template if issues are found.', tag:'Technical', c:'rgba(244,114,182,.2)' },
  { icon:'🏆', title:'Competitor Benchmarking', desc:'Add up to 10 competitor domains and see how your AI visibility score compares across every LLM, keyword category, and content vertical.', tag:'Intelligence', c:'rgba(74,222,128,.2)' },
  { icon:'📬', title:'Weekly Alert Reports', desc:'Receive a curated email digest every Monday with changes in your citation count, new competitor movements, and the top 3 action items for that week.', tag:'Monitoring', c:'rgba(251,191,36,.2)' },
]

const PLANS = [
  { plan:'Free', price:'0', desc:'Perfect for checking your own site and seeing where you stand.', features:['1 domain scan per day','AEO score for 3 LLMs','Basic citation count','llms.txt validator','7-day history'], cta:'Get started free', href:'/dashboard', featured:false },
  { plan:'Pro', price:'49', desc:'For SEO professionals managing client sites and their own brands.', features:['10 domains included','All 6 LLMs tracked daily','Full citation context + sentiment','Competitor benchmarking (up to 5)','Content gap analysis','Weekly email digest reports','90-day history','CSV/PDF exports'], cta:'Start 14-day free trial', href:'/dashboard', featured:true },
  { plan:'Agency', price:'149', desc:'For agencies managing multiple client accounts at scale.', features:['Unlimited domains','All 6 LLMs + custom prompt testing','White-label reports for clients','Unlimited competitor tracking','API access (coming soon)','Priority Slack support','365-day history'], cta:'Contact sales', href:'/resources/contact', featured:false },
]

const FAQS = [
  { q:'What exactly is AEO and why does it matter now?', a:'AEO (Answer Engine Optimisation) is the practice of making your content visible and citable within AI-generated answers from tools like ChatGPT, Gemini, and Perplexity. As more users skip Google and go straight to AI assistants for answers, being cited in those answers is becoming as important as ranking on page one.' },
  { q:'How do you check if an LLM has cited my site?', a:'We run thousands of relevant prompts across each LLM engine, spanning categories relevant to your niche. We record whether your domain appears in the response, the context it appears in, and the sentiment of the mention.' },
  { q:'Is this different from tracking AI Overviews in Google Search Console?', a:"Yes. GSC tracks your visibility in Google's traditional search results. Notion Cue tracks your visibility in standalone AI chat tools like ChatGPT, Perplexity, and Gemini that have hundreds of millions of direct users who never go near Google Search." },
  { q:'What is llms.txt and why should I care?', a:'llms.txt is an emerging standard (similar to robots.txt) that tells AI crawlers how to access and use your content. Sites with a well-structured llms.txt file signal authority and crawlability to LLM training pipelines.' },
  { q:'Can I track competitor domains on the free plan?', a:'Competitor tracking is available on Pro and Agency plans. The free plan allows you to scan your own domain and see how you compare to the industry average in your niche.' },
]

export const metadata = {
  title: 'Notion Cue — AI Visibility Intelligence Platform',
  description: 'Track how often your website gets cited by ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude. Get your AEO score in 30 seconds.',
  openGraph: {
    title: 'Notion Cue — AI Visibility Intelligence Platform',
    description: 'See how visible your brand is to AI engines. Scan your domain free.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--bg2:#070613;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ffffff;--muted:rgba(255,255,255,0.75);--muted2:rgba(255,255,255,0.4);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--rose:#f472b6;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spinR{to{transform:rotateX(70deg) rotateZ(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes lineGrow{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        a{color:inherit;text-decoration:none}
        input:focus,button:focus{outline:none}
        button{cursor:pointer;font-family:inherit}
        .feat-card:hover{background:rgba(255,255,255,.03)!important}
        .feat-card:hover .feat-title{color:var(--accent)}
        .price-card{transition:all .3s}
        .price-card:hover{transform:translateY(-4px);border-color:var(--border-h)!important}
        .faq-q:hover{color:var(--accent)}
        .nav-link:hover{color:var(--text)!important}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)',fontFamily:"'Epilogue',sans-serif"}}>

        <SharedHeader />

        {/* ── HERO — client island (canvas + form) ── */}
        <Suspense fallback={<div style={{minHeight:'100vh',background:'var(--bg)'}} />}>
          <HeroClient />
        </Suspense>

        {/* ── MARQUEE — fully static ── */}
        <div style={{overflow:'hidden',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'var(--bg2)',padding:'1rem 0'}}>
          <div style={{display:'flex',width:'max-content',animation:'marquee 28s linear infinite'}}>
            {[...MARQUEE,...MARQUEE].map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'1.2rem',padding:'0 2.5rem',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)'}}>
                <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--accent)',display:'inline-block'}} />{t}
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS — static ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderBottom:'1px solid var(--border)',background:'var(--bg2)'}}>
          {[
            {num:'2.4',suf:'B',label:'AI queries processed daily across tracked LLMs'},
            {num:'94',suf:'%',label:'Of top-cited domains have structured AEO signals'},
            {num:'6',suf:'x',label:'More organic trust from AI-cited pages vs non-cited'},
            {num:'30',suf:'s',label:'Average time to get your full AI visibility report'},
          ].map((s,i)=>(
            <div key={i} style={{padding:'3rem 2.5rem',borderRight:i<3?'1px solid var(--border)':'none'}}>
              <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.2rem,3.5vw,3.5rem)',lineHeight:1,color:'#fff',letterSpacing:'-.02em',marginBottom:'.4rem'}}>
                {s.num}<span style={{color:'var(--accent)',fontSize:'.6em'}}>{s.suf}</span>
              </div>
              <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS — static ── */}
        <section id="how-it-works" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
                01 — How it works<span style={{width:'32px',height:'1px',background:'var(--border)',display:'inline-block'}} />
              </div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
                From URL to<br/><span style={{color:'var(--muted)'}}>full AI audit</span><br/>in seconds.
              </h2>
              <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px',marginBottom:'3rem'}}>No integrations. No API keys. Just paste your domain and we run a deep scan across every major LLM.</p>
              <div>
                {[
                  {icon:'🔗',title:'Paste your URL',desc:'Enter any domain or specific page URL. We analyse your entire site architecture, content structure, schema markup, and llms.txt status.'},
                  {icon:'🤖',title:'We query 6 LLMs',desc:'Our engine fires thousands of niche prompts across ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude to check where your brand appears.'},
                  {icon:'📊',title:'Get your AEO score',desc:'Receive a full breakdown — citation frequency, sentiment, competitor gaps, and a prioritised fix list to improve your AI visibility fast.'},
                  {icon:'🚀',title:'Track weekly changes',desc:'Monitor your AI presence over time with weekly automated scans, email alerts when citations change, and competitor benchmark reports.'},
                ].map((step,i)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'56px 1fr',gap:'1.5rem',padding:'1.75rem 0',borderBottom:'1px solid var(--border)',borderTop:i===0?'1px solid var(--border)':'none'}}>
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'.25rem'}}>
                      <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.95rem'}}>{step.icon}</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.05rem',marginBottom:'.3rem'}}>{step.title}</div>
                      <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.65}}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Orbital widget — pure CSS, no JS needed */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:'360px',height:'360px',position:'relative',perspective:'900px',display:'flex',alignItems:'center',justifyContent:'center',animation:'floatY 7s ease-in-out infinite'}}>
                {[{size:'100%',color:'rgba(34,211,238,.2)',dur:'12s',dir:'normal'},{size:'72%',color:'rgba(200,242,71,.3)',dur:'9s',dir:'reverse'},{size:'50%',color:'rgba(123,108,255,.4)',dur:'7s',dir:'normal'}].map((r,i)=>(
                  <div key={i} style={{position:'absolute',width:r.size,height:r.size,borderRadius:'50%',border:`1px solid ${r.color}`,transform:'rotateX(70deg)',animation:`spinR ${r.dur} linear infinite`,animationDirection:r.dir as any}} />
                ))}
                <div style={{position:'relative',zIndex:2,width:'100px',height:'100px',background:'rgba(200,242,71,.1)',border:'1px solid rgba(200,242,71,.4)',borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 0 60px rgba(200,242,71,.15)'}}>
                  <span style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1.8rem',color:'var(--accent)',lineHeight:1}}>91</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.55rem',color:'var(--muted2)',letterSpacing:'.1em'}}>AEO SCORE</span>
                </div>
                {[{label:'ChatGPT',top:'-10px',left:'50%',transform:'translateX(-50%)'},{label:'Perplexity',top:'50%',right:'-20px',transform:'translateY(-50%)'},{label:'Gemini',bottom:'-10px',left:'50%',transform:'translateX(-50%)'},{label:'Claude',top:'50%',left:'-20px',transform:'translateY(-50%)'}].map((l,i)=>(
                  <div key={i} style={{position:'absolute',top:l.top,bottom:(l as any).bottom,left:l.left,right:(l as any).right,transform:l.transform,fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted)',padding:'.3rem .6rem',background:'rgba(9,17,28,.9)',border:'1px solid var(--border)',borderRadius:'4px',whiteSpace:'nowrap'}}>{l.label}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FEATURES — static ── */}
        <section id="features" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>02 — Features</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
                Everything your<br/><span style={{color:'var(--muted)'}}>AEO strategy needs.</span>
              </h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>Built for SEO professionals who know the next frontier of search is already here.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'16px',overflow:'hidden',border:'1px solid var(--border)'}}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feat-card" style={{background:'var(--card)',padding:'2.5rem 2rem',transition:'background .3s',cursor:'default'}}>
                <div style={{width:'46px',height:'46px',borderRadius:'12px',marginBottom:'1.4rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',border:`1px solid ${f.c}`,background:f.c.replace('.2',',.08)')}}>{f.icon}</div>
                <div className="feat-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1.1rem',marginBottom:'.5rem',transition:'color .2s'}}>{f.title}</div>
                <div style={{fontSize:'.85rem',color:'var(--muted)',lineHeight:1.7}}>{f.desc}</div>
                <span style={{display:'inline-block',marginTop:'1rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.08)',border:'1px solid rgba(123,108,255,.18)',borderRadius:'4px',padding:'.25rem .6rem'}}>{f.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── ENGINE MATRIX — static ── */}
        <section id="matrix" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>04 — Engine Matrix</div>
              <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em'}}>
                Deep-scan coverage<br/><span style={{color:'var(--muted)'}}>across every LLM.</span>
              </h2>
            </div>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,maxWidth:'480px'}}>We don't just check one AI. We probe each engine's own retrieval logic, citation behaviour, and content preference.</p>
          </div>
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'16px',overflow:'hidden',marginBottom:'2rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr repeat(6,80px)',borderBottom:'1px solid var(--border)',background:'rgba(255,255,255,.02)'}}>
              <div style={{padding:'1rem 1.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted2)'}}>Capability</div>
              {[{l:'ChatGPT',c:'#10a37f'},{l:'Gemini',c:'#4285f4'},{l:'Perplexity',c:'#ff6b35'},{l:'Grok',c:'#1da1f2'},{l:'Copilot',c:'#7565d9'},{l:'Claude',c:'#d97706'}].map(e=>(
                <div key={e.l} style={{padding:'.75rem .5rem',textAlign:'center',borderLeft:'1px solid var(--border)'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'7px',background:`${e.c}22`,border:`1px solid ${e.c}44`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto .4rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',fontWeight:700,color:e.c}}>{e.l.slice(0,2)}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',lineHeight:1.2}}>{e.l}</div>
                </div>
              ))}
            </div>
            {[
              {feat:'Citation tracking',desc:'How often your URL appears in answers',vals:['Full','Full','Full','Partial','Full','Partial']},
              {feat:'Sentiment analysis',desc:'Positive / neutral / negative mention tone',vals:['Full','Full','Full','Full','Partial','Partial']},
              {feat:'Competitor gap detection',desc:"Queries where rivals appear but you don't",vals:['Full','Full','Full','Soon','Full','Soon']},
              {feat:'llms.txt crawl check',desc:'Whether your AI allowlist is respected',vals:['Full','Partial','Full','Soon','Partial','Full']},
              {feat:'BLUF content scoring',desc:'How well your content answers directly',vals:['Full','Full','Full','Full','Full','Full']},
              {feat:'Weekly trend tracking',desc:'Citation delta week-over-week',vals:['Full','Full','Full','Partial','Full','Partial']},
              {feat:'Real-time query probing',desc:'Live prompt testing against your niche',vals:['Full','Partial','Full','Soon','Partial','Soon']},
            ].map((row,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr repeat(6,80px)',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                <div style={{padding:'1rem 1.5rem'}}>
                  <div style={{fontSize:'.85rem',color:'var(--text)',fontWeight:400,marginBottom:'.2rem'}}>{row.feat}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>{row.desc}</div>
                </div>
                {row.vals.map((v,vi)=>(
                  <div key={vi} style={{display:'flex',alignItems:'center',justifyContent:'center',borderLeft:'1px solid rgba(255,255,255,.04)'}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',fontWeight:600,padding:'.25rem .5rem',borderRadius:'4px',color:v==='Full'?'#4ade80':v==='Partial'?'var(--accent)':'var(--muted)',background:v==='Full'?'rgba(74,222,128,.08)':v==='Partial'?'rgba(200,242,71,.08)':'rgba(255,255,255,.04)',border:`1px solid ${v==='Full'?'rgba(74,222,128,.2)':v==='Partial'?'rgba(200,242,71,.2)':'rgba(255,255,255,.08)'}`}}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
            {[
              {icon:'GPT',c:'#10a37f',name:'ChatGPT',share:'~94% of AI-referred traffic',desc:'The dominant AI chat platform. Heavily influenced by domain authority, structured data, and BLUF-formatted content.',tags:['Citations','Sentiment','Gaps','BLUF']},
              {icon:'G',c:'#4285f4',name:'Gemini',share:'Google-integrated, growing fast',desc:"Deeply tied to Google's knowledge graph. E-E-A-T and schema markup have outsized influence on Gemini citations.",tags:['E-E-A-T','Schema','Sentiment','Gaps']},
              {icon:'Px',c:'#ff6b35',name:'Perplexity',share:'Real-time web retrieval model',desc:'Retrieves and cites live web sources in every answer. Sites with clear canonical structure rank disproportionately well.',tags:['Citations','Real-time','Canonical','BLUF']},
              {icon:'Gk',c:'#1da1f2',name:'Grok',share:'X / Twitter realtime signals',desc:'Uses realtime X data and web search. Social proof and trending content play a bigger role here than on other platforms.',tags:['Social Signals','Trending','Partial']},
            ].map((e,i)=>(
              <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'9px',background:`${e.c}18`,border:`1px solid ${e.c}40`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',fontWeight:700,color:e.c,flexShrink:0}}>{e.icon}</div>
                  <div>
                    <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem'}}>{e.name}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--muted2)'}}>{e.share}</div>
                  </div>
                </div>
                <div style={{fontSize:'.8rem',color:'var(--muted)',lineHeight:1.65,marginBottom:'1rem'}}>{e.desc}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'.3rem'}}>
                  {e.tags.map(t=><span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',color:'var(--muted2)',border:'1px solid var(--border)',padding:'.2rem .5rem',borderRadius:'4px'}}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── PRICING — static (links instead of router.push) ── */}
        <section id="pricing" style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>03 — Pricing</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'1rem'}}>
            Simple, transparent<br/><span style={{color:'var(--muted)'}}>pricing.</span>
          </h2>
          <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'3.5rem'}}>Start free. Scale when you need. No lock-in.</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',textAlign:'left'}}>
            {PLANS.map((p,i)=>(
              <div key={i} className="price-card" style={{background:p.featured?'linear-gradient(160deg,rgba(200,242,71,.04),#100e22)':'var(--card)',border:`1px solid ${p.featured?'rgba(200,242,71,.35)':'var(--border)'}`,borderRadius:'16px',padding:'2.5rem 2rem',position:'relative'}}>
                {p.featured && <span style={{position:'absolute',top:'1.25rem',right:'1.25rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'var(--bg)',background:'var(--accent)',padding:'.25rem .6rem',borderRadius:'4px',fontWeight:600}}>Most Popular</span>}
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'.75rem'}}>{p.plan}</div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'3rem',lineHeight:1,letterSpacing:'-.02em',marginBottom:'.25rem'}}>
                  <sup style={{fontSize:'1.2rem',color:'var(--muted)',verticalAlign:'super'}}>$</sup>{p.price}<span style={{fontSize:'1rem',color:'var(--muted)'}}>/mo</span>
                </div>
                <div style={{fontSize:'.82rem',color:'var(--muted)',marginBottom:'1.75rem'}}>{p.desc}</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.65rem',marginBottom:'2rem'}}>
                  {p.features.map(f=>(
                    <li key={f} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',fontSize:'.85rem',color:'var(--muted)',lineHeight:1.5}}>
                      <span style={{color:'var(--accent)',fontSize:'.75rem',flexShrink:0,marginTop:'.1rem'}}>✦</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={p.href} style={{display:'block',width:'100%',padding:'.85rem',borderRadius:'100px',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.85rem',letterSpacing:'.04em',border:`1px solid ${p.featured?'transparent':'var(--border)'}`,background:p.featured?'var(--accent)':'transparent',color:p.featured?'var(--bg)':'var(--text)',transition:'all .22s',textAlign:'center',boxSizing:'border-box'}}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <div style={{height:'1px',background:'var(--border)',margin:'0 3.5rem'}} />

        {/* ── FAQ — client island (accordion toggle) ── */}
        <section style={{padding:'7rem 3.5rem',maxWidth:'1320px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.18em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'.75rem'}}>05 — FAQ</div>
          <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2rem,4vw,3.8rem)',lineHeight:1.05,letterSpacing:'-.025em',marginBottom:'3rem'}}>
            Common <span style={{color:'var(--muted)'}}>questions.</span>
          </h2>
          <FAQClient faqs={FAQS} />
        </section>

        {/* ── CTA — client island (URL input) ── */}
        <div style={{background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'8rem 3.5rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'300px',background:'radial-gradient(ellipse,rgba(123,108,255,.12) 0%,transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:1,maxWidth:'680px',margin:'0 auto'}}>
            <h2 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(2.5rem,5vw,4.5rem)',lineHeight:1,letterSpacing:'-.03em',marginBottom:'1.25rem'}}>
              Start tracking your<br/><span style={{color:'var(--accent)'}}>AI visibility</span> today.
            </h2>
            <p style={{fontSize:'1rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2.5rem'}}>Over 3,400 SEO professionals already know where they stand in AI search. Do you?</p>
            <HeroClient ctaOnly />
          </div>
        </div>

        <SharedFooter />

        <div style={{borderTop:'1px solid var(--border)',padding:'1.5rem 3.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>© 2026 <span style={{color:'var(--muted)'}}>Notion Cue</span> — AI Visibility Intelligence Platform</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)',letterSpacing:'.05em'}}>Built for the next era of search.</span>
        </div>

      </div>
    </>
  )
}