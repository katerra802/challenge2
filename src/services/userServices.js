const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const registerServices = {
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
        return { user, token };
    }
}

module.exports = registerServices;