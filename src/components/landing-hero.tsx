"use client"

import { buttonVariants } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function LandingHero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 mt-16">
            {/* Background Image with Watercolor Overlay */}
            <div className="absolute inset-0 -z-10">
                {/* The actual hero photo */}
                <Image
                    src="/hero-tablet.jpg"
                    alt="Classroom background"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Dark warm overlay for text contrast - key fix */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#3D2F1D]/70 via-[#3D2F1D]/60 to-[#3D2F1D]/80" />
                {/* Watercolor color tint overlay - subtle artistic effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--wc-blue)]/30 via-[var(--wc-ochre)]/20 to-[var(--wc-sage)]/25 mix-blend-overlay" />
                {/* Bottom fade to cream section below */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--wc-cream)] via-transparent to-transparent" />
            </div>

            {/* Decorative watercolor splashes - reduced opacity to not compete */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--wc-gold)]/10 rounded-full blur-3xl animate-wc-float" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[var(--wc-blue)]/10 rounded-full blur-3xl animate-wc-float" style={{ animationDelay: '2s' }} />

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center space-y-8 max-w-4xl"
                >
                    <div className="space-y-4 flex flex-col items-center">
                        <h1 className="text-5xl font-display font-bold tracking-tight sm:text-6xl xl:text-8xl text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                            Get PDA Affirming Advice for Your IEP or 504 Plan
                        </h1>
                        <p className="max-w-[800px] text-lg text-white/95 md:text-xl leading-relaxed font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                            Upload your child's IEP or 504 Plan and get instant, privacy-conscious feedback on goals, supports, and accommodations. Empower your next school meeting with clear, actionable recommendations.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <Link href="/analyze" className={buttonVariants({ variant: "watercolor", size: "xl", className: "w-full sm:w-auto px-8 rounded-full shadow-lg" })}>
                            Analyze IEP Now
                        </Link>
                        <Link href="/how-it-works" className={buttonVariants({ variant: "outline-organic", size: "xl", className: "bg-white/95 backdrop-blur-sm hover:bg-white text-[var(--wc-brown-darker)] shadow-lg" })}>
                            How it Works
                        </Link>
                    </div>

                    <Link href="/privacy" className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/95 border border-[var(--wc-ochre)]/40 rounded-full px-6 py-2.5 hover:bg-white transition-all hover:border-[var(--wc-ochre)]/70 mt-6 backdrop-blur-sm shadow-lg">
                        <ShieldCheck className="h-5 w-5 text-[var(--wc-sage-dark)] shrink-0" aria-hidden="true" />
                        <span className="text-[var(--wc-brown-darker)] text-sm font-medium">
                            <strong className="font-semibold">Privacy Guaranteed:</strong> Your IEP/504 data is safe, secure & private. <span className="hidden sm:inline opacity-70">|</span> <span className="underline decoration-[var(--wc-ochre)]/50 underline-offset-4 group-hover:text-[var(--wc-blue-dark)] transition-colors">How we keep it safe &rarr;</span>
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
