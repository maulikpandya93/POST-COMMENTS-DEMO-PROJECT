const {User} = require("../validations/loginSchema");
const jwt = require('jsonwebtoken');
const errorMessages = require('../validations/errorMessages');
const passport = require("passport");
require('dotenv').config();


exports.cookieExtractor = (req) => {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['authToken'];
    }
    return token;
}


exports.isAuth = (roles) => {
    try {
        return (req, res ,next) => {
            passport.authenticate('jwt',{session : false}, (err, user) => {
                if(err){
                    res.status(404).json({
                        error : '404',
                        message : 'Token either expired or not valid!'
                    })
                }else{
                    if(roles.includes(user.role)){
                        req.user = user;
                        next();
                    }else{
                        res.status(404).json({
                            error : '404',
                            message : 'User Not Authorized!'
                        })
                    }
                }
            })(req, res, next)
        }    
    } catch (error) {
        res.status(404).json({
            error : error
        })
    }
    
}
    // try {

    //     const authCookie = req.cookies.authToken;
        
    //     try {
    //         const verifyUser = passport.authenticate('jwt', (req, res) => {

    //         })
    //     if(verifyUser){
    //         verifyUser.role = verifyUser.role.toUpperCase();
    //         if(roles.includes(verifyUser.role)){
    //             req.user = verifyUser  
    //             next();
    //         }else{
    //             res.status(404).json({
    //                 error : '404',
    //                 message : 'User Not Authorized!'
    //             })
    //         }
    //     }
    //     } catch (error) {
    //         res.status(404).json({
    //             error  :'Bad Request!',
    //             message : 'Token either expired or Invalid Token'
    //         })
    //     }
        
    // } catch (error) {
    //     res.status(404).json({
    //         error : '404',
    //         message : 'Provide Token First!'
    //     })
    // }
