const User = require('../models/User');
const ErrorRes = require('../utils/errorRes');

// Get all Users
// GET /api/v1/auth/users
// Private admin
exports.getUsers = async (req, res, next) => {
    try {
        res.status(200).json(res.queryResults);
    } catch (error) {
        next(error);
    }
};

// Get single User
// GET /api/v1/auth/users/:id
// Private admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorRes(`No user with id of ${req.params.id}`, 400))
        };

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Create new user
// POST /api/v1/auth/users
// Private admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Update user
// PUT /api/v1/auth/users/:id
// Private admin
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorRes(`No user with id of ${req.params.id}`, 400))
        };

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Delete user
// Delete /api/v1/auth/users/:id
// Private admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorRes(`No user with id of ${req.params.id}`, 400))
        };

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};