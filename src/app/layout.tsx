import type { Metadata } from "next";
import { Caveat, Nunito, Geist_Mono } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://pdayouriep.org"),
  title: "PDA Your IEP | AI-Powered Advocacy for IEPs & 504s",
  description: "Empower your child's education with AI-driven IEP and 504 Plan analysis. Upload, evaluate, and advocate with confidence.",
  alternates: {
    canonical: "/",
  },
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
        className={`${caveat.variable} ${nunito.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground`}
        suppressHydrationWarning
      >
        <PostHogSnippet />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
