import api from "./api";

/**
 * ============================================
 * LearnPath - Learning Path Service
 * ============================================
 * Handles all learning path-related API calls.
 *
 * Backend Endpoints:
 * - POST   /api/learning-path/:company
 * - GET    /api/learning-path
 * - GET    /api/learning-path/:company
 * - PUT    /api/learning-path/:id/progress
 * - DELETE /api/learning-path/:id
 */

/**
 * Generate a learning path for a specific company
 * @param {string} company
 * @returns {Promise<Object>}
 */
export const generateLearningPath = async (company) => {
    try {
        const response = await api.post(`/learning-path/${company}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error generating learning path:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get all learning paths for the logged-in user
 * @returns {Promise<Array>}
 */
export const getAllLearningPaths = async () => {
    try {
        const response = await api.get("/learning-path");
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching learning paths:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get a learning path by company name
 * @param {string} company
 * @returns {Promise<Object>}
 */
export const getLearningPathByCompany = async (company) => {
    try {
        const response = await api.get(`/learning-path/${company}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching learning path:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Update learning path progress
 * @param {string} id
 * @param {number} progress
 * @returns {Promise<Object>}
 */
export const updateLearningPathProgress = async (id, progress) => {
    try {
        const response = await api.put(
            `/learning-path/${id}/progress`,
            { progress }
        );
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error updating learning path progress:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Delete a learning path
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteLearningPath = async (id) => {
    try {
        const response = await api.delete(`/learning-path/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error deleting learning path:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Default export for cleaner imports
 */
const learningPathService = {
    generateLearningPath,
    getAllLearningPaths,
    getLearningPathByCompany,
    updateLearningPathProgress,
    deleteLearningPath,
};

export default learningPathService;