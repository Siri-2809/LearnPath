import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to protect routes
 * Verifies JWT token and attaches the authenticated user to the request.
 */
const protect = async (req, res, next) => {
    let token;

    try {
        // Check if Authorization header exists and starts with Bearer
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found. Authorization denied.",
                });
            }

            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided.",
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Token failed.",
            error: error.message,
        });
    }
};

/**
 * Middleware for admin-only access
 * Ensures that only users with the 'admin' role can access certain routes.
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }
};

export { protect, admin };