
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Upload, BrainCircuit, FileSearch, ShieldCheck, Sparkles, BicepsFlexed, Trophy } from "lucide-react"
import { WhyIBuiltThis } from "@/components/why-i-built-this"

import { BottomCTA } from "@/components/bottom-cta"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "How It Works | PDA Your IEP",
    description: "Learn how our AI analyzes your IEP. We prioritize privacy and security while delivering specific, actionable advocacy strategies for PDA students.",
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />
            <main className="flex-1 pt-40 pb-20">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="text-center mb-20 space-y-6 relative isolate">
                        {/* Watercolor wash background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] h-[300px] wc-wash-blend blur-2xl rounded-full -z-10 opacity-60"></div>

                        <h1 className="text-4xl font-display font-extrabold tracking-tight sm:text-5xl text-[var(--wc-brown-darker)]">
                            How it Works
                        </h1>
                        <p className="text-xl text-[var(--wc-brown-dark)] max-w-2xl mx-auto">
                            We combine advanced AI with expert-verified PDA strategies to turn your child's IEP or 504 Plan into a powerful tool for support, not just compliance.
                        </p>
                    </div>

                    <div className="space-y-24 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--wc-ochre-light)] before:to-transparent">

                        {/* Step 1 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[var(--wc-paper)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-[var(--wc-brown-darker)]">1</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] wc-card p-6 ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-[var(--wc-blue-pale)] rounded-lg flex items-center justify-center text-[var(--wc-blue-dark)]">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Secure Upload</h3>
                                </div>
                                <p className="text-[var(--wc-brown-dark)] leading-relaxed">
                                    Upload your child's existing IEP or 504 Plan (PDF). We prioritize privacy: your document is processed in-memory and heavily safeguarded. No data is used to train public models.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 1) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-first md:group-even:order-last">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 wc-wash-blue rounded-full opacity-50 blur-2xl animate-pulse"></div>
                                    <ShieldCheck className="h-32 w-32 text-[var(--wc-blue-wash)] absolute opacity-20" />
                                    <Upload className="h-16 w-16 text-[var(--wc-blue-dark)] relative z-10 drop-shadow-xl bg-[var(--wc-paper)] p-3 rounded-2xl border border-[var(--wc-blue)]/20" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[var(--wc-paper)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-[var(--wc-brown-darker)]">2</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] wc-card p-6 ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-[var(--wc-ochre-pale)] rounded-lg flex items-center justify-center text-[var(--wc-ochre-dark)]">
                                        <BrainCircuit className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">AI Logic + Expert Knowledge</h3>
                                </div>
                                <p className="text-[var(--wc-brown-dark)] leading-relaxed">
                                    Our AI engine reads your IEP or 504 Plan and cross-references it against our curated <a href="/pda-guide" className="text-[var(--wc-blue-dark)] hover:underline font-medium">"PDA Affirming Guide"</a>. It understands the nuance between standard ASD supports and what PDA brains actually need.
                                </p>
                            </div>

                            {/* Visual Illustrated (Opposite Step 2) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-last md:group-even:order-first">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 wc-wash-ochre rounded-full opacity-50 blur-2xl"></div>
                                    <BrainCircuit className="h-32 w-32 text-[var(--wc-ochre-light)] absolute opacity-20" />
                                    <div className="relative z-10 bg-[var(--wc-paper)] p-4 rounded-2xl border border-[var(--wc-ochre)]/20 shadow-lg flex flex-col items-center gap-2">
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[var(--wc-ochre)]"></div>
                                            <div className="h-2 w-8 rounded-full bg-[var(--wc-ochre-pale)]"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[var(--wc-ochre)]"></div>
                                            <div className="h-2 w-12 rounded-full bg-[var(--wc-ochre-pale)]"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[var(--wc-ochre)]"></div>
                                            <div className="h-2 w-6 rounded-full bg-[var(--wc-ochre-pale)]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[var(--wc-paper)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-[var(--wc-brown-darker)]">3</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] wc-card p-6 ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-[var(--wc-sage-pale)] rounded-lg flex items-center justify-center text-[var(--wc-sage-dark)]">
                                        <FileSearch className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Detailed Analysis</h3>
                                </div>
                                <p className="text-[var(--wc-brown-dark)] leading-relaxed">
                                    We identify "bad" goals (compliance-based) and suggest specific, PDA-affirming replacements. We also check for missing accommodations that are critical for nervous system safety.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 3) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-first md:group-even:order-last">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 wc-wash-sage rounded-full opacity-50 blur-2xl"></div>
                                    <FileSearch className="h-32 w-32 text-[var(--wc-sage-light)] absolute opacity-20" />

                                    {/* Mini Card Mockup */}
                                    <div className="relative z-10 bg-[var(--wc-paper)] p-4 rounded-xl border border-[var(--wc-sage)]/20 shadow-xl w-40 -rotate-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-6 w-6 rounded-full bg-[var(--wc-sage-pale)] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--wc-sage-dark)]"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                            <div className="h-2 w-16 bg-[var(--wc-sage-pale)] rounded-full"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-[var(--wc-ochre-pale)] rounded-full"></div>
                                            <div className="h-1.5 w-3/4 bg-[var(--wc-ochre-pale)] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[var(--wc-paper)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-[var(--wc-brown-darker)]">4</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] wc-card p-6 ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-[var(--wc-gold-pale)] rounded-lg flex items-center justify-center text-[var(--wc-gold-dark)]">
                                        <BicepsFlexed className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Advocate with Confidence</h3>
                                </div>
                                <p className="text-[var(--wc-brown-dark)] leading-relaxed">
                                    You get a cleaner, data-backed report to take to your next school meeting. No more feeling overwhelmed or unsure of what to ask for.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 4) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-last md:group-even:order-first">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 wc-wash-gold rounded-full opacity-50 blur-2xl"></div>
                                    <BicepsFlexed className="h-32 w-32 text-[var(--wc-gold-light)] absolute opacity-20" />

                                    <div className="relative z-10">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[var(--wc-gold)] to-[var(--wc-ochre)] shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
                                            <Trophy className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="absolute -top-4 -right-4 bg-[var(--wc-paper)] p-2 rounded-lg shadow-lg">
                                            <Sparkles className="h-6 w-6 text-[var(--wc-gold)] fill-[var(--wc-gold-light)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-24">
                        <WhyIBuiltThis />
                    </div>
                </div>
                <BottomCTA />
            </main>
            <Footer />
        </div>
    )
}
