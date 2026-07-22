'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Logo from '@/components/logo'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// ─── Site structure ────────────────────────────────────────────────────────────
const TOOLS = [
  {
    label:       'AI Visibility Tool',
    href:        '/ai-visibility-tool',
    desc:        'Track AI visibility across 6 engines',
    icon:        '📊',
    badge:       'Free',
    badgeColor:  'rgba(146,124,255,.08)',
    badgeBorder: 'rgba(146,124,255,.25)',
    badgeText:   '#927cff',
  },
  {
    label:       'AI Topical Cluster Map',
    href:        '/topic-cluster-generator',
    desc:        'Generate AI-optimised content clusters',
    icon:        '🎯',
    badge:       'Free',
    badgeColor:  'rgba(146,124,255,.08)',
    badgeBorder: 'rgba(146,124,255,.25)',
    badgeText:   '#927cff',
  },
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
    icon:        '🤖',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI BLUF Templates',
    href:        '/bluf-templates',
    desc:        'Bottom-line-up-front content templates',
    icon:        '⚡',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI BLUF Generator',
    href:        '/bluf-builder',
    desc:        'Generate citation-ready BLUF openings',
    icon:        '✍️',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI E-E-A-T Checker',
    href:        '/ai-eeat-checker',
    desc:        'Audit E-E-A-T signals for AI engines',
    icon:        '🏅',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI Page Speed Analyser',
    href:        '/ai-page-speed-analysis-tools',
    desc:        'Translate Core Web Vitals into AEO impact',
    icon:        '🚀',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI Readability Checker',
    href:        '/ai-readability-checker',
    desc:        'Score content readability for AI citation',
    icon:        '📖',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI Schema Markup Generator',
    href:        '/ai-schema-markup-generator',
    desc:        'Generate schema markup for AI crawlers',
    icon:        '🧩',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AEO Content Brief Generator',
    href:        '/topic-cluster-generator',
    desc:        'Full AEO content brief from a keyword',
    icon:        '📋',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI Visibility Heatmap',
    href:        '/ai-visibility-heatmap',
    desc:        'Site-wide AEO citation coverage map',
    icon:        '🌡️',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'llms.txt Validator',
    href:        '/llms-txt-live-validator',
    desc:        'Validate any domain\'s llms.txt live',
    icon:        '🔍',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
  {
    label:       'AI Answer Gap Finder',
    href:        '/ai-answer-gap-finder',
    desc:        'Find unanswered questions in your niche',
    icon:        '🔎',
    badge:       'FREE',
    badgeColor:  'rgba(82,227,142,.08)',
    badgeBorder: 'rgba(82,227,142,.25)',
    badgeText:   '#52e38e',
  },
]

const NAV_LINKS = [
  { label: 'AI Visibility',  href: '/ai-visibility-tool' },
  { label: 'AI SEO/AEO/GEO Guide',      href: '/aeo-guide' },
  { label: 'Be AI Ready',           href: '/blog/is-your-website-agent-ready-complete-technical-guide-2026' },
  { label: ' Blog',      href: '/blog' },
  { label: 'Contact',      href: '/contact' },
  { label: 'About',          href: '/about' },
]

// Split 14 tools into two columns of 7
const TOOLS_COL1 = TOOLS.slice(0, 7)
const TOOLS_COL2 = TOOLS.slice(7)

export default function SharedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen]   = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)

  // Track auth state — checks once on mount, then stays in sync with
  // sign-in/sign-out events fired from anywhere in the app.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAccountOpen(false)
    router.push('/')
    router.refresh()
  }

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setToolsOpen(false); setAccountOpen(false) }, [pathname])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive      = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const isToolsActive = TOOLS.some(t => pathname.startsWith(t.href))

  return (
    <>
      <style>{`
        @keyframes sh-pulse {
          0%,100% { opacity:1; box-shadow:0 0 6px rgba(82,227,142,.6) }
          50%      { opacity:.5; box-shadow:0 0 3px rgba(82,227,142,.25) }
        }
        @keyframes sh-fadeDown {
          from { opacity:0; transform:translateX(-50%) translateY(-6px) }
          to   { opacity:1; transform:translateX(-50%) translateY(0) }
        }
        @keyframes sh-slideIn {
          from { opacity:0; transform:translateX(100%) }
          to   { opacity:1; transform:translateX(0) }
        }

        .sh-nav-link:hover   { color:#f5f8ff !important }
        .sh-tools-btn:hover  { color:#f5f8ff !important }
        .sh-cta:hover        { box-shadow:0 0 28px rgba(202,255,69,.35) !important }
        .sh-dd-item:hover    { background:rgba(255,255,255,.05) !important }
        .sh-mob-link:hover   { color:#caff45 !important; background:rgba(202,255,69,.05) !important }
        .sh-mob-tool:hover   { background:rgba(255,255,255,.05) !important }

        /* Desktop dropdown: open on hover */
        .sh-dd-wrap:hover .sh-dropdown {
          display: block !important;
          animation: sh-fadeDown .18s both;
        }
        .sh-dd-wrap:hover .sh-chevron { transform: rotate(180deg) }

        /* Hide desktop nav on mobile */
        @media(max-width:900px) {
          .sh-desktop-nav  { display:none !important }
          .sh-status       { display:none !important }
          .sh-hamburger    { display:flex !important }
        }
        @media(min-width:901px) {
          .sh-hamburger    { display:none !important }
          .sh-mobile-menu  { display:none !important }
        }
      `}</style>

      {/* Spacer */}
      <div style={{ height: 65 }} />

      <header style={{
        position:         'fixed',
        top:              0,
        left:             0,
        right:            0,
        zIndex:           900,
        height:           65,
        background:       'rgba(3,6,12,.92)',
        backdropFilter:   'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom:     '1px solid rgba(220,235,255,.08)',
      }}>
        <div style={{
          maxWidth:   1200,
          margin:     '0 auto',
          padding:    '0 2rem',
          height:     '100%',
          display:    'flex',
          alignItems: 'center',
          gap:        '1rem',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none', flexShrink:0 }}>
            <Logo size="sm" variant="full" href="/" />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="sh-desktop-nav" style={{ display:'flex', alignItems:'center', gap:2, marginLeft:10 }}>

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

              {/* ── 2-column dropdown — 7 items per column ── */}
              <div className="sh-dropdown" style={{
                display:      'none',
                position:     'absolute',
                top:          'calc(100% + 8px)',
                left:         '50%',
                transform:    'translateX(-50%)',
                width:        640,
                background:   'linear-gradient(145deg,rgba(10,17,32,.98),rgba(6,11,20,.97))',
                border:       '1px solid rgba(220,235,255,.1)',
                borderRadius: 12,
                padding:      10,
                boxShadow:    '0 24px 60px rgba(0,0,0,.6)',
                zIndex:       1000,
              }}>
                <div style={{
                  fontFamily:    "'JetBrains Mono',monospace",
                  fontSize:      8,
                  color:         'rgba(220,233,255,.3)',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  padding:       '4px 10px 10px',
                  borderBottom:  '1px solid rgba(220,235,255,.06)',
                  marginBottom:  6,
                }}>
                  Free Tools + Pro Features — {TOOLS.length} total
                </div>

                {/* Two columns of 7 */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 4px' }}>
                  {[TOOLS_COL1, TOOLS_COL2].map((col, ci) => (
                    <div key={ci}>
                      {col.map(tool => (
                        <Link key={tool.href} href={tool.href} className="sh-dd-item"
                          style={{
                            display:             'grid',
                            gridTemplateColumns: '28px 1fr auto',
                            gap:                 8,
                            padding:             '8px 10px',
                            borderRadius:        7,
                            textDecoration:      'none',
                            alignItems:          'center',
                            transition:          'background .15s',
                            background:          isActive(tool.href) ? 'rgba(202,255,69,.06)' : 'transparent',
                          }}>
                          <span style={{
                            width:       28,
                            height:      28,
                            display:     'grid',
                            placeItems:  'center',
                            background:  'rgba(255,255,255,.04)',
                            border:      `1px solid ${isActive(tool.href) ? 'rgba(202,255,69,.2)' : 'rgba(220,235,255,.08)'}`,
                            borderRadius:6,
                            fontSize:    13,
                            flexShrink:  0,
                          }}>
                            {tool.icon}
                          </span>
                          <div style={{ minWidth:0 }}>
                            <div style={{
                              fontFamily:   "'Familjen Grotesk',sans-serif",
                              fontWeight:   600,
                              fontSize:     11.5,
                              color:        isActive(tool.href) ? '#caff45' : '#f5f8ff',
                              marginBottom: 1,
                              whiteSpace:   'nowrap',
                              overflow:     'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {tool.label}
                            </div>
                            <div style={{ fontSize:9, color:'rgba(220,233,255,.38)', fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                              {tool.desc}
                            </div>
                          </div>
                          <span style={{
                            fontFamily:  "'JetBrains Mono',monospace",
                            fontSize:    7,
                            padding:     '2px 5px',
                            borderRadius:3,
                            background:  tool.badgeColor,
                            border:      `1px solid ${tool.badgeBorder}`,
                            color:       tool.badgeText,
                            whiteSpace:  'nowrap',
                            flexShrink:  0,
                          }}>
                            {tool.badge}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
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

          {/* ── Right side ── */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>

            {/* Status pill — desktop only */}
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
                width:       6,
                height:      6,
                borderRadius:'50%',
                background:  '#52e38e',
                boxShadow:   '0 0 6px rgba(82,227,142,.6)',
                display:     'block',
                animation:   'sh-pulse 2s ease-in-out infinite',
                flexShrink:  0,
              }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#52e38e', letterSpacing:'.06em' }}>
                All systems live
              </span>
            </div>

            {/* CTA — auth-aware */}
            {user ? (
              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  style={{
                    display:'flex', alignItems:'center', gap:'.5rem',
                    fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:500,
                    color:'#f5f8ff', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.1)',
                    padding:'7px 14px', borderRadius:100, cursor:'pointer', whiteSpace:'nowrap',
                  }}
                >
                  <span style={{ width:18, height:18, borderRadius:'50%', background:'#caff45', color:'#07100b', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {(user.email?.[0] || '?').toUpperCase()}
                  </span>
                  {user.email?.split('@')[0]}
                </button>
                {accountOpen && (
                  <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0, minWidth:180,
                    background:'#100e22', border:'1px solid rgba(255,255,255,.1)', borderRadius:10,
                    padding:'6px', zIndex:50,
                  }}>
                    <Link href="/ai-visibility-tool" onClick={() => setAccountOpen(false)} style={{ display:'block', padding:'8px 10px', borderRadius:6, fontSize:13, color:'#f5f8ff', textDecoration:'none' }}>
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut} style={{ display:'block', width:'100%', textAlign:'left', padding:'8px 10px', borderRadius:6, fontSize:13, color:'#f87171', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="sh-cta"
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
                Sign in →
              </Link>
            )}

            {/* ── Hamburger (mobile only) ── */}
            <button
              className="sh-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              style={{
                display:        'none',
                alignItems:     'center',
                justifyContent: 'center',
                width:          36,
                height:         36,
                background:     mobileOpen ? 'rgba(202,255,69,.08)' : 'rgba(255,255,255,.04)',
                border:         `1px solid ${mobileOpen ? 'rgba(202,255,69,.25)' : 'rgba(220,235,255,.1)'}`,
                borderRadius:   8,
                cursor:         'pointer',
                flexShrink:     0,
                transition:     'background .2s, border-color .2s',
                padding:        0,
              }}>
              {mobileOpen ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="#caff45" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M0 1H16M0 6H16M0 11H10" stroke="rgba(220,233,255,.7)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="sh-mobile-menu"
          style={{
            position:       'fixed',
            top:            65,
            left:           0,
            right:          0,
            bottom:         0,
            zIndex:         850,
            background:     'rgba(3,6,12,.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflowY:      'auto',
            animation:      'sh-slideIn .22s both',
            borderTop:      '1px solid rgba(220,235,255,.07)',
          }}>
          <div style={{ padding:'1.25rem 1.5rem 3rem' }}>

            {/* Tools section */}
            <div style={{ marginBottom:'1.5rem' }}>
              <button
                onClick={() => setToolsOpen(o => !o)}
                style={{
                  width:          '100%',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  background:     'none',
                  border:         'none',
                  padding:        '10px 0',
                  cursor:         'pointer',
                  borderBottom:   '1px solid rgba(220,235,255,.07)',
                  marginBottom:   toolsOpen ? 10 : 0,
                }}>
                <span style={{
                  fontFamily:    "'JetBrains Mono',monospace",
                  fontSize:      10,
                  color:         isToolsActive ? '#caff45' : 'rgba(220,233,255,.6)',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                }}>
                  Tools ({TOOLS.length})
                </span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transform: toolsOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s', opacity:.5 }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="#dce9ff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {toolsOpen && (
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {TOOLS.map(tool => (
                    <Link key={tool.href} href={tool.href} className="sh-mob-tool"
                      style={{
                        display:        'flex',
                        alignItems:     'center',
                        gap:            10,
                        padding:        '9px 10px',
                        borderRadius:   8,
                        textDecoration: 'none',
                        background:     isActive(tool.href) ? 'rgba(202,255,69,.06)' : 'transparent',
                        transition:     'background .15s',
                      }}>
                      <span style={{
                        width:       30,
                        height:      30,
                        display:     'grid',
                        placeItems:  'center',
                        background:  'rgba(255,255,255,.04)',
                        border:      `1px solid ${isActive(tool.href) ? 'rgba(202,255,69,.2)' : 'rgba(220,235,255,.09)'}`,
                        borderRadius:6,
                        fontSize:    14,
                        flexShrink:  0,
                      }}>
                        {tool.icon}
                      </span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{
                          fontFamily: "'Familjen Grotesk',sans-serif",
                          fontWeight: 600,
                          fontSize:   13,
                          color:      isActive(tool.href) ? '#caff45' : '#f5f8ff',
                        }}>
                          {tool.label}
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'rgba(220,233,255,.38)' }}>
                          {tool.desc}
                        </div>
                      </div>
                      <span style={{
                        fontFamily:  "'JetBrains Mono',monospace",
                        fontSize:    7,
                        padding:     '2px 6px',
                        borderRadius:3,
                        background:  tool.badgeColor,
                        border:      `1px solid ${tool.badgeBorder}`,
                        color:       tool.badgeText,
                        flexShrink:  0,
                      }}>
                        {tool.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav links */}
            <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:'2rem' }}>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="sh-mob-link"
                  style={{
                    fontFamily:    "'JetBrains Mono',monospace",
                    fontSize:      13,
                    color:         isActive(link.href) ? '#caff45' : 'rgba(230,239,255,.65)',
                    textDecoration:'none',
                    padding:       '11px 12px',
                    borderRadius:  8,
                    letterSpacing: '.03em',
                    transition:    'color .2s, background .2s',
                    display:       'block',
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            {user ? (
              <>
                <Link href="/ai-visibility-tool"
                  style={{
                    display:       'block',
                    textAlign:     'center',
                    fontFamily:    "'Familjen Grotesk',sans-serif",
                    fontWeight:    700,
                    fontSize:      14,
                    color:         '#07100b',
                    background:    '#caff45',
                    padding:       '13px 24px',
                    borderRadius:  100,
                    textDecoration:'none',
                    boxShadow:     '0 0 24px rgba(202,255,69,.2)',
                  }}>
                  Open Dashboard →
                </Link>
                <button onClick={handleSignOut}
                  style={{
                    display:'block', width:'100%', textAlign:'center', marginTop:10,
                    fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'#f87171',
                    background:'transparent', border:'1px solid rgba(248,113,113,.25)',
                    borderRadius:100, padding:'10px 24px', cursor:'pointer',
                  }}>
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login"
                style={{
                  display:       'block',
                  textAlign:     'center',
                  fontFamily:    "'Familjen Grotesk',sans-serif",
                  fontWeight:    700,
                  fontSize:      14,
                  color:         '#07100b',
                  background:    '#caff45',
                  padding:       '13px 24px',
                  borderRadius:  100,
                  textDecoration:'none',
                  boxShadow:     '0 0 24px rgba(202,255,69,.2)',
                }}>
                Sign in →
              </Link>
            )}

            {/* Status */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            6,
              marginTop:      16,
            }}>
              <span style={{
                width:        5,
                height:       5,
                borderRadius: '50%',
                background:   '#52e38e',
                boxShadow:    '0 0 6px rgba(82,227,142,.6)',
                animation:    'sh-pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#52e38e', letterSpacing:'.06em' }}>
                All systems live
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}