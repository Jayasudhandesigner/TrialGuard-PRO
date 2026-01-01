"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Stethoscope } from "lucide-react";
import { PatientData } from "@/lib/api";

interface PatientFormProps {
    onSubmit: (data: PatientData) => void;
    isLoading: boolean;
    error: string | null;
}

const InputHint = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[0.8rem] text-muted-foreground mt-1.5 flex items-center gap-1">
        <span className="inline-block w-3 h-3 text-slate-400">ⓘ</span>
        {children}
    </p>
);

export default function PatientForm({ onSubmit, isLoading, error }: PatientFormProps) {
    const [formData, setFormData] = useState<PatientData>({
        patient_id: "",
        age: 0,
        gender: "male",
        trial_phase: "phase_1",
        treatment_group: "control",
        days_in_trial: 0,
        visits_completed: 0,
        last_visit_day: 0,
        adverse_events: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "patient_id" ? value : Number(value)
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-semibold">Patient Risk Assessment</CardTitle>
                        <CardDescription>Enter clinical data for dropout prediction</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient ID</Label>
                            <Input
                                id="patient_id"
                                name="patient_id"
                                value={formData.patient_id}
                                onChange={handleChange}
                                placeholder="e.g. P-001"
                                required
                            />
                            <InputHint>Unique identifier from your CTMS</InputHint>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age || ""}
                                onChange={handleChange}
                                min={18} max={100}
                                required
                            />
                            <InputHint>Patient age in years (18-100)</InputHint>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Trial Phase</Label>
                            <Select value={formData.trial_phase} onValueChange={(v) => handleSelectChange("trial_phase", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phase_1">Phase I</SelectItem>
                                    <SelectItem value="phase_2">Phase II</SelectItem>
                                    <SelectItem value="phase_3">Phase III</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Treatment Group</Label>
                            <Select value={formData.treatment_group} onValueChange={(v) => handleSelectChange("treatment_group", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="control">Control</SelectItem>
                                    <SelectItem value="treatment_a">Treatment A</SelectItem>
                                    <SelectItem value="treatment_b">Treatment B</SelectItem>
                                    <SelectItem value="placebo">Placebo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="days_in_trial">Days in Trial</Label>
                            <Input id="days_in_trial" name="days_in_trial" type="number" value={formData.days_in_trial || ""} onChange={handleChange} required />
                            <InputHint>Total days since enrollment</InputHint>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="visits_completed">Visits Completed</Label>
                            <Input id="visits_completed" name="visits_completed" type="number" value={formData.visits_completed || ""} onChange={handleChange} required />
                            <InputHint>Number of scheduled visits attended</InputHint>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="last_visit_day">Last Visit Day</Label>
                            <Input id="last_visit_day" name="last_visit_day" type="number" value={formData.last_visit_day || ""} onChange={handleChange} required />
                            <InputHint>Day number of last attended visit</InputHint>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adverse_events">Adverse Events</Label>
                            <Input id="adverse_events" name="adverse_events" type="number" value={formData.adverse_events || 0} onChange={handleChange} required />
                            <InputHint>Total adverse events reported</InputHint>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" size="lg" disabled={isLoading}>
                        {isLoading ? "Analyzing..." : "Run Risk Analysis"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
