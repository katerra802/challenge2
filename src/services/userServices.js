require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const otp = require('../models/otp');

const userServices = {
    getRegisterPage: (req, res) => {
        return res.render('register.ejs');
    },

    postRegister: async (user) => {
        try {
            user.password = await bcrypt.hash(user.password, saltRounds);
            const results = await user.save();
            console.log('User registered successfully:', results);
            return results;
        }
        catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    loginUser: async (email, password) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const accessToken = userServices.createToken(user, process.env.JWT_SECRET, '15m'); // Set cookie for 15 minutes
        const refreshToken = userServices.createToken(user, process.env.JWT_REFRESH_SECRET, '7d');
        return { accessToken, refreshToken };
    },

    sendOTP: async (userEmail) => {
        const userExist = await User.findOne({ email: userEmail });
        if (userExist) {
            console.error('User existed with the provided email:', userEmail);
            return false;
        }
        const nodemailer = require('nodemailer');

        const numberVerify = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SERVICE,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: '"Verify OTP" <x>',
            to: userEmail,
            subject: 'Mã xác thực của bạn',
            html: `<h1>${numberVerify}</h1><p>Cảm ơn bạn đã xác thực</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
            const otpEntry = new otp({
                email: userEmail,
                otp: numberVerify,
                createdAt: Date.now()
            });

            otpEntry.save();
            return true;
        } catch (error) {
            console.error('Lỗi gửi email:', error);
            return false;
        }
    },
    verifyOTP: async (userEmail, otpCode) => {
        try {
            if (!userEmail || !otpCode) {
                throw new Error('Email and OTP code are required');
            }

            const otpEntry = await otp.findOne({ email: userEmail, otp: otpCode });
            if (!otpEntry) {
                console.error('OTP not found for the provided email and code');
                return false;
            }
            otpEntry.deleteOne({ email: userEmail, otp: otpCode });
            return true;
        }
        catch (error) {
            console.error('Error in verifyOTP:', error);
            return false;
        }

    },

    getUsersList: async () => {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            console.error('Error fetching users list:', error);
            throw error;
        }
    },
    createToken: (user, secret, timeToken) => {
        if (!user || !user._id) {
            throw new Error('Invalid user object');
        }
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: timeToken });
        return token;
    },
    reverseToken: (accessToken) => {
        if (!accessToken) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                return decoded;
            } catch (error) {
                console.error('Error verifying access token:', error);
                throw new Error('Invalid access token');
            }
        }
        else {
            return null;
        }
    }
}

module.exports = userServices;