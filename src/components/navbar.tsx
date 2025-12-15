import Image from "next/image"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"

import { HeartHandshake } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 bg-white border-b border-indigo-100 shadow-sm">
            {/* Top Utility Bar */}
            <div className="bg-slate-50 border-b border-indigo-50/50 block">
                <div className="container mx-auto px-4 md:px-6 h-9 flex items-center justify-end gap-6 text-xs font-medium text-slate-500">
                    <Link className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors" href="/support">
                        <HeartHandshake className="h-3.5 w-3.5" />
                        Support & Donate
                    </Link>
                    <Link className="hover:text-indigo-600 transition-colors" href="/privacy">
                        Your Privacy
                    </Link>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="container mx-auto flex h-20 items-center px-4 md:px-6 justify-between">
                <div className="flex items-center">
                    <Link className="flex items-center gap-2 group" href="/">
                        <div className="relative h-10 w-10">
                            <Image
                                src="/logo.png"
                                alt="PDA Your IEP Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl text-slate-900 group-hover:text-indigo-700 transition-colors">PDA Your IEP</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link className="text-slate-600 hover:text-indigo-600 transition-colors" href="/how-it-works">
                        How it Works
                    </Link>
                    <Link className="text-slate-600 hover:text-indigo-600 transition-colors" href="/accommodations">
                        Accommodations
                    </Link>
                    <Link className="text-slate-600 hover:text-indigo-600 transition-colors" href="/other-tools">
                        Other Tools
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/analyze" className={cn(buttonVariants({ variant: "premium", size: "default" }), "hidden md:inline-flex font-semibold shadow-md shadow-indigo-500/20")}>
                        Analyze IEP Now
                    </Link>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
