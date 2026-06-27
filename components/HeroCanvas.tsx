'use client'

import { useRef, useEffect } from 'react'

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let W = 0, H = 0, animId = 0
    interface Pt { x:number; y:number; z:number; vx:number; vy:number }
    let pts: Pt[] = []

    function resize() {
      W = canvas!.width = canvas!.offsetWidth
      H = canvas!.height = canvas!.offsetHeight
      pts = Array.from({ length: Math.min(70, Math.floor(W * H / 18000)) }, () => ({
        x: Math.random() * W, y: Math.random() * H, z: Math.random(),
        vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .15,
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1 })
      for (let a = 0; a < pts.length; a++) {
        for (let b = a + 1; b < pts.length; b++) {
          const A = pts[a], B = pts[b]
          const d = Math.hypot(A.x - B.x, A.y - B.y)
          if (d < 130) { ctx!.strokeStyle = `rgba(123,108,255,${(1 - d / 130) * .18})`; ctx!.lineWidth = .8; ctx!.beginPath(); ctx!.moveTo(A.x, A.y); ctx!.lineTo(B.x, B.y); ctx!.stroke() }
        }
        const p = pts[a]
        ctx!.fillStyle = `rgba(200,242,71,${.1 + p.z * .25})`
        ctx!.beginPath(); ctx!.arc(p.x, p.y, 1 + p.z * 1.8, 0, Math.PI * 2); ctx!.fill()
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0, opacity:.6 }}
    />
  )
}