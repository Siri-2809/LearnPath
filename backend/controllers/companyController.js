import Company from "../models/Company.js";

/**
 * @desc    Get all companies
 * @route   GET /api/companies
 * @access  Public
 */
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ isActive: true }).sort({
            name: 1,
        });

        res.status(200).json({
            success: true,
            count: companies.length,
            companies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching companies: ${error.message}`,
        });
    }
};

/**
 * @desc    Get a single company by name
 * @route   GET /api/companies/:name
 * @access  Public
 */
export const getCompanyByName = async (req, res) => {
    try {
        const { name } = req.params;

        const company = await Company.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            isActive: true,
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found.",
            });
        }

        res.status(200).json({
            success: true,
            company,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching company: ${error.message}`,
        });
    }
};

/**
 * @desc    Create a new company
 * @route   POST /api/companies
 * @access  Private/Admin
 */
export const createCompany = async (req, res) => {
    try {
        const {
            name,
            description,
            subjects,
            difficultyLevel,
            averagePackage,
            logo,
            website,
            hiringProcess,
            isActive,
        } = req.body;

        if (!name || !subjects || subjects.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Company name and subjects are required.",
            });
        }

        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "Company already exists.",
            });
        }

        const company = await Company.create({
            name,
            description,
            subjects,
            difficultyLevel,
            averagePackage,
            logo,
            website,
            hiringProcess,
            isActive,
        });

        res.status(201).json({
            success: true,
            message: "Company created successfully.",
            company,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error creating company: ${error.message}`,
        });
    }
};

/**
 * @desc    Update an existing company
 * @route   PUT /api/companies/:id
 * @access  Private/Admin
 */
export const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found.",
            });
        }

        const {
            name,
            description,
            subjects,
            difficultyLevel,
            averagePackage,
            logo,
            website,
            hiringProcess,
            isActive,
        } = req.body;

        company.name = name || company.name;
        company.description = description || company.description;
        company.subjects = subjects || company.subjects;
        company.difficultyLevel =
            difficultyLevel || company.difficultyLevel;
        company.averagePackage =
            averagePackage ?? company.averagePackage;
        company.logo = logo || company.logo;
        company.website = website || company.website;
        company.hiringProcess =
            hiringProcess || company.hiringProcess;
        company.isActive =
            isActive !== undefined ? isActive : company.isActive;

        const updatedCompany = await company.save();

        res.status(200).json({
            success: true,
            message: "Company updated successfully.",
            company: updatedCompany,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating company: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete a company
 * @route   DELETE /api/companies/:id
 * @access  Private/Admin
 */
export const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found.",
            });
        }

        await company.deleteOne();

        res.status(200).json({
            success: true,
            message: "Company deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting company: ${error.message}`,
        });
    }
};