import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-[var(--wc-ochre-pale)] bg-[var(--wc-cream)] relative overflow-hidden">
            {/* Subtle watercolor wash at top */}
            <div className="absolute top-0 left-0 right-0 h-16 wc-wash-blend opacity-30" />

            <div className="container mx-auto py-12 px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2">
                        <Link className="flex items-center gap-2 font-display font-bold text-2xl text-[var(--wc-brown-darker)] mb-4" href="#">
                            PDA Your IEP
                        </Link>
                        <p className="text-sm text-[var(--wc-brown-dark)] max-w-xs">
                            Empowering parents with AI-driven insights for better educational outcomes. Privacy-focused and secure.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3 text-[var(--wc-brown-darker)]">Product</h3>
                        <ul className="space-y-2 text-sm text-[var(--wc-brown-dark)]">
                            <li><Link href="/how-it-works" className="hover:text-[var(--wc-blue-dark)] transition-colors">How it Works</Link></li>
                            <li><Link href="/behavior-report" className="hover:text-[var(--wc-blue-dark)] transition-colors">Behavior Reports</Link></li>
                            <li><Link href="/accommodations" className="hover:text-[var(--wc-blue-dark)] transition-colors">Accommodations Library</Link></li>
                            <li><Link href="/support" className="hover:text-[var(--wc-blue-dark)] transition-colors">Support & Donate</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3 text-[var(--wc-brown-darker)]">Connect</h3>
                        <ul className="space-y-2 text-sm text-[var(--wc-brown-dark)]">
                            <li>Questions? Comments? <a href="mailto:declarativeapp@gmail.com" className="hover:text-[var(--wc-blue-dark)] underline decoration-dotted decoration-[var(--wc-ochre)]">Contact me.</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3 text-[var(--wc-brown-darker)]">Legal</h3>
                        <ul className="space-y-2 text-sm text-[var(--wc-brown-dark)]">
                            <li><Link href="/privacy-policy" className="hover:text-[var(--wc-blue-dark)] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--wc-blue-dark)] transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-[var(--wc-ochre-pale)] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-[var(--wc-brown-dark)]">
                    <div>© {new Date().getFullYear()} PDA Your IEP. All rights reserved. Not legal advice.</div>
                    <div className="font-medium text-[var(--wc-blue-dark)]">Built with care for the PDA community by Kyle Wegner</div>
                </div>
            </div>
        </footer>
    )
}
