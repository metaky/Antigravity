import { Shield, AlertCircle } from "lucide-react"

export function PrivacyNotice() {
    return (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10 print:hidden">
            <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                    <h3 className="font-semibold text-blue-900">Your Privacy is Our Priority</h3>
                    <p className="text-sm text-blue-900 font-medium">
                        We understand the sensitivity of IEP documents.
                    </p>
                    <ul className="text-sm text-blue-800 list-disc pl-4 space-y-1">
                        <li>Documents are processed safely and are minimally retained.</li>
                        <li>We do not sell your data to third parties.</li>
                        <li>This tool uses AI to analyze text. Data may be processed by the AI provider but is not used for training public models.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export function Disclaimer() {
    return (
        <div className="text-xs text-muted-foreground mt-4 flex items-start gap-2 max-w-lg mx-auto text-center justify-center print:hidden">
            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
            <p>
                This tool provides information for educational advocacy purposes only and does not constitute legal or medical advice. Always consult with a qualified attorney or advocate for specific legal situations.
            </p>
        </div>
    )
}
