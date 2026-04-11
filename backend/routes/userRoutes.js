import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    updateTargetCompany,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get("/", protect, admin, getAllUsers);

/**
 * @route   GET /api/users/target-company
 * @desc    Get logged-in user's target company
 * @access  Private
 */
router.get("/target-company", protect, (req, res) => {
    res.status(200).json({
        success: true,
        targetCompany: req.user.targetCompany,
    });
});

/**
 * @route   PUT /api/users/target-company
 * @desc    Update logged-in user's target company
 * @access  Private
 */
router.put("/target-company", protect, updateTargetCompany);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get("/:id", protect, admin, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, updateUserRole);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteUser);

export default router;