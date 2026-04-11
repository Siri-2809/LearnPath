import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Schema for LearnPath
 * Stores authentication details and user preferences.
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false, // Prevents password from being returned in queries
        },
        targetCompany: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Middleware: Hash password before saving
 */
userSchema.pre("save", async function (next) {
    // Only hash if password is modified
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Method: Compare entered password with hashed password
 * @param {string} enteredPassword
 * @returns {boolean}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Export User Model
 */
const User = mongoose.model("User", userSchema);

export default User;