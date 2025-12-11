import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ExternalLink, Sparkles, MessageSquare, Heart, BookOpen } from "lucide-react"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "PDA Tools & Resources | PDA Your IEP",
    description: "Explore our collection of tools designed for the PDA community, including the Declarative Language App and other neurodiverse-affirming resources.",
}

export default function OtherToolsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6 max-w-5xl">
                <div className="space-y-8">
                    <div className="space-y-4 relative isolate text-center">
                        {/* Hero Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300 blur-3xl rounded-full -z-10 opacity-30"></div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
                            Other PDA Tools
                        </h1>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            I am committed to building free, accessible tools for the PDA (Pathological Demand Avoidance) and neurodivergent community.
                            Here you can find other applications designed to support families, individuals, and professionals in creating more affirming environments.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                        {/* Declarative App Module */}
                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="h-24 w-24 text-sky-500" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-sky-100 p-3 w-fit text-sky-600">
                                    <MessageSquare className="h-6 w-6" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Declarative Language Tool
                                </h3>

                                <p className="text-slate-600 mb-6 flex-grow">
                                    Use this tool to help communicate with neurodivergent people who respond better to declarative language.
                                    Translate commands into invitations, rate your declarative statements, and learn about the "Give over Get" mindset.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700">
                                        AI Translator
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                        Skill Rater
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                        Free
                                    </span>
                                </div>

                                <Button asChild variant="premium" className="w-full sm:w-auto hover:scale-105">
                                    <Link href="https://declarativeapp.org/" target="_blank" rel="noopener noreferrer">
                                        Visit Declarative App
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Placeholder for future tools (Optional, or just leave with one for now) */}
                        <div className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <BookOpen className="h-24 w-24 text-slate-400" />
                            </div>
                            <div className="p-4 rounded-full bg-slate-100 mb-4">
                                <Heart className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                More Coming Soon
                            </h3>
                            <p className="text-slate-500 max-w-sm">
                                I'm constantly working on new ideas to support the community. Check back later for more tools!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
