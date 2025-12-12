"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function LandingHero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 mt-16">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/hero-bg.png"
                    alt="Classroom background"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center space-y-8 max-w-4xl"
                >
                    <div className="space-y-4 flex flex-col items-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-7xl/none text-white">
                            Get PDA Affirming Advice for Your IEP or 504 Plan
                        </h1>
                        <p className="max-w-[800px] text-lg text-gray-200 md:text-xl leading-relaxed">
                            Upload your child's IEP or 504 Plan and get instant, privacy-conscious feedback on goals, supports, and accommodations. Empower your next school meeting with clear, actionable recommendations.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <Link href="/analyze" className={buttonVariants({ variant: "premium", size: "xl", className: "shadow-indigo-500/25 w-full sm:w-auto px-8" })}>
                            Analyze IEP Now
                        </Link>
                        <Link href="/how-it-works" className={buttonVariants({ variant: "outline", size: "xl", className: "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm" })}>
                            How it Works
                        </Link>
                    </div>

                    <Link href="/privacy" className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-indigo-950/40 border border-indigo-500/30 rounded-full px-6 py-2.5 hover:bg-indigo-900/50 transition-all hover:border-indigo-400/50 mt-6 backdrop-blur-sm">
                        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span className="text-indigo-100 text-sm font-medium">
                            <strong className="text-white font-semibold">Privacy Guaranteed:</strong> Your IEP/504 data is safe, secure & private. <span className="hidden sm:inline opacity-70">|</span> <span className="underline decoration-indigo-400/50 underline-offset-4 group-hover:text-white transition-colors">How we keep it safe &rarr;</span>
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
