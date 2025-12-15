import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2">
                        <Link className="flex items-center gap-2 font-bold text-xl mb-4" href="#">
                            PDA Your IEP
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Empowering parents with AI-driven insights for better educational outcomes. Privacy-focused and secure.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/how-it-works" className="hover:text-foreground">How it Works</Link></li>
                            <li><Link href="/accommodations" className="hover:text-foreground">Accommodations Library</Link></li>
                            <li><Link href="/support" className="hover:text-foreground">Support & Donate</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Connect</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Questions? Comments? <a href="mailto:declarativeapp@gmail.com" className="hover:text-foreground underline decoration-dotted">Contact me.</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-muted-foreground">
                    <div>© {new Date().getFullYear()} PDA Your IEP. All rights reserved. Not legal advice.</div>
                    <div className="font-medium text-indigo-600 dark:text-indigo-400">Built with care for the PDA community by Kyle Wegner</div>
                </div>
            </div>
        </footer>
    )
}
