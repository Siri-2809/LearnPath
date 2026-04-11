import mongoose from "mongoose";

/**
 * Question Schema for LearnPath
 * Stores quiz questions mapped to subjects and companies.
 * Used for generating company-specific quizzes.
 */

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question text is required"],
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (options) {
                    return options.length === 4;
                },
                message: "A question must have exactly four options.",
            },
        },

        correctAnswer: {
            type: String,
            required: [true, "Correct answer is required"],
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

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },

        companies: [
            {
                type: String,
                required: true,
                trim: true,
            },
        ],

        marks: {
            type: Number,
            default: 1,
            min: 1,
        },

        explanation: {
            type: String,
            default: "",
            trim: true,
        },

        testType: {
            type: String,
            enum: ["diagnostic", "mock"],
            required: true,
            default: "diagnostic",
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
 * Ensure the correct answer exists within the provided options.
 */
questionSchema.pre("validate", function (next) {
    if (this.correctAnswer && !this.options.includes(this.correctAnswer)) {
        next(new Error("Correct answer must be one of the provided options."));
    } else {
        next();
    }
});

/**
 * Export Question Model
 */
const Question = mongoose.model("Question", questionSchema);

export default Question;