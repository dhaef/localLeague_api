const User = require('../models/User');
const ErrorRes = require('../utils/errorRes');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
            return next(new ErrorRes('User not found', 404));
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

// Forgot Password
// POST /api/v1/auth/forgotpassword
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    
        if (!user) {
            return next(new ErrorRes('User not found', 404));
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

        const message = `Please make a PUT request to the following url to reset your password \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset password',
                message
            });
            // Mails sends to mailtrap.io
            res.status(200).json({ success: true, data: 'email sent' });
        } catch (err) {
            console.log(err);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ runValidators: false });
            return next(new ErrorRes('Could not send email', 500));
        }
        res.status(200).json({ success: true, data: user }); 
    } catch (error) {
        next(error);
    }
};

// Reset password 
// PUT /api/v1/auth/resetpassword/:id
exports.resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorRes('Invalid Token', 400));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
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