"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, XCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DualUploadZoneProps {
    onFilesSelect: (behaviorReport: File, iepDocument: File) => void
    isProcessing?: boolean
}

interface UploadBoxProps {
    label: string
    description: string
    file: File | null
    onDrop: (files: File[]) => void
    onRemove: () => void
    disabled: boolean
    colorScheme: "amber" | "indigo"
}

function UploadBox({ label, description, file, onDrop, onRemove, disabled, colorScheme }: UploadBoxProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: { 'application/pdf': ['.pdf'] },
        disabled
    })

    const colors = {
        amber: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: "text-amber-600",
            iconBg: "bg-amber-100"
        },
        indigo: {
            bg: "bg-indigo-50",
            border: "border-indigo-200",
            icon: "text-indigo-600",
            iconBg: "bg-indigo-100"
        }
    }

    const scheme = colors[colorScheme]

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out flex-1",
                isDragActive
                    ? `${scheme.border} ${scheme.bg} ring-4 ring-${colorScheme}-200 scale-[1.02]`
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                file ? "bg-background border-solid border-green-300" : "",
                disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
        >
            <input {...getInputProps()} />

            <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className={cn("h-14 w-14 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300", scheme.iconBg)}>
                                <UploadCloud className={cn("h-7 w-7", scheme.icon)} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{label}</h3>
                                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                    {description}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="filled"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full"
                        >
                            <div className="relative bg-card rounded-xl shadow-sm border p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="font-medium truncate text-sm">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                {!disabled && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                        aria-label="Remove file"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            <div className="mt-2 text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                                ✓ Ready
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export function DualUploadZone({ onFilesSelect, isProcessing = false }: DualUploadZoneProps) {
    const [behaviorReport, setBehaviorReport] = useState<File | null>(null)
    const [iepDocument, setIepDocument] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleBehaviorDrop = useCallback((acceptedFiles: File[]) => {
        setError(null)
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0]
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload PDF files only.")
                return
            }
            setBehaviorReport(selectedFile)
        }
    }, [])

    const handleIepDrop = useCallback((acceptedFiles: File[]) => {
        setError(null)
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0]
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload PDF files only.")
                return
            }
            setIepDocument(selectedFile)
        }
    }, [])

    const handleAnalyze = () => {
        if (behaviorReport && iepDocument) {
            onFilesSelect(behaviorReport, iepDocument)
        }
    }

    const bothFilesReady = behaviorReport && iepDocument

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Dual Upload Boxes */}
            <div className="flex flex-col md:flex-row gap-4">
                <UploadBox
                    label="Behavior Incident Report"
                    description="Upload the incident report PDF"
                    file={behaviorReport}
                    onDrop={handleBehaviorDrop}
                    onRemove={() => setBehaviorReport(null)}
                    disabled={isProcessing}
                    colorScheme="amber"
                />
                <UploadBox
                    label="IEP / 504 Plan"
                    description="Upload the student's IEP or 504 Plan"
                    file={iepDocument}
                    onDrop={handleIepDrop}
                    onRemove={() => setIepDocument(null)}
                    disabled={isProcessing}
                    colorScheme="indigo"
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="text-sm text-destructive font-medium flex items-center justify-center gap-2">
                    <XCircle className="h-4 w-4" /> {error}
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
                {isProcessing ? (
                    <div className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Analyzing both documents...
                        </div>
                        <p className="text-xs text-muted-foreground">This may take up to a minute.</p>
                    </div>
                ) : (
                    <Button
                        size="xl"
                        className="w-full font-semibold shadow-lg shadow-indigo-500/20"
                        onClick={handleAnalyze}
                        disabled={!bothFilesReady}
                    >
                        {bothFilesReady ? "Generate Behavior Report Analysis" : "Upload Both Documents to Continue"}
                    </Button>
                )}
            </div>
        </div>
    )
}
