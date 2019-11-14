const express = require('express');
const { getTeams, getTeam, createTeam, updateTeam, deleteTeam } = require('../controllers/teams');

const playerRouter = require('./players')

const router = express.Router({ mergeParams: true });

router.use('/:id/players', playerRouter);

router
    .route('/')
    .get(getTeams)
    .post(createTeam);

router
    .route('/:id')
    .get(getTeam)
    .put(updateTeam)
    .delete(deleteTeam);

module.exports = router;