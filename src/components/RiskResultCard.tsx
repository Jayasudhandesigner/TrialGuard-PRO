"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PredictionResult } from "@/lib/api";
import { Activity, Shield, AlertTriangle, CheckCircle, Database, ArrowRight } from "lucide-react";

interface RiskResultCardProps {
    result: PredictionResult | null;
    isLoading: boolean;
}

export default function RiskResultCard({ result, isLoading }: RiskResultCardProps) {
    if (isLoading) {
        return (
            <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full animate-ping bg-emerald-100 dark:bg-emerald-900/40 opacity-75"></div>
                    <div className="relative bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-full">
                        <Activity className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analyzing Patient Profile</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Running logistic regression model on clinical parameters...
                </p>
            </Card>
        );
    }

    if (!result) {
        return (
            <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-full mb-6">
                    <Database className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Awaiting Patient Data</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                    Enter patient clinical information and click "Run Risk Analysis" to generate predictions
                </p>
                <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                    Powered by Logistic Regression (Production)
                </div>
            </Card>
        );
    }

    const isHighRisk = result.risk_level === "Critical";
    const isMediumRisk = result.risk_level === "Medium";

    // Determine color scheme based on risk
    const statusColor = isHighRisk ? "text-red-600 dark:text-red-400" : isMediumRisk ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400";
    const bgColor = isHighRisk ? "bg-red-50 dark:bg-red-900/20" : isMediumRisk ? "bg-orange-50 dark:bg-orange-900/20" : "bg-emerald-50 dark:bg-emerald-900/20";
    const borderColor = isHighRisk ? "border-red-100 dark:border-red-900/30" : isMediumRisk ? "border-orange-100 dark:border-orange-900/30" : "border-emerald-100 dark:border-emerald-900/30";

    const RiskIcon = isHighRisk ? AlertTriangle : isMediumRisk ? Activity : Shield;

    return (
        <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className={`p-1 h-2 w-full ${isHighRisk ? "bg-red-500" : isMediumRisk ? "bg-orange-500" : "bg-emerald-500"}`}></div>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Risk Analysis Results</CardTitle>
                        <CardDescription>Submit patient data to view prediction</CardDescription>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bgColor} ${statusColor} text-sm font-medium border ${borderColor}`}>
                        <RiskIcon className="h-4 w-4" />
                        {result.risk_level} Risk
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                        {(result.dropout_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Dropout Probability</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500 font-medium uppercase mb-1">Recommended Action</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-1 text-slate-400" />
                            {result.recommended_action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500 font-medium uppercase mb-1">Estimated Intervention Cost</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                            ${result.intervention_cost}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Model: {result.model_used}</span>
                        <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Confidence: {(result.confidence || 0) * 100}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
