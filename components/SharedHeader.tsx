'use client'
import { useRouter, usePathname } from 'next/navigation'

export default function SharedHeader() {
  const router = useRouter()
  const path = usePathname()

  const navLinks = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features',     href: '/#features' },
  { label: 'Pricing',      href: '/#pricing' },
  { label: 'Resources',    href: '/aeo-guide' },
  { label: 'Blog',         href: '/resources/blog' },
  { label: 'Company',      href: '/about' },
]

  function navigate(href: string) {
    if (href.startsWith('/#')) {
      if (path === '/') {
        const id = href.slice(2)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push(href)
      }
    } else if (href.includes('#')) {
      const [page, hash] = href.split('#')
      if (path === page) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        router.push(href)
      }
    } else {
      router.push(href)
    }
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.3rem 3.5rem',
      background: 'rgba(4,3,12,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Logo */}
      <div onClick={() => router.push('/')} style={{
        display: 'flex', alignItems: 'center', gap: '.6rem',
        fontFamily: "'Familjen Grotesk', sans-serif", fontWeight: 700,
        fontSize: '1rem', color: '#fff', cursor: 'pointer',
      }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '7px',
          background: 'linear-gradient(135deg,#7b6cff,#c8f247)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.75rem', fontWeight: 700, color: '#fff',
        }}>A</div>
        Notion Cue
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
        {navLinks.map(n => (
          <span key={n.href} onClick={() => navigate(n.href)} style={{
            fontSize: '.8rem', color: 'rgba(237,233,255,0.55)',
            cursor: 'pointer', transition: 'color .2s',
            fontFamily: "'Epilogue', sans-serif",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ede9ff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,233,255,0.55)')}
          >{n.label}</span>
        ))}
      </div>

      {/* CTA — Start free only */}
      <button onClick={() => router.push('/dashboard')} style={{
        fontFamily: "'Familjen Grotesk', sans-serif", fontSize: '.78rem',
        fontWeight: 700, padding: '.5rem 1.2rem', borderRadius: '100px',
        border: 'none', background: '#c8f247', color: '#04030c',
        cursor: 'pointer',
      }}>Start free</button>
    </nav>
  )
}