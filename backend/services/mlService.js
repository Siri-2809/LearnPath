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
 * Perform Skill Gap Analysis
 * Sends quiz scores to the ML service to identify weak subjects.
 *
 * @param {Object} scores - Subject-wise scores
 * @returns {Array} weak subjects
 */
export const analyzeSkillGap = async (scores) => {
    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/skill-gap`,
            { scores },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

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

        return {
            weak_subjects: weakSubjects,
            source: "fallback",
        };
    }
};

/**
 * Get Resource Recommendations
 * Sends subject preferences to the ML service.
 *
 * @param {Array} subjects - List of subjects
 * @returns {Array} recommended resources
 */
export const getRecommendations = async (subjects) => {
    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/recommend`,
            { subjects },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "❌ ML Service Error (Recommendations):",
            error.response?.data || error.message
        );

        // Fallback: Return empty recommendations
        return {
            recommendations: [],
            source: "fallback",
        };
    }
};

/**
 * Check ML Service Health
 * Useful for verifying connectivity with the Python microservice.
 *
 * @returns {Object} service status
 */
export const checkMLServiceHealth = async () => {
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/health`, {
            timeout: 5000,
        });

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