const League = require('../models/League');
const ErrorRes= require('../utils/errorRes');

// Get all leagues
// GET /api/v1/leagues
exports.getLeagues = async (req, res, next) => {
    try {
        res.status(200).json(res.queryResults);
    } catch (error) {
        next(error);
    }
};

// Get single league
// GET /api/v1/leagues/:id
exports.getLeague = async (req, res, next) => {
    try {
        const league = await League.findById(req.params.id).populate({
            path: 'teams',
            select: 'name'
        });

        if (!league) {
            return next(new ErrorRes(`No league found with id of ${req.params.id}`, 404));
        }
    
        res.status(200).json({ success: true, data: league });
    } catch (error) {
        next(error);
    }
};

// Create new league
// POST /api/v1/leagues
exports.createLeague = async (req, res, next) => {
    try {
        const league = await League.create(req.body);

        res.status(200).json({ success: true, data: league });
    } catch (error) {
        next(error);
    }
};

// Update league
// PUT /api/v1/leagues/:id
exports.updateLeague = async (req, res, next) => {
    try {
        let league = await League.findById(req.params.id);

        if (!league) {
            return next({ success: false, data: `No league found with id of ${req.params.id}` });
        }

        league = await League.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: league });
    } catch (error) {
        next(error);
    }
};

// Delete league
// PUT /api/v1/leagues/:id
exports.deleteLeague = async (req, res, next) => {
    try {
        const league = await League.findById(req.params.id);

        if (!league) {
            return next({ success: false, data: `No league found with id of ${req.params.id}` });
        }

        await League.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};