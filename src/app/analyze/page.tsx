"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UploadZone } from "@/components/upload-zone"
import { PrivacyNotice, Disclaimer } from "@/components/privacy-notice"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Trash2, FileText, Clock, ChevronRight, Sparkles, AlertCircle } from "lucide-react"
import { DonationPrompt } from "@/components/donation-prompt"
import Image from "next/image"

type AnalysisSession = {
    id: string
    timestamp: number
    fileName: string
    data: any
}

export default function AnalyzePage() {
    const [isProcessing, setIsProcessing] = useState(false)
    const [analysisComplete, setAnalysisComplete] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [savedSessions, setSavedSessions] = useState<AnalysisSession[]>([])

    const [showWarningModal, setShowWarningModal] = useState(false)
    const [warningReason, setWarningReason] = useState("")
    const [pendingFile, setPendingFile] = useState<File | null>(null)

    // Load sessions on mount
    useEffect(() => {
        const loadSessions = () => {
            try {
                const saved = localStorage.getItem("iep_history")
                if (saved) {
                    const parsed = JSON.parse(saved)
                    // Ensure it's an array and sort by date desc
                    if (Array.isArray(parsed)) {
                        setSavedSessions(parsed.sort((a, b) => b.timestamp - a.timestamp))
                    }
                }
            } catch (e) {
                console.error("Failed to load history", e)
            }
        }
        loadSessions()
    }, [])

    const saveSession = (data: any, fileName: string) => {
        const newSession: AnalysisSession = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            fileName: fileName,
            data: data
        }

        const updatedSessions = [newSession, ...savedSessions]
        setSavedSessions(updatedSessions)
        localStorage.setItem("iep_history", JSON.stringify(updatedSessions))
    }

    const restoreSession = (session: AnalysisSession) => {
        setResults(session.data)
        setAnalysisComplete(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const updated = savedSessions.filter(s => s.id !== id)
        setSavedSessions(updated)
        localStorage.setItem("iep_history", JSON.stringify(updated))
    }

    const handleFileSelect = async (file: File, force = false) => {
        setIsProcessing(true)
        // Reset warning state if starting fresh
        if (!force) {
            setShowWarningModal(false)
            setWarningReason("")
            setPendingFile(null)
        }

        try {
            const formData = new FormData()
            formData.append("file", file)
            if (force) {
                formData.append("force", "true")
            }

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setResults(data.data)
                setAnalysisComplete(true)
                saveSession(data.data, file.name)
                // Clear any pending file on success
                setPendingFile(null)
                setShowWarningModal(false)
            } else if (data.warning === "IrrelevantContent") {
                // Show warning modal
                setWarningReason(data.reason)
                setPendingFile(file)
                setShowWarningModal(true)
            } else {
                alert("Error analyzing file: " + data.error)
            }

        } catch (error) {
            console.error("Upload error:", error)
            alert("An unexpected error occurred.")
        } finally {
            setIsProcessing(false)
        }
    }

    const proceedWithWarning = () => {
        setShowWarningModal(false)
        if (pendingFile) {
            handleFileSelect(pendingFile, true)
        }
    }

    const cancelWarning = () => {
        setShowWarningModal(false)
        setPendingFile(null)
    }


    // Helper to Group Results by Category
    const groupedResults = results?.results ? results.results.reduce((acc: any, item: any) => {
        const cat = item.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {}) : {};

    if (analysisComplete && results) {
        const score = results.score || 0;
        const scoreColor = score >= 80 ? "text-green-600 ring-green-600" : score >= 60 ? "text-amber-600 ring-amber-600" : "text-red-600 ring-red-600";
        const scoreBg = score >= 80 ? "bg-green-50" : score >= 60 ? "bg-amber-50" : "bg-red-50";

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

                <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6 print:pt-4 print:pb-4 print:max-w-none">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Print Header */}
                        <div className="hidden print:flex items-center mb-8 border-b pb-4">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center">
                                    <Image src="/logo.png" alt="PDA Your IEP Logo" width={75} height={75} className="h-[75px] w-[75px] object-contain" />
                                </Link>
                                <div className="-ml-3">
                                    <h1 className="text-2xl font-bold text-slate-900 leading-none">PDA Your IEP</h1>
                                    <p className="text-sm text-slate-500 mt-1">AI-Powered Advocacy Tool</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Analysis Report</span>
                                <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Header & Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Analysis Results</h1>
                                <p className="text-muted-foreground">Detailed breakdown of PDA affirmation and compliance.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => window.print()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
                                    Print / Save PDF
                                </Button>
                                <Button variant="premium" onClick={() => setAnalysisComplete(false)}>Analyze Another File</Button>
                            </div>
                        </div>

                        {/* Top Section: Score & Summary */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-xl p-8 shadow-sm border flex flex-col items-center justify-center text-center print:border-gray-300">
                                <h3 className="font-semibold text-muted-foreground mb-4 uppercase tracking-wider text-sm">PDA Affirming Score</h3>
                                <div className={cn("relative flex items-center justify-center w-32 h-32 rounded-full border-8 text-4xl font-bold print:border-4", scoreColor, scoreBg)}>
                                    {score}
                                </div>
                                <p className="text-sm text-muted-foreground mt-4 print:text-black">
                                    {score >= 80 ? "Excellent Alignment" : score >= 60 ? "Partial Alignment" : "Significant Changes Needed"}
                                </p>
                            </div>

                            {/* Summary & Highlights */}
                            <div className="md:col-span-2 bg-white rounded-xl p-8 shadow-sm border flex flex-col justify-center print:border-gray-300">
                                <h3 className="font-semibold text-lg mb-3">Executive Summary</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg print:text-black">{results.summary}</p>
                            </div>
                        </div>

                        {/* Strengths & Opportunities */}
                        <div className="grid md:grid-cols-2 gap-6 print:block print:space-y-6">
                            <div className="bg-green-50/50 border border-green-100 rounded-xl p-6 print:bg-green-50 print:border-green-200 print:break-inside-avoid">
                                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-4 print:text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {results.strengths?.map((s: string, i: number) => (
                                        <li key={i} className="flex gap-2 text-sm text-green-900 print:text-black">
                                            <span>•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6 print:bg-amber-50 print:border-amber-200 print:break-inside-avoid">
                                <h3 className="flex items-center gap-2 font-semibold text-amber-800 mb-4 print:text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                    Opportunities
                                </h3>
                                <ul className="space-y-2">
                                    {results.opportunities?.map((s: string, i: number) => (
                                        <li key={i} className="flex gap-2 text-sm text-amber-900 print:text-black">
                                            <span>•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Detailed Findings */}
                        <div className="space-y-8">
                            {Object.entries(groupedResults).map(([category, items]: [string, any]) => (
                                <div key={category} className="space-y-4 print:mt-4">
                                    <h2 className="text-xl font-bold px-1 sticky top-20 bg-muted/10 backdrop-blur-sm py-2 z-10 w-fit print:static print:bg-transparent print:mb-2">{category}s</h2>
                                    <div className="grid gap-4 print:block print:space-y-4">
                                        {items.map((item: any, idx: number) => (
                                            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-l-4 group hover:shadow-md transition-shadow relative overflow-hidden print:shadow-none print:border-gray-300"
                                                style={{ borderLeftColor: item.status === 'Good' ? '#22c55e' : '#f59e0b' }}>

                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                                            <span className={cn(
                                                                "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide print:border print:border-gray-300",
                                                                item.status === 'Good' ? "bg-green-100 text-green-800 print:bg-green-100 print:text-green-900" : "bg-amber-100 text-amber-800 print:bg-amber-100 print:text-amber-900"
                                                            )}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{item.description}</p>

                                                        {item.recommendation && (
                                                            <div className="bg-blue-50/50 p-3 rounded-lg text-sm text-blue-900 border border-blue-100/50 mt-2 print:bg-blue-50 print:border-blue-200 print:text-black">
                                                                <span className="font-semibold mr-1">💡 Suggestion:</span>
                                                                {item.recommendation}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Evidence / Quote Column */}
                                                    <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm print:bg-gray-50 print:border-gray-200">
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>
                                                            Cited Evidence
                                                        </div>
                                                        <blockquote className="italic text-gray-600 mb-2">"{item.quote}"</blockquote>
                                                        {item.page && (
                                                            <div className="text-xs text-gray-400 text-right">Page {item.page}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Category Specific Recommendations Box */}
                                    {results.category_suggestions && results.category_suggestions[category] && (
                                        <div className="grid md:grid-cols-2 gap-4 mt-6 print:mt-4 print:break-inside-avoid">
                                            {/* Consider Adding */}
                                            {results.category_suggestions[category].add && results.category_suggestions[category].add.length > 0 && (
                                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 print:border-emerald-200">
                                                    <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wide">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                        Consider Adding
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {results.category_suggestions[category].add.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-emerald-900 leading-relaxed">
                                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Consider Removing */}
                                            {results.category_suggestions[category].remove && results.category_suggestions[category].remove.length > 0 && (
                                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 print:border-rose-200">
                                                    <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-3 text-sm uppercase tracking-wide">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        Consider Removing
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {results.category_suggestions[category].remove.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-rose-900 leading-relaxed">
                                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>

                        {/* Donation Prompt */}
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

    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <Navbar />
            <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Upload your IEP or 504 Plan
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            We'll analyze the goals, accommodations, and services in your IEP or 504 Plan against our <Link href="/pda-guide" className="text-indigo-600 font-medium hover:underline">PDA Affirming Guide</Link> to provide you with a detailed set of recommendations to help your PDA child succeed at school.
                        </p>
                    </div>

                    <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

                    {/* Recent Sessions List */}
                    {savedSessions.length > 0 && (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-slate-700">Recent Analyses</h3>
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
                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {session.fileName}
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
                                                aria-label="Delete session"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            < ChevronRight className="h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-8">
                        <PrivacyNotice />
                        <Disclaimer />
                    </div>

                    {/* Warning Modal */}
                    {showWarningModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-amber-200"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg text-slate-900">Wait, is this an IEP?</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Our system thinks this document might be irrelevant.
                                        </p>
                                        {warningReason && (
                                            <div className="bg-amber-50 p-3 rounded-lg text-xs font-medium text-amber-800 border border-amber-100">
                                                AI Note: "{warningReason}"
                                            </div>
                                        )}
                                        <p className="text-slate-600 text-sm">
                                            Analyzing irrelevant documents (like receipts or books) won't give you good results.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 justify-end">
                                    <Button variant="outline" onClick={cancelWarning}>
                                        Cancel & Upload Different File
                                    </Button>
                                    <Button variant="destructive" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={proceedWithWarning}>
                                        Proceed Anyway
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
