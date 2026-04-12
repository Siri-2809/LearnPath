import api from "./api";

/**
 * ============================================
 * LearnPath - Company Service
 * ============================================
 * Handles all company-related API interactions.
 *
 * Backend Endpoints:
 * - GET /api/companies
 * - GET /api/companies/:name
 */

/**
 * Fetch all companies
 * @returns {Promise<Array>} List of companies
 */
export const getAllCompanies = async () => {
    try {
        const response = await api.get("/companies");
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching companies:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Fetch a specific company by name
 * @param {string} companyName
 * @returns {Promise<Object>} Company details
 */
export const getCompanyByName = async (companyName) => {
    try {
        const response = await api.get(
            `/companies/${encodeURIComponent(companyName)}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error fetching company "${companyName}":`,
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Get subjects associated with a specific company
 * @param {string} companyName
 * @returns {Promise<Array>} List of subjects
 */
export const getCompanySubjects = async (companyName) => {
    try {
        const company = await getCompanyByName(companyName);
        return company?.subjects || [];
    } catch (error) {
        console.error(
            `❌ Error fetching subjects for "${companyName}":`,
            error
        );
        throw error;
    }
};

/**
 * Default export for cleaner imports
 */
const companyService = {
    getAllCompanies,
    getCompanyByName,
    getCompanySubjects,
};

export default companyService;