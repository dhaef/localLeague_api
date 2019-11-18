const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name'],
        trim: true
    },
    age: {
        type: String,
        required: [true, 'Please add the team age group'],
        enum: ['u16', 'u17', 'u18']
    },
    skill: {
        type: String,
        required: [true, 'Please add team skill level'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    city: {
        type: String,
        required: [true, 'Please add you teams city']
    },
    record: {
        type: Object,
        default: {
            "wins": 0,
            "loses": 0,
            "ties": 0
        }
    },
    points: {
        type: Number,
        default: 0
    },
    league: {
        type: mongoose.Schema.ObjectId,
        ref: 'League',
        required: true
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate points on save
TeamSchema.pre('save', function () {
    let total = 0;
    if (this.record.wins > 0) {
        total += (this.record.wins * 3);
    }
    if (this.record.ties > 0) {
        total += this.record.ties;
    };

    this.set({ points: total });
});

// reverse populate with virtuals
TeamSchema.virtual('players', {
    ref: 'Player',
    localField: '_id',
    foreignField: 'team',
    justOne: false
  });

module.exports = mongoose.model('Team', TeamSchema);