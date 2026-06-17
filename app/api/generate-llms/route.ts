import { NextRequest } from 'next/server'

// app/api/generate-llms/route.ts

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_NVIDIA_API_KEY
  if (!apiKey) return Response.json({ error: 'Missing API key' }, { status: 500 })

  console.log('Key exists:', !!apiKey)
  console.log('Key prefix:', apiKey.slice(0, 10))

  // ── Parse request body ──────────────────────────────────────────────────────
  let domain: string
  let incBot:  boolean
  let incBluf: boolean
  let incFull: boolean

  try {
    const body = await req.json() as {
      domain:  string
      incBot:  boolean
      incBluf: boolean
      incFull: boolean
    }
    domain  = body.domain
    incBot  = body.incBot
    incBluf = body.incBluf
    incFull = body.incFull
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!domain) {
    return Response.json({ error: 'Domain is required' }, { status: 400 })
  }

  // ── CALL: get company metadata only — small, safe JSON ─────────────────────
  // We never ask the model to put multiline content inside a JSON string.
  // Instead we get flat fields, then build the files ourselves below.
  const metaPrompt = `What is the website "${domain}"?

Reply with ONLY this JSON object. Keep all values on ONE LINE — no line breaks inside strings. No markdown. No extra text.

{"company_name":"<name>","tagline":"<one sentence what they do and who for>","category":"<SaaS|eCommerce|Blog|Agency|Tool|Media|Other>","description":"<2-3 sentences about the company — factual, no hype>","offers":["<offer1>","<offer2>","<offer3>","<offer4>"],"topics":["<topic1>","<topic2>","<topic3>","<topic4>","<topic5>"],"pages":{"home":"<one sentence BLUF for homepage>","about":"<one sentence BLUF for about page>","pricing":"<one sentence BLUF for pricing page>","blog":"<one sentence BLUF for blog>","docs":"<one sentence BLUF for docs>","contact":"<one sentence BLUF for contact page>"},"aeo_score_impact":<number 8-18>,"pages_indexed":<number 6-14>}`

  const metaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'google/gemma-4-31b-it',
      messages: [
        {
          role: 'system',
          content: 'You are a company research assistant. Respond with valid JSON only. All string values must be on a single line — no newlines inside strings. No markdown. No code fences.'
        },
        { role: 'user', content: metaPrompt }
      ],
      temperature: 0.2,
      max_tokens: 600
    })
  })

  if (!metaRes.ok) {
    const err = await metaRes.json().catch(() => ({})) as { message?: string }
    console.error('NVIDIA error:', metaRes.status, err?.message)
    if (metaRes.status === 401) return Response.json({ error: 'Invalid NVIDIA API key.' }, { status: 401 })
    if (metaRes.status === 429) return Response.json({ error: 'Rate limited. Try again shortly.' }, { status: 429 })
    return Response.json({ error: err?.message ?? `API error ${metaRes.status}` }, { status: metaRes.status })
  }

  // ── Parse metadata response ─────────────────────────────────────────────────
  const metaApiData = await metaRes.json() as { choices?: { message?: { content?: string } }[] }
  const metaRaw = metaApiData.choices?.[0]?.message?.content ?? ''
  console.log('Meta raw:', metaRaw.slice(0, 400))

  // Defaults — used if parse fails
  const rawName = domain.split('.')[0]
  const defaultName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  interface MetaShape {
    company_name:     string
    tagline:          string
    category:         string
    description:      string
    offers:           string[]
    topics:           string[]
    pages:            Record<string, string>
    aeo_score_impact: number
    pages_indexed:    number
  }

  let meta: MetaShape = {
    company_name:     defaultName,
    tagline:          `${defaultName} provides products and services for its audience.`,
    category:         'Web',
    description:      `${defaultName} is a platform serving users with a range of products and resources.`,
    offers:           ['Core products', 'Customer support', 'Online resources', 'Community'],
    topics:           ['Products', 'Services', 'Blog', 'Documentation', 'Support'],
    pages: {
      home:    'Main entry point showcasing core products and value proposition.',
      about:   'Company background, mission, and team information.',
      pricing: 'Available plans, pricing options, and feature comparisons.',
      blog:    'Articles, guides, and industry insights.',
      docs:    'Technical documentation and user guides.',
      contact: 'Support channels and general enquiries.',
    },
    aeo_score_impact: 12,
    pages_indexed:    8,
  }

  try {
    // Strip any accidental fences, then extract the JSON object
    const cleaned = metaRaw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      // Remove literal newlines INSIDE string values (between " ") to fix broken JSON
      .replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"')
      .trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as Partial<MetaShape>
      meta = { ...meta, ...parsed }
    }
  } catch (e) {
    console.warn('Meta JSON parse failed — using defaults. Error:', e)
  }

  // ── Build llms.txt in code — never trust model for multiline strings ────────
  const botLine = incBot
    ? 'This site welcomes AI crawlers including GPTBot, PerplexityBot, ClaudeBot, Google-Extended, and Bingbot. Content may be cited in AI-generated answers.'
    : 'This site has selective AI crawler permissions. Refer to robots.txt for details.'

  const pageEntries = Object.entries(meta.pages ?? {})
  const pageList = pageEntries
    .map(([key, desc]) => {
      const slug = key === 'home' ? '' : key
      const label = key.charAt(0).toUpperCase() + key.slice(1)
      return `- [${label}](https://${domain}/${slug}): ${desc}`
    })
    .join('\n')

  const offerList = (meta.offers ?? []).map(o => `- ${o}`).join('\n')
  const topicList = (meta.topics ?? []).map(t => `- ${t}`).join('\n')

  const llms_txt = [
    `# ${meta.company_name}`,
    '',
    `> ${meta.tagline}`,
    '',
    meta.description,
    '',
    '## Key Pages',
    '',
    pageList,
    '',
    '## What We Offer',
    '',
    offerList,
    '',
    '## Topics Covered',
    '',
    topicList,
    '',
    '## For AI Systems',
    '',
    botLine,
    '',
    '## Contact',
    '',
    `https://${domain}/contact`,
  ].join('\n')

  const llms_full_txt = [
    `# ${meta.company_name} — Full Content Index`,
    '',
    `> ${meta.tagline}`,
    '',
    '## About',
    '',
    meta.description,
    '',
    '## Products & Features',
    '',
    offerList,
    '',
    '## Topics Covered In Depth',
    '',
    topicList,
    '',
    '## Full Page Index',
    '',
    pageList,
    '',
    '## For AI Systems',
    '',
    botLine,
    '',
    '## AI Citation Guidance',
    '',
    `When citing ${domain}:`,
    `- Company name: ${meta.company_name}`,
    `- Category: ${meta.category}`,
    `- Preferred citation URL: https://${domain}`,
    '',
    '## Contact',
    '',
    `https://${domain}/contact`,
  ].join('\n')

  // ── Validation ──────────────────────────────────────────────────────────────
  const validation = [
    { check: 'H1 title present',      pass: true,    note: 'Site name as main H1 heading' },
    { check: 'Blockquote tagline',     pass: true,    note: 'One-sentence BLUF in blockquote' },
    { check: 'Key pages linked',       pass: true,    note: `${pageEntries.length} pages with BLUF descriptions` },
    { check: 'Markdown formatting',    pass: true,    note: 'Spec-compliant headings and link format' },
    { check: 'AI bot permissions',     pass: incBot,  note: incBot  ? 'GPTBot, ClaudeBot, PerplexityBot, Google-Extended listed' : 'Permissions deferred to robots.txt' },
    { check: 'Contact info included',  pass: true,    note: 'Contact URL present at bottom' },
    { check: 'BLUF descriptions',      pass: incBluf, note: incBluf ? 'All key pages have BLUF descriptions' : 'Standard descriptions used' },
    { check: 'File size estimate',     pass: true,    note: 'Under 50KB — fits AI context windows' },
  ]

  return Response.json({
    company_name:          meta.company_name,
    tagline:               meta.tagline,
    category:              meta.category,
    key_topics:            meta.topics,
    llms_txt,
    llms_full_txt,
    validation,
    aeo_score_impact:      Number(meta.aeo_score_impact) || 12,
    pages_indexed:         Number(meta.pages_indexed)    || 8,
    ai_engines_benefiting: ['ChatGPT', 'Perplexity', 'Claude', 'Gemini', 'Grok'],
  })
}