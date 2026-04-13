import {
    generateQuiz,
    submitQuiz,
    getUserQuizResults,
    getLatestQuizResult,
} from "../services/quizService.js";
import StudyPlan from "../models/StudyPlan.js";
/**
 * @desc    Generate a company-specific quiz
 * @route   GET /api/quiz/:company
 * @access  Private
 */
export const generateCompanyQuiz = async (req, res) => {
    try {
        const { company } = req.params;
        const { testType = "diagnostic", limit } = req.query
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company name is required.",
            });
        }

        // Restrict mock tests until preparation is completed
        if (testType === "mock") {
            const completedPlan = await StudyPlan.findOne({
                user: req.user._id,
                company,
                status: "Completed",
            });

            if (!completedPlan) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Complete your study plan before attempting the mock test.",
                });
            }
        }
        
        // Parse limit: if not provided, use null to return ALL questions
        const questionLimit = limit ? parseInt(limit) : null;
        const questions = await generateQuiz(company, questionLimit, testType);

        res.status(200).json({
            success: true,
            company,
            testType,
            totalQuestions: questions.length,
            questions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error generating quiz: ${error.message}`,
        });
    }
};

/**
 * @desc    Submit quiz answers and store results
 * @route   POST /api/quiz/submit
 * @access  Private
 */
export const submitCompanyQuiz = async (req, res) => {
    try {
        const { company, answers, timeTaken, testType } = req.body;

        if (!company || !answers || !Array.isArray(answers) || !testType) {
            return res.status(400).json({
                success: false,
                message: "Company and answers are required.",
            });
        }

        const result = await submitQuiz({
            userId: req.user._id,
            company,
            answers,
            timeTaken,
            testType,
        });

        res.status(201).json({
            success: true,
            message: "Quiz submitted successfully.",
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error submitting quiz: ${error.message}`,
        });
    }
};

/**
 * @desc    Get all quiz results for the logged-in user
 * @route   GET /api/quiz/results
 * @access  Private
 */
export const getMyQuizResults = async (req, res) => {
    try {
        const results = await getUserQuizResults(req.user._id);

        res.status(200).json({
            success: true,
            count: results.length,
            results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching quiz results: ${error.message}`,
        });
    }
};

/**
 * @desc    Get quiz results by company
 * @route   GET /api/quiz/results/:company
 * @access  Private
 */
export const getQuizResultsByCompany = async (req, res) => {
    try {
        const { company } = req.params;

        const results = await getUserQuizResults(
            req.user._id,
            company
        );

        res.status(200).json({
            success: true,
            company,
            count: results.length,
            results,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching company quiz results: ${error.message}`,
        });
    }
};

/**
 * @desc    Get latest quiz result for a specific company
 * @route   GET /api/quiz/latest/:company
 * @access  Private
 */
export const getLatestResult = async (req, res) => {
    try {
        const { company } = req.params;

        const result = await getLatestQuizResult(
            req.user._id,
            company
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No quiz results found for this company.",
            });
        }

        res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching latest quiz result: ${error.message}`,
        });
    }
};

/**
 * @desc    Get a specific quiz result by ID
 * @route   GET /api/quiz/result/:id
 * @access  Private
 */
export const getQuizResultById = async (req, res) => {
    try {
        const results = await getUserQuizResults(req.user._id);
        const result = results.find(
            (r) => r._id.toString() === req.params.id
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Quiz result not found.",
            });
        }

        res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching quiz result: ${error.message}`,
        });
    }
};