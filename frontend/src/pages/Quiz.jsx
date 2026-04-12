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
    const limit = parseInt(searchParams.get("limit")) || 15;

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(limit * 60); // seconds
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    /**
     * Fetch quiz questions from backend
     */
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await quizService.generateQuiz(
                    company,
                    testType,
                    limit
                );

                const quizData =
                    response.data?.questions ||
                    response.questions ||
                    response.data ||
                    [];

                setQuestions(quizData);
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("Failed to load quiz. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [company, testType, limit]);

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
            const formattedAnswers = questions.map((q) => ({
                questionId: q._id,
                selectedAnswer: answers[q._id] || null,
            }));

            const payload = {
                company,
                testType,
                answers: formattedAnswers,
                timeTaken: limit * 60 - timeLeft,
            };

            const response = await quizService.submitQuiz(payload);

            navigate("/quiz-result", {
                state: {
                    result: response.data || response,
                    questions,
                    userAnswers: answers,
                    company,
                    testType,
                },
            });
        } catch (err) {
            console.error("Error submitting quiz:", err);
            setError("Failed to submit quiz. Please try again.");
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