import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom Hook: useAuth
 * -------------------------------------------
 * Provides easy access to authentication state
 * and actions throughout the LearnPath app.
 *
 * Usage:
 * const { user, login, logout } = useAuth();
 */
const useAuth = () => {
    const context = useContext(AuthContext);

    // Ensure the hook is used within AuthProvider
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export default useAuth;