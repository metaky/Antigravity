import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDA Your IEP | AI-Powered Advocacy for IEPs & 504s",
  description: "Empower your child's education with AI-driven IEP and 504 Plan analysis. Upload, evaluate, and advocate with confidence.",
};

import { PostHogSnippet } from "@/components/posthog-snippet";
import { CookieBanner } from "@/components/cookie-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground`}
      >
        <PostHogSnippet />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
