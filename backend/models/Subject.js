import mongoose from "mongoose";

/**
 * Subject Schema for LearnPath
 * Defines subjects, topics, and their prerequisite relationships.
 * Used for generating structured learning paths using topological sorting.
 */
const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subject name is required"],
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        prerequisites: [
            {
                type: String,
                default: [],
            },
        ],
        topics: [
            {
                type: String,
                trim: true,
            },
        ],
        difficultyLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        estimatedHours: {
            type: Number,
            default: 10,
            min: 1,
        },
        category: {
            type: String,
            enum: [
                "Programming",
                "Data Structures",
                "Algorithms",
                "Database",
                "Operating Systems",
                "Computer Networks",
                "Aptitude",
                "System Design",
                "Object-Oriented Programming",
                "Miscellaneous",
            ],
            default: "Miscellaneous",
        },
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
 * Export Subject Model
 */
const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;