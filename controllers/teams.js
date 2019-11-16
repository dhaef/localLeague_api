const Team = require('../models/Team');
const League = require('../models/League');
const ErrorRes = require('../utils/errorRes');

// Get all teams
// GET /api/v1/teams
exports.getTeams = async (req, res, next) => {
    try {
        res.status(200).json(res.queryResults);
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