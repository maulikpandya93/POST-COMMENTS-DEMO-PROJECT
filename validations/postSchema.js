const Joi = require('joi');



const postSchema = Joi.object({
    title : Joi.string().required(),
    caption : Joi.string().required()
})


module.exports = postSchema