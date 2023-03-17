const Joi = require('joi');


const commentSchema = Joi.object({
    comment : Joi.string()
    .max(150)
    .required()
})

module.exports = commentSchema;