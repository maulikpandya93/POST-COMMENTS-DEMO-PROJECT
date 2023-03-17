const {signupSchema} = require('../validations/signupSchema')
const errorMessages = require('../validations/errorMessages')

exports.validateUser = async(req, res, next) => {
    
    try {
        const options = {
            abortEarly : false,
            messages : errorMessages
        }        
        const isValidate = await signupSchema.validateAsync(req.body, options);
        if (isValidate) {
            next();
        }
        
    } catch (error) {
        // console.log(error);
        error = error.details.map(err => {
            return err.message.replaceAll('"',"")
        })
        // console.log(error);
        // error = error.
        res.status(404).json({
            message : 'Bad Request',
            error : error
        })
    }
}