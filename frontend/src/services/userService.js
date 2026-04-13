import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * User Service - Handles user-related API calls
 */

/**
 * Get user's target company
 */
const getTargetCompany = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/target-company`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching target company:", error);
        throw error;
    }
};

/**
 * Update user's target company
 * @param {string} targetCompany - Company name
 */
const updateTargetCompany = async (targetCompany) => {
    try {
        const response = await axios.put(
            `${API_URL}/users/target-company`,
            { targetCompany },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating target company:", error);
        throw error;
    }
};

const userService = {
    getTargetCompany,
    updateTargetCompany,
};

export default userService;
