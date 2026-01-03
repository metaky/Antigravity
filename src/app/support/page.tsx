import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SupportCoffee } from "@/components/support-coffee"
import { Heart, Shield } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Support & Donate | PDA Your IEP",
    description: "Help us keep these advocacy tools free for families. Support the developer and the mission to empower neurodivergent education.",
}

export default function SupportPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />
            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                    <div className="text-center mb-16 space-y-4 relative isolate">
                        {/* Watercolor wash background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] wc-wash-blend blur-2xl rounded-full -z-10 opacity-60"></div>

                        <h1 className="text-4xl font-display font-extrabold tracking-tight sm:text-5xl text-[var(--wc-brown-darker)]">
                            Support the Mission
                        </h1>
                        <p className="text-xl text-[var(--wc-brown-dark)] flex items-center justify-center gap-2">
                            Help keep these tools free for the families who need them most.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Personal Note Card */}
                        <div className="wc-card p-8 border-2 border-[var(--wc-ochre)]/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-[var(--wc-ochre-pale)] flex items-center justify-center">
                                    <Heart className="h-6 w-6 text-[var(--wc-ochre)] fill-[var(--wc-ochre)]/20" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-[var(--wc-brown-darker)]">A Personal Note</h2>
                            </div>
                            <div className="space-y-4 text-[var(--wc-brown-dark)] leading-relaxed">
                                <p>
                                    Hi, I'm a dad to a PDA autistic child. I'm not a professional software developer, but like many of you, I've navigated the complex, challenging, and often lonely journey of understanding neurodiversity and finding ways to truly connect with my child.
                                </p>
                                <p>
                                    This tool comes directly from that personal experience. I built it because I needed it, and I suspect others can benefit from it too.
                                </p>
                            </div>
                        </div>

                        {/* Why Support Card */}
                        <div className="wc-card p-8 border-2 border-[var(--wc-blue)]/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-[var(--wc-blue-pale)] flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-[var(--wc-blue)] fill-[var(--wc-blue)]/20" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-[var(--wc-brown-darker)]">Why Support?</h2>
                            </div>
                            <div className="space-y-4 text-[var(--wc-brown-dark)] leading-relaxed">
                                <p>
                                    My goal is to provide these tools <strong className="text-[var(--wc-brown-darker)] font-semibold">at no cost</strong> so they can help the most number of people.
                                </p>
                                <p>
                                    However, running AI-powered applications incurs real server and API costs. Your contribution helps keep the lights on and supports the development of more tools for our community.
                                </p>
                            </div>
                        </div>

                        {/* Donation Component at the bottom */}
                        <div className="pt-8">
                            <SupportCoffee />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
