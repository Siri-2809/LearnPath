import api, { mlApi } from "./api";
import {
    formatScoresForML,
    formatWeakSubjectsForML,
} from "../utils/helpers";

/**
 * ============================================
 * LearnPath - Quiz Service
 * ============================================
 * Handles all quiz-related API interactions.
 *
 * Backend Endpoints:
 * - GET    /api/quiz/:company
 * - POST   /api/quiz/submit
 * - GET    /api/quiz/results
 * - GET    /api/quiz/results/:company
 * - GET    /api/quiz/latest/:company
 * - GET    /api/quiz/result/:id
 *
 * ML Service Endpoints:
 * - POST   /skill-gap
 * - POST   /recommend
 */

/* ============================================
   Generate Quiz
============================================ */

/**
 * Generate a diagnostic or mock quiz
 * @param {string} company
 * @param {string} testType - "diagnostic" or "mock"
 * @param {number} limit - Optional limit (if null, returns all questions)
 * @returns {Promise<Object>}
 */
export const generateQuiz = async (
    company,
    testType = "diagnostic",
    limit = null
) => {
    try {
        const params = { testType };
        if (limit) {
            params.limit = limit;
        }
        
        const response = await api.get(`/quiz/${company}`, { params });
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error generating quiz:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/* ============================================
   Submit Quiz
============================================ */

/**
 * Submit quiz answers
 * @param {Object} quizData
 * @returns {Promise<Object>}
 */
export const submitQuiz = async (quizData) => {
    try {
        const response = await api.post("/quiz/submit", quizData);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error submitting quiz:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/* ============================================
   Quiz Results
============================================ */

/**
 * Get all quiz results
 * @returns {Promise<Array>}
 */
export const getAllQuizResults = async () => {
    try {
        const response = await api.get("/quiz/results");
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching quiz results:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get quiz results by company
 * @param {string} company
 * @returns {Promise<Array>}
 */
export const getQuizResultsByCompany = async (company) => {
    try {
        const response = await api.get(`/quiz/results/${company}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching company quiz results:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get latest quiz result for a company
 * @param {string} company
 * @returns {Promise<Object>}
 */
export const getLatestQuizResult = async (company) => {
    try {
        const response = await api.get(`/quiz/latest/${company}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching latest quiz result:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get quiz result by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getQuizResultById = async (id) => {
    try {
        const response = await api.get(`/quiz/result/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching quiz result:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/* ============================================
   ML Service Integrations
============================================ */

/**
 * Analyze skill gaps using the ML microservice
 * @param {Object} scores
 * @returns {Promise<Object>}
 */
export const analyzeSkillGap = async (scores) => {
    try {
        const payload = formatScoresForML(scores);
        const response = await mlApi.post("/skill-gap", payload);
        return response.data;
    } catch (error) {
        console.error(
            "❌ ML Skill Gap Analysis Error:",
            error.response?.data || error.message
        );

        // Fallback logic if ML service is unavailable
        const weakSubjects = Object.keys(scores).filter(
            (subject) => scores[subject] < 50
        );

        return {
            success: true,
            weak_subjects: weakSubjects,
            strong_subjects: Object.keys(scores).filter(
                (subject) => scores[subject] >= 50
            ),
            average_score:
                Object.values(scores).reduce((a, b) => a + b, 0) /
                Object.values(scores).length,
            performance: "Fallback Analysis",
            source: "fallback",
        };
    }
};

/**
 * Get resource recommendations from ML service
 * @param {Array} weakSubjects
 * @returns {Promise<Object>}
 */
export const getRecommendations = async (weakSubjects) => {
    try {
        const payload = formatWeakSubjectsForML(weakSubjects);
        const response = await mlApi.post("/recommend", payload);
        return response.data;
    } catch (error) {
        console.error(
            "❌ ML Recommendation Error:",
            error.response?.data || error.message
        );

        return {
            success: false,
            recommendations: [],
            source: "fallback",
        };
    }
};

/* ============================================
   Export Service
============================================ */

const quizService = {
    generateQuiz,
    submitQuiz,
    getAllQuizResults,
    getQuizResultsByCompany,
    getLatestQuizResult,
    getQuizResultById,
    analyzeSkillGap,
    getRecommendations,
};

export default quizService;