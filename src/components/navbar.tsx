import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"

export function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-border bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link className="flex items-center gap-2 font-bold text-xl" href="/">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span>PDA Your IEP</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link className="transition-colors hover:text-primary" href="/how-it-works">
                        How it Works
                    </Link>
                    <Link className="transition-colors hover:text-primary" href="/support">
                        Support & Donate
                    </Link>
                    <Link className="transition-colors hover:text-primary" href="/other-tools">
                        Other Tools
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/analyze" className={cn(buttonVariants({ variant: "premium", size: "sm" }), "hidden md:inline-flex")}>
                        Analyze IEP Now
                    </Link>
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
