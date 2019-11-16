const jwt = require('jsonwebtoken');
const ErrorRes = require('../utils/ErrorRes');
const User = require('../models/User');

exports.checkLoggedIn = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ErrorRes('Not authorized to use this route', 401));
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decode.id);

            next();
        } catch (error) {
            return next(new ErrorRes('Not authorized to use this route', 401));
        }
    } catch (error) {
        console.log(error)
    }
};

exports.checkUserType = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return next(new ErrorRes(`User type of ${req.user.userType} is not authorized for this route`, 401));
        }
        next();
    }
}