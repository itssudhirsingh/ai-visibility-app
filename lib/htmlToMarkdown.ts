// lib/htmlToMarkdown.ts
// Converts the subset of HTML used in posts.ts to clean Markdown.
// Handles: h2, h3, p, ul/li, ol/li, strong, em, a, code, pre>code,
//          div.callout, blockquote, br, and strips all other tags.

export function htmlToMarkdown(html: string, meta?: {
  title?:      string
  excerpt?:    string
  author?:     string
  authorRole?: string
  date?:       string
  url?:        string
  tag?:        string
}): string {
  const lines: string[] = []

  // ── Optional YAML-style front matter ──────────────────────────────────────
  if (meta) {
    lines.push('---')
    if (meta.title)      lines.push(`title: "${meta.title.replace(/"/g, '\\"')}"`)
    if (meta.date)       lines.push(`date: "${meta.date}"`)
    if (meta.author)     lines.push(`author: "${meta.author}"`)
    if (meta.authorRole) lines.push(`author_role: "${meta.authorRole}"`)
    if (meta.tag)        lines.push(`category: "${meta.tag}"`)
    if (meta.excerpt)    lines.push(`description: "${meta.excerpt.replace(/"/g, '\\"')}"`)
    if (meta.url)        lines.push(`canonical: "${meta.url}"`)
    lines.push('---')
    lines.push('')
    if (meta.title) {
      lines.push(`# ${meta.title}`)
      lines.push('')
    }
  }

  let md = html
    // Callout divs → blockquote
    .replace(/<div[^>]*class="callout"[^>]*>([\s\S]*?)<\/div>/gi, (_, inner) => {
      const text = stripTags(inner).trim()
      return `\n> ${text.replace(/\n/g, '\n> ')}\n`
    })
    // Headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t).trim()}\n`)
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t).trim()}\n`)
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t).trim()}\n`)
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t).trim()}\n`)
    // Code blocks (before inline code)
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
      const decoded = decodeHtmlEntities(code.trim())
      return `\n\`\`\`\n${decoded}\n\`\`\`\n`
    })
    // Inline code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``)
    // Bold / italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, (_, t) => `**${stripTags(t)}**`)
    .replace(/<b[^>]*>(.*?)<\/b>/gi,           (_, t) => `**${stripTags(t)}**`)
    .replace(/<em[^>]*>(.*?)<\/em>/gi,          (_, t) => `*${stripTags(t)}*`)
    .replace(/<i[^>]*>(.*?)<\/i>/gi,            (_, t) => `*${stripTags(t)}*`)
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => `[${stripTags(text)}](${href})`)
    // Blockquote
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
      return inner.trim().split('\n').map((l: string) => `> ${l.trim()}`).join('\n') + '\n'
    })
    // Lists — capture entire ul/ol block then process li items
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      return '\n' + items.map(m => `- ${stripTags(m[1]).trim()}`).join('\n') + '\n'
    })
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
      const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      return '\n' + items.map((m, i) => `${i + 1}. ${stripTags(m[1]).trim()}`).join('\n') + '\n'
    })
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${stripTags(t).trim()}\n`)
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip any remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse 3+ blank lines to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  lines.push(md)
  return lines.join('\n')
}

function stripTags(html: string): string {
  return html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '$1')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '$1')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '$1')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '$1')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '$1')
    .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .trim()
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
}