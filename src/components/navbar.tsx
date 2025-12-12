import Image from "next/image"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"

export function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-border bg-white">
            <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
                <Link className="flex items-center" href="/">
                    <Image src="/logo.png" alt="PDA Your IEP Logo" width={75} height={75} className="h-[75px] w-[75px] object-contain" />
                    <span className="-ml-3 font-bold text-2xl text-slate-900">PDA Your IEP</span>
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
                    <Link className="transition-colors hover:text-primary" href="/privacy">
                        Your Privacy
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
