const express = require('express');
const path = require('path');
const router = express.Router();
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');


router.get('/', homeController.homePage);
router.get('/register-user', accountController.registerPage);
router.post('/register', accountController.postRegister);
module.exports = router;