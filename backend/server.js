import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Database Connection
import connectDB from "./config/db.js";

// Middleware
import { notFound } from "./middleware/errorMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Scheduler
import initializeSchedulers from "./utils/scheduler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import learningPathRoutes from "./routes/learningPathRoutes.js";
import studyPlanRoutes from "./routes/studyPlanRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// ===============================
// Global Middleware
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logging in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// ===============================
// Health Check Route
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 LearnPath API is running...",
    });
});

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/study-plan", studyPlanRoutes);
app.use("/api/resources", resourceRoutes);

// ===============================
// Error Handling Middleware
// ===============================
app.use(notFound);
app.use(errorHandler);

// ===============================
// Initialize Background Schedulers
// ===============================
initializeSchedulers();

// ===============================
// Server Configuration
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
    );
});