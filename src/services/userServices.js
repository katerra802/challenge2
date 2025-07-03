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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('User logged in successfully:', user);
        console.log('Generated JWT token:', token);
        return { user, token };
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

    }
}

module.exports = userServices;