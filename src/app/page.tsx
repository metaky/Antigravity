import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing-hero";
import { Footer } from "@/components/footer";
import { Target, Gauge, ClipboardCheck, FileWarning, ArrowRight } from "lucide-react";
import Link from "next/link";

import { BottomCTA } from "@/components/bottom-cta";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingHero />

        {/* Features Section - Watercolor Paper Style */}
        <section id="features" className="py-24 bg-[var(--wc-cream)] relative overflow-hidden">
          {/* Watercolor wash decorations */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--wc-blue)]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--wc-ochre)]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 relative isolate">
              {/* Subtle watercolor glow behind text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[100vw] max-w-[600px] h-[120%] wc-wash-blend opacity-60 rounded-full blur-2xl" />
              <h2 className="text-4xl font-display font-bold tracking-tight mb-4 text-[var(--wc-brown-darker)]">
                Everything you need to advocate effectively
              </h2>
              <p className="text-[var(--wc-brown-dark)] text-lg">
                Our AI analyzes your document against thousands of educational standards to provide clear, actionable insights.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Goal Analysis Card */}
              <div className="group relative wc-card-hover p-8 overflow-hidden">
                {/* Watercolor accent */}
                <div className="absolute top-0 right-0 w-32 h-32 wc-wash-blue rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <Target className="w-32 h-32 text-[var(--wc-blue)]" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-display font-bold mb-3 text-[var(--wc-brown-darker)]">Goal Analysis</h3>
                  <p className="text-[var(--wc-brown-dark)] leading-relaxed text-lg">
                    Ensure goals are SMART and safely constructed to avoid triggering demand avoidance.
                  </p>
                </div>
              </div>

              {/* PDA Affirming Score Card */}
              <div className="group relative wc-card-hover p-8 overflow-hidden">
                {/* Watercolor accent */}
                <div className="absolute top-0 right-0 w-32 h-32 wc-wash-sage rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <Gauge className="w-32 h-32 text-[var(--wc-sage)]" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-display font-bold mb-3 text-[var(--wc-brown-darker)]">PDA Affirming Score</h3>
                  <p className="text-[var(--wc-brown-dark)] leading-relaxed text-lg">
                    Get an instant score (1-100) measuring how well the IEP supports nervous system regulation.
                  </p>
                </div>
              </div>

              {/* Accommodation Review Card */}
              <div className="group relative wc-card-hover p-8 overflow-hidden">
                {/* Watercolor accent */}
                <div className="absolute top-0 right-0 w-32 h-32 wc-wash-ochre rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <ClipboardCheck className="w-32 h-32 text-[var(--wc-ochre)]" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-display font-bold mb-3 text-[var(--wc-brown-darker)]">Accommodation Review</h3>
                  <p className="text-[var(--wc-brown-dark)] leading-relaxed text-lg">
                    Check if suggested accommodations align with your child's specific diagnosis and needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Behavior Reports Tool Promo - Watercolor Style */}
        <section className="py-20 bg-[var(--wc-paper)] relative overflow-hidden">
          {/* Multi-color watercolor wash background */}
          <div className="absolute inset-0 wc-wash-blend opacity-50" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="group relative wc-card p-8 md:p-10 border-2 border-[var(--wc-sage)]/30 hover:border-[var(--wc-sage)]/50 transition-all duration-300 overflow-hidden">
                {/* Background watercolor decoration */}
                <div className="absolute -top-10 -right-10 w-40 h-40 wc-wash-sage rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <FileWarning className="w-40 h-40 text-[var(--wc-sage)]" aria-hidden="true" />
                </div>

                {/* Badge - Watercolor Style */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)] text-sm font-semibold mb-6 border border-[var(--wc-sage)]/20">
                  <span className="inline-flex rounded-full h-2 w-2 bg-[var(--wc-sage)]"></span>
                  New Tool Available
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--wc-brown-darker)]">
                      Behavior Incident Report Analyzer
                    </h3>
                    <p className="text-[var(--wc-brown-dark)] leading-relaxed text-lg">
                      Did your child receive a behavior incident report? Upload it alongside their IEP to discover which accommodations
                      <strong className="text-[var(--wc-sage-dark)]"> should have been implemented</strong>, identify discrepancies,
                      and receive PDA-affirming strategies for future incidents.
                    </p>
                    <ul className="text-[var(--wc-brown-dark)] space-y-2 text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--wc-sage-dark)] mt-1 font-bold">✓</span>
                        <span>Compare incident responses to IEP accommodations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--wc-sage-dark)] mt-1 font-bold">✓</span>
                        <span>Highlight missed opportunities and what went well</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--wc-sage-dark)] mt-1 font-bold">✓</span>
                        <span>Get PDA-specific strategies beyond the IEP</span>
                      </li>
                    </ul>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="/behavior-report"
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[var(--wc-sage)] to-[var(--wc-blue)] text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Analyze Your BIR
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
