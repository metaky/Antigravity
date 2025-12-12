"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="relative z-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Backdrop & Menu Container */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-white flex flex-col animate-in fade-in slide-in-from-top-5 duration-200">
                    <div className="container mx-auto px-4 py-24 flex flex-col gap-8 text-center bg-white h-full overflow-y-auto">

                        <div className="space-y-6 flex flex-col items-center">
                            <Link
                                href="/how-it-works"
                                className="text-2xl font-medium text-slate-900 py-2"
                            >
                                How it Works
                            </Link>
                            <Link
                                href="/support"
                                className="text-2xl font-medium text-slate-900 py-2"
                            >
                                Support & Donate
                            </Link>
                            <Link
                                href="/other-tools"
                                className="text-2xl font-medium text-slate-900 py-2"
                            >
                                Other Tools
                            </Link>
                            <Link
                                href="/pda-guide"
                                className="text-2xl font-medium text-slate-900 py-2"
                            >
                                PDA Guide
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-2xl font-medium text-slate-900 py-2"
                            >
                                Your Privacy
                            </Link>
                        </div>

                        <div className="mt-8 space-y-4 flex flex-col items-center w-full max-w-xs mx-auto">
                            <Link href="/analyze" className={cn(buttonVariants({ variant: "premium", size: "lg" }), "w-full justify-center text-lg h-14")}>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Analyze IEP Now
                            </Link>
                        </div>

                        <div className="mt-auto pb-8 text-slate-400 text-sm">
                            <Link href="/privacy" className="px-3 py-2">Privacy</Link>
                            <Link href="/terms" className="px-3 py-2">Terms</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
