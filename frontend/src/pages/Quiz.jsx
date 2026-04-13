import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import quizService from "../services/quizService";
import QuestionCard from "../components/QuestionCard";

/**
 * ============================================
 * LearnPath - Quiz Page
 * ============================================
 * Features:
 * - Fetches quiz questions based on company
 * - Supports Diagnostic and Mock tests
 * - Tracks user answers
 * - Includes countdown timer
 * - Submits results to backend
 * - Redirects to Quiz Results page
 */

const Quiz = () => {
    const { company } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const testType = searchParams.get("testType") || "diagnostic";
    const limitParam = searchParams.get("limit");

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null); // Will be set based on actual questions
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /**
     * Fetch quiz questions from backend
     */
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                
                // Validate company parameter
                if (!company) {
                    setError("Company parameter is missing. Please select a company first.");
                    setLoading(false);
                    return;
                }

                console.log(`📥 Fetching quiz for ${company} (${testType})`);
                
                const response = await quizService.generateQuiz(
                    company,
                    testType,
                    limitParam ? parseInt(limitParam) : null
                );

                console.log("✓ Quiz response received:", response);

                const quizData =
                    response.data?.questions ||
                    response.questions ||
                    response.data ||
                    [];

                if (!Array.isArray(quizData)) {
                    console.error("❌ Quiz data is not an array:", typeof quizData, quizData);
                    setError("Invalid quiz data received from server. Please try again.");
                    setLoading(false);
                    return;
                }

                if (quizData.length === 0) {
                    setError(`No questions available for ${company} ${testType} test.`);
                    setLoading(false);
                    return;
                }

                setQuestions(quizData);
                // Set timer based on actual number of questions (2 min per question)
                setTimeLeft(quizData.length * 120); // 2 minutes per question in seconds
            } catch (err) {
                console.error("❌ Error fetching quiz:", err);
                const errorMsg = err?.message || err?.response?.data?.message || "Failed to load quiz. Please try again.";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [company, testType, limitParam]);

    /**
     * Countdown Timer
     */
    useEffect(() => {
        if (!timeLeft || questions.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, questions]);

    /**
     * Handle answer selection
     */
    const handleSelectAnswer = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    /**
     * Format time display
     */
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    /**
     * Submit quiz to backend
     */
    const handleSubmit = async () => {
        if (submitting) return;

        setSubmitting(true);

        try {
            // Format answers - include all questions (answered and unanswered)
            const formattedAnswers = questions.map((q) => ({
                questionId: q._id,
                selectedAnswer: answers[q._id] || null, // null for unanswered questions
            }));

            console.log(`📊 Questions: ${questions.length}, Answered: ${Object.keys(answers).length}`);

            const payload = {
                company,
                testType,
                answers: formattedAnswers,
                timeTaken: Math.max(0, questions.length * 120 - timeLeft), // Total time allocated - time remaining
            };

            console.log("📤 Submitting quiz payload:", payload);

            const response = await quizService.submitQuiz(payload);
            console.log("📥 Quiz response:", response);

            // quizService returns: { success: true, message, result: {...} }
            if (!response?.result) {
                console.error("⚠️ Missing result in response:", response);
                throw new Error("Invalid response from backend");
            }

            console.log("✅ Quiz submitted successfully");

            navigate("/quiz-result", {
                state: {
                    result: response.result,
                    questions,
                    userAnswers: answers,
                    company,
                    testType,
                },
            });
        } catch (err) {
            // Get the actual error message from backend
            const errorMsg = err?.response?.data?.message || 
                           err?.message || 
                           "Failed to submit quiz. Please try again.";
            console.error("❌ Error submitting quiz:", err);
            console.error("Error details:", {
                status: err?.response?.status,
                data: err?.response?.data,
                message: errorMsg,
            });
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

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
     * Error State
     */
    if (error) {
        return (
            <div className="container text-center">
                <div className="card">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container quiz-page fade-in">
            {/* Header */}
            <div className="quiz-header">
                <h2>
                    {company} {testType.charAt(0).toUpperCase() + testType.slice(1)} Test
                </h2>
                <div className="quiz-info">
                    <span className="badge badge-info">
                        Questions: {questions.length}
                    </span>
                    <span className="badge badge-warning">
                        Time Left: {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Questions */}
            <div className="quiz-questions">
                {questions.map((question, index) => (
                    <QuestionCard
                        key={question._id}
                        question={question}
                        index={index}
                        selectedAnswer={answers[question._id]}
                        onSelectAnswer={handleSelectAnswer}
                    />
                ))}
            </div>

            {/* Submit Button */}
            <div className="quiz-submit">
                {Object.keys(answers).length < questions.length && (
                    <div style={{
                        padding: "10px",
                        marginBottom: "15px",
                        backgroundColor: "#fef3c7",
                        border: "1px solid #f59e0b",
                        borderRadius: "8px",
                        color: "#92400e",
                        fontSize: "0.9rem"
                    }}>
                        ⚠️ You have {questions.length - Object.keys(answers).length} unanswered question(s). They will be marked as incorrect.
                    </div>
                )}
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .quiz-header h2 {
          color: #1e3a8a;
          font-weight: 700;
        }

        .quiz-info {
          display: flex;
          gap: 10px;
        }

        .quiz-submit {
          text-align: center;
          margin-top: 20px;
        }

        .badge-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        @media (max-width: 768px) {
          .quiz-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
        </div>
    );
};

export default Quiz;