export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL required' }, { status: 400 })

    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // Fetch page content
    let pageText = ''
    let pageHtml = ''
    try {
      const pageRes = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
        signal: AbortSignal.timeout(8000)
      })
      pageHtml = await pageRes.text()
      pageText = pageHtml
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000)
    } catch (e) {
      pageText = ''
    }

    // Check for specific signals in raw HTML
    const hasAuthorSchema = /author/i.test(pageHtml)
    const hasOrgSchema = /Organization|WebSite/i.test(pageHtml)
    const hasSSL = targetUrl.startsWith('https')
    const hasAboutLink = /href=["'][^"']*about[^"']*["']/i.test(pageHtml)
    const hasPrivacyLink = /href=["'][^"']*privacy[^"']*["']/i.test(pageHtml)

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are an E-E-A-T and AEO authority expert. Always respond with valid JSON only — no markdown, no code fences.' },
          { role: 'user', content: `Audit the E-E-A-T signals for "${targetUrl}".

Detected signals:
- SSL/HTTPS: ${hasSSL}
- Author schema detected: ${hasAuthorSchema}
- Organization schema detected: ${hasOrgSchema}
- About page link found: ${hasAboutLink}
- Privacy policy link found: ${hasPrivacyLink}

Page content sample:
"""${pageText.slice(0, 2000)}"""

Return ONLY this JSON:
{
  "overall_score": <0-100>,
  "summary": "<2-3 sentence assessment of this site's E-E-A-T standing for AI engines>",
  "pillars": {
    "experience": {
      "score": <0-100>,
      "verdict": "<pass|warn|fail>",
      "found": ["<signal found if any>"],
      "missing": ["<specific missing signal>", "<missing signal>"],
      "fix": "<single most impactful fix for Experience>"
    },
    "expertise": {
      "score": <0-100>,
      "verdict": "<pass|warn|fail>",
      "found": ["<signal found>"],
      "missing": ["<missing signal>", "<missing signal>"],
      "fix": "<single most impactful fix for Expertise>"
    },
    "authoritativeness": {
      "score": <0-100>,
      "verdict": "<pass|warn|fail>",
      "found": ["<signal found>"],
      "missing": ["<missing signal>", "<missing signal>"],
      "fix": "<single most impactful fix for Authoritativeness>"
    },
    "trustworthiness": {
      "score": <0-100>,
      "verdict": "<pass|warn|fail>",
      "found": ["<signal found>"],
      "missing": ["<missing signal>", "<missing signal>"],
      "fix": "<single most impactful fix for Trustworthiness>"
    }
  },
  "quick_wins": [
    {"title": "<action>", "effort": "low|med|high", "impact": "low|med|high", "desc": "<specific implementation step>"},
    {"title": "<action>", "effort": "low|med|high", "impact": "low|med|high", "desc": "<specific implementation step>"},
    {"title": "<action>", "effort": "low|med|high", "impact": "low|med|high", "desc": "<specific implementation step>"}
  ],
  "ai_engine_readiness": {
    "chatgpt": "<good|fair|poor>",
    "gemini": "<good|fair|poor>",
    "perplexity": "<good|fair|poor>",
    "reason": "<1 sentence on which engine benefits most from E-E-A-T improvement for this site>"
  }
}` }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const data = JSON.parse(text.replace(/```json|```/g, '').trim())
    return Response.json({ ...data, url: targetUrl, detected: { hasSSL, hasAuthorSchema, hasOrgSchema, hasAboutLink, hasPrivacyLink } })

  } catch (err) {
    console.error('EEAT audit error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}