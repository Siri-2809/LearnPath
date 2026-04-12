import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import ProgressChart from "../components/ProgressChart";
import quizService from "../services/quizService";

/**
 * ============================================
 * LearnPath - Quiz Result Page
 * ============================================
 * Features:
 * - Displays quiz score and performance summary
 * - Highlights correct and incorrect answers
 * - Shows subject-wise analytics
 * - Integrates with ML service for skill gap analysis
 * - Provides personalized recommendations
 */

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state?.result;
    const questions = location.state?.questions || [];
    const userAnswers = location.state?.userAnswers || {};
    const company = location.state?.company || "Unknown";
    const testType = location.state?.testType || "diagnostic";

    const [analysis, setAnalysis] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * Redirect if accessed directly without data
     */
    useEffect(() => {
        if (!result) {
            navigate("/dashboard");
        }
    }, [result, navigate]);

    /**
     * Perform ML-based skill gap analysis
     */
    useEffect(() => {
        const fetchMLInsights = async () => {
            try {
                setLoading(true);

                const subjectScores =
                    result?.subjectWiseScores ||
                    result?.data?.subjectWiseScores ||
                    [];

                if (!subjectScores.length) return;

                // Convert to ML-friendly format
                const scores = {};
                const chartData = subjectScores.map((item) => {
                    scores[item.subject] = item.score;
                    return {
                        subject: item.subject,
                        score: item.score,
                    };
                });

                // Skill Gap Analysis
                const skillGapResponse = await quizService.analyzeSkillGap(scores);
                setAnalysis(skillGapResponse);

                // Resource Recommendations
                if (skillGapResponse?.weak_subjects?.length) {
                    const recResponse = await quizService.getRecommendations(
                        skillGapResponse.weak_subjects
                    );
                    setRecommendations(recResponse.recommendations || []);
                }

                setChartData(chartData);
            } catch (error) {
                console.error("ML Analysis Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMLInsights();
    }, [result]);

    const [chartData, setChartData] = useState([]);

    if (!result) return null;

    // Extract result data safely
    const score = result.score ?? result.data?.score ?? 0;
    const totalQuestions =
        result.totalQuestions ??
        result.data?.totalQuestions ??
        questions.length;

    const percentage =
        totalQuestions > 0
            ? ((score / totalQuestions) * 100).toFixed(2)
            : 0;

    const performance =
        result.performance ||
        result.data?.performance ||
        (percentage >= 75
            ? "Excellent"
            : percentage >= 50
                ? "Good"
                : "Needs Improvement");

    return (
        <div className="container quiz-result fade-in">
            {/* Header */}
            <div className="result-header card">
                <h2>
                    {company} {testType.charAt(0).toUpperCase() + testType.slice(1)} Test
                    Result
                </h2>
                <p className="result-subtitle">
                    Review your performance and insights
                </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-4 stats">
                <div className="card stat-card">
                    <h3>Score</h3>
                    <p>
                        {score}/{totalQuestions}
                    </p>
                </div>

                <div className="card stat-card">
                    <h3>Percentage</h3>
                    <p>{percentage}%</p>
                </div>

                <div className="card stat-card">
                    <h3>Performance</h3>
                    <p>{performance}</p>
                </div>

                <div className="card stat-card">
                    <h3>Company</h3>
                    <p>{company}</p>
                </div>
            </div>

            {/* Performance Chart */}
            {chartData.length > 0 && (
                <div className="section">
                    <ProgressChart data={chartData} />
                </div>
            )}

            {/* Skill Gap Analysis */}
            {analysis && (
                <div className="card section">
                    <h3>Skill Gap Analysis</h3>
                    <div className="skill-gap">
                        <div>
                            <h4>Weak Subjects</h4>
                            {analysis.weak_subjects?.length ? (
                                analysis.weak_subjects.map((subject, index) => (
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
                            {analysis.strong_subjects?.length ? (
                                analysis.strong_subjects.map((subject, index) => (
                                    <span key={index} className="badge badge-success">
                                        {subject}
                                    </span>
                                ))
                            ) : (
                                <p>No strong subjects identified.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="card section">
                    <h3>Recommended Resources</h3>
                    <ul className="recommendation-list">
                        {recommendations.map((rec, index) => (
                            <li key={index}>
                                <strong>{rec.title || rec.name}</strong>
                                {rec.url && (
                                    <>
                                        {" - "}
                                        <a
                                            href={rec.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Visit Resource
                                        </a>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Answer Review */}
            <div className="section">
                <h3>Answer Review</h3>
                {questions.map((question, index) => (
                    <QuestionCard
                        key={question._id}
                        question={question}
                        index={index}
                        selectedAnswer={userAnswers[question._id]}
                        correctAnswer={question.correctAnswer}
                        showResult={true}
                    />
                ))}
            </div>

            {/* Action Buttons */}
            <div className="result-actions">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/quiz/${company}`)}
                >
                    Retake Quiz
                </button>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .quiz-result {
          padding-bottom: 40px;
        }

        .result-header {
          text-align: center;
          margin-bottom: 20px;
          padding: 20px;
        }

        .result-header h2 {
          color: #1e3a8a;
        }

        .result-subtitle {
          color: #64748b;
        }

        .stats {
          margin-bottom: 20px;
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

        .section {
          margin-top: 30px;
        }

        .skill-gap {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 5px 10px;
          margin: 5px;
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

        .recommendation-list {
          padding-left: 20px;
        }

        .recommendation-list a {
          color: #2563eb;
          text-decoration: none;
        }

        .recommendation-list a:hover {
          text-decoration: underline;
        }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .skill-gap {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
};

export default QuizResult;