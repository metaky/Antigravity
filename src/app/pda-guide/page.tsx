import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertTriangle, CheckCircle2, Heart, Lightbulb, Shield, Sparkles } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "PDA Affirming IEP Guide | PDA Your IEP",
    description: "A comprehensive guide to crafting a PDA-affirming IEP. Learn about autonomy, declarative language, and creating a safe educational environment.",
}

export default function PDAGuidePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />

            <main className="flex-1 container mx-auto pt-24 md:pt-32 pb-16 px-4 md:px-6 max-w-5xl">
                {/* Header Section */}
                <div className="mb-12 text-center space-y-4">

                    <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-[var(--wc-brown-darker)] leading-tight">
                        An In-Depth Guide to Crafting a <span className="text-[var(--wc-blue-dark)]">PDA-Affirming IEP</span>
                    </h1>
                    <p className="text-xl text-[var(--wc-brown-dark)] max-w-3xl mx-auto leading-relaxed">
                        Moving beyond compliance to create an educational plan based on trust, safety, and true understanding.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="wc-card p-8 md:p-12 lg:p-16 space-y-16">

                    {/* Section 1: Foundational Shift */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-[var(--wc-blue-dark)] mb-6">
                            <Sparkles className="w-8 h-8" />
                            <h2 className="text-3xl font-display font-bold text-[var(--wc-brown-darker)]">1.0 A Foundational Shift</h2>
                        </div>
                        <div className="prose prose-slate prose-lg max-w-none text-[var(--wc-brown-dark)] leading-relaxed space-y-6">
                            <p>
                                Crafting an effective Individualized Education Program (IEP) for a student with a Pathological Demand Avoidance (PDA) profile requires a fundamental shift in mindset. Traditional frameworks often fail because they are built on compliance. For a PDA learner, success begins with understanding the "why" behind their nervous system response.
                            </p>
                            <p>
                                PDA is a profile of autism rooted in a nervous system characterized by persistently high anxiety and a survival-driven need for autonomy. Avoidance is not a choice; it is a neurological response to perceived threat.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 my-8">
                                <div className="bg-[var(--wc-cream)] p-6 rounded-2xl border border-[var(--wc-ochre-pale)]">
                                    <h3 className="font-semibold text-[var(--wc-brown-darker)] mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-[var(--wc-gold)]" />
                                        The Traditional View
                                    </h3>
                                    <ul className="space-y-2 text-sm text-[var(--wc-brown-dark)]">
                                        <li>• Behavior is a choice or defiance</li>
                                        <li>• Use rewards/consequences to motivate</li>
                                        <li>• Goal is compliance and obedience</li>
                                    </ul>
                                </div>
                                <div className="bg-[var(--wc-blue-pale)] p-6 rounded-2xl border border-[var(--wc-blue)]/30">
                                    <h3 className="font-semibold text-[var(--wc-blue-dark)] mb-4 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-[var(--wc-blue)]" />
                                        The PDA Reality
                                    </h3>
                                    <ul className="space-y-2 text-sm text-[var(--wc-blue-dark)]">
                                        <li>• Behavior is a survival response (fight/flight)</li>
                                        <li>• Safety and connection drive progress</li>
                                        <li>• Goal is regulation and trust</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Section 2: Strengths */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 text-[var(--wc-sage-dark)] mb-6">
                            <Lightbulb className="w-8 h-8" />
                            <h2 className="text-3xl font-display font-bold text-[var(--wc-brown-darker)]">2.0 Reframing: PDA Strengths</h2>
                        </div>
                        <p className="text-lg text-[var(--wc-brown-dark)]">
                            Adopting a strengths-based perspective is essential. PDA learners have access to more of their skills when their nervous system is regulated.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {[
                                { title: "Principled Advocacy", desc: "Unwavering commitment to equity and standing up for the marginalized." },
                                { title: "Visionary Thinking", desc: "Inventive minds that perceive solutions and pathways invisible to most." },
                                { title: "Intuitive Insight", desc: "Profound capacity to read underlying motives and emotional honesty." },
                                { title: "Imaginative Reality Shift", desc: "Display of highly skilled pretend play, sometimes blurring the lines between pretend and reality." },
                                { title: "Social Resonance", desc: "Electric personality and wit that naturally attracts and inspires others." },
                                { title: "Self-Directed Mastery", desc: "Remarkable ability to master complex subjects through independent exploration." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-xl border border-[var(--wc-ochre-pale)] bg-[var(--wc-paper)] hover:shadow-md transition-shadow">
                                    <h3 className="font-display font-bold text-[var(--wc-brown-darker)] mb-2">{item.title}</h3>
                                    <p className="text-sm text-[var(--wc-brown-dark)]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Separator />

                    {/* Section 3: Principles */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 text-[var(--wc-ochre-dark)] mb-6">
                            <Shield className="w-8 h-8" />
                            <h2 className="text-3xl font-display font-bold text-[var(--wc-brown-darker)]">3.0 Core Educational Principles</h2>
                        </div>

                        <Alert className="bg-[var(--wc-blue-pale)] border-[var(--wc-blue)]/30">
                            <Info className="h-5 w-5 text-[var(--wc-blue-dark)]" />
                            <AlertTitle className="text-[var(--wc-blue-dark)] font-semibold">Shift Priority</AlertTitle>
                            <AlertDescription className="text-[var(--wc-blue-dark)]">
                                The most important shift is moving from <strong>Compliance</strong> to <strong>Connection & Co-regulation</strong>.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-6">
                            <h3 className="text-xl font-display font-bold text-[var(--wc-brown-darker)]">The Three Pillars of Safety</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--wc-blue-pale)] flex items-center justify-center text-[var(--wc-blue-dark)] font-bold">1</div>
                                    <h4 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Autonomy</h4>
                                    <p className="text-[var(--wc-brown-dark)] text-sm leading-relaxed">
                                        Providing choice preempts the threat response. Allow the student to opt-out, change rules, or choose how to complete tasks.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--wc-ochre-pale)] flex items-center justify-center text-[var(--wc-ochre-dark)] font-bold">2</div>
                                    <h4 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Equality</h4>
                                    <p className="text-[var(--wc-brown-dark)] text-sm leading-relaxed">
                                        Collaborate rather than dictate. Position yourself as a mentor. Use "we" language and equalize the power dynamic.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--wc-gold-pale)] flex items-center justify-center text-[var(--wc-gold-dark)] font-bold">3</div>
                                    <h4 className="font-display font-bold text-lg text-[var(--wc-brown-darker)]">Lowering Demands</h4>
                                    <p className="text-[var(--wc-brown-dark)] text-sm leading-relaxed">
                                        Adjust expectations based on regulation levels, not ability. Reduce workload, share the task, or act as a scribe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Section 4: Accommodations */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-display font-bold text-[var(--wc-brown-darker)]">4.0 Accommodations & Supports</h2>
                        <p className="text-lg text-[var(--wc-brown-dark)]">
                            Standard accommodations must be adapted. Here is how to shift from traditional to PDA-affirming approaches.
                        </p>

                        <div className="overflow-hidden rounded-xl border border-[var(--wc-ochre-pale)]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[var(--wc-cream)] text-[var(--wc-brown-darker)] font-semibold">
                                    <tr>
                                        <th className="p-4 border-b border-r border-[var(--wc-ochre-pale)] w-1/2">Traditional / Unhelpful</th>
                                        <th className="p-4 border-b border-[var(--wc-ochre-pale)] w-1/2 bg-[var(--wc-blue-pale)] text-[var(--wc-blue-dark)]">PDA-Affirming Alternative</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--wc-ochre-pale)] bg-[var(--wc-paper)]">
                                    <tr>
                                        <td className="p-4 border-r border-[var(--wc-ochre-pale)] text-[var(--wc-brown-dark)]">Rigid visual schedule</td>
                                        <td className="p-4 bg-[var(--wc-blue-pale)]/30 text-[var(--wc-brown-dark)]">Flexible "rhythm" or visual suggestion</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-r border-[var(--wc-ochre-pale)] text-[var(--wc-brown-dark)]">Token boards / Sticker charts</td>
                                        <td className="p-4 bg-[var(--wc-blue-pale)]/30 text-[var(--wc-brown-dark)]">Surprise, natural rewards & genuine praise</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-r border-[var(--wc-ochre-pale)] text-[var(--wc-brown-dark)]">Forced social skills groups</td>
                                        <td className="p-4 bg-[var(--wc-blue-pale)]/30 text-[var(--wc-brown-dark)]">Parallel play, buddy systems, or optional groups</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-r border-[var(--wc-ochre-pale)] text-[var(--wc-brown-dark)]">Linear, prescribed tasks</td>
                                        <td className="p-4 bg-[var(--wc-blue-pale)]/30 text-[var(--wc-brown-dark)]">"Strewing" materials, starting in the middle, sharing demands</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-display font-bold text-[var(--wc-brown-darker)]">Key Accommodation Categories</h3>
                            <ul className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Access to a safe, quiet retreat space",
                                    "Declarative Language ('I wonder...', 'I notice...')",
                                    "Choice in topic, materials, or method",
                                    "Use of scribe or speech-to-text",
                                    "Advance notice of changes (non-demanding)",
                                    "'Hot pass' to leave room without questions"
                                ].map((acc, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[var(--wc-brown-dark)] bg-[var(--wc-cream)] p-3 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-[var(--wc-sage)] shrink-0 mt-0.5" />
                                        {acc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <Separator />

                    {/* Section 5: Goals */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-display font-bold text-[var(--wc-brown-darker)]">5.0 Meaningful Goals (SMART)</h2>
                        <p className="text-lg text-[var(--wc-brown-dark)]">
                            Goals should focus on long-term well-being, self-advocacy, and regulation, not just compliance.
                        </p>

                        <div className="bg-[var(--wc-gold-pale)] border border-[var(--wc-gold)]/50 rounded-xl p-6">
                            <h3 className="font-display font-bold text-[var(--wc-gold-dark)] mb-2">Example Improvement</h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-bold text-[var(--wc-error-dark)] uppercase tracking-wide">Problematic Goal</span>
                                    <p className="text-[var(--wc-brown-dark)] mt-1">"Student will complete 80% of worksheets independently."</p>
                                </div>
                                <div className="border-t border-[var(--wc-gold)]/30 pt-3">
                                    <span className="text-xs font-bold text-[var(--wc-sage-dark)] uppercase tracking-wide">PDA-Affirming Goal</span>
                                    <p className="text-[var(--wc-brown-darker)] font-medium mt-1">
                                        "When given executive functioning supports and choice, learner will begin the task within 1 minute on 4 of 5 opportunities."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="bg-[var(--wc-brown-darker)] text-[var(--wc-cream)] p-8 rounded-2xl text-center">
                        <p className="italic text-lg">
                            "A successful IEP for a PDA student is a living document, built on a foundation of trust, flexibility, and a deep, compassionate understanding of the child's unique neurology."
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
