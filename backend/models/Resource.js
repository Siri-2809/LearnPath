import mongoose from "mongoose";

/**
 * Resource Schema for LearnPath
 * Stores learning resources such as videos, articles, and courses.
 * These resources are recommended in learning paths and study plans.
 */

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Resource title is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        url: {
            type: String,
            required: [true, "Resource URL is required"],
            trim: true,
            match: [
                /^(https?:\/\/)[^\s$.?#].[^\s]*$/,
                "Please enter a valid URL",
            ],
        },

        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },

        topic: {
            type: String,
            default: "",
            trim: true,
        },

        type: {
            type: String,
            enum: ["Article", "Video", "Course", "Book", "Documentation"],
            default: "Article",
        },

        difficultyLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },

        platform: {
            type: String,
            default: "",
            trim: true,
        },

        duration: {
            type: String,
            default: "", // Example: "2 hours", "45 minutes"
            trim: true,
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },

        companies: [
            {
                type: String,
                trim: true,
            },
        ],

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes to optimize search and recommendations
 */
resourceSchema.index({ subject: 1 });
resourceSchema.index({ topic: 1 });
resourceSchema.index({ companies: 1 });
resourceSchema.index({ difficultyLevel: 1 });

/**
 * Export Resource Model
 */
const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;