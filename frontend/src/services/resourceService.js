import api from "./api";

/**
 * ============================================
 * LearnPath - Resource Service
 * ============================================
 * Handles all API calls related to learning
 * resources from the backend.
 *
 * Base Endpoint: /api/resources
 */

/**
 * Fetch all learning resources
 * @returns {Promise<Object>}
 */
export const getAllResources = async () => {
    try {
        const response = await api.get("/resources");
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching resources:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Fetch a single resource by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getResourceById = async (id) => {
    try {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching resource:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Fetch resources by subject
 * @param {string} subject
 * @returns {Promise<Object>}
 */
export const getResourcesBySubject = async (subject) => {
    try {
        const response = await api.get(
            `/resources?subject=${encodeURIComponent(subject)}`
        );
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching resources by subject:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Create a new resource (Admin only)
 * @param {Object} resourceData
 * @returns {Promise<Object>}
 */
export const createResource = async (resourceData) => {
    try {
        const response = await api.post("/resources", resourceData);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error creating resource:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Update an existing resource (Admin only)
 * @param {string} id
 * @param {Object} resourceData
 * @returns {Promise<Object>}
 */
export const updateResource = async (id, resourceData) => {
    try {
        const response = await api.put(`/resources/${id}`, resourceData);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error updating resource:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Delete a resource (Admin only)
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteResource = async (id) => {
    try {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error deleting resource:",
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

/**
 * Default Export for Cleaner Imports
 */
const resourceService = {
    getAllResources,
    getResourceById,
    getResourcesBySubject,
    createResource,
    updateResource,
    deleteResource,
};

export default resourceService;