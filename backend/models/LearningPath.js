import mongoose from "mongoose";

/**
 * Learning Path Item Schema
 * Represents each step in the learning path.
 */
const learningPathItemSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
        },
        estimatedHours: {
            type: Number,
            default: 0,
        },
        resources: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resource",
            },
        ],
    },
    { _id: false }
);

/**
 * Learning Path Schema for LearnPath
 * Defines the ordered roadmap of subjects tailored to a user
 * based on company requirements and skill gap analysis.
 */
const learningPathSchema = new mongoose.Schema(
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
        subjects: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],
        path: {
            type: [learningPathItemSchema],
            default: [],
        },
        generatedBy: {
            type: String,
            enum: ["algorithm", "ml", "manual"],
            default: "algorithm",
        },
        totalEstimatedHours: {
            type: Number,
            default: 0,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Ensure one learning path per user per company
 */
learningPathSchema.index({ user: 1, company: 1 }, { unique: true });

/**
 * Export Learning Path Model
 */
const LearningPath = mongoose.model(
    "LearningPath",
    learningPathSchema
);

export default LearningPath;