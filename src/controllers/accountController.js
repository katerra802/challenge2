const registerServices = require('../services/userServices');
const User = require('../models/User');

const accountController = {
    registerPage: registerServices.getRegisterPage,

    postRegister: async (req, res) => {
        try {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            const results = await registerServices.postRegister(user);
            res.render('homePage.ejs');
        } catch (error) {
            console.error('Error in postRegister controller:', error);
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    }

}

module.exports = accountController;