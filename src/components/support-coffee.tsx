"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Coffee } from "lucide-react"

export function SupportCoffee() {
    const [selectedAmount, setSelectedAmount] = useState<number | "custom" | null>(null)

    // TODO: Replace these with actual Stripe Payment Links when available
    const STRIPE_LINKS: Record<string, string> = {
        "3": "https://buy.stripe.com/placeholder_small",
        "8": "https://buy.stripe.com/placeholder_medium",
        "custom": "https://buy.stripe.com/placeholder_custom"
    }

    const handleSupportClick = () => {
        if (!selectedAmount) return

        const link = STRIPE_LINKS[selectedAmount.toString()]
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <div className="bg-[#FFFBF0] rounded-3xl p-8 shadow-sm border border-orange-100">
            <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100">
                    <Coffee className="h-8 w-8 text-orange-600" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Buy me a coffee</h2>
                <p className="text-orange-900/70 font-medium">Select an amount to contribute</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
                <button
                    onClick={() => setSelectedAmount(3)}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl bg-white border transition-all hover:border-orange-300 hover:shadow-md",
                        selectedAmount === 3
                            ? "border-orange-500 ring-1 ring-orange-500 shadow-orange-100"
                            : "border-transparent shadow-sm"
                    )}
                >
                    <span className="text-xl font-bold text-gray-900">$3</span>
                    <span className="text-xs text-gray-500 font-medium">Small</span>
                </button>
                <button
                    onClick={() => setSelectedAmount(8)}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl bg-white border transition-all hover:border-orange-300 hover:shadow-md",
                        selectedAmount === 8
                            ? "border-orange-500 ring-1 ring-orange-500 shadow-orange-100"
                            : "border-transparent shadow-sm"
                    )}
                >
                    <span className="text-xl font-bold text-gray-900">$8</span>
                    <span className="text-xs text-gray-500 font-medium">Medium</span>
                </button>
                <button
                    onClick={() => setSelectedAmount("custom")}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl bg-white border transition-all hover:border-orange-300 hover:shadow-md",
                        selectedAmount === "custom"
                            ? "border-orange-500 ring-1 ring-orange-500 shadow-orange-100"
                            : "border-transparent shadow-sm"
                    )}
                >
                    <span className="text-lg font-bold text-gray-900">Custom</span>
                </button>
            </div>

            <Button
                className={cn(
                    "w-full h-14 text-lg font-semibold rounded-xl shadow-none transition-all",
                    selectedAmount
                        ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200"
                        : "bg-[#9ca3af] hover:bg-[#6b7280] text-white opacity-50 cursor-not-allowed"
                )}
                size="lg"
                onClick={handleSupportClick}
                disabled={!selectedAmount}
            >
                Support {selectedAmount && selectedAmount !== "custom" && `$${selectedAmount}`}
            </Button>

            <div className="mt-6 text-center space-y-1">
                <p className="text-xs text-orange-900/40">
                    By donating, you agree to our <a href="/terms" className="underline hover:text-orange-900/60">Terms of Service</a> and <a href="/privacy" className="underline hover:text-orange-900/60">Privacy Policy</a>.
                </p>
                <p className="text-xs text-orange-900/40">
                    Secure payment processing via Stripe.
                </p>
            </div>
        </div>
    )
}
