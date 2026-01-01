"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    HeartPulse,
    LayoutDashboard,
    HelpCircle,
} from "lucide-react";

interface HeaderProps {
    activeTab: "dashboard" | "how-it-works";
    onTabChange: (tab: "dashboard" | "how-it-works") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
    const scrollToConsole = () => {
        document.getElementById('patient-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header className="bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-50">
            {/* Top Bar */}
            <div className="border-b border-slate-700 hidden lg:block">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center justify-end gap-6 text-xs py-2 text-slate-400">
                        <span>Version 2.0.0</span>
                        <span>•</span>
                        <span>HIPAA Compliant</span>
                        <span>•</span>
                        <span>ISO 27001</span>
                        <span>•</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <HeartPulse className="h-8 w-8 text-white" />
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">TrialGuard</span>
                            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-medium">PRO</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink
                            active={activeTab === "dashboard"}
                            onClick={() => onTabChange("dashboard")}
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            active={activeTab === "how-it-works"}
                            onClick={() => onTabChange("how-it-works")}
                        >
                            How It Works
                        </NavLink>
                        <a
                            href="https://github.com/Jayasudhandesigner/MLOps-System-for-Clinical-Trial-Risk-Prediction"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium transition-colors text-slate-400 hover:text-white"
                        >
                            Documentation
                        </a>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <div className="lg:hidden">
                            <ThemeToggle />
                        </div>
                        <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={scrollToConsole}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>

            {/* Secondary Nav */}
            <div className="border-t border-slate-700 bg-slate-800 dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-6 h-12 text-sm overflow-x-auto">
                        <SecondaryNavLink
                            active={activeTab === "dashboard"}
                            onClick={() => onTabChange("dashboard")}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </SecondaryNavLink>
                        <SecondaryNavLink
                            active={activeTab === "how-it-works"}
                            onClick={() => onTabChange("how-it-works")}
                        >
                            <HelpCircle className="h-4 w-4" />
                            How It Works
                        </SecondaryNavLink>
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavLink({
    children,
    active,
    onClick
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium transition-colors ${active
                ? "text-white"
                : "text-slate-400 hover:text-white"
                }`}
        >
            {children}
        </button>
    );
}

function SecondaryNavLink({
    children,
    active,
    onClick
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${active
                ? "text-white border-orange-500"
                : "text-slate-400 hover:text-white border-transparent"
                }`}
        >
            {children}
        </button>
    );
}
