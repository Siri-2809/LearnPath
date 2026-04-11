import express from "express";
import {
    getCompanies,
    getCompanyByName,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../controllers/companyController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/companies
 * @desc    Get all companies
 * @access  Public
 */
router.get("/", getCompanies);

/**
 * @route   GET /api/companies/:name
 * @desc    Get a company by name
 * @access  Public
 */
router.get("/:name", getCompanyByName);

/**
 * @route   POST /api/companies
 * @desc    Create a new company
 * @access  Private/Admin
 */
router.post("/", protect, admin, createCompany);

/**
 * @route   PUT /api/companies/:id
 * @desc    Update a company
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, updateCompany);

/**
 * @route   DELETE /api/companies/:id
 * @desc    Delete a company
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteCompany);

export default router;