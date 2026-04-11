import Resource from "../models/Resource.js";
import { getRecommendations } from "./mlService.js";

/**
 * LearnPath - Recommendation Service
 * -----------------------------------
 * Provides study material recommendations using:
 * 1. Machine Learning (Primary Method)
 * 2. Database-Based Filtering (Fallback Method)
 */

/**
 * Fetch recommendations using the ML microservice.
 * Falls back to database recommendations if the ML service is unavailable.
 *
 * @param {Array} subjects - List of subjects for recommendation
 * @param {String} company - Optional company filter
 * @returns {Array} Recommended resources
 */
export const fetchRecommendations = async (subjects, company = null) => {
    try {
        if (!subjects || subjects.length === 0) {
            return [];
        }

        // Attempt to fetch recommendations from ML service
        const mlResponse = await getRecommendations(subjects);

        if (
            mlResponse &&
            mlResponse.recommendations &&
            mlResponse.recommendations.length > 0
        ) {
            return mlResponse.recommendations;
        }

        // Fallback to database recommendations
        return await getFallbackRecommendations(subjects, company);
    } catch (error) {
        console.error("❌ Recommendation Service Error:", error.message);
        return await getFallbackRecommendations(subjects, company);
    }
};

/**
 * Fallback Recommendation Method
 * Retrieves resources directly from the database.
 *
 * @param {Array} subjects - List of subjects
 * @param {String} company - Optional company filter
 * @returns {Array} Recommended resources
 */
export const getFallbackRecommendations = async (
    subjects,
    company = null
) => {
    try {
        const query = {
            subject: { $in: subjects },
            isActive: true,
        };

        // Filter by company if provided
        if (company) {
            query.$or = [
                { companies: { $in: [company] } },
                { companies: { $size: 0 } } // General resources
            ];
        }

        const resources = await Resource.find(query)
            .sort({ rating: -1 })
            .limit(20);

        return resources;
    } catch (error) {
        console.error(
            "❌ Fallback Recommendation Error:",
            error.message
        );
        return [];
    }
};

/**
 * Recommend resources based on weak subjects identified from quiz results.
 *
 * @param {Array} weakSubjects - Subjects where the user needs improvement
 * @param {String} company - Selected company
 * @returns {Array} Recommended resources
 */
export const recommendResourcesByWeakAreas = async (
    weakSubjects,
    company
) => {
    if (!weakSubjects || weakSubjects.length === 0) {
        return [];
    }

    return await fetchRecommendations(weakSubjects, company);
};

/**
 * Recommend resources based on a learning path.
 *
 * @param {Array} learningPath - Ordered list of subjects
 * @param {String} company - Selected company
 * @returns {Array} Recommended resources
 */
export const recommendResourcesByLearningPath = async (
    learningPath,
    company
) => {
    if (!learningPath || learningPath.length === 0) {
        return [];
    }

    return await fetchRecommendations(learningPath, company);
};