import mongoose from "mongoose";

/**
 * Study Session Schema
 * Represents an individual study task in the timetable.
 */
const studySessionSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true,
            min: 1,
        },
        date: {
            type: Date,
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        topic: {
            type: String,
            default: "",
            trim: true,
        },
        resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resource",
            default: null,
        },
        durationHours: {
            type: Number,
            required: true,
            min: 0.5,
            default: 1,
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },
    },
    { _id: false }
);

/**
 * Study Plan Schema for LearnPath
 * Defines a personalized study timetable for a user based on
 * quiz performance, learning path, and company requirements.
 */
const studyPlanSchema = new mongoose.Schema(
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
        learningPath: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LearningPath",
            default: null,
        },
        durationDays: {
            type: Number,
            required: true,
            min: 1,
        },
        sessions: {
            type: [studySessionSchema],
            default: [],
        },
        totalStudyHours: {
            type: Number,
            default: 0,
        },
        weakSubjects: [
            {
                type: String,
                trim: true,
            },
        ],
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Paused"],
            default: "Active",
        },
        generatedBy: {
            type: String,
            enum: ["algorithm", "ml", "manual"],
            default: "algorithm",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Middleware: Calculate end date before saving
 */
studyPlanSchema.pre("save", function (next) {
    if (this.startDate && this.durationDays) {
        const end = new Date(this.startDate);
        end.setDate(end.getDate() + this.durationDays - 1);
        this.endDate = end;
    }
    next();
});

/**
 * Middleware: Calculate total study hours before saving
 */
studyPlanSchema.pre("save", function (next) {
    if (this.sessions && this.sessions.length > 0) {
        this.totalStudyHours = this.sessions.reduce(
            (total, session) => total + (session.durationHours || 0),
            0
        );
    }
    next();
});

/**
 * Ensure one study plan per user per company
 */
studyPlanSchema.index({ user: 1, company: 1 }, { unique: true });

/**
 * Export StudyPlan Model
 */
const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;