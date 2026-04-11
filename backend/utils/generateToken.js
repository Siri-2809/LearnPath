import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for authentication.
 *
 * @param {string} userId - The ID of the authenticated user.
 * @returns {string} - Signed JWT token.
 */
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d",
        }
    );
};

export default generateToken;