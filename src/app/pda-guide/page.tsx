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
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 container mx-auto pt-24 md:pt-32 pb-16 px-4 md:px-6 max-w-5xl">
                {/* Header Section */}
                <div className="mb-12 text-center space-y-4">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 mb-4 px-4 py-1.5 text-sm font-medium border-none shadow-none">
                        Essential Reading
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        An In-Depth Guide to Crafting a <span className="text-indigo-600">PDA-Affirming IEP</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Moving beyond compliance to create an educational plan based on trust, safety, and true understanding.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12 lg:p-16 space-y-16">

                        {/* Section 1: Foundational Shift */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-indigo-600 mb-6">
                                <Sparkles className="w-8 h-8" />
                                <h2 className="text-3xl font-bold text-slate-900">1.0 A Foundational Shift</h2>
                            </div>
                            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
                                <p>
                                    Crafting an effective Individualized Education Program (IEP) for a student with a Pathological Demand Avoidance (PDA) profile requires a fundamental shift in mindset. Traditional frameworks often fail because they are built on compliance. For a PDA learner, success begins with understanding the "why" behind their nervous system response.
                                </p>
                                <p>
                                    PDA is a profile of autism rooted in a nervous system characterized by persistently high anxiety and a survival-driven need for autonomy. Avoidance is not a choice; it is a neurological response to perceived threat.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 my-8">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                            The Traditional View
                                        </h3>
                                        <ul className="space-y-2 text-sm">
                                            <li>• Behavior is a choice or defiance</li>
                                            <li>• Use rewards/consequences to motivate</li>
                                            <li>• Goal is compliance and obedience</li>
                                        </ul>
                                    </div>
                                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                        <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-indigo-500" />
                                            The PDA Reality
                                        </h3>
                                        <ul className="space-y-2 text-sm text-indigo-900">
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
                            <div className="flex items-center gap-4 text-emerald-600 mb-6">
                                <Lightbulb className="w-8 h-8" />
                                <h2 className="text-3xl font-bold text-slate-900">2.0 Reframing: PDA Strengths</h2>
                            </div>
                            <p className="text-lg text-slate-600">
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
                                    <div key={i} className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* Section 3: Principles */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 text-sky-600 mb-6">
                                <Shield className="w-8 h-8" />
                                <h2 className="text-3xl font-bold text-slate-900">3.0 Core Educational Principles</h2>
                            </div>

                            <Alert className="bg-sky-50 border-sky-100">
                                <Info className="h-5 w-5 text-sky-600" />
                                <AlertTitle className="text-sky-900 font-semibold">Shift Priority</AlertTitle>
                                <AlertDescription className="text-sky-800">
                                    The most important shift is moving from <strong>Compliance</strong> to <strong>Connection & Co-regulation</strong>.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900">The Three Pillars of Safety</h3>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">1</div>
                                        <h4 className="font-bold text-lg">Autonomy</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Providing choice preempts the threat response. Allow the student to opt-out, change rules, or choose how to complete tasks.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">2</div>
                                        <h4 className="font-bold text-lg">Equality</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Collaborate rather than dictate. Position yourself as a mentor. Use "we" language and equalize the power dynamic.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">3</div>
                                        <h4 className="font-bold text-lg">Lowering Demands</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Adjust expectations based on regulation levels, not ability. Reduce workload, share the task, or act as a scribe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 4: Accommodations */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-bold text-slate-900">4.0 Accommodations & Supports</h2>
                            <p className="text-lg text-slate-600">
                                Standard accommodations must be adapted. Here is how to shift from traditional to PDA-affirming approaches.
                            </p>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-900 font-semibold">
                                        <tr>
                                            <th className="p-4 border-b border-r border-slate-200 w-1/2">Traditional / Unhelpful</th>
                                            <th className="p-4 border-b border-slate-200 w-1/2 bg-indigo-50 text-indigo-900">PDA-Affirming Alternative</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="p-4 border-r border-slate-200">Rigid visual schedule</td>
                                            <td className="p-4 bg-indigo-50/30">Flexible "rhythm" or visual suggestion</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 border-r border-slate-200">Token boards / Sticker charts</td>
                                            <td className="p-4 bg-indigo-50/30">Surprise, natural rewards & genuine praise</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 border-r border-slate-200">Forced social skills groups</td>
                                            <td className="p-4 bg-indigo-50/30">Parallel play, buddy systems, or optional groups</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 border-r border-slate-200">Linear, prescribed tasks</td>
                                            <td className="p-4 bg-indigo-50/30">"Strewing" materials, starting in the middle, sharing demands</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900">Key Accommodation Categories</h3>
                                <ul className="grid md:grid-cols-2 gap-4">
                                    {[
                                        "Access to a safe, quiet retreat space",
                                        "Declarative Language ('I wonder...', 'I notice...')",
                                        "Choice in topic, materials, or method",
                                        "Use of scribe or speech-to-text",
                                        "Advance notice of changes (non-demanding)",
                                        "'Hot pass' to leave room without questions"
                                    ].map((acc, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-3 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            {acc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 5: Goals */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-bold text-slate-900">5.0 Meaningful Goals (SMART)</h2>
                            <p className="text-lg text-slate-600">
                                Goals should focus on long-term well-being, self-advocacy, and regulation, not just compliance.
                            </p>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                                <h3 className="font-bold text-amber-900 mb-2">Example Improvement</h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Problematic Goal</span>
                                        <p className="text-slate-700 mt-1">"Student will complete 80% of worksheets independently."</p>
                                    </div>
                                    <div className="border-t border-amber-200 pt-3">
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide">PDA-Affirming Goal</span>
                                        <p className="text-slate-800 font-medium mt-1">
                                            "When given executive functioning supports and choice, learner will begin the task within 1 minute on 4 of 5 opportunities."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="bg-slate-900 text-slate-200 p-8 rounded-2xl text-center">
                            <p className="italic text-lg">
                                "A successful IEP for a PDA student is a living document, built on a foundation of trust, flexibility, and a deep, compassionate understanding of the child's unique neurology."
                            </p>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
