"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import analytics, { type ConsentValue } from "@/services/analytics"

export function CookieBanner() {
    const [consent, setConsent] = useState<ConsentValue | null | "loading">("loading")

    useEffect(() => {
        setConsent(analytics.getStoredConsent())
    }, [])

    const handleAccept = () => {
        analytics.setConsent("granted")
        setConsent("granted")
    }

    const handleDecline = () => {
        analytics.setConsent("denied")
        setConsent("denied")
    }

    if (consent === "loading" || consent !== null) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600 md:max-w-2xl">
                    <p className="font-semibold text-slate-900 mb-1">🍪 We value your privacy</p>
                    <p>
                        We load analytics only after you opt in.
                        We do not sell your data. Read our <a href="/privacy" className="underline text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" size="sm" onClick={handleDecline} className="flex-1 md:flex-none">
                        Decline
                    </Button>
                    <Button size="sm" onClick={handleAccept} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700">
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    )
}
