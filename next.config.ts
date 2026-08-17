import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ── 1. Block _rsc param URLs from Google indexing ──────────────────────
      // Next.js uses ?_rsc= internally for RSC data fetching.
      // Without this Google indexes thousands of param variants.
      {
        source: "/:path*",
        has: [{ type: "query", key: "_rsc" }],
        headers: [
          { key: "X-Robots-Tag",    value: "noindex, nofollow" },
          { key: "Cache-Control",   value: "private, no-store, no-cache" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },

      // ── 2. Security + canonical signal on all real pages ───────────────────
      {
        source: "/:path*",
        missing: [{ type: "query", key: "_rsc" }], // only on clean URLs
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          // Stop MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Referrer for analytics
          { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
          // Permissions policy
          { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
        ],
      },

      // ── 3. Allow AI crawlers on all public pages ───────────────────────────
      // Complements llms.txt — explicit header-level permission for AI bots
      {
        source: "/:path*",
        missing: [{ type: "query", key: "_rsc" }],
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
        ],
      },

      // ── 4. Noindex auth + private pages ──────────────────────────────────
      {
        source: "/reset-password",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/forgot-password",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/auth/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },

      // ── 5. Long cache for static assets ──────────────────────────────────
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;