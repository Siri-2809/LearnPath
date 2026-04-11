import cron from "node-cron";
import StudyPlan from "../models/StudyPlan.js";

/**
 * LearnPath Scheduler Utility
 * Handles automated background tasks such as updating study plan statuses.
 */

/**
 * Updates the status of study plans based on completion and end dates.
 */
const updateStudyPlanStatuses = async () => {
    try {
        const now = new Date();

        const studyPlans = await StudyPlan.find({ status: "Active" });

        for (const plan of studyPlans) {
            const allSessionsCompleted =
                plan.sessions.length > 0 &&
                plan.sessions.every((session) => session.status === "Completed");

            const isExpired = plan.endDate && plan.endDate < now;

            if (allSessionsCompleted || isExpired) {
                plan.status = "Completed";
                await plan.save();
            }
        }

        console.log("⏰ Study plan statuses updated successfully.");
    } catch (error) {
        console.error("❌ Scheduler Error:", error.message);
    }
};

/**
 * Initializes all cron jobs for the application.
 */
const initializeSchedulers = () => {
    // Runs every day at midnight (00:00)
    cron.schedule("0 0 * * *", async () => {
        console.log("🔄 Running daily scheduler tasks...");
        await updateStudyPlanStatuses();
    });

    console.log("✅ Scheduler initialized: Daily Study Plan Updater");
};

export default initializeSchedulers;