// components/JsonLd.tsx — renders one or more JSON-LD objects.
// Server component (no 'use client') so schema lands in SSR HTML,
// which is exactly what crawlers and AI engines read.

export default function JsonLd({ schema }: { schema: object | object[] }) {
  const items = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {items.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  )
}