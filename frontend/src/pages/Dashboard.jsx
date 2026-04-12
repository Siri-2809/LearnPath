import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import quizService from "../services/quizService";
import ProgressChart from "../components/ProgressChart";

/**
 * ============================================
 * LearnPath - Dashboard Page
 * ============================================
 * Features:
 * - User Welcome Section
 * - Quiz Performance Analytics
 * - ML-Based Skill Gap Insights
 * - Quick Navigation Cards
 * - Responsive Modern UI
 */

const Dashboard = () => {
    const { user } = useAuth();

    const [performanceData, setPerformanceData] = useState([]);
    const [skillGap, setSkillGap] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch latest quiz results and analyze skill gaps
     */
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch quiz results
                const result = await quizService.getAllQuizResults();

                if (result?.data?.length) {
                    const latestResult = result.data[0];

                    // Format data for chart
                    const subjectScores =
                        latestResult.subjectWiseScores?.map((item) => ({
                            subject: item.subject,
                            score: item.score,
                        })) || [];

                    setPerformanceData(subjectScores);

                    // Prepare scores for ML service
                    const scores = {};
                    subjectScores.forEach((item) => {
                        scores[item.subject] = item.score;
                    });

                    // Analyze skill gap using ML
                    const analysis = await quizService.analyzeSkillGap(scores);
                    setSkillGap(analysis);
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="container flex-center" style={{ height: "60vh" }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container dashboard fade-in">
            {/* Welcome Section */}
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
                <p>
                    Track your progress, analyze skill gaps, and continue your learning
                    journey.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-4 stats">
                <div className="card stat-card">
                    <h3>Target Company</h3>
                    <p>{user?.targetCompany || "Not Selected"}</p>
                </div>

                <div className="card stat-card">
                    <h3>Weak Subjects</h3>
                    <p>{skillGap?.weak_subjects?.length || 0}</p>
                </div>

                <div className="card stat-card">
                    <h3>Average Score</h3>
                    <p>
                        {skillGap?.average_score
                            ? `${skillGap.average_score.toFixed(1)}%`
                            : "N/A"}
                    </p>
                </div>

                <div className="card stat-card">
                    <h3>Performance</h3>
                    <p>{skillGap?.performance || "N/A"}</p>
                </div>
            </div>

            {/* Progress Chart */}
            <div className="dashboard-section">
                <ProgressChart data={performanceData} />
            </div>

            {/* Skill Gap Analysis */}
            {skillGap && (
                <div className="dashboard-section card">
                    <h2>Skill Gap Analysis</h2>
                    <div className="skill-gap-container">
                        <div>
                            <h4>Weak Subjects</h4>
                            {skillGap.weak_subjects?.length ? (
                                skillGap.weak_subjects.map((subject, index) => (
                                    <span key={index} className="badge badge-danger">
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <p>No weak subjects identified 🎉</p>
                            )}
                        </div>

                        <div>
                            <h4>Strong Subjects</h4>
                            {skillGap.strong_subjects?.length ? (
                                skillGap.strong_subjects.map((subject, index) => (
                                    <span key={index} className="badge badge-success">
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <p>No strong subjects available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Navigation */}
            <div className="dashboard-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="grid grid-4">
                    <Link to="/companies" className="card action-card">
                        <h3>🏢 Select Company</h3>
                        <p>Choose your dream company.</p>
                    </Link>

                    <Link to="/quiz/Google" className="card action-card">
                        <h3>📝 Take Quiz</h3>
                        <p>Assess your technical skills.</p>
                    </Link>

                    <Link to="/learning-path" className="card action-card">
                        <h3>📘 Learning Path</h3>
                        <p>Follow your personalized roadmap.</p>
                    </Link>

                    <Link to="/study-plan" className="card action-card">
                        <h3>📅 Study Plan</h3>
                        <p>Stay consistent with daily goals.</p>
                    </Link>
                </div>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          color: #1e3a8a;
        }

        .stats {
          margin-bottom: 30px;
        }

        .stat-card {
          text-align: center;
          padding: 20px;
        }

        .stat-card h3 {
          font-size: 1rem;
          color: #64748b;
        }

        .stat-card p {
          font-size: 1.4rem;
          font-weight: bold;
          color: #2563eb;
        }

        .dashboard-section {
          margin-top: 30px;
        }

        .section-title {
          margin-bottom: 15px;
          color: #1e3a8a;
        }

        .skill-gap-container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 15px;
        }

        .action-card {
          text-align: center;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          transition: 0.3s;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15);
        }

        .badge {
          display: inline-block;
          margin: 5px;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .badge-danger {
          background: #fee2e2;
          color: #b91c1c;
        }

        .badge-success {
          background: #dcfce7;
          color: #166534;
        }

        @media (max-width: 768px) {
          .skill-gap-container {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;