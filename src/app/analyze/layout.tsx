import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analyze Your IEP | PDA Your IEP",
    description: "Upload your IEP for instant, AI-powered analysis tailored to the PDA profile. Get actionable feedback on goals, accommodations, and supports.",
};

export default function AnalyzeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
