// app/blog/[slug]/ReadingProgress.tsx
'use client'

import { useEffect } from 'react'

export default function ReadingProgress({ tagColor }: { tagColor: string }) {
  useEffect(() => {
    const topFill     = document.getElementById('read-progress-fill')
    const sidebarFill = document.getElementById('sidebar-progress')

    function update() {
      const el      = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total   = el.scrollHeight - el.clientHeight
      const pct     = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
      const val     = pct + '%'
      if (topFill)     topFill.style.width     = val
      if (sidebarFill) sidebarFill.style.width = val
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [tagColor])

  return null
}