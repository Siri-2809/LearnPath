import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js";
import Company from "../models/Company.js";

/**
 * LearnPath - Quiz Service
 * ------------------------
 * Handles quiz generation, evaluation, and result storage.
 */

/**
 * Generate a company-specific quiz with questions from all required subjects.
 *
 * @param {string} company - Selected company name
 * @param {number} totalQuestions - Optional limit (if not provided, returns all available)
 * @param {string} testType - "diagnostic" or "mock"
 * @returns {Array} List of quiz questions with balanced difficulty
 */
export const generateQuiz = async (company, totalQuestions = null, testType = "diagnostic") => {
    try {
        if (!company) {
            throw new Error("Company name is required to generate a quiz.");
        }

        // Fetch company details to get required subjects
        const companyData = await Company.findOne({ name: company, isActive: true });

        if (!companyData) {
            throw new Error(`Company '${company}' not found or is inactive.`);
        }

        const requiredSubjects = companyData.subjects || [];

        if (requiredSubjects.length === 0) {
            throw new Error(`No subjects assigned to company '${company}'.`);
        }

        // Fetch questions from all required subjects
        const allQuestions = await Question.find({
            subject: { $in: requiredSubjects },
            companies: { $in: [company] },
            testType,
            isActive: true,
        }).select("-correctAnswer");

        if (allQuestions.length === 0) {
            throw new Error(
                `No questions found for company '${company}' in subjects: ${requiredSubjects.join(", ")}`
            );
        }

        // Organize questions by subject and difficulty
        const questionsBySubject = {};
        const difficulties = ["Easy", "Medium", "Hard"];

        requiredSubjects.forEach((subject) => {
            questionsBySubject[subject] = {
                Easy: [],
                Medium: [],
                Hard: [],
            };
        });

        // Group questions by subject and difficulty
        allQuestions.forEach((q) => {
            if (
                questionsBySubject[q.subject] &&
                questionsBySubject[q.subject][q.difficulty]
            ) {
                questionsBySubject[q.subject][q.difficulty].push(q);
            }
        });

        // Build balanced quiz ensuring each subject is covered
        let selectedQuestions = [];

        if (!totalQuestions || totalQuestions >= allQuestions.length) {
            // Return all available questions
            selectedQuestions = allQuestions;
        } else {
            // Strategy: Ensure each subject gets at least one question,
            // then fill remaining slots with balanced difficulty distribution

            const questionsPerSubject = Math.floor(totalQuestions / requiredSubjects.length);
            const remainingSlots = totalQuestions % requiredSubjects.length;

            requiredSubjects.forEach((subject, index) => {
                const subjectQuestions = questionsBySubject[subject];
                let toAdd = questionsPerSubject;

                // Distribute remaining slots
                if (index < remainingSlots) {
                    toAdd++;
                }

                // Pick questions with balanced difficulty
                const combined = [
                    ...subjectQuestions.Easy,
                    ...subjectQuestions.Medium,
                    ...subjectQuestions.Hard,
                ];

                // Shuffle and take needed questions
                const shuffled = combined.sort(() => 0.5 - Math.random());
                selectedQuestions.push(...shuffled.slice(0, Math.max(1, toAdd))); // At least 1 per subject
            });

            // Ensure we have exactly totalQuestions
            selectedQuestions = selectedQuestions.slice(0, totalQuestions);
        }

        // Final shuffle
        const shuffledQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

        return shuffledQuestions;
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
        const subjectWiseScores = [];

        Object.keys(subjectStats).forEach((subject) => {
            const { correct, total } = subjectStats[subject];
            const percentage = (correct / total) * 100;
            
            // Get total marks for this subject
            const subjectMarks = evaluatedAnswers
                .filter((ans) => ans.subject === subject)
                .reduce((sum, ans) => sum + ans.marksAwarded, 0);

            subjectWiseScores.push({
                subject,
                correct,
                total,
                score: subjectMarks,
                percentage,
            });

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
            subjectWiseScores,
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
            subjectWiseScores: evaluation.subjectWiseScores,
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