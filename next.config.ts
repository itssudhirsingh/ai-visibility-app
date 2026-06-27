import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Prevents RSC URLs from being publicly discoverable
    serverActions: {
      allowedOrigins: ["notioncue.com", "www.notioncue.com"],
    },
  },

  async headers() {
    return [
      {
        // Apply to ALL routes
        source: "/:path*",
        headers: [
          {
            // Tells Google: only index the canonical clean URL
            key: "X-Robots-Tag",
            value: "noindex",
          },
          {
            // Blocks RSC responses from being cached publicly
            key: "Cache-Control",
            value: "private, no-store",
          },
          {
            // Prevents RSC payload URLs leaking via Referer
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
        has: [{ type: "query", key: "_rsc" }],
      },
    ];
  },
};

export default nextConfig;