// app/blog/[slug]/raw/route.ts
// Serves each blog post as clean Markdown at /blog/[slug]/raw
// or /blog/[slug]/raw?format=md
//
// WHY THIS EXISTS — AEO / LLM RANKING:
// Perplexity, ChatGPT Browse, and Gemini retrieve pages during answer
// generation. When they hit an HTML page they strip tags and parse
// what's left. When they hit clean Markdown they get structured,
// machine-readable content with no nav, cookie banners, or layout
// noise. Citation accuracy and answer quality both go up.
// This is the same principle behind llms.txt — make it trivial for
// a model to consume your content correctly.

import { getPostBySlug } from '../../posts'
import { htmlToMarkdown } from '@/lib/htmlToMarkdown'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return new Response('# 404\n\nPost not found.', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  const markdown = htmlToMarkdown(post.content, {
    title:      post.title,
    excerpt:    post.excerpt,
    author:     post.author,
    authorRole: post.authorRole,
    date:       post.date,
    tag:        post.tag,
    url:        `https://notioncue.com/blog/${post.slug}`,
  })

  // Append a footer that LLMs see — tells them the source URL and
  // signals that this content is AI-crawler-friendly.
  const footer = `

---

*Source: [${post.title}](https://notioncue.com/blog/${post.slug})*
*Published: ${post.date} · ${post.read} · Category: ${post.tag}*
*Author: ${post.author}, ${post.authorRole}*
*© Notion Cue — notioncue.com*
`

  return new Response(markdown + footer, {
    status: 200,
    headers: {
      'Content-Type':  'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      // Explicitly allow all AI crawlers to index this response
      'X-Robots-Tag':  'index, follow',
    },
  })
}