import express from "express";
import {
    generateCompanyQuiz,
    submitCompanyQuiz,
    getMyQuizResults,
    getQuizResultsByCompany,
    getLatestResult,
    getQuizResultById,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/quiz/submit
 * @desc    Submit quiz answers
 * @access  Private
 */
router.post("/submit", protect, submitCompanyQuiz);

/**
 * @route   GET /api/quiz/results
 * @desc    Get all quiz results of logged-in user
 * @access  Private
 */
router.get("/results", protect, getMyQuizResults);

/**
 * @route   GET /api/quiz/results/:company
 * @desc    Get quiz results by company
 * @access  Private
 */
router.get("/results/:company", protect, getQuizResultsByCompany);

/**
 * @route   GET /api/quiz/latest/:company
 * @desc    Get latest quiz result for a specific company
 * @access  Private
 */
router.get("/latest/:company", protect, getLatestResult);

/**
 * @route   GET /api/quiz/result/:id
 * @desc    Get a specific quiz result by ID
 * @access  Private
 */
router.get("/result/:id", protect, getQuizResultById);

/**
 * @route   GET /api/quiz/:company
 * @desc    Generate a company-specific quiz
 * @access  Private
 *
 * NOTE: This dynamic route is placed LAST to avoid conflicts
 * with other routes like /results and /latest.
 */
router.get("/:company", protect, generateCompanyQuiz);

export default router;