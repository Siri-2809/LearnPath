import api from "./api";

/**
 * ============================================
 * LearnPath - Study Plan Service
 * ============================================
 * Handles all study plan-related API calls.
 *
 * Backend Endpoints:
 * - POST   /api/study-plan
 * - GET    /api/study-plan
 * - GET    /api/study-plan/:company
 * - PUT    /api/study-plan/:id/session
 * - DELETE /api/study-plan/:id
 */

/**
 * Generate a study plan
 * @param {Object} data
 * @param {string} data.company
 * @param {number} data.durationDays
 * @param {Array<string>} data.weakSubjects
 * @returns {Promise<Object>}
 */
export const generateStudyPlan = async (data) => {
    try {
        const response = await api.post("/study-plan", data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error generating study plan:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get all study plans for the logged-in user
 * @returns {Promise<Array>}
 */
export const getAllStudyPlans = async () => {
    try {
        const response = await api.get("/study-plan");
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching study plans:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get a study plan by company
 * @param {string} company
 * @returns {Promise<Object>}
 */
export const getStudyPlanByCompany = async (company) => {
    try {
        const response = await api.get(`/study-plan/${encodeURIComponent(company)}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching study plan:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Update the status of a study session
 * @param {string} id - Study plan ID
 * @param {number} day - Day number
 * @param {string} status - Completed | Pending | In Progress
 * @returns {Promise<Object>}
 */
export const updateStudySessionStatus = async (id, day, status) => {
    try {
        const response = await api.put(`/study-plan/${id}/session`, {
            day,
            status,
        });
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error updating study session:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Delete a study plan
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteStudyPlan = async (id) => {
    try {
        const response = await api.delete(`/study-plan/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error deleting study plan:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Default export for cleaner imports
 */
const studyPlanService = {
    generateStudyPlan,
    getAllStudyPlans,
    getStudyPlanByCompany,
    updateStudySessionStatus,
    deleteStudyPlan,
};

export default studyPlanService;