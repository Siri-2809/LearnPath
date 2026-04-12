import api from "./api";

/**
 * ============================================
 * LearnPath - Authentication Service
 * ============================================
 * Handles all authentication-related API calls.
 *
 * Endpoints:
 * - POST   /api/auth/register
 * - POST   /api/auth/login
 * - GET    /api/auth/profile
 * - PUT    /api/auth/profile
 */

/**
 * Register a new user
 * @param {Object} userData
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.targetCompany
 * @returns {Promise<Object>}
 */
const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

/**
 * Login user
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<Object>}
 */
const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

/**
 * Get logged-in user profile
 * @returns {Promise<Object>}
 */
const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

/**
 * Update user profile
 * @param {Object} updatedData
 * @returns {Promise<Object>}
 */
const updateProfile = async (updatedData) => {
    const response = await api.put("/auth/profile", updatedData);
    return response.data;
};

/**
 * Logout user
 * (Handled on frontend by clearing localStorage)
 */
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const authService = {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
};

export default authService;