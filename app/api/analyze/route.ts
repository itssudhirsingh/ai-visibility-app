export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL is required' }, { status: 400 })
    if (!process.env.OPENAI_API_KEY) return Response.json({ error: 'Missing OpenAI API key' }, { status: 500 })

    // Step 1 — search the web for real data about this domain
    const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-search-preview',
        messages: [
          {
            role: 'user',
            content: `Search the web and find out:
1. What is ${url}? What does this brand/site do?
2. Is ${url} mentioned or cited by ChatGPT, Perplexity, Gemini, or Claude in AI-generated answers?
3. Who are the top 3 direct competitors of ${url}?
4. What are the main SEO and AEO weaknesses of ${url}?
5. Does ${url} have llms.txt, structured schema markup, or strong E-E-A-T signals?

Be honest — if this is a small or unknown site, say so clearly.`
          }
        ],
        web_search_options: {}
      })
    })

    const searchJson = await searchResponse.json()
    console.log('Search status:', searchResponse.status)

    if (!searchResponse.ok) {
      console.error('Search error:', searchJson)
      // fall back to standard analysis if search model not available
      return fallbackAnalysis(url)
    }

    const searchData = searchJson.choices?.[0]?.message?.content || ''
    console.log('Search result preview:', searchData.slice(0, 300))

    // Step 2 — score based on real data
    const scoreResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AEO analyst. Respond with valid JSON only. No markdown. No extra text.'
          },
          {
            role: 'user',
            content: `Based on this real research about "${url}":

${searchData}

Now generate an honest AEO visibility report. If this is a small or unknown brand with little AI presence, scores should be LOW (10-35 range). Do NOT inflate scores for unknown sites.

Return ONLY this JSON:
{
  "score": <honest 0-100, small unknown sites should score 5-30>,
  "mentions": <realistic monthly AI mentions, unknown sites = 0-5>,
  "sentiment": "<positive|neutral|negative>",
  "engines_citing": "<X/4>",
  "engines": [
    {"n": "ChatGPT",    "s": <0-100>, "desc": "<honest 1-2 sentences based on research>"},
    {"n": "Perplexity", "s": <0-100>, "desc": "<honest 1-2 sentences>"},
    {"n": "Gemini",     "s": <0-100>, "desc": "<honest 1-2 sentences>"},
    {"n": "Claude",     "s": <0-100>, "desc": "<honest 1-2 sentences>"}
  ],
  "comps": [
    {"n": "<real competitor domain>", "s": <0-100>},
    {"n": "<real competitor domain>", "s": <0-100>},
    {"n": "<real competitor domain>", "s": <0-100>}
  ],
  "fixes": [
    {"priority": "HIGH", "title": "<specific fix>", "desc": "<specific actionable description>"},
    {"priority": "HIGH", "title": "<specific fix>", "desc": "<specific description>"},
    {"priority": "MED",  "title": "<specific fix>", "desc": "<specific description>"},
    {"priority": "LOW",  "title": "<specific fix>", "desc": "<specific description>"}
  ],
  "eeat": {
    "experience": <0-100>,
    "expertise":  <0-100>,
    "authority":  <0-100>,
    "trust":      <0-100>
  },
  "schema": [
    {"label": "Organization schema",        "status": "<pass|fail|warn>"},
    {"label": "Product/Service schema",     "status": "<pass|fail|warn>"},
    {"label": "FAQ schema on key pages",    "status": "<pass|fail|warn>"},
    {"label": "BreadcrumbList",             "status": "<pass|fail|warn>"},
    {"label": "Article/BlogPosting schema", "status": "<pass|fail|warn>"}
  ]
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1200,
      })
    })

    const scoreJson = await scoreResponse.json()
    const text = scoreJson.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'Empty scoring response' }, { status: 500 })

    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return Response.json(data)

  } catch (err) {
    console.error('API Error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

async function fallbackAnalysis(url: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AEO analyst. Respond with valid JSON only. No markdown.' },
        { role: 'user', content: `Analyze AEO visibility for "${url}". If unknown/small site give LOW scores (5-30). Return JSON with: score, mentions, sentiment, engines_citing, engines (array with n,s,desc), comps (array with n,s), fixes (array with priority,title,desc), eeat (experience,expertise,authority,trust), schema (array with label,status).` }
      ],
      temperature: 0.3,
      max_tokens: 1200,
    })
  })
  const json = await response.json()
  const text = json.choices?.[0]?.message?.content || '{}'
  const clean = text.replace(/```json|```/g, '').trim()
  return Response.json(JSON.parse(clean))
}