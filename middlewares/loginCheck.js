const Joi = require('Joi');
const {User} = require("../validations/loginSchema");
const jwt = require('jsonwebtoken');
const errorMessages = require('../validations/errorMessages');


exports.validateLogin = async (req, res, next) => {
    try {
        const options = {
            abortEarly : false,
            messages : errorMessages
        }        
        const isValidate = await User.validateAsync(req.body, options);
        if (isValidate) {
            next();
        }
        
    } catch (error) {

        error = error.details.map(err => {
            return err.message
        })

        res.status(404).json({
            message : 'Bad Request',
            error : error
        })
    }
}