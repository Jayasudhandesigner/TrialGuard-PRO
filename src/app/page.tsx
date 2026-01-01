"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PatientForm from "@/components/PatientForm";
import RiskResultCard from "@/components/RiskResultCard";
import ApiStatus from "@/components/ApiStatus";
import BatchUploader from "@/components/BatchUploader";
import HowItWorks from "@/components/HowItWorks";
import ModelMetrics from "@/components/ModelMetrics";
import { PredictionResult, PatientData, predictRisk } from "@/lib/api";

export default function Home() {
    const [activeTab, setActiveTab] = useState<"dashboard" | "how-it-works">("dashboard");
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePrediction = async (data: PatientData) => {
        setLoading(true);
        setError(null);
        try {
            const pred = await predictRisk(data);
            setResult(pred);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Prediction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "dashboard" ? (
                <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
                    {/* Hero / Announcement */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Built with production-grade ML models
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Clinical Trial Risk Intelligence
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Real-time patient dropout prediction and cohort analysis
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="font-bold text-slate-900 dark:text-white">HIPAA</span>
                                <span className="text-xs text-slate-500">Compliant</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="font-bold text-slate-900 dark:text-white">ISO 27001</span>
                                <span className="text-xs text-slate-500">Ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-8">
                            <section id="patient-form" className="scroll-mt-24">
                                <PatientForm onSubmit={handlePrediction} isLoading={loading} error={error} />
                            </section>

                            <BatchUploader />
                        </div>

                        <div className="lg:col-span-5 space-y-8">
                            <RiskResultCard result={result} isLoading={loading} />
                            <ModelMetrics />
                            <ApiStatus />
                        </div>
                    </div>
                </div>
            ) : (
                <HowItWorks />
            )}
        </main>
    );
}
