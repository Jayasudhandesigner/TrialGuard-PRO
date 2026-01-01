"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle2, AlertCircle, FileJson, Download } from "lucide-react";
import { batchPredict, PatientData, PredictionResult } from "@/lib/api";

export default function BatchUploader() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<PatientData[]>([]);
    const [results, setResults] = useState<PredictionResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const parseCSV = (text: string) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const obj: any = {};
            headers.forEach((h, index) => {
                const val = values[index]?.trim();
                if (h === 'age' || h === 'days_in_trial' || h === 'visits_completed' || h === 'last_visit_day' || h === 'adverse_events') {
                    obj[h] = Number(val);
                } else {
                    obj[h] = val;
                }
            });
            data.push(obj as PatientData);
        }
        return data;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setFile(file);
        setError(null);
        setResults([]);

        const text = await file.text();
        try {
            let data: PatientData[] = [];
            if (file.name.endsWith('.csv')) {
                data = parseCSV(text);
            } else if (file.name.endsWith('.json')) {
                data = JSON.parse(text);
            } else {
                throw new Error("Unsupported file format. Please upload CSV or JSON.");
            }
            setParsedData(data);
        } catch (err) {
            setError("Failed to parse file. Please check the format.");
            setFile(null);
        }
    };

    const handleAnalyze = async () => {
        if (!parsedData.length) return;
        setLoading(true);
        setError(null);
        try {
            const res = await batchPredict(parsedData);
            setResults(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Batch analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Batch Patient Analysis</h2>
                <p className="text-slate-500 dark:text-slate-400">Upload CSV or JSON files for bulk risk assessment of patient cohorts</p>
            </div>

            <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>Upload Patient Cohort</CardTitle>
                    <CardDescription>Bulk risk assessment for patient cohorts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex justify-center gap-4 mb-4">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                <FileJson className="h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Drop your patient data file here</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Supports CSV and JSON formats from clinical trial management systems
                        </p>

                        <div className="text-xs text-slate-400 mb-6 flex items-center justify-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Required: patient_id, age, gender, treatment_group, trial_phase, days_in_trial, visits_completed, last_visit_day, adverse_events
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".csv,.json"
                                onChange={handleChange}
                            />
                            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                                <Upload className="h-4 w-4 mr-2" />
                                Select File
                            </Button>
                        </div>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                                    {file.name.endsWith('.csv') ? <FileText className="h-5 w-5 text-emerald-500" /> : <FileJson className="h-5 w-5 text-orange-500" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</div>
                                    <div className="text-xs text-slate-500">{parsedData.length} patients detected</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setParsedData([]); setResults([]); }}>
                                Remove
                            </Button>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {parsedData.length > 0 && !results.length && (
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" size="lg" onClick={handleAnalyze} disabled={loading}>
                            {loading ? "Analyzing..." : `Analyze ${parsedData.length} Patients`}
                        </Button>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-900 dark:text-white">Analysis Results</h4>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Export Report
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-center">
                                    <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                        {results.filter(r => r.risk_level === 'Low').length}
                                    </div>
                                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-500 uppercase">Low Risk</div>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30 text-center">
                                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                                        {results.filter(r => r.risk_level === 'Medium').length}
                                    </div>
                                    <div className="text-xs font-medium text-orange-600 dark:text-orange-500 uppercase">Medium Risk</div>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 text-center">
                                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                                        {results.filter(r => r.risk_level === 'Critical').length}
                                    </div>
                                    <div className="text-xs font-medium text-red-600 dark:text-red-500 uppercase">Critical</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
