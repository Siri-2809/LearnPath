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
            console.warn("⚠️ No company selected");
            setError("No target company selected. Redirecting to company selection...");
            setLoading(false);
            setTimeout(() => navigate("/companies"), 1000);
            return;
        }

        try {
            setLoading(true);
            setError("");
            console.log("🔍 Fetching/generating learning path for:", company);
            
            // Try to fetch existing learning path
            try {
                const response = await learningPathService.getLearningPathByCompany(company);
                // Service returns: { success, learningPath: {...} }
                if (response?.learningPath) {
                    console.log("✅ Found existing learning path");
                    setLearningPath(response.learningPath);
                    setLoading(false);
                    return;
                }
            } catch (fetchErr) {
                // No existing path, continue to generate
                console.log("📝 No existing learning path. Generating new one...");
            }

            // Generate new learning path
            console.log("🚀 Generating learning path...");
            const generateResponse = await learningPathService.generateLearningPath(company);
            // Service returns: { success, message, learningPath: {...} }
            console.log("📥 Generation response:", generateResponse);
            
            if (generateResponse?.learningPath) {
                console.log("✅ Learning path generated successfully");
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

    return (
        <div className="container learning-path-page fade-in">
            {/* Header */}
            <div className="page-header">
                <h1>Personalized Learning Path</h1>
                <p>
                    Follow a structured roadmap tailored to crack{" "}
                    <strong>{company || "your dream company"}</strong>.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {/* No Company Selected */}
            {!company && (
                <div className="card text-center">
                    <h3>📋 No Target Company Selected</h3>
                    <p>Please complete the diagnostic quiz and select a company to generate your learning path.</p>
                    <a href="/companies" className="btn btn-primary">
                        Select Company
                    </a>
                </div>
            )}

            {/* Display Learning Path */}
            {company && learningPath && (
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