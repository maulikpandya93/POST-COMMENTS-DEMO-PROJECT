const Joi = require('joi');



const postSchema = Joi.object({
    title : Joi.string().required().max(25),
    caption : Joi.string().required().max(150)
})


module.exports = postSchema