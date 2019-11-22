const Player = require('../models/Player');
const Team = require('../models/Team');
const ErrorRes = require('../utils/errorRes');

// Get all players
// GET /api/v1/players
exports.getPlayers = async (req, res, next) => {
    try {
        res.status(200).json(res.queryResults);
    } catch (error) {
        next(error);
    }
};

// Get single player
// GET /api/v1/players/:id
exports.getPlayer = async (req, res, next) => {
    try {
        const player = await Player.findById(req.params.id).populate({
            path: 'team',
            select: 'name record'
        });

        if (!player) {
            return next(new ErrorRes(`No player with the id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

// Create player
// POST /api/v1/teams/:id/players
exports.createPlayer = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return next(new ErrorRes(`No team with the id of ${req.params.id}`, 404));
        }

        req.body.team = req.params.id;

        const player = await Player.create(req.body);

        res.status(200).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

// update player
// PUT /api/v1/players/:id
exports.updatePlayer = async (req, res, next) => {
    try {
        let player = await Player.findById(req.params.id);

        if (!player) {
            return next(new ErrorRes(`No player with the id of ${req.params.id}`, 404));
        }

        if (req.user.id !== player.user.toString() && req.user.userType !== 'admin') {
            return next(new ErrorRes(`User does not own this player`, 400));
        }

        player = await Player.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

// Delete player
// Delete /api/v1/players/:id
exports.deletePlayer = async (req, res, next) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return next(new ErrorRes(`No player with the id of ${req.params.id}`, 404));
        }

        if (req.user.id !== player.user.toString() && req.user.userType !== 'admin') {
            return next(new ErrorRes(`User does not own this player`, 400));
        }

        await player.remove()

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};