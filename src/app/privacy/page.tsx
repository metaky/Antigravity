import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | PDA Your IEP",
    description: "We prioritize your privacy. Read our policy on data handling, AI processing, and how we protect your uploaded educational documents.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1 container mx-auto pt-32 pb-16 px-4 md:px-6 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="text-sm text-indigo-900 font-medium text-center">
                            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Your Privacy & Safety</h1>
                            <p className="lead text-xl text-slate-600 max-w-2xl mx-auto">
                                We know you are uploading sensitive documents about your child. We take that responsibility incredibly seriously. Here is exactly how we handle your data.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-12 not-prose">
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                <h3 className="font-bold text-emerald-900 text-lg mb-2">🚫 No Selling of Data</h3>
                                <p className="text-emerald-800 text-sm">We strictly never sell your personal data or your child's data to advertisers or third parties.</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 text-lg mb-2">🧠 No Public AI Training</h3>
                                <p className="text-blue-800 text-sm">Your uploaded IEPs or 504 Plans are NOT used to train the public AI models (like ChatGPT or Gemini). Your data stays isolated.</p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                                <h3 className="font-bold text-purple-900 text-lg mb-2">🗑️ Transient Processing</h3>
                                <p className="text-purple-800 text-sm">Files are processed in-memory and then discarded. We don't build a database of student IEPs.</p>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                <h3 className="font-bold text-amber-900 text-lg mb-2">🔒 Encrypted & Secure</h3>
                                <p className="text-amber-800 text-sm">All data transfer is encrypted (HTTPS/TLS) and processed using secure, enterprise-grade cloud infrastructure.</p>
                            </div>
                        </div>

                        <hr className="my-12 border-slate-100" />

                        <div className="bg-slate-50 p-8 rounded-xl text-center">
                            <h2 className="text-xl font-bold mb-4">Need the Full Legal Details?</h2>
                            <p className="text-slate-600 mb-6">
                                We believe in transparency. You can read our complete, legally binding privacy policy at the link below.
                            </p>
                            <a href="/privacy-policy" className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 h-10 px-4 py-2 hover:border-slate-300 shadow-sm">
                                Read Full Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
