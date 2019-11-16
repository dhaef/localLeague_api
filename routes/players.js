const express = require('express');
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/players');

const Player = require('../models/Player');

const router = express.Router({ mergeParams: true });

const queryResults = require('../middleware/queryResults');
const { checkLoggedIn, checkUserType } = require('../middleware/auth');

router
    .route('/')
    .get(queryResults(Player), getPlayers)
    .post(checkLoggedIn, checkUserType('player', 'coach', 'admin'), createPlayer);

router
    .route('/:id')
    .get(getPlayer)
    .put(checkLoggedIn, checkUserType('player', 'coach', 'admin'), updatePlayer)
    .delete(checkLoggedIn, checkUserType('player', 'coach', 'admin'), deletePlayer);

module.exports = router;