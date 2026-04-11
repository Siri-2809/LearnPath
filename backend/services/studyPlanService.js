import StudyPlan from "../models/StudyPlan.js";
import LearningPath from "../models/LearningPath.js";
import Resource from "../models/Resource.js";

/**
 * LearnPath - Study Plan Service
 * --------------------------------
 * Generates and manages personalized study plans based on:
 * - Learning Paths
 * - Weak Subjects
 * - Available Duration
 */

/**
 * Helper function to distribute subjects across days.
 */
const distributeSubjects = (subjects, durationDays) => {
    const schedule = [];
    let day = 1;
    let index = 0;

    while (day <= durationDays) {
        schedule.push({
            day,
            subject: subjects[index % subjects.length],
        });
        index++;
        day++;
    }

    return schedule;
};

/**
 * Generate a personalized study plan.
 *
 * @param {String} userId
 * @param {String} company
 * @param {Number} durationDays
 * @param {Array} weakSubjects
 * @returns {Object} Study Plan
 */
export const generateStudyPlan = async (
    userId,
    company,
    durationDays = 30,
    weakSubjects = []
) => {
    try {
        if (!userId || !company) {
            throw new Error("User ID and Company are required.");
        }

        // Fetch learning path
        const learningPath = await LearningPath.findOne({
            user: userId,
            company,
        }).populate("path.resources");

        if (!learningPath) {
            throw new Error(
                "Learning path not found. Generate a learning path first."
            );
        }

        // Prioritize weak subjects if available
        let subjects = learningPath.subjects;
        if (weakSubjects && weakSubjects.length > 0) {
            const prioritized = [
                ...weakSubjects,
                ...subjects.filter((sub) => !weakSubjects.includes(sub)),
            ];
            subjects = [...new Set(prioritized)];
        }

        // Distribute subjects across days
        const schedule = distributeSubjects(subjects, durationDays);

        const sessions = [];
        let currentDate = new Date();
        let totalStudyHours = 0;

        for (const item of schedule) {
            const subject = item.subject;

            // Fetch best resource for the subject
            const resource = await Resource.findOne({
                subject,
                isActive: true,
                $or: [
                    { companies: { $in: [company] } },
                    { companies: { $size: 0 } },
                ],
            }).sort({ rating: -1 });

            const durationHours = 2;
            totalStudyHours += durationHours;

            sessions.push({
                day: item.day,
                date: new Date(currentDate),
                subject,
                topic: resource?.topic || "General Concepts",
                resource: resource?._id || null,
                durationHours,
                status: "Pending",
            });

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Check if a study plan already exists
        let studyPlan = await StudyPlan.findOne({
            user: userId,
            company,
        });

        if (studyPlan) {
            studyPlan.learningPath = learningPath._id;
            studyPlan.durationDays = durationDays;
            studyPlan.sessions = sessions;
            studyPlan.totalStudyHours = totalStudyHours;
            studyPlan.weakSubjects = weakSubjects;
            studyPlan.startDate = new Date();
            studyPlan.status = "Active";
            studyPlan.generatedBy = "algorithm";

            await studyPlan.save();
        } else {
            studyPlan = await StudyPlan.create({
                user: userId,
                company,
                learningPath: learningPath._id,
                durationDays,
                sessions,
                totalStudyHours,
                weakSubjects,
                startDate: new Date(),
                status: "Active",
                generatedBy: "algorithm",
            });
        }

        return studyPlan;
    } catch (error) {
        throw new Error(`Study Plan Generation Error: ${error.message}`);
    }
};

/**
 * Retrieve a study plan for a user and company.
 *
 * @param {String} userId
 * @param {String} company
 * @returns {Object}
 */
export const getStudyPlan = async (userId, company) => {
    try {
        return await StudyPlan.findOne({
            user: userId,
            company,
        })
            .populate("learningPath")
            .populate("sessions.resource")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(`Error fetching study plan: ${error.message}`);
    }
};

/**
 * Retrieve all study plans for a user.
 *
 * @param {String} userId
 * @returns {Array}
 */
export const getUserStudyPlans = async (userId) => {
    try {
        return await StudyPlan.find({ user: userId })
            .populate("learningPath")
            .populate("sessions.resource")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(
            `Error fetching user study plans: ${error.message}`
        );
    }
};

/**
 * Update the status of a study session.
 *
 * @param {String} studyPlanId
 * @param {Number} day
 * @param {String} status
 * @returns {Object}
 */
export const updateStudySessionStatus = async (
    studyPlanId,
    day,
    status
) => {
    try {
        const validStatuses = ["Pending", "In Progress", "Completed"];

        if (!validStatuses.includes(status)) {
            throw new Error("Invalid session status.");
        }

        const studyPlan = await StudyPlan.findById(studyPlanId);
        if (!studyPlan) {
            throw new Error("Study plan not found.");
        }

        const session = studyPlan.sessions.find(
            (s) => s.day === day
        );

        if (!session) {
            throw new Error("Study session not found.");
        }

        session.status = status;

        // Calculate progress
        const completedSessions = studyPlan.sessions.filter(
            (s) => s.status === "Completed"
        ).length;

        const progress =
            (completedSessions / studyPlan.sessions.length) * 100;

        if (progress === 100) {
            studyPlan.status = "Completed";
        }

        await studyPlan.save();
        return studyPlan;
    } catch (error) {
        throw new Error(
            `Error updating study session: ${error.message}`
        );
    }
};

/**
 * Delete a study plan.
 *
 * @param {String} studyPlanId
 * @returns {Object}
 */
export const deleteStudyPlan = async (studyPlanId) => {
    try {
        const studyPlan = await StudyPlan.findById(studyPlanId);

        if (!studyPlan) {
            throw new Error("Study plan not found.");
        }

        await studyPlan.deleteOne();
        return { message: "Study plan deleted successfully." };
    } catch (error) {
        throw new Error(
            `Error deleting study plan: ${error.message}`
        );
    }
};