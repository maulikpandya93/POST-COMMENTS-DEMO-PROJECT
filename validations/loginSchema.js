const Joi = require('joi');

User = Joi.object({
    email : Joi.string()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .email({
        minDomainSegments:2,
        tlds:['com', 'net']
    })
    .required(),
    password : Joi.string()
    .min(5)
    .max(20)
    .alphanum()
    .required(),
    role : Joi.string()
    .optional()
    .valid('user','admin')
})

module.exports = {User};