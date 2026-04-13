import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Authentication Hook
import useAuth from "./hooks/useAuth";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanySelection from "./pages/CompanySelection";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import LearningPath from "./pages/LearningPath";
import StudyPlan from "./pages/StudyPlan";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

/**
 * Protected Route Component
 * Restricts access to authenticated users only.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading indicator while checking authentication
    if (loading) {
        return (
            <div className="text-center mt-3">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route Component
 * Prevents logged-in users from accessing login/register pages.
 */
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : children;
};

/**
 * Application Routes
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/companies"
                element={
                    <ProtectedRoute>
                        <CompanySelection />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/quiz/:company"
                element={
                    <ProtectedRoute>
                        <Quiz />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/quiz-result"
                element={
                    <ProtectedRoute>
                        <QuizResult />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/learning-path"
                element={
                    <ProtectedRoute>
                        <LearningPath />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/learning-path/:company"
                element={
                    <ProtectedRoute>
                        <LearningPath />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/study-plan"
                element={
                    <ProtectedRoute>
                        <StudyPlan />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resources"
                element={
                    <ProtectedRoute>
                        <Resources />
                    </ProtectedRoute>
                }
            />

            {/* Redirects */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;