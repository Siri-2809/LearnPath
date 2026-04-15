import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

/**
 * ============================================
 * LearnPath - ProgressChart Component
 * ============================================
 * Displays subject-wise performance using a
 * responsive bar chart.
 *
 * Props:
 * - data: [
 *     { subject: "DSA", score: 75 },
 *     { subject: "DBMS", score: 60 },
 *     { subject: "OS", score: 50 },
 *     { subject: "CN", score: 80 }
 *   ]
 */

const ProgressChart = ({ data = [] }) => {
    // Handle empty data
    if (!data || data.length === 0) {
        return (
            <div className="card text-center">
                <h3>No Performance Data Available</h3>
                <p>Complete a quiz to view your progress.</p>
            </div>
        );
    }

    return (
        <div className="progress-chart card fade-in">
            {/* Header */}
            <div className="chart-header">
                <h2>Performance Overview</h2>
                <p className="text-muted">
                    Subject-wise quiz performance analysis
                </p>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                        formatter={(value) =>
                            value !== null && value !== undefined
                                ? `${Number(value).toFixed(1)}%`
                                : "N/A"
                        }
                    />
                    <Legend />
                    <Bar
                        dataKey="percentage"
                        name="Percentage (%)"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                    />
                    <Bar
                        dataKey="score"
                        name="Score (Marks)"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Inline Styling */}
            <style jsx="true">{`
        .progress-chart {
          padding: 25px;
          border-radius: 16px;
        }

        .chart-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .chart-header h2 {
          color: #1e3a8a;
          font-weight: 700;
        }

        .chart-header p {
          font-size: 0.95rem;
          color: #64748b;
        }
      `}</style>
        </div>
    );
};

export default ProgressChart;