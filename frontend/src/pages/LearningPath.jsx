import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import learningPathService from "../services/learningPathService";
import LearningPathTimeline from "../components/LearningPathTimeline";
import useAuth from "../hooks/useAuth";

/**
 * ============================================
 * LearnPath - Learning Path Page
 * ============================================
 * Features:
 * - Fetches personalized learning paths
 * - Generates a new learning path if none exists
 * - Uses diagnostic quiz results to prioritize weak subjects
 * - Displays data in a timeline format
 * - Integrated with backend APIs
 * - Responsive and user-friendly UI
 */

const LearningPath = () => {
    const { company: paramCompany } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const company = paramCompany || user?.targetCompany;

    const [learningPath, setLearningPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Fetch or generate Learning Path
     */
    const fetchOrGenerateLearningPath = async () => {
        if (!company) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            // Try to fetch existing learning path
            try {
                const response = await learningPathService.getLearningPathByCompany(company);
                if (response?.learningPath) {
                    setLearningPath(response.learningPath);
                    setLoading(false);
                    return;
                }
            } catch (fetchErr) {
                // No existing path, continue to generate
            }

            // Generate new learning path
            const generateResponse = await learningPathService.generateLearningPath(company);
            
            if (generateResponse?.learningPath) {
                setLearningPath(generateResponse.learningPath);
            } else {
                throw new Error("Invalid response from learning path generation");
            }
        } catch (err) {
            console.error("❌ Error generating learning path:", err);
            setError(`Failed to generate learning path: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchOrGenerateLearningPath();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company]);

    /**
     * Loading State
     */
    if (loading) {
        return (
            <div className="container flex-center" style={{ height: "60vh" }}>
                <div className="spinner"></div>
            </div>
        );
    }

    /**
     * No Company Selected State
     */
    if (!company) {
        return (
            <div className="container learning-path-page fade-in">
                <div className="page-header">
                    <h1>Personalized Learning Path</h1>
                    <p>Select a company to generate your customized learning roadmap.</p>
                </div>

                <div className="card text-center" style={{ padding: "40px" }}>
                    <h3 style={{ marginBottom: "15px" }}>📋 No Target Company Selected</h3>
                    <p style={{ marginBottom: "20px", color: "#666" }}>
                        Please select a company first to generate your personalized learning path.
                    </p>
                    <a href="/companies" className="btn btn-primary">
                        Select a Company
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container learning-path-page fade-in">
            {/* Header */}
            <div className="page-header">
                <h1>Personalized Learning Path</h1>
                <p>
                    Follow a structured roadmap tailored to crack{" "}
                    <strong>{company}</strong>.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {/* Display Learning Path */}
            {learningPath && (
                <LearningPathTimeline learningPath={learningPath} />
            )}

            {/* Debug Info - Remove after testing */}
            {company && !learningPath && !error && (
                <div className="card" style={{ backgroundColor: "#f0f4ff", borderLeft: "4px solid #2563eb" }}>
                    <p style={{ color: "#2563eb", fontSize: "0.9rem", margin: 0 }}>
                        📊 Loading state: <code>loading={loading.toString()}</code> | 
                        Company: <code>{company}</code> | 
                        Learning Path: <code>{learningPath ? "loaded" : "null"}</code>
                    </p>
                    <p style={{ color: "#666", fontSize: "0.85rem", margin: "5px 0 0 0" }}>
                        💡 Check browser console (F12) for detailed logs
                    </p>
                </div>
            )}

            {/* Inline Styling */}
            <style jsx="true">{`
        .learning-path-page {
          padding-bottom: 40px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          color: #1e3a8a;
          font-weight: 700;
        }

        .page-header p {
          color: #64748b;
        }

        .alert {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .alert-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .card {
          padding: 25px;
          border-radius: 16px;
          text-align: center;
        }

        .btn {
          margin-top: 10px;
        }
      `}</style>
        </div>
    );
};

export default LearningPath;