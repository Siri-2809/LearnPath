import React from "react";

/**
 * ============================================
 * LearnPath - QuestionCard Component
 * ============================================
 * Displays a single quiz question with options.
 *
 * Props:
 * - question: {
 *      _id: string,
 *      question: string,
 *      options: string[],
 *      subject?: string,
 *      difficulty?: string
 *   }
 * - index: number
 * - selectedAnswer: string
 * - onSelectAnswer: function
 * - showResult: boolean (optional)
 * - correctAnswer: string (optional)
 */

const QuestionCard = ({
    question,
    index,
    selectedAnswer,
    onSelectAnswer,
    showResult = false,
    correctAnswer = "",
}) => {
    /**
     * Determine option styling based on result state
     */
    const getOptionClass = (option) => {
        if (!showResult) {
            return selectedAnswer === option
                ? "option selected"
                : "option";
        }

        if (option === correctAnswer) {
            return "option correct";
        }

        if (option === selectedAnswer && option !== correctAnswer) {
            return "option incorrect";
        }

        return "option";
    };

    return (
        <div className="question-card card fade-in">
            {/* Question Header */}
            <div className="question-header">
                <h3 className="question-title">
                    Question {index + 1}
                </h3>

                {(question.subject || question.difficulty) && (
                    <div className="question-meta">
                        {question.subject && (
                            <span className="badge badge-info">
                                {question.subject}
                            </span>
                        )}
                        {question.difficulty && (
                            <span className="badge badge-warning">
                                {question.difficulty}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Question Text */}
            <p className="question-text">{question.question}</p>

            {/* Options */}
            <div className="options-container">
                {question.options.map((option, idx) => (
                    <label
                        key={idx}
                        className={getOptionClass(option)}
                    >
                        <input
                            type="radio"
                            name={`question-${question._id}`}
                            value={option}
                            checked={selectedAnswer === option}
                            onChange={() => onSelectAnswer(question._id, option)}
                            disabled={showResult}
                        />
                        <span className="option-text">{option}</span>
                    </label>
                ))}
            </div>

            {/* Explanation (Optional) */}
            {showResult && question.explanation && (
                <div className="explanation">
                    <strong>Explanation:</strong> {question.explanation}
                </div>
            )}

            {/* Inline Styles */}
            <style jsx="true">{`
        .question-card {
          margin-bottom: 25px;
          padding: 25px;
          border-radius: 16px;
          background: #ffffff;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .question-title {
          font-size: 1.2rem;
          color: #1e3a8a;
          font-weight: 600;
        }

        .question-meta {
          display: flex;
          gap: 8px;
        }

        .question-text {
          font-size: 1.05rem;
          margin: 15px 0;
          color: #0f172a;
          line-height: 1.6;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .option:hover {
          background: #eef2ff;
          border-color: #2563eb;
        }

        .option input {
          margin-right: 10px;
          cursor: pointer;
        }

        .option.selected {
          border-color: #2563eb;
          background: #dbeafe;
        }

        .option.correct {
          border-color: #22c55e;
          background: #dcfce7;
        }

        .option.incorrect {
          border-color: #ef4444;
          background: #fee2e2;
        }

        .option-text {
          font-size: 0.95rem;
          color: #1e293b;
        }

        .explanation {
          margin-top: 15px;
          padding: 12px;
          border-radius: 8px;
          background: #f1f5f9;
          font-size: 0.9rem;
          color: #334155;
          border-left: 4px solid #2563eb;
        }

        @media (max-width: 768px) {
          .question-card {
            padding: 20px;
          }

          .question-title {
            font-size: 1.1rem;
          }

          .question-text {
            font-size: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default QuestionCard;