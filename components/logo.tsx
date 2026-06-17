'use client'
import { useRouter } from 'next/navigation'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg'
type LogoVariant = 'full' | 'mark' | 'wordmark' | 'nav'

interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  onClick?: () => void
  href?: string
}

const sizes = {
  xs: { mark: 32, radius: 8,  nucleus: 6,  r1: 14, r2: 20, dot: 3,  orbit: 20, font: 16, subFont: 0  },
  sm: { mark: 36, radius: 9,  nucleus: 8,  r1: 18, r2: 28, dot: 4,  orbit: 28, font: 18, subFont: 8  },
  md: { mark: 72, radius: 18, nucleus: 12, r1: 30, r2: 44, dot: 5,  orbit: 44, font: 28, subFont: 9  },
  lg: { mark: 96, radius: 22, nucleus: 16, r1: 40, r2: 60, dot: 6,  orbit: 60, font: 38, subFont: 11 },
}

function OrbitMark({ s }: { s: typeof sizes['md'] }) {
  return (
    <div style={{
      width: s.mark, height: s.mark,
      background: 'linear-gradient(145deg,#0f1c0a,#1a2e10)',
      border: '1.5px solid rgba(202,255,69,.3)',
      borderRadius: s.radius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
      animation: 'ncGlow 3s ease-in-out infinite, ncFloat 5s ease-in-out infinite',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,transparent,rgba(202,255,69,.4),transparent)',
        animation: 'ncScan 3s linear infinite',
      }} />
      <div style={{ position: 'relative', width: s.orbit, height: s.orbit, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Rings */}
        {[s.r1, s.r2].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', width: r, height: r, borderRadius: '50%',
            border: '1px solid rgba(202,255,69,.15)',
            animation: `ncRingPulse 2.4s ${i * 0.8}s ease-in-out infinite`,
          }} />
        ))}
        {/* Nucleus */}
        <div style={{
          width: s.nucleus, height: s.nucleus, background: '#caff45', borderRadius: '50%',
          boxShadow: '0 0 14px rgba(202,255,69,.8)', position: 'relative', zIndex: 2,
          animation: 'ncPulse 2s ease-in-out infinite',
        }} />
        {/* Orbiting dots */}
        {[
          { color: '#45e4ff', anim: 'ncOrbitA 2.8s linear infinite' },
          { color: '#927cff', anim: 'ncOrbitB 2.8s linear infinite' },
          { color: '#52e38e', anim: 'ncOrbitC 2.8s linear infinite' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', width: s.dot, height: s.dot, borderRadius: '50%',
            background: d.color, boxShadow: `0 0 8px ${d.color}`,
            top: '50%', left: '50%', marginTop: -s.dot/2, marginLeft: -s.dot/2,
            animation: d.anim,
            ['--r' as any]: `${s.r2 * 0.5}px`,
          }} />
        ))}
      </div>
    </div>
  )
}

export default function Logo({ size = 'md', variant = 'full', onClick, href }: LogoProps) {
  const router = useRouter()
  const s = sizes[size]

  const handleClick = () => {
    if (onClick) onClick()
    else if (href) router.push(href)
  }

  const css = `
    @keyframes ncGlow{0%,100%{box-shadow:0 0 0 0 rgba(202,255,69,0)}50%{box-shadow:0 0 32px 8px rgba(202,255,69,.18)}}
    @keyframes ncFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes ncScan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
    @keyframes ncRingPulse{0%,100%{opacity:.18}50%{opacity:.35}}
    @keyframes ncPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
    @keyframes ncOrbitA{0%{transform:rotate(0deg) translateX(${s.r2*0.5}px) rotate(0deg)}100%{transform:rotate(360deg) translateX(${s.r2*0.5}px) rotate(-360deg)}}
    @keyframes ncOrbitB{0%{transform:rotate(120deg) translateX(${s.r2*0.5}px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(${s.r2*0.5}px) rotate(-480deg)}}
    @keyframes ncOrbitC{0%{transform:rotate(240deg) translateX(${s.r2*0.5}px) rotate(-240deg)}100%{transform:rotate(600deg) translateX(${s.r2*0.5}px) rotate(-600deg)}}
  `

  // Nav variant — matches your current sidebar exactly
  if (variant === 'nav') {
    return (
      <>
        <style>{css}</style>
        <div onClick={handleClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{
            width: 32, height: 32, display: 'grid', placeItems: 'center',
            background: '#caff45', color: '#07100b', borderRadius: 7,
            boxShadow: '0 0 34px rgba(202,255,69,.2)',
            fontFamily: '"Familjen Grotesk",sans-serif', fontWeight: 800, fontSize: 14,
            animation: 'ncFloat 5s ease-in-out infinite',
          }}>A</div>
          <span style={{ fontFamily: '"Familjen Grotesk",sans-serif', fontWeight: 700, fontSize: 18, color: '#f5f8ff' }}>
            Notion <span style={{ color: '#caff45' }}>Cue</span>
          </span>
        </div>
      </>
    )
  }

  // Mark only
  if (variant === 'mark') {
    return (
      <>
        <style>{css}</style>
        <div onClick={handleClick} style={{ cursor: href || onClick ? 'pointer' : 'default' }}>
          <OrbitMark s={s} />
        </div>
      </>
    )
  }

  // Full lockup (default)
  return (
    <>
      <style>{css}</style>
      <div onClick={handleClick} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: href || onClick ? 'pointer' : 'default' }}>
        <OrbitMark s={s} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontFamily: '"Familjen Grotesk",sans-serif', fontWeight: 700, fontSize: s.font, letterSpacing: '-.04em', color: '#f5f8ff', lineHeight: 1 }}>
            Notion<span style={{ color: '#caff45' }}>Cue</span>
          </div>
          {s.subFont > 0 && (
            <div style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: s.subFont, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(230,239,255,.35)' }}>
              AI Visibility Platform
            </div>
          )}
        </div>
      </div>
    </>
  )
}