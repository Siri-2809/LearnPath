import React from "react";
import {
    formatDate,
    calculateProgress,
    getStatusColor,
} from "../utils/helpers";

/**
 * ============================================
 * LearnPath - StudyPlanTable Component
 * ============================================
 * Displays a structured study plan with progress
 * tracking and session status updates.
 *
 * Props:
 * - studyPlan: {
 *      _id: string,
 *      company: string,
 *      durationDays: number,
 *      createdAt: string,
 *      sessions: [
 *          {
 *              day: number,
 *              subject: string,
 *              topic: string,
 *              date: string,
 *              status: "Pending" | "In Progress" | "Completed"
 *          }
 *      ]
 *   }
 * - onUpdateStatus: function(id, day, status)
 */

const StudyPlanTable = ({ studyPlan, onUpdateStatus }) => {
    if (!studyPlan || !studyPlan.sessions?.length) {
        return (
            <div className="card text-center">
                <h3>No Study Plan Available</h3>
                <p>Generate a study plan to get started.</p>
            </div>
        );
    }

    const { _id, company, durationDays, createdAt, sessions } = studyPlan;

    // Calculate progress
    const completedSessions = sessions.filter(
        (session) => session.status === "Completed"
    ).length;

    const progress = calculateProgress(
        completedSessions,
        sessions.length
    );

    return (
        <div className="study-plan card fade-in">
            {/* Header */}
            <div className="study-plan-header">
                <div>
                    <h2>{company} Study Plan</h2>
                    <p>
                        Duration: <strong>{durationDays} Days</strong>
                    </p>
                    <p className="text-muted">
                        Created on {formatDate(createdAt)}
                    </p>
                </div>

                {/* Progress */}
                <div className="progress-container">
                    <p className="progress-label">
                        Progress: <strong>{progress}%</strong>
                    </p>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table study-plan-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session.day}>
                                <td>Day {session.day}</td>
                                <td>{session.subject}</td>
                                <td>{session.topic}</td>
                                <td>{formatDate(session.date)}</td>
                                <td>
                                    <span
                                        className={`badge ${getStatusColor(
                                            session.status
                                        )}`}
                                    >
                                        {session.status}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        className="form-control"
                                        value={session.status}
                                        onChange={(e) =>
                                            onUpdateStatus(
                                                _id,
                                                session.day,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Inline Styling */}
            <style jsx="true">{`
        .study-plan {
          padding: 25px;
          border-radius: 16px;
        }

        .study-plan-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          margin-bottom: 20px;
          gap: 20px;
        }

        .study-plan-header h2 {
          color: #1e3a8a;
          font-weight: 700;
        }

        .progress-container {
          min-width: 220px;
        }

        .progress-label {
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #2563eb, #38bdf8);
          transition: width 0.4s ease-in-out;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .study-plan-table th {
          background: #2563eb;
          color: #ffffff;
        }

        .study-plan-table td,
        .study-plan-table th {
          vertical-align: middle;
        }

        .form-control {
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #cbd5f5;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .study-plan-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
        </div>
    );
};

export default StudyPlanTable;