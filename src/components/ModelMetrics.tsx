"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, BarChart3, Fingerprint, Layers, Activity } from "lucide-react";
import { PRODUCTION_MODEL_INFO } from "@/lib/api";

export default function ModelMetrics() {
    const { metrics, feature_importance, thresholds } = PRODUCTION_MODEL_INFO;

    return (
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">ML Model Intelligence</CardTitle>
                        <p className="text-sm text-slate-500">Production model performance metrics</p>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30 gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        PRODUCTION
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-purple-500" />
                        <span className="text-slate-500">Algorithm:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{PRODUCTION_MODEL_INFO.algorithm}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-emerald-500" />
                        <span className="text-slate-500">Version:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{PRODUCTION_MODEL_INFO.version}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-slate-500">Response:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">&lt;100ms</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                        label="Accuracy"
                        value={(metrics.accuracy! * 100).toFixed(1) + "%"}
                        icon={Target}
                        color="text-emerald-600 dark:text-emerald-400"
                        bg="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <MetricCard
                        label="ROC-AUC"
                        value={(metrics.roc_auc * 100).toFixed(1) + "%"}
                        icon={Activity}
                        color="text-purple-600 dark:text-purple-400"
                        bg="bg-purple-50 dark:bg-purple-900/20"
                    />
                    <MetricCard
                        label="Recall"
                        value={(metrics.recall * 100).toFixed(1) + "%"}
                        icon={BarChart3}
                        color="text-orange-600 dark:text-orange-400"
                        bg="bg-orange-50 dark:bg-orange-900/20"
                    />
                    <MetricCard
                        label="F1-Score"
                        value={(metrics.f1_score * 100).toFixed(1) + "%"}
                        icon={BarChart3}
                        color="text-blue-600 dark:text-blue-400"
                        bg="bg-blue-50 dark:bg-blue-900/20"
                    />
                </div>

                {/* Feature Importance */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Feature Importance</h4>
                    <div className="space-y-3">
                        {feature_importance.slice(0, 5).map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {item.feature.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </span>
                                    <span className="font-medium text-slate-900 dark:text-white">{(item.importance * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={item.importance * 100} className="h-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Thresholds */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Risk Stratification Thresholds</h4>
                    <div className="h-4 w-full rounded-full flex overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${thresholds.low * 100}%` }}></div>
                        <div className="h-full bg-orange-500" style={{ width: `${(thresholds.medium - thresholds.low) * 100}%` }}></div>
                        <div className="h-full bg-red-500" style={{ width: `${(1 - thresholds.medium) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                        <span>Low (0-{thresholds.low * 100}%)</span>
                        <span>Medium ({thresholds.low * 100}-{thresholds.medium * 100}%)</span>
                        <span>Critical ({thresholds.medium * 100}+%)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MetricCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className={`absolute top-4 left-4 p-2 rounded-lg ${bg} ${color}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="mt-10">
                <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">{value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase">{label}</div>
            </div>
        </div>
    )
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    )
}
