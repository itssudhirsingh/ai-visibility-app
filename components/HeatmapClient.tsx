'use client'
import { useState } from 'react'

export default function HeatmapClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [filter, setFilter] = useState<'all'|'high'|'medium'|'low'>('all')

  async function run() {
    if (!url.trim()) return
    setLoading(true); setError(''); setData(null)
    
    try {
      const res = await fetch('/api/visibility-heatmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error — please try again.') }
    finally { setLoading(false) }
  }

  const bandColor: Record<string, string> = { high: '#4ade80', medium: '#c8f247', low: '#f87171' }
  const bandBg: Record<string, string> = { high: 'rgba(74,222,128,.1)', medium: 'rgba(200,242,71,.08)', low: 'rgba(248,113,113,.08)' }
  const bandBorder: Record<string, string> = { high: 'rgba(74,222,128,.25)', medium: 'rgba(200,242,71,.2)', low: 'rgba(248,113,113,.2)' }

  const filtered = data?.pages?.filter((p: any) => filter === 'all' || p.citation_band === filter) || []

  return (
    <div>
      <div style={{ display: 'flex', gap: '.75rem', maxWidth: '640px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={url} onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          placeholder="https://yourdomain.com"
          style={{ flex: 1, minWidth: '220px', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.16)', borderRadius: '10px', padding: '.85rem 1.1rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', color: '#fff', outline: 'none' }}
        />
        <button onClick={run} disabled={loading} style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.85rem', background: loading ? 'rgba(200,242,71,.4)' : '#c8f247', color: '#04030c', border: 'none', borderRadius: '10px', padding: '.85rem 1.6rem', cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
          {loading ? 'Scanning site...' : 'Generate heatmap'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: '10px', padding: '.85rem 1.1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1.5rem', maxWidth: '640px' }}>{error}</div>}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', padding: '2rem 0' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8f247', animation: 'blink 1s ease-in-out infinite', display: 'inline-block' }} />
          Crawling sitemap and scoring pages for AEO citation potential...
        </div>
      )}

      {data && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Overall AEO', val: `${data.overall_aeo_score}/100`, color: data.overall_aeo_score >= 70 ? '#4ade80' : data.overall_aeo_score >= 40 ? '#c8f247' : '#f87171' },
              { label: 'High citation', val: data.summary?.high_count || 0, color: '#4ade80' },
              { label: 'Medium citation', val: data.summary?.medium_count || 0, color: '#c8f247' },
              { label: 'Low citation', val: data.summary?.low_count || 0, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: s.color, lineHeight: 1, marginBottom: '.3rem' }}>{s.val}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Summary + top opportunity */}
          {data.summary && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '.5rem' }}>Key insight</div>
                <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.78)', lineHeight: 1.65 }}>{data.summary.biggest_gap}</div>
              </div>
              <div style={{ background: 'rgba(200,242,71,.05)', border: '1px solid rgba(200,242,71,.2)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#c8f247', marginBottom: '.5rem' }}>Top opportunity</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: '#fff' }}>{data.summary.top_opportunity}</div>
              </div>
            </div>
          )}

          {/* Filter + view controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <div style={{ display: 'flex', gap: '.4rem' }}>
              {(['all', 'high', 'medium', 'low'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.06em', textTransform: 'uppercase', padding: '.35rem .75rem', borderRadius: '6px', border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(255,255,255,.3)' : bandBorder[f]) : 'rgba(255,255,255,.1)'}`, background: filter === f ? (f === 'all' ? 'rgba(255,255,255,.06)' : bandBg[f]) : 'transparent', color: filter === f ? (f === 'all' ? '#fff' : bandColor[f]) : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>
                  {f === 'all' ? `All (${data.pages?.length || 0})` : `${f} (${data.pages?.filter((p: any) => p.citation_band === f).length || 0})`}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.4rem' }}>
              {(['grid', 'list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', padding: '.35rem .65rem', borderRadius: '6px', border: `1px solid ${view === v ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.08)'}`, background: view === v ? 'rgba(255,255,255,.06)' : 'transparent', color: view === v ? '#fff' : 'rgba(255,255,255,.35)', cursor: 'pointer' }}>
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid view — heatmap tiles */}
          {view === 'grid' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '.6rem' }}>
              {filtered.map((page: any, i: number) => (
                <a key={i} href={page.full_url} target="_blank" rel="noopener noreferrer" style={{ background: bandBg[page.citation_band], border: `1px solid ${bandBorder[page.citation_band]}`, borderRadius: '10px', padding: '1rem', textDecoration: 'none', display: 'block', transition: 'opacity .2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>{page.page_type}</span>
                    <span style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: bandColor[page.citation_band] }}>{page.citation_score}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: '#fff', marginBottom: '.4rem', wordBreak: 'break-all' }}>{page.slug}</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.5 }}>{page.primary_issue}</div>
                </a>
              ))}
            </div>
          )}

          {/* List view */}
          {view === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {filtered.map((page: any, i: number) => (
                <div key={i} style={{ background: '#100e22', border: `1px solid ${bandBorder[page.citation_band]}`, borderRadius: '10px', padding: '.9rem 1.1rem', display: 'grid', gridTemplateColumns: '60px 1fr 1fr 120px', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: bandColor[page.citation_band] }}>{page.citation_score}</span>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: '#fff', marginBottom: '.2rem' }}>{page.slug}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>{page.page_type}</div>
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)' }}>{page.quick_fix}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem' }}>
                    {page.engines_likely?.slice(0, 2).map((e: string) => (
                      <span key={e} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.4)', border: '1px solid rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '3px' }}>{e}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {[['high', '70–100 — High citation potential'],['medium', '40–69 — Medium citation potential'],['low', '0–39 — Low citation potential']].map(([band, label]) => (
              <div key={band} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: bandBg[band], border: `1px solid ${bandBorder[band]}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.4)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}