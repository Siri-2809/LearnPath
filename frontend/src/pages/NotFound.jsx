import React from "react";
import { Link } from "react-router-dom";

/**
 * ============================================
 * LearnPath - NotFound Page (404)
 * ============================================
 * Displays a user-friendly message when a route
 * is not found. Provides navigation back to the
 * homepage and dashboard.
 */

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-card card fade-in">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Page Not Found</h2>
                <p className="notfound-text">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="notfound-actions">
                    <Link to="/" className="btn btn-primary">
                        Go to Home
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline">
                        Go to Dashboard
                    </Link>
                </div>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .notfound-container {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 20px;
        }

        .notfound-card {
          max-width: 500px;
          width: 100%;
          text-align: center;
          padding: 40px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .notfound-code {
          font-size: 5rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .notfound-title {
          font-size: 1.8rem;
          color: #1e3a8a;
          margin-bottom: 10px;
        }

        .notfound-text {
          color: #64748b;
          margin-bottom: 20px;
        }

        .notfound-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .notfound-code {
            font-size: 3.5rem;
          }

          .notfound-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
        </div>
    );
};

export default NotFound;