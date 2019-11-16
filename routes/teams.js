const express = require('express');
const { getTeams, getTeam, createTeam, updateTeam, deleteTeam, getLeagueTeams } = require('../controllers/teams');

const Team = require('../models/Team');

const playerRouter = require('./players')

const router = express.Router({ mergeParams: true });

const queryResults = require('../middleware/queryResults');
const { checkLoggedIn, checkUserType } = require('../middleware/auth');

router.use('/:id/players', playerRouter);

router
    .route('/')
    .get(queryResults(Team), getTeams)
    .post(checkLoggedIn, checkUserType('coach', 'admin'), createTeam);

router
    .route('/:id')
    .get(getTeam)
    .put(checkLoggedIn, checkUserType('coach', 'admin'), updateTeam)
    .delete(checkLoggedIn, checkUserType('coach', 'admin'), deleteTeam);

module.exports = router;