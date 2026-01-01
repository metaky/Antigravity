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

        {/* Features Section Placeholder - To be componentized later if needed */}
        <section id="features" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 relative isolate">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[100vw] max-w-[600px] h-[120%] bg-gradient-to-r from-indigo-300/30 via-purple-300/30 to-rose-300/30 blur-3xl rounded-full" />
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to advocate effectively</h2>
              <p className="text-muted-foreground">Our AI analyzes your document against thousands of educational standards to provide clear, actionable insights.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Goal Analysis Module */}
              <div className="group relative bg-white p-8 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Target className="w-32 h-32 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Goal Analysis</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Ensure goals are SMART and safely constructed to avoid triggering demand avoidance.
                  </p>
                </div>
              </div>

              {/* PDA Affirming Score Module */}
              <div className="group relative bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <Gauge className="w-32 h-32 text-emerald-600" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">PDA Affirming Score</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Get an instant score (1-100) measuring how well the IEP supports nervous system regulation.
                  </p>
                </div>
              </div>

              {/* Accommodation Review Module */}
              <div className="group relative bg-white p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <ClipboardCheck className="w-32 h-32 text-amber-600" aria-hidden="true" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-center">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Accommodation Review</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    Check if suggested accommodations align with your child's specific diagnosis and needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Behavior Reports Tool Promo */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="group relative bg-white p-8 md:p-10 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                  <FileWarning className="w-40 h-40 text-purple-600" aria-hidden="true" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                  <span className="inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  New Tool Available
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                      Behavior Incident Report Analyzer
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Did your child receive a behavior incident report? Upload it alongside their IEP to discover which accommodations
                      <strong className="text-purple-700"> should have been implemented</strong>, identify discrepancies,
                      and receive PDA-affirming strategies for future incidents.
                    </p>
                    <ul className="text-slate-600 space-y-2 text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        <span>Compare incident responses to IEP accommodations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        <span>Highlight missed opportunities and what went well</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">✓</span>
                        <span>Get PDA-specific strategies beyond the IEP</span>
                      </li>
                    </ul>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="/behavior-report"
                      className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
