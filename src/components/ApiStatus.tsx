"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Server, Activity, Clock, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { healthCheck, HealthStatus } from "@/lib/api";

export default function ApiStatus() {
    const [status, setStatus] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    const checkStatus = async () => {
        setLoading(true);
        try {
            const data = await healthCheck();
            setStatus(data);
            setLastCheck(new Date());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const isOnline = status?.status === "healthy" || status?.status === "online";

    return (
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-slate-500" />
                    <CardTitle className="text-base font-medium">System Status</CardTitle>
                </div>
                <button
                    onClick={checkStatus}
                    className={`text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">API Connection</span>
                    {isOnline ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Online
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-xs font-medium">
                            <AlertCircle className="h-3 w-3" />
                            Offline
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                        <Activity className="h-4 w-4 mx-auto text-orange-500 mb-1" />
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {status?.latency ? `${status.latency}ms` : '--'}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">Latency</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                        <Server className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {status?.version ? "v" + status.version : '--'}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">Model</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                        <Clock className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">Last Check</div>
                    </div>
                </div>

                {!isOnline && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400">
                        <Activity className="h-4 w-4" />
                        <AlertDescription className="text-xs font-medium ml-2">
                            Service unavailable
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
