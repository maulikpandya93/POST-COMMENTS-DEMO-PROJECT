const {User} = require("../validations/loginSchema");
const jwt = require('jsonwebtoken');
const errorMessages = require('../validations/errorMessages');
require('dotenv').config();

exports.isAuth = (roles) => async (req, res, next) => {
    try {
        console.log('idhar hu me');
        // console.log('auth');
        const token = req.headers.authorization.split(" ")[1];
        // console.log(verifyUser);
        // console.log(req.headers);
        
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        if(verifyUser){
            verifyUser.role = verifyUser.role.toUpperCase();
            if(roles.includes(verifyUser.role)){
                req.user = verifyUser  
                next();
            }else{
                res.status(404).json({
                    error : '404',
                    message : 'User Not Authorized!'
                })
            }
        }else{
            res.status(404).json({
                error : '404',
                message : 'Invalid Credentials!'
            })
        }
        
    } catch (error) {
        res.status(404).json({
            error : '404',
            message : 'Something Went Wrong!'
        })
    }
}