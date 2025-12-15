import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import {
    MessageCircle,
    CalendarClock,
    HeartHandshake,
    AlertTriangle,
    CheckCircle2,
    BookOpen,
    Users,
    BrainCircuit,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "PDA Accommodations Library | PDA Your IEP",
    description: "A curated library of school accommodations specifically designed for the Pathological Demand Avoidance (PDA) profile of autism, contrasting standard ASD supports with PDA needs.",
}

const AccommodationsPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 md:px-6 max-w-5xl">

                    {/* Header */}
                    <div className="text-center mb-16 space-y-6 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] h-[300px] bg-gradient-to-r from-indigo-200 via-purple-200 to-rose-200 blur-3xl rounded-full -z-10 opacity-40"></div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                            The PDA Accommodations Library
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            While general autism accommodations often focus on structure, routine, and clear instruction, <strong className="text-indigo-700 font-semibold">PDA accommodations must prioritize autonomy, flexibility, and anxiety reduction.</strong>
                        </p>
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl max-w-2xl mx-auto text-sm text-amber-900 flex gap-3 items-start text-left shadow-sm">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <p>
                                In many cases, standard autism strategies (like rigid visual schedules or reward charts) can actually <span className="font-semibold">trigger PDA anxiety</span>, making the behavior worse.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-20">
                        {/* Section 1: Language */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-indigo-200 pb-4">
                                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <MessageCircle className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">I. Language & Communication</h2>
                            </div>

                            <div className="grid gap-6">
                                <AccommodationCard
                                    title="1. Use of Declarative Language"
                                    description="Staff will predominantly use declarative language (statements of fact, observations, or 'I wonder' statements) rather than imperative language (direct commands, questions, or demands)."
                                    asdApproach="Often relies on clear, direct commands (e.g., 'Put on your coat')."
                                    pdaApproach="Direct commands trigger the threat response. Declarative language invites collaboration without pressure (e.g., 'I notice it’s cold outside; I’m going to grab my coat')."
                                    rationale="Reduces the perception of a 'demand,' lowering cortisol levels and allowing the student to initiate the action themselves, preserving autonomy."
                                    source="The Declarative Language Handbook (Murphy); PDA Society Guidelines."
                                />
                                <AccommodationCard
                                    title="2. Depersonalized Demands"
                                    description="When rules must be enforced, attribute the 'demand' to an inanimate object, a sign, or 'the system' rather than the teacher's personal authority."
                                    example="Pointing to a sign that says 'Library is Quiet' rather than saying 'You need to be quiet.'"
                                    rationale="It removes the interpersonal power struggle. The teacher remains an ally rather than an enforcer."
                                    source="30 IEP Strategies for PDA and Masking Behaviors."
                                    hideComparison={true}
                                />
                                <AccommodationCard
                                    title="3. Extended Processing Time (Wait Time)"
                                    description="After presenting an idea or option, staff must wait (sometimes 10+ seconds) without repeating the prompt or adding pressure."
                                    asdApproach="Often used for cognitive processing."
                                    pdaApproach="Used for emotional processing. The child needs time to quell their initial 'No!' fight-or-flight reflex before they can logically consider the request."
                                    source="PDA North America."
                                />
                            </div>
                        </section>

                        {/* Section 2: Structure */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-purple-200 pb-4">
                                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                    <CalendarClock className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">II. Schedule, Structure & Flexibility</h2>
                            </div>

                            <div className="grid gap-6">
                                <AccommodationCard
                                    title="4. Visual 'Menus' Instead of Rigid Schedules"
                                    description="Instead of a fixed timeline (9:00 Math, 9:30 Reading), provide a 'Menu of Tasks' that must be completed by the end of a block, allowing the student to choose the order."
                                    asdApproach="Thrives on rigid, predictable 'First/Then' schedules."
                                    pdaApproach="Rigid schedules feel like a cage. 'First/Then' is often perceived as a threat/bribe. Choice provides the necessary sense of control."
                                    rationale="Maintains academic expectations while granting the necessary autonomy to lower anxiety."
                                    source="30 IEP Strategies for PDA and Masking Behaviors."
                                />
                                <AccommodationCard
                                    title="5. The 'Opt-Out' or 'Safe Exit' Clause"
                                    description="The student is explicitly allowed to opt out of an activity or leave the room to a designated safe space without asking for permission (e.g., using a pass system) if they feel a meltdown approaching."
                                    asdApproach="May need permission/prompting to take a break."
                                    pdaApproach="The requirement to ask for permission is a demand in itself. Knowing they can escape often reduces the anxiety enough that they don't need to."
                                    rationale="Reduces the feeling of being trapped, which is a primary trigger for PDA panic/meltdowns."
                                    source="National Autistic Society (UK) - PDA Guidelines."
                                />
                                <AccommodationCard
                                    title="6. Novelty & Interest-Led Modifications"
                                    description="Allow the student to incorporate intense interests into non-preferred tasks (e.g., writing a math problem about Minecraft characters)."
                                    asdApproach="Interests are often used as a reward for finishing work (First work, then Minecraft)."
                                    pdaApproach="Interests are used as a bridge to start the work. Rewards generally do not work for PDA students because the pressure to 'earn' the reward ruins the motivation."
                                    source="At Peace Parents (Casey Ehrlich); PDA Society."
                                />
                            </div>
                        </section>

                        {/* Section 3: Social */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-emerald-200 pb-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">III. Behavioral & Social Approaches</h2>
                            </div>

                            <div className="grid gap-6">
                                <AccommodationCard
                                    title="7. Collaboration Over Compliance"
                                    subtitle="(Low Arousal Approach)"
                                    description="The IEP goals prioritize emotional regulation and trust over immediate compliance. Staff are trained to drop demands when the student shows signs of distress."
                                    asdApproach="Often uses ABA (Applied Behavior Analysis) or compliance training."
                                    pdaApproach="Compliance-based approaches (ABA) are frequently contraindicated for PDA as they increase trauma and masking. The focus is on co-regulation."
                                    source="PDA North America; 30 IEP Strategies for PDA."
                                />
                                <AccommodationCard
                                    title="8. Indirect Praise"
                                    description="Avoid 'Good job!' or 'I'm so proud of you!' directly to the child's face immediately after a task. Instead, praise the object ('That drawing has great colors') or let them overhear you praising them to another adult later."
                                    asdApproach="Often responds well to enthusiastic verbal praise and reinforcement."
                                    pdaApproach="Direct praise can feel patronizing or like a 'manipulation' to get them to do it again, triggering anxiety about future expectations."
                                    rationale="Allows the child to feel pride without the pressure of external validation."
                                    source="The PDA Society."
                                />
                                <AccommodationCard
                                    title="9. Peer Body Doubling / Parallel Work"
                                    description="Allowing the student to work alongside a teacher or peer who is doing their own work, rather than the teacher 'hovering' to supervise."
                                    rationale="'Body doubling' provides social motivation without the direct pressure of being watched or critiqued."
                                    source="Neurodivergent Insights."
                                    hideComparison={true}
                                />
                            </div>
                        </section>

                        <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 text-center text-white space-y-6">
                            <h2 className="text-2xl md:text-3xl font-bold">Need these in your IEP?</h2>
                            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                                Upload your current IEP or 504 Plan and our AI will check if you have these critical supports in place.
                            </p>
                            <Link
                                href="/analyze"
                                className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
                            >
                                Analyze My IEP Now <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

// Components

function AccommodationCard({
    title,
    subtitle,
    description,
    asdApproach,
    pdaApproach,
    rationale,
    source,
    example,
    hideComparison = false
}: {
    title: string
    subtitle?: string
    description: string
    asdApproach?: string
    pdaApproach?: string
    rationale?: string
    source?: string
    example?: string
    hideComparison?: boolean
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 md:p-8 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    {subtitle && <p className="text-slate-500 font-medium">{subtitle}</p>}
                </div>

                <p className="text-lg text-slate-700 leading-relaxed border-l-4 border-indigo-500 pl-4 bg-slate-50 py-2 pr-2 rounded-r-lg">
                    {description}
                </p>

                {example && (
                    <div className="bg-slate-100 p-4 rounded-lg text-slate-700 italic">
                        <span className="font-semibold not-italic text-slate-900 mr-2">Example:</span>
                        {example}
                    </div>
                )}

                {!hideComparison && (asdApproach || pdaApproach) && (
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                <Users className="h-4 w-4" aria-hidden="true" />
                                Standard ASD
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{asdApproach}</p>
                        </div>
                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 relative">
                            <div className="absolute top-0 right-0 p-3">
                                <CheckCircle2 className="h-5 w-5 text-indigo-500 opacity-20" aria-hidden="true" />
                            </div>
                            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold uppercase text-xs tracking-wider">
                                <BrainCircuit className="h-4 w-4" aria-hidden="true" />
                                PDA Specific
                            </div>
                            <p className="text-indigo-900 text-sm leading-relaxed font-medium">{pdaApproach}</p>
                        </div>
                    </div>
                )}

                {(rationale || source) && (
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-6 text-sm">
                        {rationale && (
                            <div className="flex-1">
                                <span className="font-bold text-slate-900 block mb-1">Why it works:</span>
                                <p className="text-slate-600">{rationale}</p>
                            </div>
                        )}
                        {source && (
                            <div className="sm:max-w-[200px] text-slate-400">
                                <span className="font-bold text-slate-500 block mb-1 flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" aria-hidden="true" /> Source:
                                </span>
                                <p className="italic text-xs">{source}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccommodationsPage
