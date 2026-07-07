import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { GoogleTagManager } from "@next/third-parties/google";
import { organizationSchema, websiteSchema } from "@/lib/schema";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: 'Notion Cue — 100% Free AI Visibility Tool Platform',
    template: '%s — Notion Cue',  // auto appends on every page
  },
  description: 'Track how often your website gets cited by ChatGPT, Gemini, Perplexity, Grok, Copilot, and Claude.',
  metadataBase: new URL('https://notioncue.com'),
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
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        {children}
        <SpeedInsights />
        <Analytics />
        <GoogleTagManager gtmId="GTM-K4QVFK6" />
      </body>
    </html>
  );
}