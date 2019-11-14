const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for your league'],
        trim: true,
        maxlength: [65, 'Please keep your name under 65 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for your league'],
        maxlength: [300, 'Please keep your description under 300 characters']
    },
    location: {
        type: String,
        required: [true, 'Please add the location of your league']
    },
    seasonStart: {
        type: String,
        required: [true, 'Please add the start date for your league']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// reverse populate with virtuals
LeagueSchema.virtual('teams', {
    ref: 'Team',
    localField: '_id',
    foreignField: 'league',
    justOne: false
  });

module.exports = mongoose.model('League', LeagueSchema);