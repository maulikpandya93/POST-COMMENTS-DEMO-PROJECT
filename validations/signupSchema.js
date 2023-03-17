const Joi = require('joi');



const signupSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        // .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/)
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] }
        })
        .required(),
    password: Joi.string()
        .min(5)
        .max(20)
        .alphanum()
        .required(),
    role : Joi.string()
    .valid('user','admin')
    .optional()

})

module.exports = { signupSchema };