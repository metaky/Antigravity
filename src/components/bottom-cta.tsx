import { buttonVariants } from "@/components/ui/button"
import { TrackedLink } from "@/components/tracked-link"
import { cn } from "@/lib/utils"

export function BottomCTA() {
    return (
        <section className="py-16 md:py-24 bg-[var(--wc-paper)] border-t border-[var(--wc-ochre-pale)] relative overflow-hidden">
            {/* Watercolor wash background */}
            <div className="absolute inset-0 wc-wash-blend opacity-40" />

            {/* Floating paint splashes */}
            <div className="absolute top-10 left-20 w-32 h-32 bg-[var(--wc-blue)]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-[var(--wc-ochre)]/15 rounded-full blur-2xl" />

            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-6 relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--wc-brown-darker)]">
                    Ready to advocate for your child?
                </h2>
                <p className="text-lg text-[var(--wc-brown-dark)] max-w-[600px]">
                    Get instant, PDA-affirming feedback on your IEP or 504 Plan today.
                </p>
                <TrackedLink
                    href="/analyze"
                    eventName="analyze_cta_clicked"
                    eventProperties={{ source: "bottom_cta", destination: "/analyze" }}
                    className={cn(buttonVariants({ variant: "watercolor", size: "xl" }), "px-8 font-semibold rounded-full")}
                >
                    Analyze IEP Now
                </TrackedLink>
            </div>
        </section>
    )
}
