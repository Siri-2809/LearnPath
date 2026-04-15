import LearningPath from "../models/LearningPath.js";
import Subject from "../models/Subject.js";
import Company from "../models/Company.js";
import Resource from "../models/Resource.js";
import QuizResult from "../models/QuizResult.js";
import topologicalSort from "../algorithms/topologicalSort.js";

/**
 * LearnPath - Learning Path Service
 * ---------------------------------
 * Generates and manages personalized learning paths
 * based on company requirements and subject prerequisites.
 */

/**
 * Generate a learning path for a user based on the selected company.
 *
 * @param {String} userId
 * @param {String} companyName
 * @returns {Object} Generated Learning Path
 */
export const generateLearningPath = async (userId, companyName) => {
    try {
        if (!userId || !companyName) {
            throw new Error("User ID and Company Name are required.");
        }

        // Check if the company exists
        const company = await Company.findOne({ name: companyName });
        if (!company) {
            throw new Error("Selected company not found.");
        }

        // Fetch all subjects
        const allSubjects = await Subject.find({ isActive: true }).lean();
        if (!allSubjects.length) {
            throw new Error("No subjects available to generate a learning path.");
        }

        // Get subjects required for the company
        const companySubjects = company.subjects;

        // Use latest quiz score profile to prioritize weak subjects.
        const latestQuizResult = await QuizResult.findOne({
            user: userId,
            company: companyName,
        })
            .sort({ createdAt: -1 })
            .select("weakSubjects strongSubjects subjectWiseScores");

        const subjectScoreMap = new Map();
        (latestQuizResult?.subjectWiseScores || []).forEach((item) => {
            subjectScoreMap.set(item.subject, Number(item.percentage || 0));
        });

        const weakSubjectsSet = new Set(latestQuizResult?.weakSubjects || []);
        const strongSubjectsSet = new Set(latestQuizResult?.strongSubjects || []);

        const getSubjectWeight = (subjectName) => {
            const score = subjectScoreMap.has(subjectName)
                ? subjectScoreMap.get(subjectName)
                : null;

            let weight = score === null
                ? 1
                : 0.6 + ((100 - score) / 100) * 1.4;

            if (weakSubjectsSet.has(subjectName)) {
                weight += 0.25;
            }

            if (strongSubjectsSet.has(subjectName) && !weakSubjectsSet.has(subjectName)) {
                weight -= 0.15;
            }

            return Math.min(2, Math.max(0.5, Number(weight.toFixed(2))));
        };

        const subjectWeights = new Map(
            allSubjects.map((subject) => [subject.name, getSubjectWeight(subject.name)])
        );

        // Reorder subjects before topological sort so weak subjects get higher
        // priority whenever multiple nodes are available at the same dependency level.
        const prioritizedSubjects = [...allSubjects].sort(
            (a, b) => (subjectWeights.get(b.name) || 1) - (subjectWeights.get(a.name) || 1)
        );

        // Generate ordered learning path using topological sort
        const orderedSubjects = topologicalSort(
            prioritizedSubjects,
            companySubjects
        );

        // Build detailed learning path with resources
        let totalEstimatedHours = 0;

        const path = await Promise.all(
            orderedSubjects.map(async (subjectName, index) => {
                const subjectDetails = allSubjects.find(
                    (sub) => sub.name === subjectName
                );

                const baseEstimatedHours = subjectDetails?.estimatedHours || 0;
                const weight = subjectWeights.get(subjectName) || 1;
                const estimatedHours = Number(
                    Math.max(1, (baseEstimatedHours * weight)).toFixed(1)
                );
                totalEstimatedHours += estimatedHours;

                // Fetch relevant resources
                const resources = await Resource.find({
                    subject: subjectName,
                    isActive: true,
                    $or: [
                        { companies: { $in: [companyName] } },
                        { companies: { $size: 0 } }
                    ]
                })
                    .limit(3)
                    .select("_id");

                return {
                    subject: subjectName,
                    order: index + 1,
                    estimatedHours,
                    resources: resources.map((res) => res._id),
                };
            })
        );

        // Check if a learning path already exists
        let learningPath = await LearningPath.findOne({
            user: userId,
            company: companyName,
        });

        if (learningPath) {
            // Update existing learning path
            learningPath.subjects = orderedSubjects;
            learningPath.path = path;
            learningPath.totalEstimatedHours = totalEstimatedHours;
            learningPath.generatedBy = "algorithm";
            learningPath.generatedAt = new Date();

            await learningPath.save();
        } else {
            // Create a new learning path
            learningPath = await LearningPath.create({
                user: userId,
                company: companyName,
                subjects: orderedSubjects,
                path,
                totalEstimatedHours,
                generatedBy: "algorithm",
            });
        }

        return learningPath;
    } catch (error) {
        throw new Error(
            `Learning Path Generation Error: ${error.message}`
        );
    }
};

/**
 * Retrieve a user's learning path for a specific company.
 *
 * @param {String} userId
 * @param {String} companyName
 * @returns {Object|null}
 */
export const getLearningPath = async (userId, companyName) => {
    try {
        return await LearningPath.findOne({
            user: userId,
            company: companyName,
        })
            .populate("path.resources")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(
            `Error fetching learning path: ${error.message}`
        );
    }
};

/**
 * Update progress of a learning path.
 *
 * @param {String} learningPathId
 * @param {Number} progress
 * @returns {Object}
 */
export const updateLearningPathProgress = async (
    learningPathId,
    progress
) => {
    try {
        if (progress < 0 || progress > 100) {
            throw new Error("Progress must be between 0 and 100.");
        }

        const learningPath = await LearningPath.findById(learningPathId);
        if (!learningPath) {
            throw new Error("Learning path not found.");
        }

        learningPath.progress = progress;

        if (progress === 100) {
            learningPath.isCompleted = true;
        }

        await learningPath.save();
        return learningPath;
    } catch (error) {
        throw new Error(
            `Error updating learning path progress: ${error.message}`
        );
    }
};

/**
 * Retrieve all learning paths for a user.
 *
 * @param {String} userId
 * @returns {Array}
 */
export const getUserLearningPaths = async (userId) => {
    try {
        return await LearningPath.find({ user: userId })
            .populate("path.resources")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(
            `Error fetching user learning paths: ${error.message}`
        );
    }
};

/**
 * Delete a learning path.
 *
 * @param {String} learningPathId
 * @returns {Object}
 */
export const deleteLearningPath = async (learningPathId) => {
    try {
        const learningPath = await LearningPath.findById(
            learningPathId
        );

        if (!learningPath) {
            throw new Error("Learning path not found.");
        }

        await learningPath.deleteOne();
        return { message: "Learning path deleted successfully." };
    } catch (error) {
        throw new Error(
            `Error deleting learning path: ${error.message}`
        );
    }
};