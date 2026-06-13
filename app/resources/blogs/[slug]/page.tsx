import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS, getPostBySlug } from '../../posts'

// SSR — generates static pages at build time for all 6 posts
export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

// SEO metadata per post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} — Notion Cue Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

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

  // Related posts — other posts in same tag, or just next 2
  const related = BLOG_POSTS
    .filter(p => p.slug !== post.slug && p.tag === post.tag)
    .slice(0, 2)
    .concat(
      BLOG_POSTS.filter(p => p.slug !== post.slug && p.tag !== post.tag).slice(0, 2 - Math.min(2, BLOG_POSTS.filter(p => p.slug !== post.slug && p.tag === post.tag).length))
    )
    .slice(0, 2)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Epilogue:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#04030c;--card:#100e22;
          --border:rgba(255,255,255,0.07);--border-h:rgba(255,255,255,0.16);
          --text:#ede9ff;--muted:rgba(237,233,255,0.44);--muted2:rgba(237,233,255,0.22);
          --accent:#c8f247;--violet:#7b6cff;--cyan:#22d3ee;--green:#4ade80;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:'Epilogue',sans-serif;font-weight:300;overflow-x:hidden}
        a{color:inherit;text-decoration:none}

        /* Sub-nav */
        .subnav-btn{fontFamily:"'JetBrains Mono',monospace";font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;padding:.55rem 1rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);white-space:nowrap;cursor:pointer;transition:all .2s;font-family:inherit}
        .subnav-btn:hover{color:var(--text)}
        .subnav-btn.active{border-bottom-color:var(--accent);color:var(--accent)}

        /* Prose */
        .prose{font-size:.97rem;line-height:1.85;color:var(--muted)}
        .prose h2{font-family:'Familjen Grotesk',sans-serif;font-weight:700;font-size:1.55rem;letter-spacing:-.02em;margin:2.75rem 0 .85rem;color:var(--text)}
        .prose h3{font-family:'Familjen Grotesk',sans-serif;font-weight:600;font-size:1.1rem;margin:2rem 0 .5rem;color:var(--text)}
        .prose p{margin-bottom:1.1rem}
        .prose ul,.prose ol{padding-left:1.6rem;margin-bottom:1.1rem}
        .prose li{margin-bottom:.45rem;line-height:1.75}
        .prose strong{color:var(--text);font-weight:500}
        .prose a{color:var(--accent)}
        .prose pre{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:1.1rem 1.25rem;overflow-x:auto;margin:1.5rem 0}
        .prose code{font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--cyan);line-height:1.7}
        .prose .callout{background:rgba(123,108,255,.06);border:1px solid rgba(123,108,255,.2);border-radius:10px;padding:1.1rem 1.4rem;margin:1.75rem 0}
        .prose .callout p{margin:0;color:var(--text);font-size:.9rem}

        /* Related card */
        .related-card:hover{border-color:var(--border-h)!important;transform:translateY(-3px)}
        .related-card:hover .related-title{color:var(--accent)}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
      `}</style>

      <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--text)'}}>

        {/* ── SHARED HEADER (server-safe inline version) ── */}
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:900,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.3rem 3.5rem',background:'rgba(4,3,12,0.88)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'1rem',color:'#fff'}}>
            <div style={{width:'26px',height:'26px',borderRadius:'7px',background:'linear-gradient(135deg,#7b6cff,#c8f247)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:700,color:'#fff'}}>A</div>
            Notion Cue
          </Link>
          <div style={{display:'flex',gap:'1.75rem',alignItems:'center'}}>
            {[['How it works','/#how-it-works'],['Features','/#features'],['Pricing','/#pricing'],['Resources','/resources/aeo-guide'],['Blog','/resources/blog'],['Company','/resources/about']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontSize:'.8rem',color:'rgba(237,233,255,0.55)',transition:'color .2s'}}>{l}</Link>
            ))}
          </div>
          <Link href="/dashboard" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.78rem',fontWeight:700,padding:'.5rem 1.2rem',borderRadius:'100px',border:'none',background:'#c8f247',color:'#04030c',display:'inline-block'}}>
            Start free
          </Link>
        </nav>

        {/* Sub-nav */}
        <div style={{position:'sticky',top:'65px',zIndex:700,background:'rgba(4,3,12,.9)',backdropFilter:'blur(16px)',borderBottom:'1px solid var(--border)',padding:'.6rem 3.5rem',display:'flex',gap:0,overflowX:'auto',marginTop:'65px'}}>
          {SUB_NAV.map(n=>(
            <Link key={n.href} href={n.href} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.06em',textTransform:'uppercase',padding:'.55rem 1rem',background:'none',border:'none',borderBottom:n.href==='/resources/blog'?'2px solid var(--accent)':'2px solid transparent',color:n.href==='/resources/blog'?'var(--accent)':'var(--muted)',whiteSpace:'nowrap',transition:'all .2s',display:'inline-block'}}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* ── HERO ── */}
        <div style={{maxWidth:'760px',margin:'0 auto',padding:'0 3.5rem'}}>
          <div style={{padding:'5rem 0 3rem'}}>
            {/* Back link */}
            <Link href="/resources/blog" style={{display:'inline-flex',alignItems:'center',gap:'.5rem',fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.08em',color:'var(--muted)',marginBottom:'2rem',transition:'color .2s'}}>
              ← Back to blog
            </Link>

            {/* Tag + date */}
            <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem',flexWrap:'wrap'}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.1)',border:'1px solid rgba(123,108,255,.2)',padding:'.25rem .6rem',borderRadius:'4px'}}>{post.tag}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>{post.date}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>·</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>{post.read}</span>
            </div>

            {/* Title */}
            <h1 style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'clamp(1.8rem,4vw,3rem)',lineHeight:1.1,letterSpacing:'-.02em',marginBottom:'1.25rem',color:'var(--text)'}}>{post.title}</h1>

            {/* Excerpt */}
            <p style={{fontSize:'1.05rem',color:'var(--muted)',lineHeight:1.75,marginBottom:'2rem'}}>{post.excerpt}</p>

            {/* Author */}
            <div style={{display:'flex',alignItems:'center',gap:'.85rem',padding:'1rem 1.25rem',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',borderRadius:'10px'}}>
              <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'linear-gradient(135deg,var(--violet),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.72rem',fontWeight:700,color:'#fff',flexShrink:0}}>{post.authorInitials}</div>
              <div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.9rem'}}>{post.author}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.65rem',color:'var(--muted2)'}}>{post.authorRole}</div>
              </div>
            </div>
          </div>

          {/* ── HERO EMOJI BANNER ── */}
          <div style={{height:'200px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem',borderRadius:'16px',marginBottom:'3rem',background:post.bg,border:'1px solid var(--border)'}}>{post.emoji}</div>

          {/* ── BODY ── */}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{paddingBottom:'4rem',borderBottom:'1px solid var(--border)',marginBottom:'3rem'}}
          />

          {/* ── SHARE + CTA ── */}
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',marginBottom:'4rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.7rem',color:'var(--muted2)'}}>Found this useful?</div>
              <div style={{display:'flex',gap:'.5rem'}}>
                {['Share on X','Copy link'].map(l=>(
                  <button key={l} style={{fontFamily:"'Familjen Grotesk',sans-serif",fontSize:'.75rem',fontWeight:600,padding:'.45rem .9rem',border:'1px solid var(--border)',borderRadius:'100px',background:'transparent',color:'var(--muted)',cursor:'pointer',transition:'all .2s'}}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{padding:'1.75rem',background:'rgba(200,242,71,.04)',border:'1px solid rgba(200,242,71,.18)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1.5rem',flexWrap:'wrap'}}>
              <div>
                <div style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',marginBottom:'.35rem'}}>Check your own AEO score</div>
                <div style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.5}}>Scan your domain free — get your AI visibility score in 30 seconds.</div>
              </div>
              <Link href="/dashboard" style={{flexShrink:0,fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.82rem',padding:'.65rem 1.35rem',borderRadius:'100px',background:'var(--accent)',color:'#04030c',display:'inline-block',whiteSpace:'nowrap'}}>Scan my site →</Link>
            </div>
          </div>
        </div>

        {/* ── RELATED POSTS ── */}
        {related.length > 0 && (
          <div style={{borderTop:'1px solid var(--border)',padding:'4rem 3.5rem',maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:'1.5rem'}}>More from the blog</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1.25rem'}}>
              {related.map(p=>(
                <Link key={p.slug} href={`/resources/blog/${p.slug}`} style={{display:'block'}}>
                  <div className="related-card" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',transition:'all .25s',cursor:'pointer'}}>
                    <div style={{height:'100px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',borderBottom:'1px solid var(--border)',background:p.bg}}>{p.emoji}</div>
                    <div style={{padding:'1.25rem'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.6rem'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.6rem',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--violet)',background:'rgba(123,108,255,.08)',border:'1px solid rgba(123,108,255,.18)',padding:'.2rem .55rem',borderRadius:'4px'}}>{p.tag}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',color:'var(--muted2)'}}>{p.read}</span>
                      </div>
                      <div className="related-title" style={{fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:600,fontSize:'.95rem',lineHeight:1.25,color:'var(--text)',transition:'color .2s'}}>{p.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER (server-safe inline version) ── */}
        <footer style={{borderTop:'1px solid var(--border)',fontFamily:"'Epilogue',sans-serif"}}>
          <div style={{padding:'3rem 3.5rem',display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr',gap:'2.5rem',maxWidth:'1400px',margin:'0 auto'}}>
            <div>
              <Link href="/" style={{display:'flex',alignItems:'center',gap:'.6rem',fontFamily:"'Familjen Grotesk',sans-serif",fontWeight:700,fontSize:'.95rem',color:'#fff',marginBottom:'.65rem'}}>
                <div style={{width:'22px',height:'22px',borderRadius:'6px',background:'linear-gradient(135deg,#7b6cff,#c8f247)',flexShrink:0}} />
                Notion Cue
              </Link>
              <div style={{fontSize:'.8rem',color:'rgba(237,233,255,0.44)',lineHeight:1.6,maxWidth:'200px'}}>AI visibility intelligence for the next era of search.</div>
            </div>
            {[
              {title:'Product',links:[['How it works','/#how-it-works'],['Features','/#features'],['Pricing','/#pricing'],['Dashboard','/dashboard']]},
              {title:'Resources',links:[['AEO Guide','/resources/aeo-guide'],['llms.txt Generator','/resources/llms-txt'],['BLUF Templates','/resources/bluf-templates'],['Blog','/resources/blog'],['Changelog','/resources/changelog']]},
              {title:'Company',links:[['About','/resources/about'],['Contact','/resources/contact'],['Privacy','/resources/privacy'],['Terms','/resources/terms']]},
            ].map(col=>(
              <div key={col.title}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.62rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(237,233,255,0.22)',marginBottom:'.9rem'}}>{col.title}</div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'}}>
                  {col.links.map(([l,h])=>(
                    <li key={l}><Link href={h} style={{fontSize:'.8rem',color:'rgba(237,233,255,0.44)'}}>{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid var(--border)',padding:'1.4rem 3.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',color:'rgba(237,233,255,0.22)'}}>© 2026 Notion Cue — AI Visibility Intelligence Platform</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'.63rem',color:'rgba(237,233,255,0.22)'}}>Built for the next era of search.</span>
          </div>
        </footer>

      </div>
    </>
  )
}