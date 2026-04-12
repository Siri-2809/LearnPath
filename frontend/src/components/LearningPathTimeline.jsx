import React from "react";
import { formatDate } from "../utils/helpers";

/**
 * ============================================
 * LearnPath - LearningPathTimeline Component
 * ============================================
 * Displays a structured timeline of the user's
 * personalized learning path.
 *
 * Props:
 * - learningPath: {
 *      company: string,
 *      createdAt?: string,
 *      steps: [
 *          {
 *              title: string,
 *              description: string,
 *              status: "Completed" | "In Progress" | "Pending",
 *              duration?: string,
 *              resources?: string[]
 *          }
 *      ]
 *   }
 */

const LearningPathTimeline = ({ learningPath }) => {
    if (!learningPath || !learningPath.steps?.length) {
        return (
            <div className="card text-center">
                <h3>No Learning Path Available</h3>
                <p>Generate a learning path to get started.</p>
            </div>
        );
    }

    /**
     * Returns a CSS class based on step status
     */
    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "timeline-dot completed";
            case "In Progress":
                return "timeline-dot in-progress";
            case "Pending":
            default:
                return "timeline-dot pending";
        }
    };

    return (
        <div className="learning-path card fade-in">
            {/* Header */}
            <div className="timeline-header">
                <h2>{learningPath.company} Learning Path</h2>
                {learningPath.createdAt && (
                    <p className="timeline-date">
                        Created on {formatDate(learningPath.createdAt)}
                    </p>
                )}
            </div>

            {/* Timeline */}
            <div className="timeline">
                {learningPath.steps.map((step, index) => (
                    <div className="timeline-item" key={index}>
                        {/* Timeline Indicator */}
                        <div className="timeline-indicator">
                            <span className={getStatusClass(step.status)}></span>
                            {index !== learningPath.steps.length - 1 && (
                                <span className="timeline-line"></span>
                            )}
                        </div>

                        {/* Timeline Content */}
                        <div className="timeline-content">
                            <h3 className="timeline-title">
                                Step {index + 1}: {step.title}
                            </h3>

                            <p className="timeline-description">
                                {step.description}
                            </p>

                            {/* Meta Information */}
                            <div className="timeline-meta">
                                {step.duration && (
                                    <span className="badge badge-info">
                                        ⏱ {step.duration}
                                    </span>
                                )}
                                {step.status && (
                                    <span
                                        className={`badge ${step.status === "Completed"
                                            ? "badge-success"
                                            : step.status === "In Progress"
                                                ? "badge-warning"
                                                : "badge-secondary"
                                            }`}
                                    >
                                        {step.status}
                                    </span>
                                )}
                            </div>

                            {/* Resources */}
                            {step.resources && step.resources.length > 0 && (
                                <div className="timeline-resources">
                                    <strong>Resources:</strong>
                                    <ul>
                                        {step.resources.map((resource, idx) => (
                                            <li key={idx}>{resource}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
                .learning-path {
                padding: 25px;
                border-radius: 16px;
                }

                .timeline-header {
                text-align: center;
                margin-bottom: 30px;
                }

                .timeline-header h2 {
                color: #1e3a8a;
                font-weight: 700;
                }

                .timeline-date {
                color: #64748b;
                font-size: 0.9rem;
                }

                .timeline {
                position: relative;
                margin-top: 20px;
                }

                .timeline-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 30px;
                }

                .timeline-indicator {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 15px;
                }

                .timeline-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                margin-bottom: 4px;
                }

                .timeline-dot.completed {
                background-color: #22c55e;
                }

                .timeline-dot.in-progress {
                background-color: #f59e0b;
                }

                .timeline-dot.pending {
                background-color: #cbd5f5;
                }

                .timeline-line {
                width: 3px;
                flex-grow: 1;
                background: #e2e8f0;
                min-height: 50px;
                }

                .timeline-content {
                flex: 1;
                background: #f8fafc;
                padding: 15px;
                border-radius: 12px;
                border-left: 4px solid #2563eb;
                transition: transform 0.2s ease;
                }

                .timeline-content:hover {
                transform: translateY(-3px);
                }

                .timeline-title {
                font-size: 1.1rem;
                color: #0f172a;
                margin-bottom: 5px;
                }

                .timeline-description {
                color: #475569;
                font-size: 0.95rem;
                margin-bottom: 10px;
                }

                .timeline-meta {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
                flex-wrap: wrap;
                }

                .timeline-resources ul {
                margin-top: 5px;
                padding-left: 18px;
                }

                .timeline-resources li {
                font-size: 0.9rem;
                color: #334155;
                }

                .badge-secondary {
                background-color: #e2e8f0;
                color: #334155;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.75rem;
                }

                @media (max-width: 768px) {
                .timeline-item {
                    flex-direction: column;
                }

                .timeline-indicator {
                    flex-direction: row;
                    margin-bottom: 10px;
                }

                .timeline-line {
                    display: none;
                }
                }
            `}</style>
        </div>
    );
};

export default LearningPathTimeline;