export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL required' }, { status: 400 })

    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`
    const domain = new URL(targetUrl).hostname

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // 1. Fetch llms.txt
    let llmsContent = ''
    let llmsStatus = 404
    let llmsUrl = ''

    for (const tryUrl of [`https://${domain}/llms.txt`, `https://www.${domain}/llms.txt`]) {
      try {
        const res = await fetch(tryUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
          signal: AbortSignal.timeout(6000),
        })
        llmsStatus = res.status
        if (res.ok) {
          llmsContent = await res.text()
          llmsUrl = tryUrl
          break
        }
      } catch { continue }
    }

    // 2. Fetch robots.txt for comparison
    let robotsContent = ''
    try {
      const robotsRes = await fetch(`https://${domain}/robots.txt`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
        signal: AbortSignal.timeout(5000),
      })
      if (robotsRes.ok) robotsContent = await robotsRes.text()
    } catch { /* silent */ }

    // 3. Known AI bots
    const AI_BOTS = ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Amazonbot', 'Bytespider', 'FacebookBot', 'CCBot']

    // Check robots.txt for bot status
    const robotsBotStatus: Record<string, string> = {}
    if (robotsContent) {
      AI_BOTS.forEach(bot => {
        const botSection = robotsContent.match(new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?(?=User-agent:|$)`, 'i'))
        if (botSection) {
          const section = botSection[0]
          if (/Disallow:\s*\//i.test(section) && !/Disallow:\s*\n/i.test(section)) {
            robotsBotStatus[bot] = 'blocked'
          } else if (/Allow:\s*\//i.test(section) || /Disallow:\s*\n/i.test(section) || /Disallow:\s*$/im.test(section)) {
            robotsBotStatus[bot] = 'allowed'
          } else {
            robotsBotStatus[bot] = 'partial'
          }
        } else {
          // Check wildcard
          const wildcardSection = robotsContent.match(/User-agent:\s*\*[\s\S]*?(?=User-agent:|$)/i)
          if (wildcardSection) {
            const wc = wildcardSection[0]
            robotsBotStatus[bot] = /Disallow:\s*\//i.test(wc) ? 'blocked-by-wildcard' : 'allowed-by-wildcard'
          } else {
            robotsBotStatus[bot] = 'not-specified'
          }
        }
      })
    }

    // 4. AI validation
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an llms.txt and robots.txt expert. Validate files line by line and check for AEO configuration issues. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: `Validate the llms.txt and robots.txt for "${domain}".

llms.txt status: HTTP ${llmsStatus}
llms.txt URL checked: https://${domain}/llms.txt
llms.txt content:
"""
${llmsContent || '(file not found or empty)'}
"""

robots.txt content:
"""
${robotsContent ? robotsContent.slice(0, 2000) : '(not found)'}
"""

Known AI bot status from robots.txt:
${JSON.stringify(robotsBotStatus, null, 2)}

Return ONLY this JSON:
{
  "domain": "${domain}",
  "llms_txt": {
    "exists": ${llmsStatus === 200},
    "url": "${llmsUrl || `https://${domain}/llms.txt`}",
    "http_status": ${llmsStatus},
    "line_count": ${llmsContent ? llmsContent.split('\n').filter(l => l.trim()).length : 0},
    "format_valid": <true|false>,
    "issues": [
      { "line": <line number or null>, "severity": "error|warning|info", "issue": "<specific issue>", "fix": "<exact fix>" }
    ],
    "has_name": <true|false>,
    "has_description": <true|false>,
    "bots_declared": ["<bot name>"]
  },
  "robots_txt": {
    "exists": ${!!robotsContent},
    "conflicts": [
      { "bot": "<bot name>", "llms_status": "<allowed|blocked|not-declared>", "robots_status": "<allowed|blocked>", "conflict": true|false, "note": "<1 sentence>" }
    ]
  },
  "bot_coverage": [
    { "bot": "<bot name>", "in_llms": true|false, "robots_status": "<allowed|blocked|not-specified|not-checked>", "overall": "<green|amber|red>", "action": "<what to do>" }
  ],
  "overall_score": <0-100>,
  "overall_verdict": "<pass|warn|fail>",
  "top_fix": "<single most important fix to make right now>"
}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Response.json({ ...data, raw_llms: llmsContent.slice(0, 2000) })
  } catch (err) {
    console.error('llms.txt validator error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}