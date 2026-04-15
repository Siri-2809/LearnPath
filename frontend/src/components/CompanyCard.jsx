import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanyLogo } from "../utils/helpers";
import userService from "../services/userService";
import { getUser, setUser } from "../utils/helpers";

/**
 * ============================================
 * LearnPath - CompanyCard Component
 * ============================================
 * Displays company information in a modern card UI.
 * Allows users to select a company and proceed.
 *
 * Props:
 * - company: {
 *     _id: string,
 *     name: string,
 *     subjects: string[]
 *   }
 */

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /**
     * Handle company selection - saves target company and navigates
     */
    const handleSelectCompany = async () => {
        try {
            setLoading(true);
            setError("");

            // Save target company to user profile
            await userService.updateTargetCompany(company.name);

            // Keep frontend auth cache in sync so dashboard persists company context.
            const cachedUser = getUser();
            if (cachedUser) {
              setUser({
                ...cachedUser,
                targetCompany: company.name,
              });
            }

            // Navigate to quiz page
            navigate(`/quiz/${company.name}`);
        } catch (err) {
            console.error("Error selecting company:", err);
            setError("Failed to select company. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="company-card card fade-in">
            {/* Company Logo */}
            <div className="company-logo-container">
                <img
                    src={getCompanyLogo(company.name)}
                    alt={company.name}
                    className="company-logo"
                    onError={(e) => {
                        e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                />
            </div>

            {/* Company Name */}
            <h3 className="company-name">{company.name}</h3>

            {/* Subjects */}
            <div className="company-subjects">
              {company.subjects?.map((subject, index) => (
                    <span key={index} className="badge badge-info">
                        {subject}
                    </span>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    color: "#dc2626",
                    fontSize: "0.875rem",
                    marginBottom: "10px",
                    padding: "8px",
                    backgroundColor: "#fee2e2",
                    borderRadius: "4px",
                }}>
                    {error}
                </div>
            )}

            {/* Action Button */}
            <button
                className="btn btn-primary company-btn"
                onClick={handleSelectCompany}
                disabled={loading}
            >
                {loading ? "Selecting..." : "Start Preparation"}
            </button>

            {/* Inline Styles */}
            <style jsx="true">{`
        .company-card {
          text-align: center;
          padding: 25px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .company-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
        }

        .company-logo-container {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border-radius: 50%;
        }

        .company-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .company-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 10px;
        }

        .company-subjects {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin-bottom: 15px;
        }

        .company-btn {
          width: 100%;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .company-card {
            padding: 20px;
          }
        }
      `}</style>
        </div>
    );
};

export default CompanyCard;