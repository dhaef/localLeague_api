const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: [true, 'Please add your family name'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add your name'],
        trim: true
    },
    position: String,
    age: {
        type: String,
        required: [true, 'Please add your age']
    },
    stats: Object,
    team: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Player', PlayerSchema);