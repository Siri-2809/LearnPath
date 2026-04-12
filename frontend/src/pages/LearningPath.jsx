import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
 * - Displays data in a timeline format
 * - Integrated with backend APIs
 * - Responsive and user-friendly UI
 */

const LearningPath = () => {
    const { company: paramCompany } = useParams();
    const { user } = useAuth();

    const company = paramCompany || user?.targetCompany;

    const [learningPath, setLearningPath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    /**
     * Fetch Learning Path
     */
    const fetchLearningPath = async () => {
        if (!company) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response =
                await learningPathService.getLearningPathByCompany(company);

            const data = response?.data || response;
            setLearningPath(data);
        } catch (err) {
            console.warn("No learning path found. Generate a new one.");
            setLearningPath(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Generate Learning Path
     */
    const handleGenerateLearningPath = async () => {
        if (!company) {
            setError("Please select a target company first.");
            return;
        }

        try {
            setGenerating(true);
            setError("");

            const response =
                await learningPathService.generateLearningPath(company);

            const data = response?.data || response;
            setLearningPath(data);
        } catch (err) {
            console.error("Error generating learning path:", err);
            setError("Failed to generate learning path. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        fetchLearningPath();
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
                    <h3>No Target Company Selected</h3>
                    <p>Please select a company to generate your learning path.</p>
                    <a href="/companies" className="btn btn-primary">
                        Select Company
                    </a>
                </div>
            )}

            {/* Generate Learning Path */}
            {company && !learningPath && (
                <div className="card text-center">
                    <h3>No Learning Path Found</h3>
                    <p>
                        Generate a personalized roadmap based on your target company and
                        performance.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateLearningPath}
                        disabled={generating}
                    >
                        {generating ? "Generating..." : "Generate Learning Path"}
                    </button>
                </div>
            )}

            {/* Display Learning Path */}
            {learningPath && (
                <LearningPathTimeline learningPath={learningPath} />
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