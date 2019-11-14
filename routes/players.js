const express = require('express');
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/players');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getPlayers)
    .post(createPlayer);

router
    .route('/:id')
    .get(getPlayer)
    .put(updatePlayer)
    .delete(deletePlayer);

module.exports = router;