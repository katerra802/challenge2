const express = require('express');
const path = require('path');
const router = express.Router();
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/auth');

router.get('/', homeController.homePage);

// register user routes
router.get('/register-user', accountController.registerPage);
router.post('/register', accountController.postRegister);
router.get('/email-otp', accountController.getSendOPTPage);
router.post('/send-otp', accountController.postSendOTP);
router.post('/verify-otp', accountController.postVerifyOTP);
//

//login user routes
router.get('/login', authMiddleware, accountController.loginPage);
router.post('/login-user', accountController.postLogin);
//

module.exports = router;