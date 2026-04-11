/**
 * LearnPath - Global Constants
 * This file centralizes reusable constants used across the backend.
 */

// ==============================
// Supported Companies
// ==============================
export const COMPANIES = [
    "TCS",
    "Infosys",
    "Google",
    "Microsoft",
    "Amazon"
];

// ==============================
// Subjects
// ==============================
export const SUBJECTS = [
    "Programming Fundamentals",
    "Object-Oriented Programming",
    "Data Structures",
    "Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Aptitude",
    "System Design"
];

// ==============================
// Difficulty Levels
// ==============================
export const DIFFICULTY_LEVELS = [
    "Easy",
    "Medium",
    "Hard"
];

// ==============================
// Resource Types
// ==============================
export const RESOURCE_TYPES = [
    "Article",
    "Video",
    "Course",
    "Book",
    "Documentation"
];

// ==============================
// Resource Difficulty Levels
// ==============================
export const RESOURCE_DIFFICULTY_LEVELS = [
    "Beginner",
    "Intermediate",
    "Advanced"
];

// ==============================
// Test Types
// ==============================
export const TEST_TYPES = {
    DIAGNOSTIC: "diagnostic",
    MOCK: "mock",
};

// ==============================
// User Roles
// ==============================
export const USER_ROLES = {
    STUDENT: "student",
    ADMIN: "admin"
};

// ==============================
// Quiz Configuration
// ==============================
export const QUIZ_CONFIG = {
    QUESTIONS_PER_SUBJECT: 5,
    DEFAULT_TOTAL_QUESTIONS: 20,
    TIME_PER_QUESTION: 60, // seconds
    PASS_PERCENTAGE: 50
};

// ==============================
// Study Plan Configuration
// ==============================
export const STUDY_PLAN_CONFIG = {
    DEFAULT_DURATION_DAYS: 30,
    HOURS_PER_DAY: 2,
    MAX_HOURS_PER_DAY: 6,
    MIN_HOURS_PER_DAY: 1
};


// ==============================
// Study Plan Status
// ==============================
export const STUDY_PLAN_STATUS = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
};

// ==============================
// Learning Path Configuration
// ==============================
export const LEARNING_PATH_CONFIG = {
    GENERATION_METHODS: [
        "algorithm",
        "ml",
        "manual"
    ]
};

// ==============================
// Session Status
// ==============================
export const SESSION_STATUS = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
};

// ==============================
// ML Service Configuration
// ==============================
export const ML_CONFIG = {
    BASE_URL: process.env.ML_SERVICE_URL || "http://127.0.0.1:8000",
    ENDPOINTS: {
        SKILL_GAP: "/skill-gap",
        RECOMMEND: "/recommend"
    }
};

// ==============================
// HTTP Status Codes
// ==============================
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// ==============================
// Standard API Response Messages
// ==============================
export const MESSAGES = {
    SUCCESS: "Success",
    SERVER_ERROR: "Internal Server Error",
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_REGISTERED: "User registered successfully",
    USER_LOGGED_IN: "User logged in successfully",
    DATA_FETCHED: "Data fetched successfully",
    DATA_CREATED: "Data created successfully",
    DATA_UPDATED: "Data updated successfully",
    DATA_DELETED: "Data deleted successfully",
    QUIZ_SUBMITTED: "Quiz submitted successfully",
    LEARNING_PATH_GENERATED: "Learning path generated successfully",
    STUDY_PLAN_GENERATED: "Study plan generated successfully"
};