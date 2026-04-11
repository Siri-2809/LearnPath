import {
    generateLearningPath,
    getLearningPath,
    getUserLearningPaths,
    updateLearningPathProgress,
    deleteLearningPath,
} from "../services/learningPathService.js";

/**
 * @desc    Generate a learning path for a selected company
 * @route   POST /api/learning-path/:company
 * @access  Private
 */
export const generatePath = async (req, res) => {
    try {
        const { company } = req.params;

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required.",
            });
        }

        const learningPath = await generateLearningPath(
            req.user._id,
            company
        );

        res.status(201).json({
            success: true,
            message: "Learning path generated successfully.",
            learningPath,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error generating learning path: ${error.message}`,
        });
    }
};

/**
 * @desc    Get a learning path for a specific company
 * @route   GET /api/learning-path/:company
 * @access  Private
 */
export const getPathByCompany = async (req, res) => {
    try {
        const { company } = req.params;

        const learningPath = await getLearningPath(
            req.user._id,
            company
        );

        if (!learningPath) {
            return res.status(404).json({
                success: false,
                message: "Learning path not found.",
            });
        }

        res.status(200).json({
            success: true,
            learningPath,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching learning path: ${error.message}`,
        });
    }
};

/**
 * @desc    Get all learning paths for the logged-in user
 * @route   GET /api/learning-path
 * @access  Private
 */
export const getMyLearningPaths = async (req, res) => {
    try {
        const learningPaths = await getUserLearningPaths(req.user._id);

        res.status(200).json({
            success: true,
            count: learningPaths.length,
            learningPaths,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching learning paths: ${error.message}`,
        });
    }
};

/**
 * @desc    Update learning path progress
 * @route   PUT /api/learning-path/:id/progress
 * @access  Private
 */
export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        if (progress === undefined) {
            return res.status(400).json({
                success: false,
                message: "Progress value is required.",
            });
        }

        const updatedPath = await updateLearningPathProgress(
            id,
            progress
        );

        res.status(200).json({
            success: true,
            message: "Learning path progress updated successfully.",
            learningPath: updatedPath,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating progress: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete a learning path
 * @route   DELETE /api/learning-path/:id
 * @access  Private
 */
export const deletePath = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await deleteLearningPath(id);

        res.status(200).json({
            success: true,
            message: response.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting learning path: ${error.message}`,
        });
    }
};