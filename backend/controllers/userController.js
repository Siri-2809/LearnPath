import User from "../models/User.js";

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching users: ${error.message}`,
        });
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching user: ${error.message}`,
        });
    }
};

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required.",
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating user role: ${error.message}`,
        });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting user: ${error.message}`,
        });
    }
};

/**
 * @desc    Update user's target company
 * @route   PUT /api/users/target-company
 * @access  Private
 */
export const updateTargetCompany = async (req, res) => {
    try {
        const { targetCompany } = req.body;

        if (!targetCompany) {
            return res.status(400).json({
                success: false,
                message: "Target company is required.",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.targetCompany = targetCompany;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Target company updated successfully.",
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
            message: `Error updating target company: ${error.message}`,
        });
    }
};