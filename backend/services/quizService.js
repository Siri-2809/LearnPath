import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js";

/**
 * LearnPath - Quiz Service
 * ------------------------
 * Handles quiz generation, evaluation, and result storage.
 */

/**
 * Generate a company-specific quiz.
 *
 * @param {string} company - Selected company name
 * @param {number} totalQuestions - Number of questions required
 * @returns {Array} List of quiz questions
 */
export const generateQuiz = async (company, totalQuestions = 15, testType = "diagnostic") => {
    try {
        if (!company) {
            throw new Error("Company name is required to generate a quiz.");
        }

        // Fetch active questions for the selected company
        const questions = await Question.find({
            companies: company,
            testType,
            isActive: true,
        }).select("-correctAnswer");

        if (!questions.length) {
            throw new Error(`No questions found for ${company}.`);
        }

        // Shuffle questions randomly
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());

        // Return the requested number of questions
        return shuffledQuestions.slice(0, totalQuestions);
    } catch (error) {
        throw new Error(`Quiz Generation Error: ${error.message}`);
    }
};

/**
 * Calculate quiz results based on submitted answers.
 *
 * @param {Array} answers - User submitted answers
 * @returns {Object} Evaluation result
 */
export const evaluateQuiz = async (answers = []) => {
    try {
        if (!answers.length) {
            throw new Error("No answers submitted.");
        }

        let score = 0;
        let totalMarks = 0;

        const subjectStats = {};
        const evaluatedAnswers = [];

        for (const ans of answers) {
            const question = await Question.findById(ans.questionId);

            if (!question) continue;

            const isCorrect = question.correctAnswer === ans.selectedAnswer;
            const marksAwarded = isCorrect ? question.marks : 0;

            score += marksAwarded;
            totalMarks += question.marks;

            // Track subject performance
            if (!subjectStats[question.subject]) {
                subjectStats[question.subject] = {
                    correct: 0,
                    total: 0,
                };
            }

            subjectStats[question.subject].total += 1;
            if (isCorrect) {
                subjectStats[question.subject].correct += 1;
            }

            evaluatedAnswers.push({
                question: question._id,
                selectedAnswer: ans.selectedAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                subject: question.subject,
                marksAwarded,
            });
        }

        // Identify weak and strong subjects
        const weakSubjects = [];
        const strongSubjects = [];

        Object.keys(subjectStats).forEach((subject) => {
            const { correct, total } = subjectStats[subject];
            const percentage = (correct / total) * 100;

            if (percentage < 50) {
                weakSubjects.push(subject);
            } else {
                strongSubjects.push(subject);
            }
        });

        const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

        return {
            score,
            totalMarks,
            percentage,
            weakSubjects,
            strongSubjects,
            answers: evaluatedAnswers,
        };
    } catch (error) {
        throw new Error(`Quiz Evaluation Error: ${error.message}`);
    }
};

/**
 * Submit and store quiz results.
 *
 * @param {Object} data - Quiz submission data
 * @returns {Object} Saved quiz result
 */
export const submitQuiz = async (data) => {
    try {
        const { userId, company, answers, timeTaken, testType } = data;

        if (!userId || !company || !answers) {
            throw new Error("Missing required fields for quiz submission.");
        }

        // Evaluate quiz
        const evaluation = await evaluateQuiz(answers);

        // Determine attempt number
        const previousAttempts = await QuizResult.countDocuments({
            user: userId,
            company,
            testType,
        });

        const quizResult = await QuizResult.create({
            user: userId,
            company,
            testType,
            answers: evaluation.answers,
            score: evaluation.score,
            totalMarks: evaluation.totalMarks,
            percentage: evaluation.percentage,
            weakSubjects: evaluation.weakSubjects,
            strongSubjects: evaluation.strongSubjects,
            timeTaken: timeTaken || 0,
            attemptNumber: previousAttempts + 1,
        });

        return quizResult;
    } catch (error) {
        throw new Error(`Quiz Submission Error: ${error.message}`);
    }
};

/**
 * Get quiz results for a specific user and company.
 *
 * @param {string} userId
 * @param {string} company
 * @returns {Array}
 */
export const getUserQuizResults = async (userId, company) => {
    try {
        const query = { user: userId };

        if (company) {
            query.company = company;
        }

        return await QuizResult.find(query)
            .populate("answers.question", "question subject difficulty")
            .sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(`Error fetching quiz results: ${error.message}`);
    }
};

/**
 * Get the latest quiz result for a user and company.
 *
 * @param {string} userId
 * @param {string} company
 * @returns {Object|null}
 */
export const getLatestQuizResult = async (userId, company) => {
    try {
        return await QuizResult.findOne({
            user: userId,
            company,
        })
            .sort({ createdAt: -1 })
            .populate("answers.question", "question subject difficulty");
    } catch (error) {
        throw new Error(
            `Error fetching latest quiz result: ${error.message}`
        );
    }
};