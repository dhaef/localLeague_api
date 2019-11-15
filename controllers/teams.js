const Team = require('../models/Team');
const League = require('../models/League');
const ErrorRes = require('../utils/errorRes');

// Get all teams
// GET /api/v1/teams
exports.getTeams = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };

        const ignoreFields = ['select', 'sort', 'limit', 'page'];

        ignoreFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Team.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query =  query.select(fields);
        };

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        };

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Team.countDocuments();

        query = query.skip(startIndex).limit(limit);
        
        const teams = await query;
        
        // .populate({ path: 'players', select: 'name' });

        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        if (!teams) {
            return next(new ErrorRes('No teams in DB', 404));
        }

        res.status(200).json({ success: true, count: teams.length, pagination, data: teams });
    } catch (error) {
        next(error);
    }
};

// Get single team
// GET /api/v1/teams/:id
exports.getTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return next(new ErrorRes(`No team team with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

// Create a team
// POST /api/v1/league/:id/teams
exports.createTeam = async (req, res, next) => {
    try {
        const league = await League.findById(req.params.id);

        if (!league) {
            return next(new ErrorRes(`No league with the id of ${req.params.id}`, 404));
        }

        req.body.league = req.params.id;

        const team = await Team.create(req.body);

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

// Update a team
// PUT /api/v1/teams/:id
exports.updateTeam = async (req, res, next) => {
    try {
        let team = await Team.findById(req.params.id);

        if (!team) {
            return next(new ErrorRes(`No Team with the id of ${req.params.id}`, 404));
        }

        team = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        await team.save();

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

// Delete a team
// Delete /api/v1/teams/:id
exports.deleteTeam = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return next(new ErrorRes(`No Team with the id of ${req.params.id}`, 404));
        }

        await Team.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};