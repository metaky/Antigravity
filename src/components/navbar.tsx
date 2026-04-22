import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { TrackedLink } from "@/components/tracked-link"
import { cn } from "@/lib/utils"

import { HeartHandshake } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white border-b border-[var(--wc-ochre-pale)] print:hidden">
            {/* Top Utility Bar - Warm cream with subtle texture */}
            <div className="bg-[var(--wc-cream)] border-b border-[var(--wc-ochre-pale)]/50">
                <div className="container mx-auto px-4 md:px-6 h-9 flex items-center justify-end gap-6 text-xs font-medium text-[var(--wc-brown-dark)]">
                    <TrackedLink
                        className="flex items-center gap-1.5 hover:text-[var(--wc-blue-dark)] transition-colors"
                        href="/support"
                        eventName="support_cta_clicked"
                        eventProperties={{ source: "navbar_utility", destination: "/support" }}
                    >
                        <HeartHandshake className="h-3.5 w-3.5" />
                        Support & Donate
                    </TrackedLink>
                    <TrackedLink className="hover:text-[var(--wc-blue-dark)] transition-colors" href="/privacy">
                        Your Privacy
                    </TrackedLink>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="container mx-auto flex h-20 items-center px-4 md:px-6 justify-between">
                <div className="flex items-center">
                    <TrackedLink className="flex items-center gap-2 group" href="/">
                        <div className="relative h-16 w-16">
                            <Image
                                src="/logo.png"
                                alt="PDA Your IEP Logo"
                                fill
                                className="object-contain mix-blend-multiply"
                            />
                        </div>
                        <span className="font-display font-bold text-2xl text-[var(--wc-brown-darker)] group-hover:text-[var(--wc-blue-dark)] transition-colors">
                            PDA Your IEP
                        </span>
                    </TrackedLink>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    <TrackedLink
                        className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group"
                        href="/analyze"
                        eventName="analyze_cta_clicked"
                        eventProperties={{ source: "navbar_primary", destination: "/analyze" }}
                    >
                        Analyze IEP
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </TrackedLink>
                    <TrackedLink className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/how-it-works">
                        How it Works
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </TrackedLink>
                    <TrackedLink
                        className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group"
                        href="/behavior-report"
                        eventName="behavior_report_cta_clicked"
                        eventProperties={{ source: "navbar_primary", destination: "/behavior-report" }}
                    >
                        Behavior Reports
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </TrackedLink>
                    <TrackedLink className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/accommodations">
                        Accommodations Library
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </TrackedLink>
                    <TrackedLink className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/other-tools">
                        Other Tools
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </TrackedLink>
                </nav>

                <div className="flex items-center gap-4">
                    <TrackedLink
                        href="/analyze"
                        className={cn(buttonVariants({ variant: "watercolor", size: "default" }), "hidden md:inline-flex font-semibold rounded-full")}
                        eventName="analyze_cta_clicked"
                        eventProperties={{ source: "navbar_button", destination: "/analyze" }}
                    >
                        Analyze IEP Now
                    </TrackedLink>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
