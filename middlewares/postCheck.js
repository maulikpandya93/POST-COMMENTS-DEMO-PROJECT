const postSchema = require('../validations/postSchema')
const errorMessages = require('../validations/errorMessages')

exports.validatePost = async(req, res, next) => {
    
    try {
        const options = {
            abortEarly : false,
            messages : errorMessages
        }        
        const isValidate = await postSchema.validateAsync(req.body, options);
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