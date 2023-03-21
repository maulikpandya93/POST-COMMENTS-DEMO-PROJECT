const {signupSchema} = require('../validations/signupSchema')
const errorMessages = require('../validations/errorMessages')

exports.validateUser = async(req, res, next) => {
    // console.log('idhr');
    try {
        const options = {
            abortEarly : false,
            messages : errorMessages
        }       
        // console.log(req.body);
        const isValidate = await signupSchema.validateAsync(req.body, options);
        if (isValidate) {
            // console.log('idhr');
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