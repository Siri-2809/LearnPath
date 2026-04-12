import React from "react";
import { useLocation } from "react-router-dom";
import RoutesConfig from "./routes";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Styles
import "./App.css";

/**
 * ============================================
 * LearnPath - App Component
 * ============================================
 * Handles global layout and routing.
 * Displays Navbar and Footer across
 * all pages except authentication pages.
 */

const App = () => {
    const location = useLocation();

    // Routes where Navbar and Footer should be hidden
    const hideLayoutPrefixes = ["/login", "/register"];

    // Check if the current path starts with any of the prefixes
    const hideLayout = hideLayoutPrefixes.some((route) =>
        location.pathname.toLowerCase().startsWith(route)
    );

    return (
        <div className="app-container">
            {/* Navbar */}
            {!hideLayout && <Navbar />}

            {/* Main Content */}
            <main className="main-content">
                <RoutesConfig />
            </main>

            {/* Footer */}
            {!hideLayout && <Footer />}
        </div>
    );
};

export default App;