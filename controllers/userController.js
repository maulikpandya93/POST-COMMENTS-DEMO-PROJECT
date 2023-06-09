const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        var {name, email, password, role} = req.body;
        if(role == undefined){
            role = 'user';
            const isExists = await userModel.findOne({
                where : {
                    role : role,
                    email : email
                }
            })    
            if (isExists) {
                res.status(400).json({
                    message : 'Bad Request',
                    error : 'User Already Exists'
                })
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10); 

        const isExists = await userModel.findOne({
            where : {
                role : role,
                email : email
            }
        })
        if (isExists) {
            res.status(400).json({
                message : 'Bad Request',
                error : 'User Already Exists'
            })
        }else{
            const addData = await userModel.create({
                name : name,
                email : email,
                password : hashedPassword,
                role : role
            })
            if(addData){
                // console.log(addData.role)
                res.status(200).json({
                    message : 'SUCCESSFULLY REGISTERED!'
                })
            }else{
                res.status(400).json({
                    message : 'Not Registered',
                    error : 'UNFORTUNATELY NOT REGISTERED!'
                })
            }
        }
    } catch (error) {
        // console.log(error);
        res.status(400).json({status : 400, message : 'Something went wrong!'})
    }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        let role = req.body.role;

        if(role == undefined) role = 'user';

        const findData = await userModel.findOne({
            where : {
                role : role,
                email : email
            }
        })
        if (findData) {
            const match = await bcrypt.compare(password, findData.password)
            const key = process.env.SECRET_KEY
            const pay_load = {
                email : findData.email,
                id : findData.id,
                role : findData.role
            }
            if(match){
                const token = jwt.sign(pay_load, key)
                res.cookie('authToken', token, {maxAge:3600 * 60 * 5, httpOnly:true});
                res.status(200).json({
                    message : `LOGGED IN SUCCESSFULLY | TOKEN DURATION - 5 MINS`,
                    "Logged in as" : findData.role
                })
            }else{
                res.status(400).json({status : 404, message : 'PASSWORD DOES NOT MATCH'})
            }
        }else{
            res.status(404).json({status : 404, message : 'Either wrong credentials or user not exists!'})
        }
    } catch (error) {
        res.status(400).send('SOMETHING WENT WRONG!')
    }
}


exports.logout = async (req, res) => {
    try {
        res.clearCookie('authToken');
    res.status(200).json({
        message : 'LOGGED OUT SUCCESSFULLY!'
    })    
    } catch (error) {
      res.status(400).json({
        error : '400',
        message : 'Theres some error in logging out!'
      })  
    }
}


exports.assignAdmin = async (req, res) => {
    const {role} = req.user;
    const {user_id} = req.query;

    if(role == 'admin'){
        const findUser = await userModel.findOne({
            where : {
                id : user_id
            }
        })
        if(findUser){
            findUser.role = 'admin'
            await findUser.save();
            res.status(200).json({
                message : 'USER ASSIGNED TO ADMIN',
                details : findUser
            })
        }else{
            res.status(404).json({
                error : '404',
                message : 'USER NOT FOUND WITH GIVEN ID!'
            })
        }
    }else{
        res.status(401).json({
            error : 'Unauthorized',
            message : 'YOU HAVE TO BE ADMIN FIRST TO CHANGE THE ROLE!'
        })
    }
}