import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import "./globals.css";
// app/layout.tsx
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-canonical-path") ?? "/";
  return {
    title: {
      default: 'Notion Cue — 100% Free AI SEO Visibility Tool ',
      template: '%s — Notion Cue',
    },
    description: 'Track how often your website gets cited by ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude.',
    metadataBase: new URL('https://notioncue.com'),
    alternates: {
      canonical: `https://notioncue.com${pathname}`,
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
