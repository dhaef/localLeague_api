const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');

const router = express.Router();

const queryResults = require('../middleware/queryResults');
const { checkLoggedIn, checkUserType } = require('../middleware/auth');

router
    .route('/')
    .get(checkLoggedIn, checkUserType('admin'), queryResults(User), getUsers)
    .post(checkLoggedIn, checkUserType('admin'), createUser);

router
    .route('/:id')
    .get(checkLoggedIn, checkUserType('admin'), getUser)
    .put(checkLoggedIn, checkUserType('admin'), updateUser)
    .delete(checkLoggedIn, checkUserType('admin'), deleteUser);

module.exports = router;