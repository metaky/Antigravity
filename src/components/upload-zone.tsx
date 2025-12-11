"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UploadZoneProps {
    onFileSelect: (file: File) => void
    isProcessing?: boolean
}

export function UploadZone({ onFileSelect, isProcessing = false }: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null)
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0]
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload a PDF file.")
                return
            }
            setFile(selectedFile)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf']
        },
        disabled: isProcessing
    })

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFile(null)
        setError(null)
    }

    const handleAnalyze = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (file) {
            onFileSelect(file)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out",
                    isDragActive
                        ? "border-primary bg-primary/5 ring-4 ring-primary/20 scale-[1.02]"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    file ? "bg-background border-none ring-0 cursor-default" : "",
                    error ? "border-destructive/50 bg-destructive/5" : ""
                )}
            >
                <input {...getInputProps()} />

                <div className="p-8 sm:p-12 text-center relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <UploadCloud className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-xl">Upload your IEP PDF</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Drag and drop your file here, or click to browse. Max size 10MB.
                                    </p>
                                </div>
                                {error && (
                                    <div className="text-sm text-destructive font-medium flex items-center gap-2 mt-2">
                                        <XCircle className="h-4 w-4" /> {error}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="filled"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full"
                            >
                                <div className="relative bg-card rounded-xl shadow-lg border p-6 flex items-center gap-4 mb-8">
                                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                        <FileText className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-medium truncate">{file.name}</div>
                                        <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                    {!isProcessing && (
                                        <button
                                            onClick={removeFile}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {isProcessing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Analyzing document...
                                        </div>
                                        <p className="text-xs text-muted-foreground">This may take up to a minute.</p>
                                    </div>
                                ) : (
                                    <Button
                                        size="xl"
                                        className="w-full font-semibold shadow-lg shadow-indigo-500/20"
                                        onClick={handleAnalyze}
                                    >
                                        Generate Report
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
