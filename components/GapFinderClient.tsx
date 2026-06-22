'use client'
import { useState } from 'react'

export default function GapFinderClient() {
  const [mode, setMode] = useState<'domain'|'niche'>('domain')
  const [domain, setDomain] = useState('')
  const [niche, setNiche] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)
  const [filter, setFilter] = useState<'all'|'first-mover'|'displacement'>('all')
  const [sortBy, setSortBy] = useState<'score'|'volume'>('score')
  const [copiedIdx, setCopiedIdx] = useState<number|null>(null)

  async function run() {
    setLoading(true); setError(''); setData(null)
    try {
      const competitor_domains = competitors.split('\n').map(u => u.trim()).filter(Boolean)
      const body = mode === 'domain' ? { domain, competitor_domains } : { niche, competitor_domains }
      const res = await fetch('/api/ai-answer-gap-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const typeColor: Record<string, string> = { 'first-mover': '#c8f247', displacement: '#f472b6' }
  const typeBg: Record<string, string> = { 'first-mover': 'rgba(200,242,71,.08)', displacement: 'rgba(244,114,182,.08)' }
  const typeBorder: Record<string, string> = { 'first-mover': 'rgba(200,242,71,.25)', displacement: 'rgba(244,114,182,.25)' }
  const volumeColor: Record<string, string> = { high: '#4ade80', medium: '#c8f247', low: 'rgba(255,255,255,.4)' }
  const intentColor: Record<string, string> = { definition: '#22d3ee', 'how-to': '#4ade80', comparison: '#f472b6', 'best-of': '#c8f247', explanation: '#7b6cff' }
  const scoreColor = (s: number) => s >= 70 ? '#4ade80' : s >= 40 ? '#c8f247' : '#f87171'

  const filtered = data?.gaps
    ?.filter((g: any) => filter === 'all' || g.gap_type === filter)
    ?.sort((a: any, b: any) => sortBy === 'score' ? b.opportunity_score - a.opportunity_score : (b.search_volume === 'high' ? 1 : 0) - (a.search_volume === 'high' ? 1 : 0))
    || []

  function copyGap(gap: any, idx: number) {
    const text = `Question: ${gap.question}\nFormat: ${gap.recommended_format}\nWord count: ${gap.word_count}\nSchema: ${gap.schema}\nAngle: ${gap.content_angle}`
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1800)
  }

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        {(['domain', 'niche'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', letterSpacing: '.06em', textTransform: 'uppercase', padding: '.45rem 1rem', borderRadius: '8px', border: `1px solid ${mode === m ? 'rgba(200,242,71,.4)' : 'rgba(255,255,255,.1)'}`, background: mode === m ? 'rgba(200,242,71,.08)' : 'transparent', color: mode === m ? '#c8f247' : 'rgba(255,255,255,.5)', cursor: 'pointer' }}>
            {m === 'domain' ? 'My domain' : 'Topic / niche'}
          </button>
        ))}
      </div>

      <div style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem', maxWidth: '700px' }}>
        <div style={{ marginBottom: '1rem' }}>
          {mode === 'domain' ? (
            <>
              <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: '.4rem' }}>Your domain *</label>
              <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="https://yourdomain.com" style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '9px', padding: '.8rem 1rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </>
          ) : (
            <>
              <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: '.4rem' }}>Topic or niche *</label>
              <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. B2B SaaS marketing, AEO tools, project management software" style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '9px', padding: '.8rem 1rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', display: 'block', marginBottom: '.4rem' }}>Competitor domains <span style={{ color: 'rgba(255,255,255,.25)' }}>(optional — one per line)</span></label>
          <textarea value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder={'https://competitor1.com\nhttps://competitor2.com'} rows={3} style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '9px', padding: '.8rem 1rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', color: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <button onClick={run} disabled={loading || (!domain && !niche)} style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '.88rem', background: loading || (!domain && !niche) ? 'rgba(200,242,71,.4)' : '#c8f247', color: '#04030c', border: 'none', borderRadius: '10px', padding: '.85rem 1.8rem', cursor: loading || (!domain && !niche) ? 'default' : 'pointer' }}>
          {loading ? 'Finding gaps...' : 'Find AI answer gaps'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: '10px', padding: '.85rem 1.1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1.5rem', maxWidth: '700px' }}>{error}</div>}
      {loading && <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', padding: '2rem 0' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8f247', animation: 'blink 1s ease-in-out infinite', display: 'inline-block' }} />Scanning AI engines for unanswered questions in your niche...</div>}

      {data && (
        <div>
          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'rgba(255,255,255,.4)', marginBottom: '.4rem' }}>Niche detected: <span style={{ color: '#c8f247' }}>{data.inferred_niche}</span></div>
            <div style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.72)', lineHeight: 1.65 }}>{data.summary}</div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.75rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Total gaps found', val: data.total_gaps || data.gaps?.length || 0 },
              { label: 'First-mover', val: data.gaps?.filter((g: any) => g.gap_type === 'first-mover').length || 0, color: '#c8f247' },
              { label: 'Displacement', val: data.gaps?.filter((g: any) => g.gap_type === 'displacement').length || 0, color: '#f472b6' },
            ].map(s => (
              <div key={s.label} style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.6rem', color: s.color || '#fff', lineHeight: 1, marginBottom: '.3rem' }}>{s.val}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter + sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '.4rem' }}>
              {(['all', 'first-mover', 'displacement'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', textTransform: 'uppercase', letterSpacing: '.04em', padding: '.35rem .75rem', borderRadius: '6px', border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(255,255,255,.25)' : typeBorder[f]) : 'rgba(255,255,255,.1)'}`, background: filter === f ? (f === 'all' ? 'rgba(255,255,255,.05)' : typeBg[f]) : 'transparent', color: filter === f ? (f === 'all' ? '#fff' : typeColor[f]) : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.3)' }}>Sort:</span>
              {(['score', 'volume'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', padding: '.3rem .6rem', borderRadius: '5px', border: `1px solid ${sortBy === s ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.08)'}`, background: sortBy === s ? 'rgba(255,255,255,.06)' : 'transparent', color: sortBy === s ? '#fff' : 'rgba(255,255,255,.35)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.04em' }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Gap cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {filtered.map((gap: any, i: number) => (
              <div key={i} style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', marginBottom: '.85rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: scoreColor(gap.opportunity_score), flexShrink: 0 }}>{gap.opportunity_score}</span>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 600, fontSize: '.95rem', color: '#fff', marginBottom: '.3rem', lineHeight: 1.4 }}>{gap.question}</div>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', textTransform: 'uppercase', color: typeColor[gap.gap_type], background: typeBg[gap.gap_type], border: `1px solid ${typeBorder[gap.gap_type]}`, padding: '.15rem .45rem', borderRadius: '4px' }}>{gap.gap_type}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', textTransform: 'uppercase', color: volumeColor[gap.search_volume], background: `${volumeColor[gap.search_volume]}12`, border: `1px solid ${volumeColor[gap.search_volume]}30`, padding: '.15rem .45rem', borderRadius: '4px' }}>vol: {gap.search_volume}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', textTransform: 'uppercase', color: intentColor[gap.ai_intent] || '#c8f247', background: `${intentColor[gap.ai_intent] || '#c8f247'}12`, border: `1px solid ${intentColor[gap.ai_intent] || '#c8f247'}30`, padding: '.15rem .45rem', borderRadius: '4px' }}>{gap.ai_intent}</span>
                    </div>
                  </div>
                  <button onClick={() => copyGap(gap, i)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', background: 'none', border: '1px solid rgba(255,255,255,.15)', borderRadius: '6px', color: copiedIdx === i ? '#4ade80' : 'rgba(255,255,255,.4)', cursor: 'pointer', padding: '.3rem .65rem', flexShrink: 0 }}>
                    {copiedIdx === i ? '✓' : 'Copy brief'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.6rem' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: '.2rem' }}>Why gap exists</div>
                    <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{gap.why_gap}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: '.2rem' }}>Winning angle</div>
                    <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{gap.content_angle}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: '.2rem' }}>Recommended format</div>
                    <div style={{ fontSize: '.78rem', color: '#c8f247' }}>{gap.recommended_format}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(255,255,255,.35)', marginTop: '.2rem' }}>{gap.word_count} words · {gap.schema}</div>
                  </div>
                </div>

                {gap.currently_cited && gap.currently_cited.toLowerCase() !== 'none' && (
                  <div style={{ marginTop: '.75rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: '#f87171', background: 'rgba(248,113,113,.05)', border: '1px solid rgba(248,113,113,.15)', borderRadius: '6px', padding: '.4rem .75rem' }}>
                    Currently cited: <span style={{ color: '#f87171', fontWeight: 600 }}>{gap.currently_cited}</span> — displacement opportunity
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}