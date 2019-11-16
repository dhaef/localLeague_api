const User = require('../models/User');
const ErrorRes = require('../utils/errorRes');
const bcrypt = require('bcrypt');

// Register new User
// POST /api/v1/auth/register
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, userType } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            userType
        });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Login user
// POST /api/v1/auth/login
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorRes('Please add your email and password', 400));
        }
    
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorRes('Invlaid credentials', 401));
        }

        const match = await user.matchPassword(password);

        if (!match) {
            return next(new ErrorRes('Invlaid credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Logout User
// POST /api/v1/auth/logout
exports.logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() * 10 * 1000),
            httpOnly: true
        })

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// Get logged in user
// GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const me = await User.findById(req.user.id);
    
        if (!me) {
            return next(new ErrorRes('User not found', 400));
        }

        res.status(200).json({ success: true, data: me });
    } catch (error) {
        next(error);
    }
};

// update user name and/or email
// PUT /api/v1/auth/updatedetails
exports.updateDetails = async (req, res, next) => {
    try {
        const fields = {
            name: req.body.name,
            email: req.body.email
        };

        let user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorRes('User not found', 400));
        }

        if (!fields.name) fields.name = user.name;
        if (!fields.email) fields.email = user.email;

        user = await User.findByIdAndUpdate(req.user.id, fields, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// update user password
// PUT /api/v1/auth/updatePassword
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        console.log(user);

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(new ErrorRes('Password is incorrect', 401));
        };

        user.password = req.body.newPassword
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const sendTokenResponse = (user, statusCode, res) => {
        const token = user.createToken();

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.status(statusCode).cookie('token', token, options).json({ success: true, token });
}