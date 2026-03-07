"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DualUploadZone } from "@/components/dual-upload-zone"
import { PrivacyNotice, Disclaimer } from "@/components/privacy-notice"
import { DonationPrompt } from "@/components/donation-prompt"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Shield, CheckCircle, AlertTriangle, BookOpen, Brain, Sparkles, Trash2, FileText, Clock, ChevronRight } from "lucide-react"
import Image from "next/image"
import posthog from "posthog-js"

interface AnalysisResults {
    whatWentWell: string[]
    whatCouldBeBetter: string[]
    iepGuidance: {
        title: string
        description: string
        quote?: string
        page?: number
        source?: "IEP" | "BIR"
    }[]
    futureRecommendations: string[]
    pdaConsiderations: {
        strategy: string
        explanation: string
        howToImplement: string
    }[]
    summary: string
}

type BehaviorReportSession = {
    id: string
    timestamp: number
    behaviorFileName: string
    iepFileName: string
    data: AnalysisResults
}

export default function BehaviorReportPage() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [analysisComplete, setAnalysisComplete] = useState(false)
    const [results, setResults] = useState<AnalysisResults | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [savedSessions, setSavedSessions] = useState<BehaviorReportSession[]>([])
    const [currentFileNames, setCurrentFileNames] = useState<{ behavior: string; iep: string } | null>(null)

    // Load sessions on mount
    useEffect(() => {
        const loadSessions = () => {
            try {
                const saved = localStorage.getItem("behavior_report_history")
                if (saved) {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed)) {
                        setSavedSessions(parsed.sort((a, b) => b.timestamp - a.timestamp))
                    }
                }
            } catch (e) {
                console.error("Failed to load behavior report history", e)
            }
        }
        loadSessions()
    }, [])

    const saveSession = (data: AnalysisResults, behaviorFileName: string, iepFileName: string) => {
        const newSession: BehaviorReportSession = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            behaviorFileName,
            iepFileName,
            data
        }

        const updatedSessions = [newSession, ...savedSessions]
        setSavedSessions(updatedSessions)
        localStorage.setItem("behavior_report_history", JSON.stringify(updatedSessions))
    }

    const restoreSession = (session: BehaviorReportSession) => {
        setResults(session.data)
        setCurrentFileNames({ behavior: session.behaviorFileName, iep: session.iepFileName })
        setAnalysisComplete(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const updated = savedSessions.filter(s => s.id !== id)
        setSavedSessions(updated)
        localStorage.setItem("behavior_report_history", JSON.stringify(updated))
    }

    const handleFilesSelect = async (behaviorReport: File, iepDocument: File) => {
        setCurrentFileNames({ behavior: behaviorReport.name, iep: iepDocument.name })
        setIsProcessing(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("behaviorReport", behaviorReport)
            formData.append("iepDocument", iepDocument)

            const response = await fetch("/api/behavior-report", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setResults(data.data)
                setAnalysisComplete(true)
                saveSession(data.data, behaviorReport.name, iepDocument.name)

                // Track successful report generation
                posthog.capture('generated_behavior_report')
            } else {
                setError(data.error || "An error occurred during analysis.")
            }

        } catch (err) {
            console.error("Upload error:", err)
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    // Results View
    if (analysisComplete && results) {
        return (
            <div className="min-h-screen flex flex-col bg-muted/10 print:bg-white">
                <style jsx global>{`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}</style>
                <div className="print:hidden"><Navbar /></div>

                {/* Maintenance Banner */}
                <div className="bg-amber-50 border-b-2 border-amber-300 py-4 px-4 text-center print:hidden">
                    <div className="container mx-auto flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        <p className="text-amber-800 font-semibold text-sm md:text-base">
                            🚧 Site is currently going through maintenance updates. Some features may be temporarily unavailable. 🚧
                        </p>
                    </div>
                </div>

                <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6 print:pt-4 print:pb-4 print:max-w-none">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Print Header */}
                        <div className="hidden print:flex items-center mb-8 border-b pb-4">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <Image src="/logo.png" alt="PDA Your IEP Logo" width={75} height={75} className="h-[75px] w-[75px] object-contain" />
                                </Link>
                                <div className="-ml-3">
                                    <h1 className="text-2xl font-bold text-slate-900 leading-none">PDA Your IEP</h1>
                                    <p className="text-sm text-slate-500 mt-1">Behavior Incident Analysis</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Behavior Report</span>
                                <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Header & Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Behavior Incident Analysis</h1>
                                <p className="text-muted-foreground">Comparison of incident report with IEP strategies and PDA considerations.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => window.print()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
                                    Print / Save PDF
                                </Button>
                                <Button variant="premium" onClick={() => setAnalysisComplete(false)}>Analyze Another Incident</Button>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border print:border-gray-300">
                            <h3 className="font-semibold text-lg mb-3">Executive Summary</h3>
                            <p className="text-muted-foreground leading-relaxed print:text-black">{results.summary}</p>
                        </div>

                        {/* What Went Well */}
                        <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 print:bg-green-50 print:border-green-200 print:break-inside-avoid">
                            <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-4 print:text-black">
                                <CheckCircle className="h-5 w-5" />
                                What Went Well
                            </h3>
                            <ul className="space-y-2">
                                {results.whatWentWell?.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-green-900 print:text-black">
                                        <span>•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* What Could Be Better */}
                        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 print:bg-amber-50 print:border-amber-200 print:break-inside-avoid">
                            <h3 className="flex items-center gap-2 font-semibold text-amber-800 mb-4 print:text-black">
                                <AlertTriangle className="h-5 w-5" />
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-2">
                                {results.whatCouldBeBetter?.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-amber-900 print:text-black">
                                        <span>•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* IEP Strategies to Apply */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold px-1 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                IEP Strategies That Should Have Been Applied
                            </h2>
                            <div className="grid gap-4 print:block print:space-y-4">
                                {results.iepGuidance?.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-l-4 border-l-blue-500 print:shadow-none print:border-gray-300">
                                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-gray-700 mb-3">{item.description}</p>
                                        {item.quote && (
                                            <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
                                                <span className="font-semibold text-blue-800">From {item.source || "IEP"}: </span>
                                                <span className="italic text-blue-900">"{item.quote}"</span>
                                                {item.page && <span className="text-xs text-blue-600 ml-2">(Page {item.page}, {item.source || "IEP"})</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Future Recommendations */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 print:break-inside-avoid">
                            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
                                <Sparkles className="h-5 w-5 text-indigo-600" />
                                Recommendations for Future Incidents
                            </h3>
                            <ul className="space-y-2">
                                {results.futureRecommendations?.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                                        <span className="text-indigo-600 font-bold">{i + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* PDA Considerations - THE KEY SECTION */}
                        <div className="space-y-4 print:break-inside-avoid">
                            <div className="flex items-center gap-3 px-1">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Brain className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-purple-900">PDA Considerations</h2>
                                    <p className="text-sm text-purple-700">Additional PDA-specific strategies beyond the IEP</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                                <p className="text-sm text-purple-800 mb-6 bg-purple-100/50 p-3 rounded-lg border border-purple-200">
                                    <strong>Note:</strong> These recommendations are specifically designed for PDA (Pathological Demand Avoidance) autistic individuals. They prioritize autonomy, anxiety reduction, and collaborative approaches rather than traditional behavioral or compliance-based strategies.
                                </p>

                                <div className="space-y-6">
                                    {results.pdaConsiderations?.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                                            <h4 className="font-bold text-purple-900 mb-2">{item.strategy}</h4>
                                            <p className="text-gray-700 text-sm mb-3">{item.explanation}</p>
                                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                                <span className="font-semibold text-purple-800 text-sm block mb-1">How to Implement:</span>
                                                <p className="text-purple-900 text-sm">{item.howToImplement}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Support CTA */}
                        <DonationPrompt />

                        {/* Report Footer & Disclaimer */}
                        <div className="border-t pt-8 mt-12 pb-8 text-center space-y-4 print:mt-8 print:pt-4">
                            <p className="font-medium text-slate-900">
                                Created for free at <Link href="/" className="text-indigo-600 hover:underline">PDAyourIEP.org</Link>
                            </p>
                            <div className="max-w-3xl mx-auto">
                                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                                    <strong>Disclaimer:</strong> This tool uses Artificial Intelligence to analyze documents and generate suggestions. It is not a substitute for professional legal, educational, or medical advice. The results should be reviewed by a qualified advocate, attorney, or education professional before being used in official IEP meetings or legal proceedings. We do not store your data permanently, and this report is generated for your personal use only.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <div className="print:hidden"><Footer /></div>
            </div>
        )
    }

    // Upload View
    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <Navbar />

            {/* Maintenance Banner */}
            <div className="bg-amber-50 border-b-2 border-amber-300 py-4 px-4 text-center">
                <div className="container mx-auto flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    <p className="text-amber-800 font-semibold text-sm md:text-base">
                        🚧 Site is currently going through maintenance updates. Some features may be temporarily unavailable. 🚧
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto pt-40 pb-12 px-4 md:px-6">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Behavior Report Tool
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Upload a Behavior Incident Report and the student's IEP to compare the incident response to IEP accommodations, outlining discrepencies and opportunities with specific PDA considerations for the future.
                        </p>
                    </div>

                    {/* Upload Zone disabled during maintenance */}
                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <p className="text-2xl font-bold text-slate-500">Out of Order</p>
                            <p className="text-slate-400 text-sm">This feature is temporarily unavailable during maintenance.</p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="text-sm text-destructive font-medium flex items-center justify-center gap-2 bg-red-50 p-4 rounded-lg border border-red-200">
                            <AlertTriangle className="h-5 w-5" />
                            {error}
                        </div>
                    )}

                    {/* Recent Reports List */}
                    {savedSessions.length > 0 && (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-slate-700">Recent Reports</h3>
                                <span className="text-xs text-muted-foreground">{savedSessions.length} saved</span>
                            </div>
                            <div className="divide-y">
                                {savedSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => restoreSession(session)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors text-sm">
                                                    {session.behaviorFileName}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={(e) => deleteSession(e, session.id)}
                                                aria-label="Delete report"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <ChevronRight className="h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* What to Expect */}
                    <div className="bg-white rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-slate-900">What You'll Receive:</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                <span><strong>What Went Well:</strong> Positive aspects of how the incident was handled</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                <span><strong>Areas for Improvement:</strong> Where IEP accommodations weren't followed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                <span><strong>IEP Strategy Guidance:</strong> Specific accommodations that should have been applied</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Brain className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                                <span><strong>PDA Considerations:</strong> Additional PDA-specific strategies beyond the IEP</span>
                            </li>
                        </ul>
                    </div>

                    {/* Bottom Privacy Notice & Disclaimer */}
                    <div className="pt-4">
                        <PrivacyNotice />
                        <Disclaimer />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
