import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageSquare, Heart, BookOpen } from "lucide-react"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "PDA Tools & Resources | PDA Your IEP",
    description: "Explore our collection of tools designed for the PDA community, including the Declarative Language App and other neurodiverse-affirming resources.",
}

export default function OtherToolsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />
            <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6 max-w-5xl">
                <div className="space-y-8">
                    <div className="space-y-4 relative isolate text-center">
                        {/* Watercolor wash background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] wc-wash-blend blur-2xl rounded-full -z-10 opacity-60"></div>

                        <h1 className="text-4xl font-display font-bold tracking-tight sm:text-5xl text-[var(--wc-brown-darker)]">
                            Other PDA Tools
                        </h1>
                        <p className="text-lg text-[var(--wc-brown-dark)] max-w-3xl mx-auto leading-relaxed">
                            I am committed to building free, accessible tools for the PDA (Pathological Demand Avoidance) and neurodivergent community.
                            Here you can find other applications designed to support families, individuals, and professionals in creating more affirming environments.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                        {/* Declarative App Module */}
                        <div className="group relative wc-card-hover p-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 wc-wash-blue rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="h-24 w-24 text-[var(--wc-blue)]" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[var(--wc-blue-pale)] p-3 w-fit text-[var(--wc-blue-dark)]">
                                    <MessageSquare className="h-6 w-6" />
                                </div>

                                <h3 className="text-xl font-display font-bold text-[var(--wc-brown-darker)] mb-2">
                                    Declarative Language Tool
                                </h3>

                                <p className="text-[var(--wc-brown-dark)] mb-6 flex-grow">
                                    Use this tool to help communicate with neurodivergent people who respond better to declarative language.
                                    Translate commands into invitations, rate your declarative statements, and learn about the "Give over Get" mindset.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)]">
                                        AI Translator
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--wc-gold-pale)] text-[var(--wc-gold-dark)]">
                                        Skill Rater
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)]">
                                        Free
                                    </span>
                                </div>

                                <Button asChild variant="watercolor" className="w-full sm:w-auto hover:scale-105">
                                    <Link href="https://declarativeapp.org/" target="_blank" rel="noopener noreferrer">
                                        Visit Declarative App
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Placeholder for future tools */}
                        <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-[var(--wc-ochre-light)] bg-[var(--wc-paper)] p-6 flex flex-col items-center justify-center text-center">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <BookOpen className="h-24 w-24 text-[var(--wc-ochre)]" />
                            </div>
                            <div className="p-4 rounded-full bg-[var(--wc-ochre-pale)] mb-4">
                                <Heart className="h-8 w-8 text-[var(--wc-ochre)]" />
                            </div>
                            <h3 className="text-lg font-display font-semibold text-[var(--wc-brown-darker)] mb-2">
                                More Coming Soon
                            </h3>
                            <p className="text-[var(--wc-brown-dark)] max-w-sm">
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
