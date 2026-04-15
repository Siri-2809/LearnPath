import StudyPlan from "../models/StudyPlan.js";
import LearningPath from "../models/LearningPath.js";
import Resource from "../models/Resource.js";
import Subject from "../models/Subject.js";
import QuizResult from "../models/QuizResult.js";

/**
 * LearnPath - Study Plan Service
 * --------------------------------
 * Generates and manages personalized study plans based on:
 * - Learning Paths
 * - Weak Subjects
 * - Available Duration
 */

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Generate a personalized study plan.
 *
 * @param {String} userId
 * @param {String} company
 * @param {Number} durationDays - Optional. If not provided, calculates based on total topics
 * @param {Array} weakSubjects
 * @returns {Object} Study Plan
 */
export const generateStudyPlan = async (
    userId,
    company,
    durationDays = null,
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

        // Use latest quiz result as source of skill-gap severity for personalization.
        const latestQuizResult = await QuizResult.findOne({
            user: userId,
            company,
        })
            .sort({ createdAt: -1 })
            .select("weakSubjects strongSubjects subjectWiseScores");

        const detectedWeakSubjects =
            weakSubjects && weakSubjects.length > 0
                ? weakSubjects
                : latestQuizResult?.weakSubjects || [];

        const subjectScoreMap = new Map();
        (latestQuizResult?.subjectWiseScores || []).forEach((item) => {
            subjectScoreMap.set(item.subject, Number(item.percentage || 0));
        });

        const strongSubjectsSet = new Set(latestQuizResult?.strongSubjects || []);
        const weakSubjectsSet = new Set(detectedWeakSubjects || []);

        let subjects = [...new Set(learningPath.subjects || [])];

        const subjectWeightMap = new Map();
        subjects.forEach((subject) => {
            const score = subjectScoreMap.has(subject)
                ? subjectScoreMap.get(subject)
                : null;

            // Lower score -> higher weight (more time), higher score -> lower weight.
            let weight = score === null
                ? 1
                : 0.6 + ((100 - score) / 100) * 1.4;

            if (weakSubjectsSet.has(subject)) {
                weight += 0.25;
            }

            if (strongSubjectsSet.has(subject) && !weakSubjectsSet.has(subject)) {
                weight -= 0.15;
            }

            subjectWeightMap.set(subject, clamp(Number(weight.toFixed(2)), 0.5, 2));
        });

        // Sort subjects by computed weakness so weaker topics appear earlier.
        subjects.sort(
            (a, b) => (subjectWeightMap.get(b) || 1) - (subjectWeightMap.get(a) || 1)
        );

        // Pre-fetch subject data and resources for each subject
        const subjectResourcesMap = {};
        const subjectTopicsMap = {};

        for (const subjectName of subjects) {
            // Fetch subject data to get topics
            const subjectData = await Subject.findOne({ name: subjectName });
            subjectTopicsMap[subjectName] = subjectData?.topics || [];

            // Fetch resources for this subject
            const resources = await Resource.find({
                subject: subjectName,
                isActive: true,
                $or: [
                    { companies: { $in: [company] } },
                    { companies: { $size: 0 } },
                ],
            }).sort({ rating: -1 });
            subjectResourcesMap[subjectName] = resources;
        }

        // Build a flat topic sequence from prioritized subjects.
        const topicSequence = [];
        for (const subjectName of subjects) {
            const topics = subjectTopicsMap[subjectName] || [];
            if (topics.length > 0) {
                for (const topic of topics) {
                    topicSequence.push({
                        subject: subjectName,
                        topic,
                    });
                }
            }
        }

        if (!durationDays || durationDays < 1) {
            durationDays = Math.max(topicSequence.length, 1);
        }

        // Distribute all topics across user-selected days.
        // When topics > days, multiple topics fall on same day.
        // When days > topics, remaining days are filled with revision sessions.
        const schedule = [];

        if (topicSequence.length > 0) {
            topicSequence.forEach((item, index) => {
                const day = Math.min(
                    durationDays,
                    Math.floor((index * durationDays) / topicSequence.length) + 1
                );

                schedule.push({
                    day,
                    subject: item.subject,
                    topic: item.topic,
                });
            });
        }

        // Ensure all selected days exist in the plan.
        for (let day = 1; day <= durationDays; day++) {
            const hasSessionForDay = schedule.some((session) => session.day === day);
            if (!hasSessionForDay) {
                const fallbackSubject =
                    subjects.length > 0
                        ? subjects[(day - 1) % subjects.length]
                        : "General";
                schedule.push({
                    day,
                    subject: fallbackSubject,
                    topic: "Targeted revision and practice",
                });
            }
        }

        schedule.sort((a, b) => a.day - b.day);

        const sessions = [];
        let currentDate = new Date();
        let totalStudyHours = 0;

        // Group scheduled topics by day and create one session per day.
        const dayBuckets = new Map();
        schedule.forEach((item) => {
            if (!dayBuckets.has(item.day)) {
                dayBuckets.set(item.day, []);
            }
            dayBuckets.get(item.day).push(item);
        });

        for (let day = 1; day <= durationDays; day++) {
            const dayItems = dayBuckets.get(day) || [];

            const primarySubject = dayItems[0]?.subject || subjects[(day - 1) % subjects.length] || "General";
            const topicsForDay = dayItems.map((item) => item.topic).filter(Boolean);

            const topicText = topicsForDay.length > 0
                ? topicsForDay.join(", ")
                : "Revision and practice";

            const resources = subjectResourcesMap[primarySubject] || [];
            let resource = null;
            if (resources.length > 0) {
                resource = resources[0];
            }

            const averageDayWeight = dayItems.length > 0
                ? dayItems.reduce(
                    (sum, item) => sum + (subjectWeightMap.get(item.subject) || 1),
                    0
                ) / dayItems.length
                : (subjectWeightMap.get(primarySubject) || 1);

            const durationHours = clamp(
                Number((1 + averageDayWeight * 1.2 + Math.max(0, dayItems.length - 1) * 0.4).toFixed(1)),
                1,
                5
            );

            totalStudyHours += durationHours;

            sessions.push({
                day,
                date: new Date(currentDate),
                subject: primarySubject,
                topic: topicText,
                resource: resource?._id || null,
                durationHours,
                status: "Pending",
            });

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
            studyPlan.weakSubjects = detectedWeakSubjects;
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
                weakSubjects: detectedWeakSubjects,
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