import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FF0033",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://previewspot.com"),
  title: {
    default: "Previewspot | AI Performance Creatives & Video Ads for Indian DTC & SaaS",
    template: "%s | Previewspot",
  },
  description:
    "Ads that stop the scroll. Previewspot produces AI-powered performance video ads, UGC-style creatives, and psychological hooks built for high-growth Indian DTC & SaaS brands.",
  keywords: [
    "AI video ads",
    "performance creatives",
    "UGC video ads India",
    "DTC ad agency India",
    "SaaS video ad creation",
    "AI ad engine",
    "high conversion video ads",
    "Previewspot",
    "Meta ad creatives",
    "Instagram Reels ads",
    "YouTube Shorts video ads",
    "performance marketing agency",
    "scroll stopping ads",
    "AI video generator for ads",
    "DTC creative strategy",
  ],
  authors: [{ name: "Previewspot", url: "https://previewspot.com" }],
  creator: "Previewspot",
  publisher: "Previewspot",
  category: "Marketing & Advertising",
  alternates: {
    canonical: "https://previewspot.com",
    types: {
      "text/plain": [
        { title: "LLM Context", url: "https://previewspot.com/llms.txt" },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Previewspot | AI Performance Creatives & Video Ads",
    description:
      "Ads that stop the scroll. AI-powered performance video ads, UGC-style creatives, and scripts for DTC & SaaS brands.",
    url: "https://previewspot.com",
    siteName: "Previewspot",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://previewspot.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Previewspot AI Performance Creatives Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Previewspot | AI Performance Creatives",
    description:
      "Ads that stop the scroll. AI-powered performance creatives & video ads built for DTC and SaaS brands.",
    creator: "@previewspot",
    site: "@previewspot",
    images: ["https://previewspot.com/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-[#0B0B0F] text-[#EAEAEA] antialiased selection:bg-[#FF0033]/30 selection:text-white`}
      >
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
