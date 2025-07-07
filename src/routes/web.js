const express = require('express');
const path = require('path');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', homeController.homePage);

// register user routes
router.get('/register-user', userController.registerPage);
router.post('/register', userController.postRegister);
router.get('/email-otp', userController.getSendOPTPage);
router.post('/send-otp', userController.postSendOTP);
router.post('/verify-otp', userController.postVerifyOTP);
//

//login user routes
router.get('/login', userController.loginPage);
router.post('/login-user', userController.postLogin);
router.get('/list-users', userController.getUsersList);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.post('/logout', userController.postLogout);
//

module.exports = router;