import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * ============================================
 * LearnPath - Register Page
 * ============================================
 * Features:
 * - User Registration with JWT Authentication
 * - Form Validation
 * - Error & Success Feedback
 * - Responsive and Modern UI
 */

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        targetCompany: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        name,
        email,
        password,
        confirmPassword,
        targetCompany,
    } = formData;

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

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await register({
                name,
                email,
                password,
                targetCompany,
            });

            if (response.success) {
                setSuccess("Registration successful! Redirecting...");
                setTimeout(() => navigate("/dashboard"), 1000);
            } else {
                setError(response.message || "Registration failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container card fade-in">
                <h2 className="auth-title">Create an Account </h2>
                <p className="auth-subtitle">
                    Start your placement preparation journey with LearnPath.
                </p>

                {/* Error Message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Success Message */}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Target Company (Optional)</label>
                        <input
                            type="text"
                            name="targetCompany"
                            className="form-control"
                            placeholder="e.g., Google, Amazon, Microsoft"
                            value={targetCompany}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* Login Redirect */}
                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">
                        Login
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
          max-width: 450px;
          width: 100%;
          padding: 30px;
          border-radius: 16px;
          background: #ffffff;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
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

export default Register;