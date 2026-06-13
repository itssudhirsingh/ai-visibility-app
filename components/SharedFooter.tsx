'use client'
import { useRouter } from 'next/navigation'

export default function SharedFooter() {
  const router = useRouter()

  const cols = [
    {
      title: 'Product',
      links: [
        { label: 'How it works',      href: '/#how-it-works' },
        { label: 'Features',          href: '/#features' },
        { label: 'Pricing',           href: '/#pricing' },
        { label: 'Dashboard',         href: '/dashboard' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'AEO Guide',           href: '/resources#aeo-guide' },
        { label: 'llms.txt Generator',  href: '/resources#llms-txt' },
        { label: 'BLUF Templates',      href: '/resources#bluf-templates' },
        { label: 'Blog',                href: '/resources#blog' },
        { label: 'Changelog',           href: '/resources#changelog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About',           href: '/resources#about' },
        { label: 'Contact',         href: '/resources#contact' },
        { label: 'Privacy Policy',  href: '/resources#privacy' },
        { label: 'Terms of Service',href: '/resources#terms' },
      ],
    },
  ]

  function navigate(href: string) {
    if (href.includes('#')) {
      const [page, hash] = href.split('#')
      router.push(`${page}#${hash}`)
    } else {
      router.push(href)
    }
  }

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', fontFamily: "'Epilogue', sans-serif" }}>
      {/* Main footer grid */}
      <div style={{
        padding: '3rem 3.5rem',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: '2.5rem',
      }}>
        {/* Brand col */}
        <div>
          <div onClick={() => router.push('/')} style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700,
            fontSize: '.95rem', color: '#fff', marginBottom: '.65rem', cursor: 'pointer',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '6px',
              background: 'linear-gradient(135deg,#7b6cff,#c8f247)',
              flexShrink: 0,
            }} />
            Notion Cue
          </div>
          <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: '200px' }}>
            AI visibility intelligence for the next era of search.
          </div>
          <button onClick={() => router.push('/dashboard')} style={{
            marginTop: '1.25rem',
            fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700,
            fontSize: '.75rem', padding: '.5rem 1.1rem', borderRadius: '100px',
            border: 'none', background: '#c8f247', color: '#04030c', cursor: 'pointer',
          }}>Start free →</button>
        </div>

        {/* Link cols */}
        {cols.map(col => (
          <div key={col.title}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '.62rem',
              letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', marginBottom: '.9rem',
            }}>{col.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
              {col.links.map(l => (
                <li key={l.label}>
                  <span onClick={() => navigate(l.href)} style={{
                    fontSize: '.8rem', color: 'rgba(255,255,255,0.75)',
                    cursor: 'pointer', transition: 'color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ede9ff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  >{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '1.4rem 3.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '.75rem',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '.63rem',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '.04em',
        }}>
          © 2026 <span style={{ color: 'rgba(255,255,255,0.75)' }}>Notion Cue</span> — AI Visibility Intelligence Platform
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '.63rem',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '.04em',
        }}>
          Built for the next era of search.
        </span>
      </div>
    </footer>
  )
}