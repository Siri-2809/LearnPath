import axios from "axios";
import { getToken, clearAuthData } from "../utils/helpers";

/**
 * ============================================
 * LearnPath - Centralized API Configuration
 * ============================================
 * This file configures Axios instances for:
 * 1. Backend (Node.js & Express)
 * 2. ML Service (FastAPI)
 *
 * Features:
 * - Automatic JWT attachment
 * - Centralized error handling
 * - Request timeouts
 * - Environment-based configuration
 */

// Environment Variables
const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ML_SERVICE_URL =
    process.env.REACT_APP_ML_URL || "http://localhost:8000";

const API_TIMEOUT =
    Number(process.env.REACT_APP_API_TIMEOUT) || 10000;

/* ============================================
   Backend API Instance
============================================ */
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: API_TIMEOUT,
});

/* ============================================
   ML Service API Instance
============================================ */
export const mlApi = axios.create({
    baseURL: ML_SERVICE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: API_TIMEOUT,
});

/* ============================================
   Request Interceptor
   Attaches JWT token automatically
============================================ */
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ============================================
   Response Interceptor
   Handles global API errors
============================================ */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // Handle Unauthorized Access
        if (status === 401) {
            console.warn("⚠️ Session expired. Logging out...");
            clearAuthData();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

/* ============================================
   ML Service Response Interceptor
============================================ */
mlApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            "❌ ML Service Error:",
            error.response?.data || error.message
        );
        return Promise.reject(error);
    }
);

/* ============================================
   Health Check Utilities
============================================ */

/**
 * Check Backend Health
 * @returns {Promise<Object>}
 */
export const checkBackendHealth = async () => {
    const response = await api.get("/");
    return response.data;
};

/**
 * Check ML Service Health
 * @returns {Promise<Object>}
 */
export const checkMLHealth = async () => {
    const response = await mlApi.get("/health");
    return response.data;
};

export default api;