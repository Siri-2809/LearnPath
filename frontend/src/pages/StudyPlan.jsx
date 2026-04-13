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
    const [error, setError] = useState("");

    const company = user?.targetCompany;

    /**
     * Fetch or generate Study Plan
     */
    const fetchOrGenerateStudyPlan = async () => {
        if (!company) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            try {
                const response =
                    await studyPlanService.getStudyPlanByCompany(company);

                if (response?.studyPlan) {
                    setStudyPlan(response.studyPlan);
                    return;
                }
            } catch (fetchErr) {
                // Study plan not found, proceed to generate below.
            }

            const payload = {
                company,
                weakSubjects: [],
            };

            const generated = await studyPlanService.generateStudyPlan(payload);
            if (generated?.studyPlan) {
                setStudyPlan(generated.studyPlan);
            } else {
                throw new Error("Invalid response while generating study plan.");
            }
        } catch (err) {
            console.error("Error loading/generating study plan:", err);
            setStudyPlan(null);
            setError("Failed to load study plan. Please try again.");
        } finally {
            setLoading(false);
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
            fetchOrGenerateStudyPlan();
        } catch (err) {
            console.error("Error updating study session:", err);
        }
    };

    useEffect(() => {
        fetchOrGenerateStudyPlan();
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