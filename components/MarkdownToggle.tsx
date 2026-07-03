'use client'

import { useState } from 'react'

interface Props {
  slug: string
  markdown: string  // pre-rendered on the server, passed as prop
}

export default function MarkdownToggle({ slug, markdown }: Props) {
  const [open, setOpen]     = useState(false)
  const [copied, setCopied] = useState(false)

  const rawUrl = `/blog/${slug}/raw`

  function copyMarkdown() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Toggle button row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: open ? '12px' : 0 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
            background: open ? 'rgba(202,255,69,.1)' : 'rgba(255,255,255,.04)',
            border: `1px solid ${open ? 'rgba(202,255,69,.3)' : 'rgba(255,255,255,.1)'}`,
            color: open ? '#caff45' : 'rgba(255,255,255,.55)',
            fontFamily: "'JetBrains Mono',monospace", fontSize: '11px',
            transition: 'all .15s',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          {open ? 'Hide Markdown' : 'View as Markdown'}
        </button>

        {open && (
          <>
            <button
              onClick={copyMarkdown}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
                color: copied ? '#52e38e' : 'rgba(255,255,255,.45)',
                fontFamily: "'JetBrains Mono',monospace", fontSize: '11px',
                transition: 'color .15s',
              }}
            >
              {copied ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg> Copied</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
              )}
            </button>

            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '6px',
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
                color: 'rgba(255,255,255,.45)', fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px', textDecoration: 'none',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Raw .md
            </a>
          </>
        )}
      </div>

      {/* Markdown preview panel */}
      {open && (
        <div style={{
          background: '#08061a',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          maxHeight: '420px',
          overflowY: 'auto',
          position: 'relative',
        }}>
          {/* LLM hint banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '6px 10px', borderRadius: '6px', marginBottom: '14px',
            background: 'rgba(202,255,69,.05)', border: '1px solid rgba(202,255,69,.15)',
            fontSize: '11px', color: 'rgba(202,255,69,.7)',
            fontFamily: "'JetBrains Mono',monospace",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            AI crawlers can fetch this post directly at
            <a href={rawUrl} style={{ color: '#caff45', textDecoration: 'none' }}>{rawUrl}</a>
          </div>

          <pre style={{
            margin: 0, fontFamily: "'JetBrains Mono',monospace",
            fontSize: '11.5px', lineHeight: 1.7,
            color: 'rgba(255,255,255,.75)', whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {markdown}
          </pre>
        </div>
      )}
    </div>
  )
}