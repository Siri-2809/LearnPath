import axios from "axios";

/**
 * LearnPath - ML Service Integration
 * ----------------------------------
 * This service communicates with the Python FastAPI ML microservice.
 * It performs:
 * 1. Skill Gap Analysis using Decision Tree / Random Forest.
 * 2. Resource Recommendations using Cosine Similarity.
 */

// Base URL of the ML Microservice
const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

/**
 * Reusable Axios Client for ML Service
 */
const mlClient = axios.create({
    baseURL: ML_SERVICE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

/**
 * Perform Skill Gap Analysis
 * Sends quiz scores to the ML service to identify weak subjects.
 *
 * @param {Object} scores - Subject-wise scores
 * @returns {Object} Skill gap analysis result
 */
export const analyzeSkillGap = async (scores) => {
    try {
        const response = await mlClient.post("/skill-gap", { scores });
        return response.data;
    } catch (error) {
        console.error(
            "❌ ML Service Error (Skill Gap Analysis):",
            error.response?.data || error.message
        );

        // Fallback: Identify weak subjects locally
        const weakSubjects = Object.keys(scores).filter(
            (subject) => scores[subject] < 50
        );

        const values = Object.values(scores);
        const averageScore =
            values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0;

        return {
            success: true,
            scores,
            weak_subjects: weakSubjects,
            strong_subjects: [],
            average_score: Number(averageScore.toFixed(2)),
            performance: "Fallback Analysis",
            source: "fallback",
        };
    }
};

/**
 * Get Resource Recommendations
 * Sends weak subjects to the ML service.
 *
 * @param {Array} weakSubjects - List of weak subjects
 * @returns {Object} Recommended resources
 */
export const getRecommendations = async (weakSubjects) => {
    try {
        const response = await mlClient.post("/recommend", {
            weak_subjects: weakSubjects,
        });

        return response.data;
    } catch (error) {
        console.error(
            "❌ ML Service Error (Recommendations):",
            error.response?.data || error.message
        );

        // Fallback: Return empty recommendations
        return {
            success: false,
            recommendations: [],
            message: "Fallback recommendations returned.",
            source: "fallback",
        };
    }
};

/**
 * Check ML Service Health
 * Useful for verifying connectivity with the Python microservice.
 *
 * @returns {Object} Service status
 */
export const checkMLServiceHealth = async () => {
    try {
        const response = await mlClient.get("/health");
        return response.data;
    } catch (error) {
        console.warn(
            "⚠️ ML Service is unavailable:",
            error.response?.data || error.message
        );

        return {
            status: "unavailable",
            message: "ML Service is not reachable",
        };
    }
};

/**
 * Initialize ML Service Connectivity Check
 * This function should be called when the backend server starts.
 */
export const initializeMLService = async () => {
    const status = await checkMLServiceHealth();

    if (status.status === "healthy") {
        console.log("✅ ML Service Connected Successfully");
    } else {
        console.warn("⚠️ ML Service Unavailable. Using fallback mechanisms.");
    }
};