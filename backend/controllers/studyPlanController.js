import {
    generateStudyPlan,
    getStudyPlan,
    getUserStudyPlans,
    updateStudySessionStatus,
    deleteStudyPlan,
} from "../services/studyPlanService.js";

/**
 * @desc    Generate a personalized study plan
 * @route   POST /api/study-plan
 * @access  Private
 */
export const createStudyPlan = async (req, res) => {
    try {
        const { company, durationDays, weakSubjects } = req.body;

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required.",
            });
        }

        const studyPlan = await generateStudyPlan(
            req.user._id,
            company,
            durationDays,
            weakSubjects
        );

        res.status(201).json({
            success: true,
            message: "Study plan generated successfully.",
            studyPlan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error generating study plan: ${error.message}`,
        });
    }
};

/**
 * @desc    Get study plan for a specific company
 * @route   GET /api/study-plan/:company
 * @access  Private
 */
export const getStudyPlanByCompany = async (req, res) => {
    try {
        const { company } = req.params;

        const studyPlan = await getStudyPlan(req.user._id, company);

        if (!studyPlan) {
            return res.status(404).json({
                success: false,
                message: "Study plan not found.",
            });
        }

        res.status(200).json({
            success: true,
            studyPlan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching study plan: ${error.message}`,
        });
    }
};

/**
 * @desc    Get all study plans for the logged-in user
 * @route   GET /api/study-plan
 * @access  Private
 */
export const getMyStudyPlans = async (req, res) => {
    try {
        const studyPlans = await getUserStudyPlans(req.user._id);

        res.status(200).json({
            success: true,
            count: studyPlans.length,
            studyPlans,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching study plans: ${error.message}`,
        });
    }
};

/**
 * @desc    Update the status of a study session
 * @route   PUT /api/study-plan/:id/session
 * @access  Private
 */
export const updateSessionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, status } = req.body;

        if (!day || !status) {
            return res.status(400).json({
                success: false,
                message: "Day and status are required.",
            });
        }

        const updatedPlan = await updateStudySessionStatus(
            id,
            day,
            status
        );

        res.status(200).json({
            success: true,
            message: "Study session updated successfully.",
            studyPlan: updatedPlan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating session: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete a study plan
 * @route   DELETE /api/study-plan/:id
 * @access  Private
 */
export const removeStudyPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await deleteStudyPlan(id);

        res.status(200).json({
            success: true,
            message: response.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting study plan: ${error.message}`,
        });
    }
};