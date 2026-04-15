import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import {
    setToken,
    getToken,
    removeToken,
    setUser,
    getUser,
    clearAuthData,
} from "../utils/helpers";

// Create Authentication Context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * -------------------------------------------
 * Manages authentication state across the app.
 * Handles login, registration, logout, and
 * profile retrieval using JWT authentication.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(getUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load user profile on app startup if token exists
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = getToken();

                if (token) {
                    const profile = await authService.getProfile();
                    const normalizedUser = profile?.user || profile;
                    setUserState(normalizedUser);
                    setUser(normalizedUser);
                }
            } catch (err) {
                console.error("Authentication initialization failed:", err);
                clearAuthData();
                setUserState(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Register a new user
     * @param {Object} userData
     */
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authService.register(userData);

            if (response.token) {
                setToken(response.token);
                setUser(response.user);
                setUserState(response.user);
            }

            return { success: true, data: response };
        } catch (err) {
            const message =
                err.response?.data?.message || "Registration failed.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login user
     * @param {Object} credentials
     */
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authService.login(credentials);

            if (response.token) {
                setToken(response.token);
                setUser(response.user);
                setUserState(response.user);
            }

            return { success: true, data: response };
        } catch (err) {
            const message =
                err.response?.data?.message || "Login failed.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        removeToken();
        clearAuthData();
        setUserState(null);
    };

    /**
     * Update user profile
     * @param {Object} updatedData
     */
    const updateProfile = async (updatedData) => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(updatedData);
            const updatedUser = response?.user || response;

            if (response?.token) {
                setToken(response.token);
            }

            setUser(updatedUser);
            setUserState(updatedUser);
            return { success: true, data: updatedUser };
        } catch (err) {
            const message =
                err.response?.data?.message || "Profile update failed.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated,
                register,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};