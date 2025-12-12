
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Upload, BrainCircuit, FileSearch, Scale, ShieldCheck, FileText, ArrowRight, Sparkles, BicepsFlexed, Trophy } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "How It Works | PDA Your IEP",
    description: "Learn how our AI analyzes your IEP. We prioritize privacy and security while delivering specific, actionable advocacy strategies for PDA students.",
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="text-center mb-20 space-y-6 relative isolate">
                        {/* Hero Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] h-[300px] bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300 blur-3xl rounded-full -z-10 opacity-30"></div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
                            How it Works
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            We combine advanced AI with expert-verified PDA strategies to turn your child's IEP into a powerful tool for support, not just compliance.
                        </p>
                    </div>

                    <div className="space-y-24 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                        {/* Step 1 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-slate-900">1</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Secure Upload</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Upload your child's existing IEP (PDF). We prioritize privacy: your document is processed in-memory and heavily safeguarded. No data is used to train public models.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 1) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-first md:group-even:order-last">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-indigo-50 rounded-full opacity-50 blur-2xl animate-pulse"></div>
                                    <ShieldCheck className="h-32 w-32 text-indigo-200 absolute opacity-20" />
                                    <Upload className="h-16 w-16 text-indigo-600 relative z-10 drop-shadow-xl bg-white p-3 rounded-2xl border border-indigo-100" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-slate-900">2</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                        <BrainCircuit className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">AI Logic + Expert Knowledge</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Our AI engine reads your IEP and cross-references it against our curated <a href="/pda-guide" className="text-indigo-600 hover:underline font-medium">"PDA Affirming Guide"</a>. It understands the nuance between standard ASD supports and what PDA brains actually need.
                                </p>
                            </div>

                            {/* Visual Illustrated (Opposite Step 2) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-last md:group-even:order-first">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-purple-50 rounded-full opacity-50 blur-2xl"></div>
                                    <BrainCircuit className="h-32 w-32 text-purple-200 absolute opacity-20" />
                                    <div className="relative z-10 bg-white p-4 rounded-2xl border border-purple-100 shadow-lg flex flex-col items-center gap-2">
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                                            <div className="h-2 w-8 rounded-full bg-slate-100"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                                            <div className="h-2 w-12 rounded-full bg-slate-100"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                                            <div className="h-2 w-6 rounded-full bg-slate-100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-slate-900">3</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                        <FileSearch className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Detailed Analysis</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    We identify "bad" goals (compliance-based) and suggest specific, PDA-affirming replacements. We also check for missing accommodations that are critical for nervous system safety.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 3) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-first md:group-even:order-last">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-emerald-50 rounded-full opacity-50 blur-2xl"></div>
                                    <FileSearch className="h-32 w-32 text-emerald-200 absolute opacity-20" />

                                    {/* Mini Card Mockup */}
                                    <div className="relative z-10 bg-white p-4 rounded-xl border border-emerald-100 shadow-xl w-40 -rotate-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                            <div className="h-2 w-16 bg-emerald-100 rounded-full"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
                                            <div className="h-1.5 w-3/4 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mb-4 md:mb-0">
                                <span className="text-sm font-bold text-slate-900">4</span>
                            </div>

                            {/* Text Card */}
                            <div className="w-full md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ml-8 md:ml-0 md:group-odd:mr-auto md:group-even:ml-auto">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                                        <BicepsFlexed className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900">Advocate with Confidence</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    You get a cleaner, data-backed report to take to your next IEP meeting. No more feeling overwhelmed or unsure of what to ask for.
                                </p>
                            </div>

                            {/* Visual Illustration (Opposite Step 4) */}
                            <div className="hidden md:flex w-[calc(50%-2.5rem)] items-center justify-center p-8 md:order-last md:group-even:order-first">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-rose-50 rounded-full opacity-50 blur-2xl"></div>
                                    <BicepsFlexed className="h-32 w-32 text-rose-200 absolute opacity-20" />

                                    <div className="relative z-10">
                                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform">
                                            <Trophy className="h-10 w-10 text-white" />
                                        </div>
                                        <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-lg">
                                            <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
