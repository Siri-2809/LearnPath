import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { scrollToTop } from "../utils/helpers";

/**
 * ============================================
 * LearnPath - Navbar Component
 * ============================================
 * Features:
 * - Responsive design
 * - Authentication-aware navigation
 * - Active route highlighting
 * - Mobile hamburger menu
 * - Logout functionality
 */

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        logout();
        navigate("/login");
        scrollToTop();
    };

    /**
     * Toggle mobile menu
     */
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    /**
     * Close menu on link click
     */
    const closeMenu = () => {
        setIsOpen(false);
        scrollToTop();
    };

    /**
     * Active link styling
     */
    const activeLinkStyle = ({ isActive }) =>
        isActive
            ? "nav-link active"
            : "nav-link";

    return (
        <nav className="navbar">
            <div className="container flex-between">
                {/* Logo */}
                <Link to="/" className="logo" onClick={closeMenu}>
                    <span className="logo-text">LearnPath</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <div className="menu-toggle" onClick={toggleMenu}>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                </div>

                {/* Navigation Links */}
                <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
                    <li>
                        <NavLink to="/" className={activeLinkStyle} onClick={closeMenu}>
                            Home
                        </NavLink>
                    </li>

                    {isAuthenticated && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={activeLinkStyle}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/companies"
                                    className={activeLinkStyle}
                                    onClick={closeMenu}
                                >
                                    Companies
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/resources"
                                    className={activeLinkStyle}
                                    onClick={closeMenu}
                                >
                                    Resources
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Authentication Links */}
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <NavLink
                                    to="/login"
                                    className="btn btn-outline"
                                    onClick={closeMenu}
                                >
                                    Login
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/register"
                                    className="btn btn-primary"
                                    onClick={closeMenu}
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* User Info */}
                            <li className="nav-user">
                                <span className="user-name">
                                    👋 {user?.name?.split(" ")[0]}
                                </span>
                            </li>

                            {/* Logout Button */}
                            <li>
                                <button className="btn btn-secondary" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* Inline Styling for Navbar */}
            <style jsx="true">{`
        .navbar {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #fff;
          padding: 12px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          text-decoration: none;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .nav-menu {
          list-style: none;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          transition: 0.3s ease;
        }

        .nav-link:hover {
          color: #c7d2fe;
        }

        .nav-link.active {
          border-bottom: 2px solid #ffffff;
          padding-bottom: 3px;
        }

        .nav-user {
          font-weight: 500;
          color: #e0f2fe;
        }

        /* Mobile Menu */
        .menu-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background: #fff;
          margin: 4px 0;
          border-radius: 5px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }

          .nav-menu {
            position: absolute;
            top: 65px;
            right: 0;
            width: 100%;
            background: #1e3a8a;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            padding: 20px 0;
            display: none;
          }

          .nav-menu.active {
            display: flex;
          }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;