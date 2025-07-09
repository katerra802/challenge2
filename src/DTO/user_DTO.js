const joi = require('joi');

const userValidation = {
    registerUserSchema: joi.object({
        username: joi.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        }),
        password: joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
        email: joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    }),

    loginUserSchema: joi.object({
        email: joi.string().email().required().messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),
    }),

    updateUserSchema: joi.object({
        username: joi.string().optional().messages({
            'string.empty': 'Username cannot be empty',
        }),
        password: joi.string().optional().messages({
            'string.empty': 'Password cannot be empty',
        }),
        email: joi.string().email().optional().messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email cannot be empty',
        }),
    }).min(1).messages({
        'object.min': 'At least one field is required to update'
    }),

    checkRoleAdmin: (...roles) => {
        return (req, res, next) => {
            console.log('Checking role. User:', req.user, 'Required roles:', roles); // Debug log
            if (req.user && roles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({
                    error: `Forbidden: You do not have permission to access this resource. Current role: ${req.user?.role}`
                });
            }
        }
    },
}

module.exports = userValidation;