const userServices = require('../services/userServices');
const User = require('../models/User');

const accountController = {
    registerPage: userServices.getRegisterPage,

    getSendOPTPage: (req, res) => {
        res.render('sendEmail.ejs', { error: true, errmsg: null });
    },

    postSendOTP: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.render('sendEmail.ejs', {
                error: true,
                errmsg: 'Vui lòng nhập email!'
            });
        }

        const results = await userServices.sendOTP(email);
        if (!results) {
            return res.render('sendEmail.ejs', {
                error: true,
                errmsg: 'Gửi email không thành công, vui lòng thử lại!'
            });
        }
        res.render('verifyEmail.ejs', { email: email });
    },

    postVerifyOTP: async (req, res) => {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.render('verifyEmail.ejs', {
                error: true,
                errmsg: 'Vui lòng nhập đầy đủ thông tin!'
            });
        }

        const isValid = await userServices.verifyOTP(email, otp);
        if (!isValid) {
            return res.render('verifyEmail.ejs', {
                error: true,
                errmsg: 'Mã OTP không hợp lệ hoặc đã hết hạn!'
            });
        }

        res.render('register.ejs', { email: email });
    },

    postRegister: async (req, res) => {
        try {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            const results = await userServices.postRegister(user);

            res.render('login.ejs', {
                error: false,
                errmsg: null
            });
        } catch (error) {
            console.error('Error in postRegister controller:', error);
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    },

    loginPage: (req, res) => {
        res.render('login.ejs', { error: false, errmsg: null });
    },

    postLogin: async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login.ejs', {
                error: true,
                errmsg: 'Vui lòng nhập đầy đủ thông tin!'
            });
        }

        try {
            const { user, token } = await userServices.loginUser(email, password);
            req.session.user = user;
            req.session.token = token;
            res.redirect('/');
        } catch (error) {
            console.error('Login failed:', error);
            res.render('login.ejs', {
                error: true,
                errmsg: error.message
            });
        }
    }

}

module.exports = accountController;