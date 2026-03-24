import type { Metadata } from "next"
import Link from "next/link"

import { BottomCTA } from "@/components/bottom-cta"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { WhyIBuiltThis } from "@/components/why-i-built-this"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "How It Works | PDA Your IEP",
    description: "Learn how our AI analyzes your IEP. We prioritize privacy and security while delivering specific, actionable advocacy strategies for PDA students.",
}

const trustPoints = ["Private", "PDA-aware", "Meeting-ready"] as const

const processSteps = [
    {
        number: "01",
        eyebrow: "Start with the paperwork",
        title: "Secure Upload",
        description:
            "Upload your child's existing IEP or 504 Plan as a PDF. Your document is processed in-memory with safeguards designed to protect family data, so the first step feels simple without feeling risky.",
        supportLabel: "At this stage",
        supportDetail: "We focus on private handling, readable extraction, and getting the document ready for review.",
        tone: {
            badge: "border-[var(--wc-blue)]/20 bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)]",
            panel: "border-[var(--wc-blue)]/15 bg-[var(--wc-blue-pale)]/60",
            rail: "bg-[var(--wc-blue)]/22",
        },
    },
    {
        number: "02",
        eyebrow: "Interpret the plan",
        title: "AI Logic + Expert Knowledge",
        description:
            'Our AI engine reads your IEP or 504 Plan and cross-references it against our curated "PDA Affirming Guide." It looks for the gap between standard school language and what PDA brains actually need.',
        supportLabel: "What the review compares",
        supportDetail: "Goal wording, accommodation fit, and whether the plan supports regulation instead of escalating demands.",
        tone: {
            badge: "border-[var(--wc-ochre)]/20 bg-[var(--wc-ochre-pale)] text-[var(--wc-ochre-dark)]",
            panel: "border-[var(--wc-ochre)]/15 bg-[var(--wc-ochre-pale)]/65",
            rail: "bg-[var(--wc-ochre)]/24",
        },
    },
    {
        number: "03",
        eyebrow: "Find what matters",
        title: "Detailed Analysis",
        description:
            'We identify "bad" goals (compliance-based) and suggest specific, PDA-affirming replacements. We also check for missing accommodations that are critical for nervous system safety.',
        supportLabel: "What gets surfaced",
        supportDetail: "You see where language needs reframing, where support is missing, and why each finding matters in real school settings.",
        tone: {
            badge: "border-[var(--wc-sage)]/20 bg-[var(--wc-sage-pale)] text-[var(--wc-sage-dark)]",
            panel: "border-[var(--wc-sage)]/15 bg-[var(--wc-sage-pale)]/60",
            rail: "bg-[var(--wc-sage)]/24",
        },
    },
    {
        number: "04",
        eyebrow: "Bring it to the meeting",
        title: "Advocate with Confidence",
        description:
            "You get a cleaner, data-backed report to take to your next school meeting. It is designed to help you show up with clearer language, stronger requests, and less second-guessing.",
        supportLabel: "What it helps you do",
        supportDetail: "Turn your understanding of your child into concrete talking points, priorities, and follow-up questions.",
        tone: {
            badge: "border-[var(--wc-gold)]/22 bg-[var(--wc-gold-pale)] text-[var(--wc-gold-dark)]",
            panel: "border-[var(--wc-gold)]/15 bg-[var(--wc-gold-pale)]/70",
            rail: "bg-[var(--wc-gold)]/26",
        },
    },
] as const

const reportSections = [
    {
        title: "What gets flagged",
        tone: "text-[var(--wc-blue-dark)]",
        items: [
            "Goals that sound compliance-first instead of safety-based.",
            "Accommodations that are vague, missing, or hard for staff to carry out consistently.",
        ],
    },
    {
        title: "What gets suggested",
        tone: "text-[var(--wc-sage-dark)]",
        items: [
            "PDA-affirming rewrites that protect autonomy and nervous system safety.",
            "Concrete support ideas that are easier to discuss in school meetings.",
        ],
    },
    {
        title: "What parents can bring to meetings",
        tone: "text-[var(--wc-gold-dark)]",
        items: [
            "A clearer summary of the biggest issues to address first.",
            "Specific talking points and follow-up questions for the team.",
        ],
    },
] as const

function ProcessStepRow(step: (typeof processSteps)[number]) {
    return (
        <article className="grid gap-4 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-6">
            <div className="relative flex items-start gap-4 md:min-h-full md:pl-2">
                <div className="absolute left-[2.15rem] top-14 hidden h-[calc(100%+1.5rem)] w-px bg-[var(--wc-ochre-light)]/70 md:block" aria-hidden="true" />
                <div
                    className={cn(
                        "relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-[var(--wc-paper)] text-sm font-bold text-[var(--wc-brown-darker)] shadow-sm",
                        step.tone.badge
                    )}
                >
                    {step.number}
                </div>
                <div className="pt-2 md:pl-5 md:pt-3">
                    <p className="max-w-[6.25rem] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--wc-brown)] md:leading-8">
                        {step.eyebrow}
                    </p>
                </div>
            </div>

            <div className="rounded-[1.85rem] border border-[var(--wc-ochre-pale)] bg-[var(--wc-paper)] p-6 shadow-[0_14px_40px_-28px_rgba(61,47,29,0.48)] md:p-7">
                <div className="max-w-3xl space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--wc-brown-darker)] md:text-[2rem]">
                        {step.title}
                    </h3>
                    <p className="text-base leading-8 text-[var(--wc-brown-dark)] md:text-lg">
                        {step.description}
                    </p>
                </div>

                <div className={cn("mt-6 rounded-[1.4rem] border p-4 md:p-5", step.tone.panel)}>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--wc-brown)]">
                        {step.supportLabel}
                    </p>
                    <div className="mt-3 flex items-start gap-3">
                        <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", step.tone.rail)} aria-hidden="true" />
                        <p className="text-sm leading-7 text-[var(--wc-brown-dark)] md:text-[15px]">
                            {step.supportDetail}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 md:pt-36">
                <div className="container mx-auto max-w-6xl px-4 md:px-6">
                    <section className="relative overflow-hidden rounded-[2.25rem] border border-[var(--wc-ochre-pale)] bg-[var(--wc-paper)] px-6 py-10 shadow-[0_18px_60px_-32px_rgba(61,47,29,0.42)] sm:px-8 lg:px-12 lg:py-14">
                        <div className="absolute inset-0 wc-wash-blend opacity-40" aria-hidden="true" />
                        <div className="absolute -left-12 top-10 h-28 w-28 rounded-full bg-[var(--wc-blue)]/10 blur-3xl" aria-hidden="true" />
                        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[var(--wc-gold)]/10 blur-3xl" aria-hidden="true" />

                        <div className="relative z-10 max-w-3xl space-y-6">
                            <div className="inline-flex items-center rounded-full border border-[var(--wc-blue)]/18 bg-[var(--wc-blue-pale)]/80 px-4 py-1.5 text-sm font-semibold text-[var(--wc-blue-dark)]">
                                How PDA Your IEP works
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-extrabold tracking-tight text-[var(--wc-brown-darker)] sm:text-5xl lg:text-6xl">
                                    How it Works
                                </h1>
                                <p className="max-w-2xl text-lg leading-8 text-[var(--wc-brown-dark)] md:text-xl">
                                    We review your child's IEP or 504 Plan through a PDA-aware lens, then turn the findings into something you can actually use in your next school conversation.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--wc-brown-dark)]">
                                {trustPoints.map((point, index) => (
                                    <div key={point} className="inline-flex items-center gap-3">
                                        <span>{point}</span>
                                        {index < trustPoints.length - 1 ? (
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--wc-ochre)]/70" aria-hidden="true" />
                                        ) : null}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Link
                                    href="/analyze"
                                    className={cn(buttonVariants({ variant: "watercolor", size: "xl" }), "w-full sm:w-auto")}
                                >
                                    Analyze IEP Now
                                </Link>
                                <p className="max-w-xl text-sm leading-7 text-[var(--wc-brown-dark)]">
                                    Your document is handled privately in-memory.
                                    {" "}
                                    <Link href="/privacy" className="font-semibold text-[var(--wc-blue-dark)] underline decoration-[var(--wc-ochre)]/60 underline-offset-4">
                                        Read our privacy approach
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16 md:mt-20">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center rounded-full border border-[var(--wc-ochre)]/18 bg-[var(--wc-ochre-pale)]/85 px-4 py-1.5 text-sm font-semibold text-[var(--wc-ochre-dark)]">
                                The process
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-[var(--wc-brown-darker)] sm:text-4xl md:text-[2.8rem]">
                                One clear path from upload to a calmer, more useful report
                            </h2>
                            <p className="max-w-2xl text-lg leading-8 text-[var(--wc-brown-dark)]">
                                This page is meant to help you follow the flow without sorting through competing panels. Each step answers one simple question: what happens next, and why it matters.
                            </p>
                        </div>

                        <div className="mt-10 space-y-6 md:space-y-7">
                            {processSteps.map((step, index) => (
                                <div key={step.number} className="relative">
                                    <ProcessStepRow {...step} />
                                    {index < processSteps.length - 1 ? (
                                        <div className="ml-6 mt-4 hidden h-6 w-px bg-[var(--wc-ochre-light)]/65 md:block" aria-hidden="true" />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 md:mt-20">
                        <div className="rounded-[2rem] border border-[var(--wc-ochre-pale)] bg-[var(--wc-paper)] px-6 py-8 shadow-[0_16px_40px_-30px_rgba(61,47,29,0.35)] sm:px-8 md:px-10 md:py-10">
                            <div className="max-w-3xl space-y-4">
                                <div className="inline-flex items-center rounded-full border border-[var(--wc-sage)]/18 bg-[var(--wc-sage-pale)]/85 px-4 py-1.5 text-sm font-semibold text-[var(--wc-sage-dark)]">
                                    What you get
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-[var(--wc-brown-darker)] sm:text-4xl">
                                    A report you can actually use
                                </h2>
                                <p className="text-lg leading-8 text-[var(--wc-brown-dark)]">
                                    The finished report is designed to help you understand what needs attention first, what language to change, and what to bring into the room when you meet with the school.
                                </p>
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {reportSections.map((section) => (
                                    <div
                                        key={section.title}
                                        className="rounded-[1.5rem] border border-[var(--wc-ochre)]/12 bg-[var(--wc-ivory)]/90 p-5"
                                    >
                                        <h3 className={cn("text-lg font-bold tracking-tight", section.tone)}>
                                            {section.title}
                                        </h3>
                                        <ul className="mt-4 space-y-3 text-[15px] leading-7 text-[var(--wc-brown-dark)]">
                                            {section.items.map((item) => (
                                                <li key={item} className="flex gap-3">
                                                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--wc-ochre)]/70" aria-hidden="true" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-18 md:mt-24">
                        <div className="max-w-2xl space-y-4 pb-6">
                            <div className="inline-flex items-center rounded-full border border-[var(--wc-gold)]/18 bg-[var(--wc-gold-pale)]/80 px-4 py-1.5 text-sm font-semibold text-[var(--wc-gold-dark)]">
                                Built from lived experience
                            </div>
                            <p className="text-base leading-8 text-[var(--wc-brown-dark)] md:text-lg">
                                If you want the human context behind the tool, here is the story. It sits after the process on purpose, so you can understand the product first and then the person behind it.
                            </p>
                        </div>

                        <WhyIBuiltThis />
                    </section>
                </div>

                <BottomCTA />
            </main>

            <Footer />
        </div>
    )
}
