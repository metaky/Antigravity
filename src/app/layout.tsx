import type { Metadata } from "next";
import "./globals.css";
import { PHProvider } from "@/app/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://pdayouriep.org"),
  title: "PDA Your IEP | AI-Powered Advocacy for IEPs & 504s",
  description: "Empower your child's education with AI-driven IEP and 504 Plan analysis. Upload, evaluate, and advocate with confidence.",
  alternates: {
    canonical: "/",
  },
};

import { CookieBanner } from "@/components/cookie-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans text-foreground"
        suppressHydrationWarning
      >
        <PHProvider>{children}</PHProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
