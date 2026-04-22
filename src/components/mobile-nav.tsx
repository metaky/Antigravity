"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import analytics from "@/services/analytics"

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    // Ensure component is mounted before rendering portal (SSR safety)
    useEffect(() => {
        setMounted(true)
    }, [])

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
                variant="ghost-warm"
                size="icon"
                className="relative z-50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>

            {/* Backdrop & Menu Container - Rendered via Portal to escape header's containing block */}
            {mounted && isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in fade-in slide-in-from-top-5 duration-200" style={{ backgroundColor: '#FDFCFA' }}>
                    {/* Close button - positioned at top right */}
                    <Button
                        variant="ghost-warm"
                        size="icon"
                        className="absolute top-6 right-4 z-20"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Menu"
                    >
                        <X className="h-6 w-6" aria-hidden="true" />
                    </Button>

                    {/* Watercolor wash decoration at top */}
                    <div className="absolute top-0 left-0 right-0 h-32 wc-wash-blend opacity-60" />

                    <div className="container mx-auto px-4 py-24 flex flex-col gap-8 text-center h-full overflow-y-auto relative z-10">

                        <div className="space-y-6 flex flex-col items-center">
                            <Link
                                href="/analyze"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                                onClick={() =>
                                    analytics.trackEvent("analyze_cta_clicked", {
                                        source: "mobile_nav_link",
                                        destination: "/analyze",
                                    })
                                }
                            >
                                Analyze IEP
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                            >
                                How it Works
                            </Link>
                            <Link
                                href="/behavior-report"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                                onClick={() =>
                                    analytics.trackEvent("behavior_report_cta_clicked", {
                                        source: "mobile_nav_link",
                                        destination: "/behavior-report",
                                    })
                                }
                            >
                                Behavior Reports
                            </Link>
                            <Link
                                href="/accommodations"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                            >
                                Accommodations Library
                            </Link>
                            <Link
                                href="/other-tools"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                            >
                                Other Tools
                            </Link>
                            <Link
                                href="/support"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                                onClick={() =>
                                    analytics.trackEvent("support_cta_clicked", {
                                        source: "mobile_nav_link",
                                        destination: "/support",
                                    })
                                }
                            >
                                Support & Donate
                            </Link>
                            <Link
                                href="/pda-guide"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                            >
                                PDA Guide
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-2xl font-semibold text-[var(--wc-brown-darker)] py-2 hover:text-[var(--wc-blue-dark)] transition-colors"
                            >
                                Your Privacy
                            </Link>
                        </div>

                        <div className="mt-8 space-y-4 flex flex-col items-center w-full max-w-xs mx-auto">
                            <Link
                                href="/analyze"
                                className={cn(buttonVariants({ variant: "watercolor", size: "lg" }), "w-full justify-center text-lg h-14 rounded-full")}
                                onClick={() =>
                                    analytics.trackEvent("analyze_cta_clicked", {
                                        source: "mobile_nav_button",
                                        destination: "/analyze",
                                    })
                                }
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Analyze IEP Now
                            </Link>
                        </div>

                        <div className="mt-auto pb-8 text-[var(--wc-brown-dark)] text-sm font-medium">
                            <Link href="/privacy" className="px-3 py-2 hover:text-[var(--wc-blue-dark)] transition-colors">Privacy</Link>
                            <Link href="/terms" className="px-3 py-2 hover:text-[var(--wc-blue-dark)] transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Watercolor wash decoration at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 wc-wash-ochre opacity-40" />
                </div>,
                document.body
            )}
        </div>
    )
}
