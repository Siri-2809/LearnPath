import express from "express";
import {
    generatePath,
    getPathByCompany,
    getMyLearningPaths,
    updateProgress,
    deletePath,
} from "../controllers/learningPathController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/learning-path/:company
 * @desc    Generate a learning path for a selected company
 * @access  Private
 */
router.post("/:company", protect, generatePath);

/**
 * @route   GET /api/learning-path
 * @desc    Get all learning paths for the logged-in user
 * @access  Private
 */
router.get("/", protect, getMyLearningPaths);

/**
 * @route   GET /api/learning-path/:company
 * @desc    Get learning path for a specific company
 * @access  Private
 */
router.get("/:company", protect, getPathByCompany);

/**
 * @route   PUT /api/learning-path/:id/progress
 * @desc    Update learning path progress
 * @access  Private
 */
router.put("/:id/progress", protect, updateProgress);

/**
 * @route   DELETE /api/learning-path/:id
 * @desc    Delete a learning path
 * @access  Private
 */
router.delete("/:id", protect, deletePath);

export default router;