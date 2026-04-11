import Resource from "../models/Resource.js";

/**
 * @desc    Get all resources
 * @route   GET /api/resources
 * @access  Public
 */
export const getAllResources = async (req, res) => {
    try {
        const { subject, difficultyLevel, type, company, search } = req.query;

        const query = { isActive: true };

        // Filter by subject
        if (subject) {
            query.subject = subject;
        }

        // Filter by difficulty level
        if (difficultyLevel) {
            query.difficultyLevel = difficultyLevel;
        }

        // Filter by resource type
        if (type) {
            query.type = type;
        }

        // Filter by company relevance
        if (company) {
            query.$or = [
                { companies: { $in: [company] } },
                { companies: { $exists: false } },
                { companies: { $size: 0 } }
            ];
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const resources = await Resource.find(query).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching resources: ${error.message}`,
        });
    }
};

/**
 * @desc    Get resource by ID
 * @route   GET /api/resources/:id
 * @access  Public
 */
export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found.",
            });
        }

        res.status(200).json({
            success: true,
            resource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching resource: ${error.message}`,
        });
    }
};

/**
 * @desc    Get resources by subject
 * @route   GET /api/resources/subject/:subject
 * @access  Public
 */
export const getResourcesBySubject = async (req, res) => {
    try {
        const { subject } = req.params;

        const resources = await Resource.find({
            subject,
            isActive: true,
        }).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching resources by subject: ${error.message}`,
        });
    }
};

/**
 * @desc    Create a new resource
 * @route   POST /api/resources
 * @access  Private/Admin
 */
export const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);

        res.status(201).json({
            success: true,
            message: "Resource created successfully.",
            resource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error creating resource: ${error.message}`,
        });
    }
};

/**
 * @desc    Update a resource
 * @route   PUT /api/resources/:id
 * @access  Private/Admin
 */
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found.",
            });
        }

        const updatedResource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Resource updated successfully.",
            resource: updatedResource,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating resource: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private/Admin
 */
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found.",
            });
        }

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting resource: ${error.message}`,
        });
    }
};