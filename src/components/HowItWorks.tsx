"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Brain, Activity, ShieldCheck, FileSpreadsheet, Stethoscope } from "lucide-react";
import { PRODUCTION_MODEL_INFO } from "@/lib/api";

export default function HowItWorks() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Intelligent Drop-out Prediction Pipeline
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Understanding how TrialGuard Pro processes clinical data to identify at-risk patients
                </p>
            </div>

            {/* Pipeline Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                <StepCard
                    icon={Database}
                    title="Data Ingestion"
                    desc="Secure ingestion of patient demographics, trial history, and engagement metrics from CTMS."
                    step="01"
                />
                <div className="hidden md:block absolute top-12 left-[25%] -ml-4 text-slate-300">
                    <ArrowRight className="h-8 w-8" />
                </div>
                <StepCard
                    icon={Brain}
                    title="Feature Engineering"
                    desc="Automated calculation of risk factors like 'Visit Burden' and 'Adverse Event Rate'."
                    step="02"
                />
                <div className="hidden md:block absolute top-12 left-[50%] -ml-4 text-slate-300">
                    <ArrowRight className="h-8 w-8" />
                </div>
                <StepCard
                    icon={Activity}
                    title="Model Inference"
                    desc="Logistic Regression model predicts probability based on trained patterns."
                    step="03"
                />
                <div className="hidden md:block absolute top-12 left-[75%] -ml-4 text-slate-300">
                    <ArrowRight className="h-8 w-8" />
                </div>
                <StepCard
                    icon={ShieldCheck}
                    title="Risk Stratification"
                    desc="Patients classified as Low/Medium/Critical with actionable intervention plans."
                    step="04"
                />
            </div>

            {/* Model Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-500" />
                            Model Architecture
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-500 text-sm">
                            The core intelligence is powered by a production-optimized <strong>Logistic Regression</strong> model, chosen for its interpretability in healthcare settings.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase font-bold">Accuracy</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{(PRODUCTION_MODEL_INFO.metrics.accuracy! * 100).toFixed(1)}%</div>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div className="text-xs text-slate-500 uppercase font-bold">ROC-AUC</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{(PRODUCTION_MODEL_INFO.metrics.roc_auc * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                            Key Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {PRODUCTION_MODEL_INFO.feature_importance.slice(0, 4).map((f, i) => (
                                <li key={i} className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <span className="text-slate-700 dark:text-slate-300 capitalize">{f.feature.replace(/_/g, ' ')}</span>
                                    <Badge variant="secondary">{(f.importance * 100).toFixed(0)}% Impact</Badge>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* User Personas */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Designed For Clinical Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PersonaCard
                        title="Study Coordinators"
                        desc="Quickly identify patients missing visits and intervene before they drop out."
                        icon={Stethoscope}
                    />
                    <PersonaCard
                        title="Data Managers"
                        desc="Batch process weekly reports to integrity check data quality and risk."
                        icon={Database}
                    />
                    <PersonaCard
                        title="Principal Investigators"
                        desc="Monitor overall trial health and safety signals in real-time."
                        icon={Activity}
                    />
                </div>
            </div>
        </div>
    );
}

function StepCard({ icon: Icon, title, desc, step }: any) {
    return (
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black text-slate-900 dark:text-white">
                {step}
            </div>
            <CardHeader className="pb-2">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-slate-900 dark:text-white" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{desc}</CardDescription>
            </CardContent>
        </Card>
    )
}

function PersonaCard({ icon: Icon, title, desc }: any) {
    return (
        <Card className="bg-slate-50 dark:bg-slate-900 border-none">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500">{desc}</p>
            </CardContent>
        </Card>
    )
}
