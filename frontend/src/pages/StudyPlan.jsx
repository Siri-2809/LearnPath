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
    const [durationDays, setDurationDays] = useState(30);

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
                durationDays,
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

    const handleRegenerateStudyPlan = async () => {
        if (!company) return;

        try {
            setGenerating(true);
            setError("");

            const payload = {
                company,
                durationDays,
                weakSubjects: [],
            };

            const generated = await studyPlanService.generateStudyPlan(payload);
            if (generated?.studyPlan) {
                setStudyPlan(generated.studyPlan);
            } else {
                throw new Error("Invalid response while generating study plan.");
            }
        } catch (err) {
            console.error("Error regenerating study plan:", err);
            setError("Failed to regenerate study plan. Please try again.");
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
            fetchOrGenerateStudyPlan();
        } catch (err) {
            console.error("Error updating study session:", err);
        }
    };

    useEffect(() => {
        fetchOrGenerateStudyPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company]);

    useEffect(() => {
        if (studyPlan?.durationDays) {
            setDurationDays(studyPlan.durationDays);
        }
    }, [studyPlan?.durationDays]);

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
            <div className="container study-plan-page fade-in">
                <div className="page-header">
                    <h1>Personalized Study Plan</h1>
                    <p>Select a company to generate your customized study plan.</p>
                </div>

                <div className="card text-center" style={{ padding: "40px" }}>
                    <h3 style={{ marginBottom: "15px" }}>📋 No Target Company Selected</h3>
                    <p style={{ marginBottom: "20px", color: "#666" }}>
                        Please select a company first to generate your personalized study plan.
                    </p>
                    <Link to="/companies" className="btn btn-primary">
                        Select a Company
                    </Link>
                </div>
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

            {/* Duration Controls */}
            <div className="card duration-controls">
                <label htmlFor="durationDays">Choose plan duration (days):</label>
                <div className="duration-actions">
                    <input
                        id="durationDays"
                        type="number"
                        min="1"
                        max="180"
                        className="form-control"
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleRegenerateStudyPlan}
                        disabled={generating || loading}
                    >
                        {generating ? "Generating..." : "Generate for Selected Days"}
                    </button>
                </div>
                {studyPlan?.durationDays && (
                    <p className="text-muted" style={{ marginTop: "8px" }}>
                        Current plan duration: <strong>{studyPlan.durationDays}</strong> days
                    </p>
                )}
            </div>

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

                .duration-controls {
                    margin-bottom: 20px;
                    text-align: left;
                }

                .duration-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    margin-top: 8px;
                }

                .form-control {
                    max-width: 180px;
                }

        .btn {
          margin-top: 10px;
        }

                @media (max-width: 768px) {
                    .duration-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .form-control {
                        max-width: 100%;
                    }
                }
      `}</style>
        </div>
    );
};

export default StudyPlan;