import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomCTA() {
    return (
        <section className="py-16 md:py-24 bg-white border-t border-indigo-100">
            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                    Ready to advocate for your child?
                </h2>
                <p className="text-lg text-slate-600 max-w-[600px]">
                    Get instant, PDA-affirming feedback on your IEP or 504 Plan today.
                </p>
                <Link
                    href="/analyze"
                    className={cn(buttonVariants({ variant: "premium", size: "xl" }), "shadow-indigo-500/25 px-8 font-semibold")}
                >
                    Analyze IEP Now
                </Link>
            </div>
        </section>
    )
}
