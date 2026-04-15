/**
 * ============================================
 * LearnPath - Utility Helper Functions
 * ============================================
 * These helpers support formatting, calculations,
 * authentication, and UI utilities across the app.
 */

/* ============================================
   String Utilities
============================================ */

/**
 * Capitalizes the first letter of a string.
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Converts text to Title Case.
 * @param {string} text
 * @returns {string}
 */
export const toTitleCase = (text = "") =>
    text.replace(/\w\S*/g, (word) =>
        word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );

/**
 * Truncates long text with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text = "", maxLength = 100) =>
    text.length > maxLength
        ? `${text.substring(0, maxLength)}...`
        : text;

/* ============================================
   Date & Time Utilities
============================================ */

/**
 * Formats a date into a readable format.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

/**
 * Formats date and time.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Converts minutes into hours and minutes.
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes = 0) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins} min`;
    return `${hrs}h ${mins}m`;
};

/* ============================================
   Score & Quiz Utilities
============================================ */

/**
 * Calculates percentage.
 * @param {number} score
 * @param {number} total
 * @returns {number}
 */
export const calculatePercentage = (score, total) => {
    if (!total) return 0;
    return Number(((score / total) * 100).toFixed(2));
};

/**
 * Determines performance level based on percentage.
 * @param {number} percentage
 * @returns {string}
 */
export const getPerformanceLevel = (percentage) => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Average";
    return "Needs Improvement";
};

/**
 * Returns badge color based on performance.
 * @param {number} percentage
 * @returns {string}
 */
export const getPerformanceBadge = (percentage) => {
    if (percentage >= 85) return "badge-success";
    if (percentage >= 70) return "badge-info";
    if (percentage >= 50) return "badge-warning";
    return "badge-danger";
};

/* ============================================
   Authentication Utilities
============================================ */

/**
 * Stores token in localStorage.
 * @param {string} token
 */
export const setToken = (token) => {
    localStorage.setItem("token", token);
};

/**
 * Retrieves token from localStorage.
 * @returns {string|null}
 */
export const getToken = () => {
    return localStorage.getItem("token");
};

/**
 * Removes token from localStorage.
 */
export const removeToken = () => {
    localStorage.removeItem("token");
};

/**
 * Checks if user is authenticated.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Stores user data in localStorage.
 * @param {Object} user
 */
export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Retrieves user data from localStorage.
 * @returns {Object|null}
 */
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

/**
 * Clears authentication data.
 */
export const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

/* ============================================
   Study Plan & Progress Utilities
============================================ */

/**
 * Calculates overall progress percentage.
 * @param {number} completed
 * @param {number} total
 * @returns {number}
 */
export const calculateProgress = (completed, total) => {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
};

/**
 * Returns status color for study plans.
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
    switch (status) {
        case "Completed":
            return "badge-success";
        case "In Progress":
            return "badge-info";
        case "Pending":
            return "badge-warning";
        default:
            return "badge-secondary";
    }
};

/* ============================================
   Company & Resource Utilities
============================================ */

/**
 * Returns company logo path.
 * @param {string} company
 * @returns {string}
 */
export const getCompanyLogo = (company) => {
    if (!company) return "/assets/images/default.png";
    return `/assets/images/${company.toLowerCase()}.png`;
};

/**
 * Filters resources by keyword.
 * @param {Array} resources
 * @param {string} keyword
 * @returns {Array}
 */
export const filterResources = (resources = [], keyword = "") => {
    return resources.filter((resource) =>
        resource.title.toLowerCase().includes(keyword.toLowerCase())
    );
};

/* ============================================
   ML Service Utilities
============================================ */

/**
 * Formats scores for ML skill gap analysis.
 * @param {Object} subjectScores
 * @returns {Object}
 */
export const formatScoresForML = (subjectScores) => {
    const subjectAliasMap = {
        "Data Structures": "DSA",
        Algorithms: "DSA",
        DSA: "DSA",
        "Database Management Systems": "DBMS",
        DBMS: "DBMS",
        "Operating Systems": "OS",
        OS: "OS",
        "Computer Networks": "CN",
        CN: "CN",
        "Object-Oriented Programming": "OOP",
        "Programming Fundamentals": "OOP",
        OOP: "OOP",
        Aptitude: "Aptitude",
        "System Design": "System Design",
    };

    const bucket = {};

    Object.entries(subjectScores || {}).forEach(([subject, value]) => {
        const mappedSubject = subjectAliasMap[subject];
        if (!mappedSubject) return;

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return;

        if (!bucket[mappedSubject]) {
            bucket[mappedSubject] = { sum: 0, count: 0 };
        }

        bucket[mappedSubject].sum += numericValue;
        bucket[mappedSubject].count += 1;
    });

    const normalizedScores = {};
    Object.entries(bucket).forEach(([subject, stats]) => {
        normalizedScores[subject] = stats.count > 0 ? stats.sum / stats.count : 0;
    });

    return { scores: normalizedScores };
};

/**
 * Formats weak subjects for ML recommendations.
 * @param {Array} weakSubjects
 * @returns {Object}
 */
export const formatWeakSubjectsForML = (weakSubjects) => {
    return { weak_subjects: weakSubjects };
};

/* ============================================
   Miscellaneous Utilities
============================================ */

/**
 * Generates a unique ID.
 * @returns {string}
 */
export const generateId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function to limit rapid API calls.
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

/**
 * Scrolls smoothly to top.
 */
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};