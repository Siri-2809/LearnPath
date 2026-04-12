import React, { useEffect, useState } from "react";
import StudyPlanTable from "../components/StudyPlanTable";
import studyPlanService from "../services/studyPlanService";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

/**
 * ============================================
 * LearnPath - Study Plan Page
 * ============================================
 * Features:
 * - Generates personalized study plans
 * - Retrieves study plans from backend
 * - Updates session status dynamically
 * - Displays progress using StudyPlanTable
 * - Responsive and user-friendly UI
 */

const StudyPlan = () => {
    const { user } = useAuth();

    const [studyPlan, setStudyPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const company = user?.targetCompany;

    /**
     * Fetch Study Plan
     */
    const fetchStudyPlan = async () => {
        if (!company) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response =
                await studyPlanService.getStudyPlanByCompany(company);

            const data = response?.data || response;
            setStudyPlan(data);
        } catch (err) {
            console.warn("No study plan found. Generate a new one.");
            setStudyPlan(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Generate Study Plan
     */
    const handleGenerateStudyPlan = async () => {
        if (!company) {
            setError("Please select a target company first.");
            return;
        }

        try {
            setGenerating(true);
            setError("");

            const payload = {
                company,
                durationDays: 30,
                weakSubjects: [], // Can be enhanced using ML insights
            };

            const response =
                await studyPlanService.generateStudyPlan(payload);

            const data = response?.data || response;
            setStudyPlan(data);
        } catch (err) {
            console.error("Error generating study plan:", err);
            setError("Failed to generate study plan. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    /**
     * Update Session Status
     */
    const handleUpdateStatus = async (id, day, status) => {
        try {
            await studyPlanService.updateStudySessionStatus(
                id,
                day,
                status
            );
            fetchStudyPlan();
        } catch (err) {
            console.error("Error updating study session:", err);
        }
    };

    useEffect(() => {
        fetchStudyPlan();
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
        <div className="container study-plan-page fade-in">
            {/* Header */}
            <div className="page-header">
                <h1>Personalized Study Plan</h1>
                <p>
                    Stay consistent and prepare efficiently for{" "}
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
                    <p>Please select a company to generate your study plan.</p>
                    <Link to="/companies" className="btn btn-primary">
                        Select Company
                    </Link>
                </div>
            )}

            {/* Generate Study Plan */}
            {company && !studyPlan && (
                <div className="card text-center">
                    <h3>No Study Plan Found</h3>
                    <p>
                        Generate a structured plan tailored to crack{" "}
                        <strong>{company}</strong>.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateStudyPlan}
                        disabled={generating}
                    >
                        {generating ? "Generating..." : "Generate Study Plan"}
                    </button>
                </div>
            )}

            {/* Display Study Plan */}
            {studyPlan && (
                <StudyPlanTable
                    studyPlan={studyPlan}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}

            {/* Inline Styling */}
            <style jsx="true">{`
        .study-plan-page {
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

export default StudyPlan;