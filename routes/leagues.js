const express = require('express');
const { getLeagues, getLeague, createLeague, updateLeague, deleteLeague } = require('../controllers/leagues');

const League = require('../models/League');

const teamRouter = require('./teams');

const router = express.Router();

const queryResults = require('../middleware/queryResults');
const { checkLoggedIn, checkUserType } = require('../middleware/auth');

// Re-rout
router.use('/:id/teams', teamRouter);

router
    .route('/')
    .get(queryResults(League), getLeagues)
    .post(checkLoggedIn, checkUserType('director', 'admin'), createLeague);

router
    .route('/:id')
    .get(getLeague)
    .put(checkLoggedIn, checkUserType('director', 'admin'), updateLeague)
    .delete(checkLoggedIn, checkUserType('director', 'admin'), deleteLeague);

module.exports = router;