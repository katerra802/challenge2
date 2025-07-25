const userServices = require('../services/userServices');
const UserMapper = require('../mappers/user_mappers');
const userOutPutDTO = require('../DTO/output/userDTO');

const API_UserController = {
    refreshToken: async (req, res) => {
        try {
            const refreshtoken = req.cookies.refreshToken || req.header('Authorization')?.replace('Bearer ', '');
            if (!refreshtoken) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const decoded = jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const accessToken = userServices.createToken(ser, process.env.JWT_SECRET, '30');
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            res.status(200).json({ message: 'Token refreshed successfully', token: newToken });
        }
        catch (error) {
            console.error('Error in refreshToken controller:', error);
            res.status(500).json({ message: 'Failed to refresh token', error: error.message });
        }
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

            res.status(201).json({
                message: 'Registration successful',
                user: UserMapper.toOutputDTO(results)
            });
        } catch (error) {
            console.error('Error in postRegister controller:', error);
            res.status(500).json({ message: 'Registration failed', error: error.message });
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    error: true,
                    errmsg: 'Email and password are required!'
                });
            }

            const { accessToken, refreshToken } = await userServices.loginUser(email, password);
            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });

            res.status(200).json({
                message: 'Login successful',
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (error) {
            res.status(401).json({
                error: true,
                errmsg: 'Invalid email or password!'
            });
        }
    },

    postLogout: (req, res) => {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({ message: 'Logout failed', error: error.message });
        }
    },

    getUsersList: async (req, res) => {
        try {
            const users = await userServices.getUsersList();
            res.status(200).json(UserMapper.toOutputListDTO(users));
            // res.render('usersList.ejs', { users: users });
        } catch (error) {
            console.error('Error fetching users list:', error);
            res.status(500).json({ message: 'Failed to fetch users list', error: error.message });
        }
    },
}

module.exports = API_UserController;