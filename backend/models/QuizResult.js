import mongoose from "mongoose";

/**
 * Answer Schema
 * Stores each answer submitted by the user during a quiz.
 */
const answerSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        selectedAnswer: {
            type: String,
            default: null,
            trim: true,
        },
        correctAnswer: {
            type: String,
            required: true,
            trim: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        marksAwarded: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

/**
 * Quiz Result Schema for LearnPath
 * Stores quiz performance data used for skill gap analysis,
 * learning path generation, and study plan creation.
 */
const quizResultSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        answers: {
            type: [answerSchema],
            default: [],
        },
        score: {
            type: Number,
            required: true,
            default: 0,
        },
        totalMarks: {
            type: Number,
            required: true,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        weakSubjects: [
            {
                type: String,
                trim: true,
            },
        ],
        strongSubjects: [
            {
                type: String,
                trim: true,
            },
        ],
        subjectWiseScores: [
            {
                subject: {
                    type: String,
                    required: true,
                    trim: true,
                },
                correct: {
                    type: Number,
                    default: 0,
                },
                total: {
                    type: Number,
                    default: 0,
                },
                score: {
                    type: Number,
                    default: 0,
                },
                percentage: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        testType: {
            type: String,
            enum: ["diagnostic", "mock"],
            required: true,
        },
        timeTaken: {
            type: Number, // in minutes
            default: 0,
        },
        attemptNumber: {
            type: Number,
            default: 1,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Middleware: Calculate percentage before saving
 */
quizResultSchema.pre("save", function (next) {
    if (this.totalMarks > 0) {
        this.percentage = (this.score / this.totalMarks) * 100;
    } else {
        this.percentage = 0;
    }
    next();
});

/**
 * Indexes to improve query performance
 */
quizResultSchema.index({ user: 1, company: 1 });
quizResultSchema.index({ submittedAt: -1 });

/**
 * Export QuizResult Model
 */
const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;