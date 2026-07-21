export async function POST(req: Request) {
  try {
    const { domain, niche, competitor_domains } = await req.json()
    if (!domain && !niche) return Response.json({ error: 'Domain or niche required' }, { status: 400 })

    const apiKey = process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    // Fetch homepage content to infer niche if not provided
    let pageContext = ''
    let targetDomain = domain || ''

    if (domain && !niche) {
      let targetUrl = domain.trim()
      if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`
      targetDomain = new URL(targetUrl).hostname
      try {
        const res = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NotionCueBot/1.0)' },
          signal: AbortSignal.timeout(7000),
        })
        const html = await res.text()
        pageContext = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 2000)
      } catch { /* silent */ }
    }

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
            content: 'You are an AEO content strategist who specialises in finding questions AI engines answer where no brand is consistently cited. Always respond with valid JSON only — no markdown, no code fences.',
          },
          {
            role: 'user',
            content: `Find AI answer gaps for:
Domain: ${targetDomain || 'not provided'}
Niche / topic: ${niche || 'infer from page content'}
Competitor domains to compare: ${competitor_domains?.join(', ') || 'none provided'}

${pageContext ? `Homepage content:\n"""${pageContext}"""\n` : ''}

Find the top 20 questions that AI engines like ChatGPT, Perplexity, and Gemini answer within this niche, where:
- Option A: No brand is consistently cited (pure gap — first-mover opportunity)
- Option B: A competitor is cited but the content is weak or incomplete (displacement opportunity)

Return ONLY this JSON:
{
  "domain": "${targetDomain}",
  "inferred_niche": "<what niche/industry was detected>",
  "total_gaps": 20,
  "gaps": [
    {
      "question": "<the exact question someone would ask ChatGPT or Perplexity>",
      "gap_type": "first-mover|displacement",
      "opportunity_score": <0-100>,
      "search_volume": "<high|medium|low>",
      "ai_intent": "<definition|how-to|comparison|best-of|explanation>",
      "currently_cited": "<brand name or none>",
      "why_gap": "<1 sentence on why this is unclaimed or weak>",
      "content_angle": "<specific angle that would win a citation here>",
      "recommended_format": "<blog post|FAQ page|comparison page|guide|definition page>",
      "word_count": <recommended word count>,
      "schema": "<FAQPage|HowTo|Article|none>"
    }
  ],
  "quick_wins": ["<slug 1>", "<slug 2>", "<slug 3>"],
  "summary": "<2-3 sentence overview of the biggest gap clusters in this niche>"
}`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      }),
    })

    const rawText = await response.text()
    if (!response.ok) return Response.json({ error: rawText }, { status: 500 })

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty response' }, { status: 500 })

    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) return Response.json({ error: 'Model did not return JSON', raw: cleaned.slice(0, 300) }, { status: 500 })
    const data = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1))
    return Response.json(data)
  } catch (err) {
    console.error('Gap finder error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}