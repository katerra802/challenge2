const joi = require('joi');

const productValidation = {
    createProductSchema: joi.object({
        name: joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        slug: joi.string().required().messages({
            'string.empty': 'Slug is required',
            'any.required': 'Slug is required'
        }),
        quantity: joi.number().integer().min(0).required().messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity cannot be negative',
            'any.required': 'Quantity is required'
        })
    }),

    updateProductSchema: joi.object({
        name: joi.string().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        slug: joi.string().required().messages({
            'string.empty': 'Slug is required',
            'any.required': 'Slug is required'
        }),
        quantity: joi.number().integer().min(0).required().messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity cannot be negative',
            'any.required': 'Quantity is required'
        })
    }).min(1).messages({
        'object.min': 'At least one field is required to update'
    }),
}

module.exports = productValidation;