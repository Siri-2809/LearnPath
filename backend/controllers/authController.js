import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, targetCompany } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password.",
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email.",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            targetCompany: targetCompany || "",
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: "User registered successfully.",
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    targetCompany: user.targetCompany,
                    role: user.role,
                },
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid user data.",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Registration failed: ${error.message}`,
        });
    }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password.",
            });
        }

        // Find user and include password explicitly
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetCompany: user.targetCompany,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Login failed: ${error.message}`,
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                targetCompany: user.targetCompany,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to fetch profile: ${error.message}`,
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const { name, email, password, targetCompany } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.targetCompany = targetCompany || user.targetCompany;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            token: generateToken(updatedUser._id),
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                targetCompany: updatedUser.targetCompany,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Profile update failed: ${error.message}`,
        });
    }
};