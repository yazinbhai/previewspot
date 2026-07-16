import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Previewspot | Performance Creatives",
  description: "Ads that stop the scroll. AI-powered end-to-end performance creatives: Scripts, AI video, UGC-style ads built for Indian DTC and SaaS brands.",
  openGraph: {
    title: "Previewspot | Performance Creatives",
    description: "Ads that stop the scroll. AI-powered performance creatives built for Indian brands.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-[#0B0B0F] text-[#EAEAEA] antialiased selection:bg-[#00E5FF]/30 selection:text-white`}
      >
        <Header />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
