import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`;

    // Use your API key from environment variables for security
    const GOOGLE_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || 'AIzaSyCWc6o7jEQ77OUfaUdPxIGe5nY9FqH12Ig';
    
    // 1. Fetch PageSpeed Insights
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&key=${GOOGLE_API_KEY}`;
    
    let cwv: any = null;
    let psiError = '';

    try {
      const psiRes = await fetch(psiUrl, { signal: AbortSignal.timeout(15000) });
      const psiData = await psiRes.json();
      
      // Handle API errors returned by Google
      if (psiData.error) {
        throw new Error(psiData.error.message || 'PageSpeed API error');
      }

      const cats = psiData.lighthouseResult?.categories;
      const audits = psiData.lighthouseResult?.audits;

      cwv = {
        performance: Math.round((cats?.performance?.score ?? 0) * 100),
        lcp: audits?.['largest-contentful-paint']?.displayValue ?? 'N/A',
        lcp_score: audits?.['largest-contentful-paint']?.score ?? 0,
        fid: audits?.['total-blocking-time']?.displayValue ?? 'N/A',
        cls: audits?.['cumulative-layout-shift']?.displayValue ?? 'N/A',
        cls_score: audits?.['cumulative-layout-shift']?.score ?? 0,
        ttfb: audits?.['server-response-time']?.displayValue ?? 'N/A',
        ttfb_score: audits?.['server-response-time']?.score ?? 0,
        speed_index: audits?.['speed-index']?.displayValue ?? 'N/A',
        render_blocking: audits?.['render-blocking-resources']?.details?.items?.length ?? 0,
        js_size: audits?.['unused-javascript']?.displayValue ?? 'N/A',
      };
    } catch (e) {
      psiError = 'Could not fetch PageSpeed data — using URL analysis only.';
    }

    // 2. Send to DeepSeek to interpret in AEO terms
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Missing NVIDIA API key' }, { status: 500 });

    const prompt = cwv
      ? `You are an AEO (Answer Engine Optimisation) expert. Analyse these Core Web Vitals for "${targetUrl}" and explain their impact on AI engine citation rates — specifically Perplexity, ChatGPT (browse mode), and Gemini.

Core Web Vitals data:
- Performance score: ${cwv.performance}/100
- LCP: ${cwv.lcp}
- TBT: ${cwv.fid}
- CLS: ${cwv.cls}
- TTFB: ${cwv.ttfb}
- Speed Index: ${cwv.speed_index}
- Render-blocking resources: ${cwv.render_blocking}
- Unused JS: ${cwv.js_size}`
      : `You are an AEO expert. Analyse the domain "${targetUrl}" for page speed AEO impact based on the URL and domain alone.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: 'You are an AEO expert. Always respond with valid JSON only — no markdown, no code fences.' },
          { role: 'user', content: `${prompt}

Return ONLY this JSON:
{
  "aeo_speed_score": 0,
  "summary": "String",
  "engine_impact": [{"engine": "String", "impact": "String", "reason": "String"}],
  "fixes": [{"priority": "String", "title": "String", "desc": "String", "aeo_gain": "String"}]
}` }
        ],
        max_tokens: 15000,
        temperature: 0.2
      })
    });

    const rawText = await response.text();
    if (!response.ok) return NextResponse.json({ error: rawText }, { status: 500 });

    const json = JSON.parse(rawText);
    const text = json.choices?.[0]?.message?.content;
    const data = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    return NextResponse.json({ ...data, cwv, psi_error: psiError, url: targetUrl });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}