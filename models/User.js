const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'Please add an email'],
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },
    password: {
        type: String,
        require: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    userType: {
        type: String,
        require: [true, 'Please add your access level'],
        enum: ['player', 'coach', 'director']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.createToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash token and set to reset password token field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set expire 
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);