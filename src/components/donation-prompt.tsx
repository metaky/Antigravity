"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Coffee } from "lucide-react"

export function DonationPrompt() {
    return (
        <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-8 text-center space-y-4 print:hidden">
            <div className="flex justify-center">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100">
                    <Heart className="h-6 w-6 text-orange-500 fill-orange-500" />
                </div>
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-xl font-bold text-gray-900">Did you find this analysis helpful?</h3>
                <p className="text-gray-600">
                    Small contributions help keep this tool free and accessible for all neurodivergent families.
                </p>
            </div>

            <div className="pt-2">
                <Link href="/support">
                    <Button
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 gap-2"
                    >
                        <Coffee className="h-4 w-4" />
                        Support the Project
                    </Button>
                </Link>
            </div>
        </div>
    )
}
