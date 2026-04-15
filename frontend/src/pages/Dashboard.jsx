import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import quizService from "../services/quizService";
import companyService from "../services/companyService";
import ProgressChart from "../components/ProgressChart";

const getPerformanceLabel = (averageScore) => {
    if (averageScore >= 85) return "Excellent";
    if (averageScore >= 70) return "Good";
    if (averageScore >= 50) return "Average";
    return "Needs Improvement";
};

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
    const [averageScore, setAverageScore] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch latest quiz results and analyze skill gaps
     */
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Only fetch if user has selected a company
                if (!user?.targetCompany) {
                    setLoading(false);
                    return;
                }

                // Fetch latest quiz result for the selected company
                const [quizResponse, companyResponse] = await Promise.all([
                    quizService.getLatestQuizResult(user.targetCompany),
                    companyService.getCompanyByName(user.targetCompany),
                ]);

                const companySubjects = Array.isArray(companyResponse?.company?.subjects)
                    ? companyResponse.company.subjects
                    : [];

                if (quizResponse?.result) {
                    const latestResult = quizResponse.result;

                    // Format data for chart
                    const rawSubjectScores =
                        latestResult.subjectWiseScores?.map((item) => ({
                            subject: item.subject,
                            score: item.score,
                            percentage: item.percentage,
                        })) || [];

                    // Ensure all company subjects are represented in the chart.
                    const subjectScoreMap = new Map(
                        rawSubjectScores.map((item) => [item.subject, item])
                    );

                    const subjectScores = companySubjects.length
                        ? companySubjects.map((subject) =>
                              subjectScoreMap.get(subject) || {
                                  subject,
                                  score: 0,
                                  percentage: 0,
                              }
                          )
                        : rawSubjectScores;

                    setPerformanceData(subjectScores);

                    // Calculate average score from attempted subjects only.
                    if (rawSubjectScores.length > 0) {
                        const avgPercentage =
                            rawSubjectScores.reduce(
                                (sum, item) => sum + (item.percentage || 0),
                                0
                            ) / rawSubjectScores.length;
                        setAverageScore(avgPercentage);
                    }

                    // Derive skill-gap directly from quiz result so all attempted
                    // subjects are represented without alias collapsing.
                    const weakSubjects = rawSubjectScores
                        .filter((item) => (item.percentage || 0) < 50)
                        .map((item) => item.subject);

                    const strongSubjects = rawSubjectScores
                        .filter((item) => (item.percentage || 0) >= 50)
                        .map((item) => item.subject);

                    const average = rawSubjectScores.length
                        ? rawSubjectScores.reduce(
                              (sum, item) => sum + (item.percentage || 0),
                              0
                          ) / rawSubjectScores.length
                        : 0;

                    setSkillGap({
                        success: true,
                        weak_subjects: weakSubjects,
                        strong_subjects: strongSubjects,
                        average_score: average,
                        performance: getPerformanceLabel(average),
                        source: "quiz-result",
                    });
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.targetCompany]);

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
                        {averageScore !== null
                            ? `${averageScore.toFixed(1)}%`
                            : skillGap?.average_score
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

                    <Link 
                        to={user?.targetCompany ? `/quiz/${user.targetCompany}` : "/companies"} 
                        className="card action-card"
                    >
                        <h3>📝 Take Quiz</h3>
                        <p>{user?.targetCompany ? `${user.targetCompany} Quiz` : "Select a company first."}</p>
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