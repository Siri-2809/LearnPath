import express from "express";
import {
    createStudyPlan,
    getStudyPlanByCompany,
    getMyStudyPlans,
    updateSessionStatus,
    removeStudyPlan,
} from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/study-plan
 * @desc    Generate a personalized study plan
 * @access  Private
 */
router.post("/", protect, createStudyPlan);

/**
 * @route   GET /api/study-plan
 * @desc    Get all study plans of the logged-in user
 * @access  Private
 */
router.get("/", protect, getMyStudyPlans);

/**
 * @route   GET /api/study-plan/:company
 * @desc    Get study plan for a specific company
 * @access  Private
 */
router.get("/:company", protect, getStudyPlanByCompany);

/**
 * @route   PUT /api/study-plan/:id/session
 * @desc    Update the status of a study session
 * @access  Private
 */
router.put("/:id/session", protect, updateSessionStatus);

/**
 * @route   DELETE /api/study-plan/:id
 * @desc    Delete a study plan
 * @access  Private
 */
router.delete("/:id", protect, removeStudyPlan);

export default router;