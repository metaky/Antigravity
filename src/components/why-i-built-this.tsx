import { Heart, ArrowRight } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"

export function WhyIBuiltThis() {
    return (
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-slate-50 shadow-xl overflow-hidden relative">
            <div className="max-w-3xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                        <Heart className="h-8 w-8 text-rose-400 fill-rose-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Why I Built This</h2>
                </div>

                {/* Content */}
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                    <p>
                        I’m a dad to a PDA autistic child. I know firsthand how exhausting it is to sit in an IEP meeting and feel like you're speaking a different language. I know the pain of seeing "non-compliance" written down when I see a child in fight-or-flight.
                    </p>
                    <p>
                        I built this tool because I needed a way to bridge that gap. I needed a way to translate our deep understanding of our kids' safety needs into the professional, data-driven language that schools respect.
                    </p>
                    <p>
                        My goal is to keep these tools free so every parent can walk into those meetings with confidence, not confusion. If this helps you secure one more accommodation or reframe one goal, that is a success.
                    </p>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-4">
                    <div>
                        <TrackedLink
                            href="/support"
                            eventName="support_cta_clicked"
                            eventProperties={{ source: "why_i_built_this", destination: "/support" }}
                            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold text-lg underline hover:no-underline transition-colors"
                        >
                            Click here to support this project and others like it <ArrowRight className="h-5 w-5" />
                        </TrackedLink>
                    </div>
                    <div>
                        <a
                            href="mailto:declarativeapp@gmail.com"
                            className="text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            Contact the Developer
                        </a>
                    </div>
                </div>

            </div>

            {/* Subtle Texture/Gradient Background */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-900/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-rose-900/10 blur-3xl rounded-full"></div>
        </div>
    )
}
