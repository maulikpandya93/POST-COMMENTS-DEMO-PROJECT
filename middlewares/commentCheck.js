const errorMessages = require("../validations/errorMessages");
const commentSchema = require("../validations/commentSchema");


exports.validateComment = async(req, res, next) => {
    // console.log('pohocha ');
    try {
        const options = {
            abortEarly : false,
            messages : errorMessages
        }        
        const isValidate = await commentSchema.validateAsync(req.body, options);
        if (isValidate) {
            next();
        }
        
    } catch (error) {

        
        error = error.details.map(err => {
            return err.message.replaceAll('"',"")
        })

        res.status(404).json({
            message : 'Bad Request',
            error : error
        })
    }
}