'use client'
import { useState } from 'react'

export default function LlmsValidatorClient() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)
  const [showRaw, setShowRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  async function run() {
    if (!url.trim()) return
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/llms-validator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const json = await res.json()
      if (!res.ok) setError(json.error || 'Something went wrong.')
      else setData(json)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const verdictColor: Record<string, string> = { pass: '#4ade80', warn: '#c8f247', fail: '#f87171' }
  const severityColor: Record<string, string> = { error: '#f87171', warning: '#c8f247', info: '#22d3ee' }
  const overallColor: Record<string, string> = { green: '#4ade80', amber: '#c8f247', red: '#f87171' }

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
          {loading ? 'Validating...' : 'Validate llms.txt'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: '10px', padding: '.85rem 1.1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1.5rem', maxWidth: '640px' }}>{error}</div>}
      {loading && <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', color: 'rgba(255,255,255,.4)', fontFamily: "'JetBrains Mono',monospace", fontSize: '.78rem', padding: '2rem 0' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8f247', animation: 'blink 1s ease-in-out infinite', display: 'inline-block' }} />Fetching llms.txt and robots.txt, validating against AI bot spec...</div>}

      {data && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Score + verdict */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Familjen Grotesk',sans-serif", fontWeight: 700, fontSize: '2.8rem', color: verdictColor[data.overall_verdict] || '#c8f247', lineHeight: 1 }}>{data.overall_score}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(255,255,255,.4)', marginTop: '.3rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>{data.overall_verdict}</div>
            </div>
            <div style={{ background: `${verdictColor[data.overall_verdict] || '#c8f247'}08`, border: `1px solid ${verdictColor[data.overall_verdict] || '#c8f247'}25`, borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: verdictColor[data.overall_verdict] || '#c8f247', marginBottom: '.5rem' }}>Top fix</div>
              <div style={{ fontSize: '.88rem', color: '#fff', lineHeight: 1.65 }}>{data.top_fix}</div>
            </div>
          </div>

          {/* llms.txt status */}
          <div style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: data.llms_txt?.exists ? '#4ade80' : '#f87171' }}>
                {data.llms_txt?.exists ? '✓ File found' : '✗ File not found'}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'rgba(255,255,255,.4)' }}>HTTP {data.llms_txt?.http_status}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem', color: 'rgba(255,255,255,.4)' }}>{data.llms_txt?.url}</span>
              {data.llms_txt?.exists && (
                <button onClick={() => setShowRaw(!showRaw)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', background: 'none', border: '1px solid rgba(255,255,255,.15)', borderRadius: '5px', color: 'rgba(255,255,255,.5)', cursor: 'pointer', padding: '.2rem .55rem', marginLeft: 'auto' }}>
                  {showRaw ? 'Hide raw' : 'View raw'}
                </button>
              )}
            </div>

            {showRaw && data.raw_llms && (
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', lineHeight: 1.7, color: 'rgba(255,255,255,.65)', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '8px', padding: '1rem', overflowX: 'auto', maxHeight: '200px', margin: 0 }}>
                  {data.raw_llms}
                </pre>
                <button onClick={() => { navigator.clipboard.writeText(data.raw_llms); setCopied(true); setTimeout(() => setCopied(false), 1500) }} style={{ position: 'absolute', top: '.5rem', right: '.5rem', fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '5px', color: copied ? '#4ade80' : 'rgba(255,255,255,.5)', cursor: 'pointer', padding: '.25rem .55rem' }}>
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            )}

            {/* Issues */}
            {data.llms_txt?.issues?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {data.llms_txt.issues.map((issue: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start', padding: '.65rem .85rem', background: `${severityColor[issue.severity] || '#c8f247'}06`, border: `1px solid ${severityColor[issue.severity] || '#c8f247'}20`, borderRadius: '8px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', textTransform: 'uppercase', color: severityColor[issue.severity], background: `${severityColor[issue.severity]}18`, border: `1px solid ${severityColor[issue.severity]}35`, padding: '.12rem .4rem', borderRadius: '3px', flexShrink: 0, marginTop: '.1rem' }}>{issue.severity}</span>
                    <div>
                      <div style={{ fontSize: '.82rem', color: '#fff', marginBottom: '.2rem' }}>{issue.issue}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', color: '#4ade80' }}>Fix: {issue.fix}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.llms_txt?.issues?.length === 0 && data.llms_txt?.exists && (
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: '#4ade80' }}>✓ No format issues detected</div>
            )}
          </div>

          {/* Bot coverage table */}
          <div style={{ background: '#100e22', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr 120px', padding: '.7rem 1.1rem', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(255,255,255,.02)' }}>
              {['Bot', 'In llms.txt', 'robots.txt', 'Action', 'Status'].map(h => (
                <div key={h} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{h}</div>
              ))}
            </div>
            {data.bot_coverage?.map((bot: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr 120px', padding: '.65rem 1.1rem', borderBottom: i < data.bot_coverage.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.75rem', color: '#fff' }}>{bot.bot}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: bot.in_llms ? '#4ade80' : '#f87171' }}>{bot.in_llms ? '✓ Yes' : '✗ No'}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: bot.robots_status?.includes('block') ? '#f87171' : '#4ade80' }}>{bot.robots_status?.replace(/-/g, ' ')}</span>
                <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)' }}>{bot.action}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: overallColor[bot.overall] || '#c8f247', background: `${overallColor[bot.overall] || '#c8f247'}12`, border: `1px solid ${overallColor[bot.overall] || '#c8f247'}30`, padding: '.15rem .45rem', borderRadius: '4px', textTransform: 'uppercase' }}>{bot.overall}</span>
              </div>
            ))}
          </div>

          {/* Conflicts */}
          {data.robots_txt?.conflicts?.filter((c: any) => c.conflict).length > 0 && (
            <div style={{ background: 'rgba(248,113,113,.05)', border: '1px solid rgba(248,113,113,.2)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f87171', marginBottom: '.75rem' }}>⚠ Conflicts between llms.txt and robots.txt</div>
              {data.robots_txt.conflicts.filter((c: any) => c.conflict).map((c: any, i: number) => (
                <div key={i} style={{ fontSize: '.82rem', color: 'rgba(255,255,255,.7)', marginBottom: '.4rem' }}>
                  <strong style={{ color: '#f87171' }}>{c.bot}</strong> — {c.note}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  )
}