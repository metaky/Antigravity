import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | PDA Your IEP",
    description: "Read our full privacy policy detailing data collection, usage, and protection measures.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--wc-cream)]">
            <Navbar />
            <main className="flex-1 container mx-auto pt-32 pb-16 px-4 md:px-6 max-w-4xl">
                <div className="wc-card p-8 md:p-12">
                    <div className="mb-8 p-4 bg-[var(--wc-blue-pale)] border border-[var(--wc-blue)]/30 rounded-xl">
                        <p className="text-sm text-[var(--wc-blue-dark)] font-medium text-center">
                            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none prose-headings:text-[var(--wc-brown-darker)] prose-headings:font-display prose-p:text-[var(--wc-brown-dark)] prose-li:text-[var(--wc-brown-dark)] prose-strong:text-[var(--wc-brown-darker)]">
                        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--wc-brown-darker)] mb-6">Privacy Policy</h1>

                        <p className="lead text-lg text-[var(--wc-brown-dark)]">
                            Your privacy is critically important to us. At PDA Your IEP ("we", "us", or "our"), we have a few fundamental principles:
                        </p>
                        <ul className="text-slate-600">
                            <li>We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services.</li>
                            <li>We store personal information for only as long as we have a reason to keep it.</li>
                            <li>We aim for full transparency on how we gather, use, and share your personal information.</li>
                        </ul>

                        <h2>1. Information We Collect</h2>
                        <p>We collect information to provide better services to all our users. The types of information we collect include:</p>

                        <h3>A. Information You Provide to Us</h3>
                        <ul>
                            <li><strong>Uploaded Documents:</strong> When you upload an IEP or other educational document for analysis, we process the text within that document. This data is processed transiently to provide you with the AI analysis.</li>
                            <li><strong>Account Information:</strong> If you create an account (in the future), we may collect your name, email address, and payment information.</li>
                        </ul>

                        <h3>B. Information We Collect Automatically</h3>
                        <p>When you use our application, we automatically collect certain information to help us understand usage patterns and improve our services. This is done through a third-party analytics service called PostHog. Analytics and session replays are enabled by default unless you decline them in the site banner or your browser sends a Do Not Track signal. The information collected includes:</p>
                        <ul>
                            <li><strong>Usage Data:</strong> We collect anonymous information about your interactions with the app, such as the pages you view and the core features you use.</li>
                            <li><strong>Session Replay Data:</strong> We may record how pages are viewed and interacted with to help us debug issues and improve the product experience, while masking inputs and excluding sensitive tool output areas from replay capture.</li>
                            <li><strong>Device Information:</strong> We may collect basic information about your device, such as browser type and operating system, to help us troubleshoot issues.</li>
                            <li><strong>Cookies:</strong> We use cookies and similar technologies to identify and track visitors, their usage of the website, and their website access preferences.</li>
                        </ul>
                        <p>If you prefer not to be included in analytics or session replays, use the site banner to decline analytics.</p>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our analysis services.</li>
                            <li>Process transactions and manage your (future) account.</li>
                            <li>Monitor and analyze usage and trends into order to optimize the user interface and features.</li>
                            <li>Identify and troubleshoot bugs and errors.</li>
                            <li>Prevent fraud and ensure the security of our platform.</li>
                        </ul>

                        <h2>3. Sharing of Information</h2>
                        <p>We do not sell your personal data. We share information only in the following limited circumstances:</p>

                        <h3>A. AI Processing Providers</h3>
                        <p>
                            To provide the IEP analysis, the text extracted from your uploaded documents is sent to our AI providers (Google Vertex AI / Gemini).
                            <strong>Note:</strong> We configure our API usage such that your data is <strong>not</strong> used to train their public foundation models. The data is used solely to generate the response for your specific request.
                        </p>

                        <h3>B. Service Providers</h3>
                        <p>We engage trusted third-party service providers to perform functions and provide services to us, such as:</p>
                        <ul>
                            <li><strong>PostHog:</strong> For anonymous product analytics that help us understand usage patterns and fix bugs. PostHog's use of your information is governed by their privacy policy.</li>
                            <li><strong>Stripe:</strong> For secure payment processing (future integration). We do not store your full credit card details.</li>
                            <li><strong>Hosting Providers:</strong> To store and serve our application (e.g., Vercel, AWS).</li>
                        </ul>

                        <h3>C. Legal Requirements</h3>
                        <p>We may disclose information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation, protect and defend our rights or property, or act in urgent circumstances to protect the personal safety of users of the Service or the public.</p>

                        <h2>4. Your Data Protection Rights (GDPR and CCPA)</h2>
                        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                        <ul>
                            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                            <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                        </ul>
                        <p>
                            <strong>Opt-out:</strong> PostHog respects "Do Not Track" browser settings. If you prefer not to be tracked, choose "Decline analytics" in the site banner instead of keeping analytics on.
                        </p>

                        <h2>5. Data Retention and Security</h2>
                        <p>
                            We prioritize the security of your data. Uploaded IEP documents are processed in memory and are not permanently stored in our database after the analysis session is complete, unless explicitly saved by you (feature dependent).
                            We retain metadata and usage statistics for a reasonable period to improve our services.
                        </p>
                        <p>
                            While we implement commercially reasonable security measures, please remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure.
                        </p>

                        <h2>6. Children's Privacy</h2>
                        <p>
                            Our Service is not directed to anyone under the age of 13. However, we understand that parents may use our tool to analyze documents related to their children.
                            We treat all data, including data contained within uploaded documents about minors, with the utmost care and privacy as described in this policy.
                        </p>

                        <h2>7. Changes to This Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                            You are advised to review this Privacy Policy periodically for any changes.
                        </p>

                        <h2>8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us via our Support page.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
