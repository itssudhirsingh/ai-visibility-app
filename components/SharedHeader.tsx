'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/logo'


// ─── Site structure ────────────────────────────────────────────────────────────
const TOOLS = [
  {
    label:       'llms.txt Generator',
    href:        '/llms-text-generator',
    desc:        'Generate AI-ready llms.txt files',
    icon:        '📄',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'Robots.txt Generator',
    href:        '/robots-txt',
    desc:        'Generate AI-ready robots.txt files',
    icon:        '📄',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'BLUF Templates',
    href:        '/bluf-templates',
    desc:        'Bottom-line-up-front content templates',
    icon:        '⚡',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AEO Dashboard',
    href:        '/dashboard',
    desc:        'Track AI visibility across engines',
    icon:        '📊',
    badge:       'Free',
    badgeColor:  'rgba(146,124,255,.08)',
    badgeBorder: 'rgba(146,124,255,.25)',
    badgeText:   '#927cff',
  },
]

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'AEO Guide', href: '/aeo-guide' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'About',     href: '/about' },
]

export default function SharedHeader() {
  const pathname = usePathname()

  const isActive      = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const isToolsActive = TOOLS.some(t => pathname.startsWith(t.href))

  return (
    <>
      <style>{`
        @keyframes sh-pulse {
          0%,100% { opacity:1; box-shadow:0 0 6px rgba(82,227,142,.6) }
          50%      { opacity:.5; box-shadow:0 0 3px rgba(82,227,142,.25) }
        }
        .sh-nav-link:hover      { color:#f5f8ff !important }
        .sh-tools-btn:hover     { color:#f5f8ff !important }
        .sh-cta:hover           { box-shadow:0 0 28px rgba(202,255,69,.35) !important }
        .sh-dd-item:hover       { background:rgba(255,255,255,.05) !important }

        /* dropdown open on hover */
        .sh-dd-wrap:hover .sh-dropdown {
          display:block !important;
          animation: sh-fadeUp .18s both;
        }
        .sh-dd-wrap:hover .sh-chevron { transform:rotate(180deg) }
        @keyframes sh-fadeUp {
          from { opacity:0; transform:translateX(-50%) translateY(6px) }
          to   { opacity:1; transform:translateX(-50%) translateY(0) }
        }

        @media(max-width:900px){
          .sh-nav-link   { display:none !important }
          .sh-dd-wrap    { display:none !important }
          .sh-status     { display:none !important }
        }
      `}</style>

      {/* Spacer for fixed header */}
      <div style={{ height: 65 }} />

      <header style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        zIndex:         900,
        height:         65,
        background:     'rgba(3,6,12,.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom:   '1px solid rgba(220,235,255,.08)',
      }}>
        <div style={{
          maxWidth:   1200,
          margin:     '0 auto',
          padding:    '0 2.5rem',
          height:     '100%',
          display:    'flex',
          alignItems: 'center',
          gap:        '1.25rem',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', flexShrink:0 }}>
           
            <div>
              <Logo size="sm" variant="full" href="/" />
            </div>
          </Link>

          {/* ── Nav ── */}
          <nav style={{ display:'flex', alignItems:'center', gap:2, marginLeft:10 }}>

            {/* Tools dropdown */}
            <div className="sh-dd-wrap" style={{ position:'relative' }}>
              <button className="sh-tools-btn" style={{
                background:   'none',
                border:       'none',
                display:      'flex',
                alignItems:   'center',
                gap:          5,
                padding:      '6px 10px',
                borderRadius: 6,
                fontFamily:   "'JetBrains Mono',monospace",
                fontSize:     11,
                cursor:       'pointer',
                color:        isToolsActive ? '#caff45' : 'rgba(230,239,255,.65)',
                letterSpacing:'.03em',
                transition:   'color .2s',
              }}>
                Tools
                <svg className="sh-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ opacity:.5, transition:'transform .2s' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              <div className="sh-dropdown" style={{
                display:      'none',
                position:     'absolute',
                top:          'calc(100% + 8px)',
                left:         '50%',
                transform:    'translateX(-50%)',
                width:        310,
                background:   'linear-gradient(145deg,rgba(10,17,32,.98),rgba(6,11,20,.97))',
                border:       '1px solid rgba(220,235,255,.1)',
                borderRadius: 10,
                padding:      8,
                boxShadow:    '0 24px 60px rgba(0,0,0,.55)',
                zIndex:       1000,
              }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:'rgba(220,233,255,.3)', letterSpacing:'.1em', textTransform:'uppercase', padding:'5px 10px 8px' }}>
                  Free Tools + Pro Features
                </div>
                {TOOLS.map(tool => (
                  <Link key={tool.href} href={tool.href} className="sh-dd-item"
                    style={{
                      display:             'grid',
                      gridTemplateColumns: '30px 1fr auto',
                      gap:                 10,
                      padding:             '9px 10px',
                      borderRadius:        7,
                      textDecoration:      'none',
                      alignItems:          'center',
                      transition:          'background .15s',
                      background:          isActive(tool.href) ? 'rgba(202,255,69,.06)' : 'transparent',
                    }}>
                    <span style={{
                      width:       30,
                      height:      30,
                      display:     'grid',
                      placeItems:  'center',
                      background:  'rgba(255,255,255,.04)',
                      border:      `1px solid ${isActive(tool.href) ? 'rgba(202,255,69,.2)' : 'rgba(220,235,255,.08)'}`,
                      borderRadius:6,
                      fontSize:    14,
                    }}>
                      {tool.icon}
                    </span>
                    <div>
                      <div style={{
                        fontFamily:   "'Familjen Grotesk',sans-serif",
                        fontWeight:   600,
                        fontSize:     12,
                        color:        isActive(tool.href) ? '#caff45' : '#f5f8ff',
                        marginBottom: 1,
                      }}>
                        {tool.label}
                      </div>
                      <div style={{ fontSize:9, color:'rgba(220,233,255,.4)', fontFamily:"'JetBrains Mono',monospace" }}>
                        {tool.desc}
                      </div>
                    </div>
                    <span style={{
                      fontFamily:  "'JetBrains Mono',monospace",
                      fontSize:    8,
                      padding:     '2px 6px',
                      borderRadius:3,
                      background:  tool.badgeColor,
                      border:      `1px solid ${tool.badgeBorder}`,
                      color:       tool.badgeText,
                      whiteSpace:  'nowrap',
                    }}>
                      {tool.badge}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Flat nav links */}
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="sh-nav-link"
                style={{
                  fontFamily:    "'JetBrains Mono',monospace",
                  fontSize:      11,
                  color:         isActive(link.href) ? '#caff45' : 'rgba(230,239,255,.65)',
                  textDecoration:'none',
                  padding:       '6px 10px',
                  borderRadius:  6,
                  letterSpacing: '.03em',
                  transition:    'color .2s',
                  borderBottom:  isActive(link.href) ? '1px solid rgba(202,255,69,.4)' : '1px solid transparent',
                }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>

            {/* Status */}
            <div className="sh-status" style={{
              display:    'flex',
              alignItems: 'center',
              gap:        6,
              padding:    '5px 11px',
              border:     '1px solid rgba(82,227,142,.14)',
              background: 'rgba(82,227,142,.04)',
              borderRadius:100,
            }}>
              <span style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   '#52e38e',
                boxShadow:    '0 0 6px rgba(82,227,142,.6)',
                display:      'block',
                animation:    'sh-pulse 2s ease-in-out infinite',
                flexShrink:   0,
              }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#52e38e', letterSpacing:'.06em' }}>
                All systems live
              </span>
            </div>

            {/* CTA */}
            <Link href="/dashboard" className="sh-cta"
              style={{
                fontFamily:    "'Familjen Grotesk',sans-serif",
                fontWeight:    700,
                fontSize:      12,
                color:         '#07100b',
                background:    '#caff45',
                padding:       '8px 16px',
                borderRadius:  100,
                textDecoration:'none',
                whiteSpace:    'nowrap',
                boxShadow:     '0 0 18px rgba(202,255,69,.16)',
                transition:    'box-shadow .2s',
              }}>
              Open Dashboard →
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}