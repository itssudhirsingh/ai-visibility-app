export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return Response.json({ error: 'URL is required' }, { status: 400 })

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return Response.json({ error: 'Missing OpenAI API key' }, { status: 500 })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
    {
      "n": "ChatGPT",
      "s": <score 1-100>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<2-3 sentence description of how ChatGPT references this brand>",
      "citations": ["<actual example snippet of how ChatGPT might mention this brand>", "<second snippet>"]
    },
    {
      "n": "Perplexity",
      "s": <score>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<description>",
      "citations": ["<snippet>", "<snippet>"]
    },
    {
      "n": "Gemini",
      "s": <score>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<description>",
      "citations": ["<snippet>"]
    },
    {
      "n": "Claude",
      "s": <score>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<description>",
      "citations": ["<snippet>"]
    },
    {
      "n": "Grok",
      "s": <score>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<description>",
      "citations": ["<snippet>"]
    },
    {
      "n": "Copilot",
      "s": <score>,
      "sentiment": "<positive|neutral|negative>",
      "status": "<CITED|NOT CITED|LOW>",
      "desc": "<description>",
      "citations": ["<snippet>"]
    }
  ],

  "comps": [
    {"n": "<real competitor domain>", "s": <score>, "gap": "<1-2 sentence description of what this competitor does better in AI visibility — specific topics or query types they own that ${url} doesn't>"},
    {"n": "<real competitor domain>", "s": <score>, "gap": "<gap description>"},
    {"n": "<real competitor domain>", "s": <score>, "gap": "<gap description>"}
  ],

  "fixes": [
    {"priority": "HIGH", "title": "<specific fix title>", "desc": "<detailed actionable description>"},
    {"priority": "HIGH", "title": "<specific fix title>", "desc": "<detailed actionable description>"},
    {"priority": "MED",  "title": "<specific fix title>", "desc": "<detailed actionable description>"},
    {"priority": "LOW",  "title": "<specific fix title>", "desc": "<detailed actionable description>"}
  ],

  "eeat": {
    "experience": <score 0-100>,
    "expertise":  <score 0-100>,
    "authority":  <score 0-100>,
    "trust":      <score 0-100>
  },

  "schema": [
    {"label": "FAQPage schema",       "status": "<pass|fail|warn>"},
    {"label": "HowTo schema",         "status": "<pass|fail|warn>"},
    {"label": "Organization schema",  "status": "<pass|fail|warn>"},
    {"label": "BreadcrumbList",       "status": "<pass|fail|warn>"},
    {"label": "robots.txt AI bots",   "status": "<pass|fail|warn>"},
    {"label": "PerplexityBot access", "status": "<pass|fail|warn>"},
    {"label": "GPTBot access",        "status": "<pass|fail|warn>"}
  ],

  "llms_txt": {
    "exists":  <true|false — best estimate based on brand size and tech-forwardness>,
    "valid":   <true|false>,
    "content": "<if exists: sample of what a good llms.txt for this site should contain; if not: empty string>"
  },

  "bluf": {
    "score":    <0-100, how well the homepage answers 'what does this do?' in the first 2 sentences>,
    "headline": "<quote or paraphrase of the likely homepage H1/hero copy>",
    "issues":   ["<specific BLUF issue 1>", "<specific BLUF issue 2>"]
  },

  "weekly_trend": [
    {"week": "W1", "score": <score>},
    {"week": "W2", "score": <score>},
    {"week": "W3", "score": <score>},
    {"week": "W4", "score": <current score>}
  ],

  "query_probes": [
    {
      "engine":   "ChatGPT",
      "query":    "<realistic user query that would reveal this brand's AI visibility>",
      "response": "<realistic excerpt of how ChatGPT would respond, mentioning or not mentioning the brand>",
      "cited":    <true|false>
    },
    {
      "engine":   "Perplexity",
      "query":    "<different realistic query>",
      "response": "<response excerpt>",
      "cited":    <true|false>
    },
    {
      "engine":   "Gemini",
      "query":    "<query>",
      "response": "<response excerpt>",
      "cited":    <true|false>
    },
    {
      "engine":   "Grok",
      "query":    "<query>",
      "response": "<response excerpt>",
      "cited":    <true|false>
    }
  ]
}`
          }
        ],
        max_tokens: 2500,
        temperature: 0.7
      })
    })

    const rawText = await response.text()
    console.log('OpenAI status:', response.status)

    if (!response.ok) {
      return Response.json({ error: `OpenAI error: ${rawText}` }, { status: 500 })
    }

    const json = JSON.parse(rawText)
    const text = json.choices?.[0]?.message?.content

    if (!text) {
      return Response.json({ error: 'Empty response from OpenAI', raw: json }, { status: 500 })
    }

    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return Response.json(data)

  } catch (err) {
    console.error('API Error:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}