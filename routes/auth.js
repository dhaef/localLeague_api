const express = require('express');
const { registerUser, loginUser, logoutUser, getMe, updateDetails, updatePassword } = require('../controllers/auth');

const router = express.Router();

const { checkLoggedIn } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/me').get(checkLoggedIn, getMe);
router.route('/updatedetails').put(checkLoggedIn, updateDetails);
router.route('/updatepassword').put(checkLoggedIn, updatePassword);

module.exports = router;