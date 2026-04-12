import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * ============================================
 * LearnPath - Login Page
 * ============================================
 * Features:
 * - JWT Authentication Integration
 * - Form Validation
 * - Error Handling
 * - Loading Indicators
 * - Responsive Design
 */

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { email, password } = formData;

    /**
     * Handle input changes
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            const response = await login({ email, password });

            if (response.success) {
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 800);
            } else {
                setError(response.message || "Invalid credentials.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container card fade-in">
                <h2 className="auth-title">Welcome Back 👋</h2>
                <p className="auth-subtitle">
                    Sign in to continue your placement preparation.
                </p>

                {/* Error Message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Success Message */}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="demo-credentials">
                    <p>
                        <strong>Demo Credentials:</strong>
                    </p>
                    <p>Email: admin@learnpath.com</p>
                    <p>Password: admin123</p>
                </div>

                {/* Register Link */}
                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary">
                        Register
                    </Link>
                </p>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .auth-page {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 20px;
        }

        .auth-container {
          max-width: 420px;
          width: 100%;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          background: #ffffff;
          text-align: center;
        }

        .auth-title {
          font-size: 1.8rem;
          color: #1e3a8a;
          margin-bottom: 10px;
        }

        .auth-subtitle {
          color: #64748b;
          margin-bottom: 20px;
        }

        .auth-form {
          text-align: left;
        }

        .auth-btn {
          width: 100%;
          margin-top: 10px;
        }

        .auth-footer {
          margin-top: 15px;
          color: #64748b;
        }

        .alert {
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .alert-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .alert-success {
          background: #dcfce7;
          color: #166534;
        }

        .demo-credentials {
          margin-top: 15px;
          font-size: 0.85rem;
          background: #f1f5f9;
          padding: 10px;
          border-radius: 8px;
          color: #334155;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 20px;
          }

          .auth-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Login;