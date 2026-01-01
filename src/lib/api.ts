import axios, { AxiosError } from "axios";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy";

// Rate limiting state
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "dev-secret-key",
    },
});

// Request interceptor
api.interceptors.request.use((config) => {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        return Promise.reject(new Error("Please wait before making another request"));
    }
    lastRequestTime = now;

    if (config.data) {
        config.data = sanitizeObject(config.data);
    }

    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 429) {
                throw new Error("Too many requests. Please try again later.");
            } else if (status === 400) {
                throw new Error("Invalid input data. Please check your entries.");
            } else if (status === 401) {
                throw new Error("Authentication failed. Please check API credentials.");
            } else if (status >= 500) {
                throw new Error("Service temporarily unavailable. Please try again.");
            }
        } else if (error.code === "ECONNABORTED") {
            throw new Error("Request timeout. Please try again.");
        } else if (!error.response) {
            throw new Error("Unable to connect to the service. Please check your connection.");
        }
        throw error;
    }
);

// Security: Sanitize string
function sanitizeString(str: string): string {
    if (typeof str !== "string") return str;
    return str
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "")
        .replace(/data:/gi, "")
        .trim()
        .slice(0, 1000);
}

// Security: Recursively sanitize object
function sanitizeObject<T>(obj: T): T {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === "string") {
        return sanitizeString(obj) as T;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject) as T;
    }

    if (typeof obj === "object") {
        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            const sanitizedKey = sanitizeString(key);
            sanitized[sanitizedKey] = sanitizeObject(value);
        }
        return sanitized as T;
    }

    return obj;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PatientData {
    patient_id: string;
    age: number;
    gender: string;
    trial_phase: string;
    treatment_group: string;
    days_in_trial: number;
    visits_completed: number;
    last_visit_day?: number;
    adverse_events: number;
}

export interface PredictionResult {
    patient_id: string;
    dropout_prediction: number;
    dropout_probability: number;
    risk_level: "Low" | "Medium" | "Critical";
    recommended_action: string;
    intervention_cost: number;
    model_used?: string;
    confidence?: number;
}

export interface HealthStatus {
    status: string;
    model_loaded: boolean;
    model_path?: string;
    version?: string;
    latency?: number;
}

export interface ModelMetrics {
    recall: number;
    precision: number;
    f1_score: number;
    roc_auc: number;
    accuracy?: number;
    model_name: string;
    model_version: string;
    training_date: string;
    total_predictions?: number;
    features_used: string[];
}

export interface ModelInfo {
    name: string;
    version: string;
    algorithm: string;
    training_date: string;
    status: "production" | "staging" | "development";
    metrics: ModelMetrics;
    thresholds: {
        low: number;
        medium: number;
        critical: number;
    };
    feature_importance: Array<{
        feature: string;
        importance: number;
    }>;
}

// ============================================================================
// STATIC MODEL DATA (from backend analysis)
// ============================================================================

// Real model metrics from Backend README and MLflow
export const PRODUCTION_MODEL_INFO: ModelInfo = {
    name: "ClinicalTrialDropoutModel",
    version: "2.0.0",
    algorithm: "Logistic Regression (Production)",
    training_date: "2025-12-28",
    status: "production",
    metrics: {
        recall: 0.55,
        precision: 0.25,
        f1_score: 0.35,
        roc_auc: 0.58,
        accuracy: 0.85,
        model_name: "Logistic Regression",
        model_version: "v_fixed",
        training_date: "2025-12-28",
        total_predictions: 0,
        features_used: [
            "age",
            "days_in_trial",
            "visit_rate",
            "adverse_event_rate",
            "time_since_last_visit",
            "burden",
            "age_adverse_risk",
            "trial_phase_risk",
            "treatment_risk"
        ]
    },
    thresholds: {
        low: 0.40,
        medium: 0.80,
        critical: 1.0
    },
    feature_importance: [
        { feature: "visit_rate", importance: 0.28 },
        { feature: "time_since_last_visit", importance: 0.22 },
        { feature: "adverse_event_rate", importance: 0.18 },
        { feature: "burden", importance: 0.12 },
        { feature: "age_adverse_risk", importance: 0.08 },
        { feature: "days_in_trial", importance: 0.05 },
        { feature: "trial_phase_risk", importance: 0.04 },
        { feature: "treatment_risk", importance: 0.02 },
        { feature: "age", importance: 0.01 }
    ]
};

// Platform statistics (demo values - update when connected to real backend)
export const PLATFORM_STATS = {
    totalPatientsAnalyzed: 0,
    dropoutsPrevented: 0,
    costSaved: 0,
    avgResponseTime: 100,
    activeTrials: 0,
    healthcarePartners: 0,
    accuracyRate: 0.85,
    uptimePercent: 99.9
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

function validateNumber(value: number, min: number, max: number): number {
    if (typeof value !== "number" || isNaN(value)) {
        throw new Error("Invalid numeric value");
    }
    return Math.max(min, Math.min(max, value));
}

function validatePatientData(data: PatientData): Record<string, unknown> {
    const validGenders = ["Male", "Female", "Non-binary"];
    const validPhases = ["Phase I", "Phase II", "Phase III"];
    const validGroups = ["Active", "Control", "Placebo"];

    // Map frontend values to backend expected values
    const genderMap: Record<string, string> = {
        male: "Male",
        female: "Female",
        other: "Non-binary"
    };

    const phaseMap: Record<string, string> = {
        phase_1: "Phase I",
        phase_2: "Phase II",
        phase_3: "Phase III",
        phase_4: "Phase III" // Map Phase IV to Phase III for compatibility
    };

    const groupMap: Record<string, string> = {
        control: "Control",
        treatment_a: "Active",
        treatment_b: "Active",
        placebo: "Placebo"
    };

    const mappedGender = genderMap[data.gender] || "Male";
    const mappedPhase = phaseMap[data.trial_phase] || "Phase II";
    const mappedGroup = groupMap[data.treatment_group] || "Control";

    return {
        patient_id: sanitizeString(data.patient_id).slice(0, 50),
        age: validateNumber(data.age, 18, 100),
        gender: validGenders.includes(mappedGender) ? mappedGender : "Male",
        trial_phase: validPhases.includes(mappedPhase) ? mappedPhase : "Phase II",
        treatment_group: validGroups.includes(mappedGroup) ? mappedGroup : "Control",
        days_in_trial: validateNumber(data.days_in_trial, 1, 10000),
        visits_completed: validateNumber(data.visits_completed, 0, 1000),
        last_visit_day: data.last_visit_day ?? Math.max(0, data.days_in_trial - 5),
        adverse_events: validateNumber(data.adverse_events, 0, 100),
    };
}

export const predictRisk = async (payload: PatientData): Promise<PredictionResult> => {
    const validatedPayload = validatePatientData(payload);

    try {
        const response = await api.post("/predict", validatedPayload);
        return {
            ...response.data,
            model_used: PRODUCTION_MODEL_INFO.algorithm,
            confidence: PRODUCTION_MODEL_INFO.metrics.roc_auc
        };
    } catch (error) {
        console.error("API unavailable:", error);
        throw new Error("Service unavailable. Please check backend connection.");
    }
};

export const healthCheck = async (): Promise<HealthStatus> => {
    const startTime = Date.now();
    try {
        const response = await api.get("/health");
        const latency = Date.now() - startTime;
        return { ...response.data, latency };
    } catch (error) {
        return {
            status: "offline",
            model_loaded: false,
            latency: Date.now() - startTime
        };
    }
};

export const getModelInfo = (): ModelInfo => {
    return PRODUCTION_MODEL_INFO;
};

export const getPlatformStats = () => {
    return PLATFORM_STATS;
};

export const batchPredict = async (patients: PatientData[]): Promise<PredictionResult[]> => {
    const MAX_BATCH_SIZE = 100;
    if (patients.length > MAX_BATCH_SIZE) {
        throw new Error(`Batch size exceeds maximum of ${MAX_BATCH_SIZE} patients`);
    }

    const predictions = await Promise.all(
        patients.map((patient) => predictRisk(patient))
    );
    return predictions;
};
