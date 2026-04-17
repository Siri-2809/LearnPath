import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import studyPlanService from "../services/studyPlanService";

/**
 * ============================================
 * LearnPath - Footer Component
 * ============================================
 * Features:
 * - Responsive design
 * - Quick navigation links
 * - Social media placeholders
 * - Dynamic copyright year
 * - Matches LearnPath theme
 * - Mock Tests only enabled after study plan completion
 */

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { user } = useAuth();
    const targetCompany = user?.targetCompany || "Infosys";
    
    const [isStudyPlanCompleted, setIsStudyPlanCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if study plan is completed
    useEffect(() => {
        const checkStudyPlanStatus = async () => {
            if (!targetCompany) {
                setLoading(false);
                return;
            }

            try {
                const response = await studyPlanService.getStudyPlanByCompany(targetCompany);
                if (response?.studyPlan?.status === "Completed") {
                    setIsStudyPlanCompleted(true);
                } else {
                    setIsStudyPlanCompleted(false);
                }
            } catch (error) {
                console.error("Error fetching study plan status:", error);
                setIsStudyPlanCompleted(false);
            } finally {
                setLoading(false);
            }
        };

        checkStudyPlanStatus();
    }, [targetCompany]);

    return (
        <footer className="footer">
            <div className="container footer-container">
                {/* Brand Section */}
                <div className="footer-section">
                    <h2 className="footer-logo">LearnPath</h2>
                    <p className="footer-description">
                        An AI-powered platform designed to help students prepare for
                        company-specific placements through personalized learning paths,
                        mock tests, and skill gap analysis.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/companies">Companies</Link>
                        </li>
                        <li>
                            <Link to="/resources">Resources</Link>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-section">
                    <h3 className="footer-title">Resources</h3>
                    <ul className="footer-links">
                        <li>
                            <Link to="/learning-path">Learning Path</Link>
                        </li>
                        <li>
                            <Link to="/study-plan">Study Plan</Link>
                        </li>
                        <li>
                            {isStudyPlanCompleted ? (
                                <Link to={`/quiz/${targetCompany}?testType=mock`}>Mock Tests</Link>
                            ) : (
                                <span className="mock-tests-disabled" title="Complete the study plan to unlock mock tests">
                                    Mock Tests (Complete Study Plan)
                                </span>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Contact / Social */}
                <div className="footer-section">
                    <h3 className="footer-title">Connect With Us</h3>
                    <div className="footer-socials">
                        <a href="#" aria-label="GitHub" title="GitHub">
                            🌐
                        </a>
                        <a href="#" aria-label="LinkedIn" title="LinkedIn">
                            💼
                        </a>
                        <a href="#" aria-label="Email" title="Email">
                            ✉️
                        </a>
                    </div>
                    <p className="footer-contact">
                        Email: <span>support@learnpath.com</span>
                    </p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <p>
                    © {currentYear} <strong>LearnPath</strong>. All Rights Reserved.
                </p>
                <p className="footer-tagline">
                    Built using MERN & FastAPI
                </p>
            </div>

            {/* Inline Styles */}
            <style jsx="true">{`
        .footer {
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: #e2e8f0;
          padding-top: 40px;
          margin-top: 40px;
        }

        .footer-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 30px;
          padding: 0 20px 30px;
          max-width: 1200px;
          margin: auto;
        }

        .footer-logo {
          font-size: 1.6rem;
          font-weight: bold;
          color: #ffffff;
        }

        .footer-description {
          font-size: 0.95rem;
          margin-top: 10px;
          line-height: 1.6;
          color: #cbd5f5;
        }

        .footer-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          color: #cbd5f5;
          text-decoration: none;
          transition: 0.3s;
        }

        .footer-links a:hover {
          color: #38bdf8;
        }

        .mock-tests-disabled {
          color: #64748b;
          cursor: not-allowed;
          font-style: italic;
          opacity: 0.6;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
          font-size: 1.4rem;
          margin: 10px 0;
        }

        .footer-socials a {
          color: #e2e8f0;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .footer-socials a:hover {
          color: #38bdf8;
          transform: scale(1.2);
        }

        .footer-contact {
          font-size: 0.9rem;
          color: #cbd5f5;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          padding: 15px;
          background-color: rgba(0, 0, 0, 0.15);
          font-size: 0.9rem;
        }

        .footer-tagline {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 5px;
        }

        @media (max-width: 768px) {
          .footer-container {
            text-align: center;
          }

          .footer-socials {
            justify-content: center;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;