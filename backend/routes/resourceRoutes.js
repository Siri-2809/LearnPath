import express from "express";
import {
    getAllResources,
    getResourceById,
    getResourcesBySubject,
    createResource,
    updateResource,
    deleteResource,
} from "../controllers/resourceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/resources
 * @desc    Get all resources (with optional filters)
 * @access  Public
 */
router.get("/", getAllResources);

/**
 * @route   GET /api/resources/subject/:subject
 * @desc    Get resources by subject
 * @access  Public
 */
router.get("/subject/:subject", getResourcesBySubject);

/**
 * @route   GET /api/resources/:id
 * @desc    Get a single resource by ID
 * @access  Public
 */
router.get("/:id", getResourceById);

/**
 * @route   POST /api/resources
 * @desc    Create a new resource
 * @access  Private/Admin
 */
router.post("/", protect, admin, createResource);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update a resource
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, updateResource);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteResource);

export default router;