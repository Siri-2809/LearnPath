import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ============================================
 * LearnPath - QuizCard Component
 * ============================================
 * Displays quiz options such as Diagnostic and
 * Mock Tests for a selected company.
 *
 * Props:
 * - title: string
 * - description: string
 * - company: string
 * - testType: "diagnostic" | "mock"
 * - icon: string (emoji or icon)
 * - disabled: boolean
 * - questions: number (optional)
 * - duration: number (optional, in minutes)
 */

const QuizCard = ({
    title,
    description,
    company,
    testType = "diagnostic",
    icon = "📝",
    disabled = false,
    questions = 15,
    duration = 30,
}) => {
    const navigate = useNavigate();

    /**
     * Handle quiz start
     */
    const handleStartQuiz = () => {
        if (!disabled) {
            navigate(`/quiz/${company}?testType=${testType}&limit=${questions}`);
        }
    };

    return (
        <div className={`quiz-card card fade-in ${disabled ? "disabled" : ""}`}>
            {/* Icon */}
            <div className="quiz-icon">{icon}</div>

            {/* Title */}
            <h3 className="quiz-title">{title}</h3>

            {/* Description */}
            <p className="quiz-description">{description}</p>

            {/* Quiz Details */}
            <div className="quiz-details">
                <span className="badge badge-info">{questions} Questions</span>
                <span className="badge badge-warning">{duration} mins</span>
            </div>

            {/* Action Button */}
            <button
                className={`btn ${disabled ? "btn-disabled" : "btn-primary"}`}
                onClick={handleStartQuiz}
                disabled={disabled}
            >
                {disabled ? "Locked" : "Start Quiz"}
            </button>

            {/* Inline Styling */}
            <style jsx="true">{`
        .quiz-card {
          text-align: center;
          padding: 25px;
          border-radius: 16px;
          background: #ffffff;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 260px;
        }

        .quiz-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
        }

        .quiz-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .quiz-title {
          font-size: 1.4rem;
          color: #1e3a8a;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .quiz-description {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 15px;
        }

        .quiz-details {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .btn-disabled {
          background-color: #94a3b8;
          color: #ffffff;
          cursor: not-allowed;
        }

        .disabled {
          opacity: 0.7;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .quiz-card {
            padding: 20px;
          }

          .quiz-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
        </div>
    );
};

export default QuizCard;