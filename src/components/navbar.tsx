import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"

import { HeartHandshake } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white border-b border-[var(--wc-ochre-pale)]">
            {/* Top Utility Bar - Warm cream with subtle texture */}
            <div className="bg-[var(--wc-cream)] border-b border-[var(--wc-ochre-pale)]/50">
                <div className="container mx-auto px-4 md:px-6 h-9 flex items-center justify-end gap-6 text-xs font-medium text-[var(--wc-brown-dark)]">
                    <Link className="flex items-center gap-1.5 hover:text-[var(--wc-blue-dark)] transition-colors" href="/support">
                        <HeartHandshake className="h-3.5 w-3.5" />
                        Support & Donate
                    </Link>
                    <Link className="hover:text-[var(--wc-blue-dark)] transition-colors" href="/privacy">
                        Your Privacy
                    </Link>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="container mx-auto flex h-20 items-center px-4 md:px-6 justify-between">
                <div className="flex items-center">
                    <Link className="flex items-center gap-2 group" href="/">
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
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    <Link className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/analyze">
                        Analyze IEP
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/how-it-works">
                        How it Works
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/behavior-report">
                        Behavior Reports
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/accommodations">
                        Accommodations Library
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                    <Link className="relative text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)] transition-colors group" href="/other-tools">
                        Other Tools
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--wc-ochre)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/analyze" className={cn(buttonVariants({ variant: "watercolor", size: "default" }), "hidden md:inline-flex font-semibold rounded-full")}>
                        Analyze IEP Now
                    </Link>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
