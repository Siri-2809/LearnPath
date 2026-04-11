import mongoose from "mongoose";

/**
 * Company Schema for LearnPath
 * Stores information about companies and their required subjects.
 */
const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        subjects: [
            {
                type: String,
                required: true,
            },
        ],
        difficultyLevel: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        averagePackage: {
            type: Number,
            default: 0,
        },
        logo: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },
        hiringProcess: [
            {
                type: String,
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
 * Export Company Model
 */
const Company = mongoose.model("Company", companySchema);

export default Company;