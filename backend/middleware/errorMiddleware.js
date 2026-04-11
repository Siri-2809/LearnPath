/**
 * LearnPath - Global Error Handling Middleware
 * ---------------------------------------------
 * Handles application errors, 404 responses, and MongoDB validation errors.
 * Ensures consistent API responses across the backend.
 */

/**
 * Middleware to handle 404 - Route Not Found
 */
export const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
        message = `Resource not found with id of ${err.value}`;
        statusCode = 404;
    }

    // Handle Duplicate Key Error (MongoDB)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for '${field}'. Please use another value.`;
        statusCode = 400;
    }

    // Handle Mongoose Validation Errors
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        statusCode = 400;
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError") {
        message = "Invalid token. Authorization denied.";
        statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        message = "Token expired. Please log in again.";
        statusCode = 401;
    }

    // Final Response
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export default errorHandler;