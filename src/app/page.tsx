import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing-hero";
import { Footer } from "@/components/footer";
import { Target, Gauge, ClipboardCheck } from "lucide-react";

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
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
