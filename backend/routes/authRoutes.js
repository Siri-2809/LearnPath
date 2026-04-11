import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update logged-in user's profile
 * @access  Private
 */
router.put("/profile", protect, updateUserProfile);

export default router;