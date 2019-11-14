const express = require('express');
const { getLeagues, getLeague, createLeague, updateLeague, deleteLeague } = require('../controllers/leagues');

const teamRouter = require('./teams');

const router = express.Router();

// Re-rout
router.use('/:id/teams', teamRouter);

router
    .route('/')
    .get(getLeagues)
    .post(createLeague);

router
    .route('/:id')
    .get(getLeague)
    .put(updateLeague)
    .delete(deleteLeague);

module.exports = router;