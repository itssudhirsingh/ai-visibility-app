export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL is required' }, { status: 400 })

    const apiKey = process.env.NVIDIA_API_KEY
if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

    console.log('Key exists:', !!apiKey)
    console.log('Key prefix:', apiKey.slice(0, 10))

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`  // ← curly braces + correct variable
  },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI visibility analyst. Always respond with valid JSON only — no markdown, no code fences, no extra text.'
          },
          {
            role: 'user',
            content: `Analyse the AI visibility of this brand/domain: "${url}"

Return ONLY this exact JSON structure with real, specific analysis for "${url}":

{
  "score": <number 1-100, overall AEO score>,
  "mentions": <estimated monthly AI mentions>,
  "sentiment": "<positive|neutral|negative>",
  "engines_citing": "<X/6>",
  "engines": [
    {"n": "ChatGPT", "s": <score 1-100>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<2-3 sentence description>", "citations": ["<snippet>", "<snippet>"]},
    {"n": "Perplexity", "s": <score>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Gemini", "s": <score>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Claude", "s": <score>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Grok", "s": <score>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]},
    {"n": "Copilot", "s": <score>, "sentiment": "<positive|neutral|negative>", "status": "<CITED|NOT CITED|LOW>", "desc": "<description>", "citations": ["<snippet>"]}
  ],
  "comps": [
    {"n": "<real competitor domain>", "s": <score>, "gap": "<gap description>"},
    {"n": "<real competitor domain>", "s": <score>, "gap": "<gap description>"},
    {"n": "<real competitor domain>", "s": <score>, "gap": "<gap description>"}
  ],
  "fixes": [
    {"priority": "HIGH", "title": "<fix title>", "desc": "<actionable description>"},
    {"priority": "HIGH", "title": "<fix title>", "desc": "<actionable description>"},
    {"priority": "MED", "title": "<fix title>", "desc": "<actionable description>"},
    {"priority": "LOW", "title": "<fix title>", "desc": "<actionable description>"}
  ],
  "eeat": {"experience": <0-100>, "expertise": <0-100>, "authority": <0-100>, "trust": <0-100>},
  "schema": [
    {"label": "FAQPage schema", "status": "<pass|fail|warn>"},
    {"label": "HowTo schema", "status": "<pass|fail|warn>"},
    {"label": "Organization schema", "status": "<pass|fail|warn>"},
    {"label": "BreadcrumbList", "status": "<pass|fail|warn>"},
    {"label": "robots.txt AI bots", "status": "<pass|fail|warn>"},
    {"label": "PerplexityBot access", "status": "<pass|fail|warn>"},
    {"label": "GPTBot access", "status": "<pass|fail|warn>"}
  ],
  "llms_txt": {"exists": <true|false>, "valid": <true|false>, "content": "<sample content or empty string>"},
  "bluf": {"score": <0-100>, "headline": "<homepage H1 paraphrase>", "issues": ["<issue 1>", "<issue 2>"]},
  "weekly_trend": [
    {"week": "W1", "score": <score>},
    {"week": "W2", "score": <score>},
    {"week": "W3", "score": <score>},
    {"week": "W4", "score": <current score>}
  ],
  "query_probes": [
    {"engine": "ChatGPT", "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>},
    {"engine": "Perplexity", "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>},
    {"engine": "Gemini", "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>},
    {"engine": "Grok", "query": "<realistic query>", "response": "<response excerpt>", "cited": <true|false>}
  ]
}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    })

    const rawText = await response.text()
    console.log('NVIDIA status:', response.status)
    console.log('Raw response preview:', rawText.slice(0, 300))

    if (!response.ok) {
      console.error('NVIDIA API error:', rawText)
      return Response.json({ error: `API error: ${rawText}` }, { status: 500 })
    }

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content

    if (!text) {
      console.error('Empty choices:', JSON.stringify(json))
      return Response.json({ error: 'Empty response', raw: json }, { status: 500 })
    }

    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return Response.json(data)

  } catch (err) {
    console.error('API Error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}