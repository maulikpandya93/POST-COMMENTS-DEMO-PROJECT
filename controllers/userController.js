const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    
    // try {
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
                res.status(404).json({
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
            res.status(404).json({
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
                console.log('DATA ADDED');
                res.status(200).json({
                    message : 'SUCCESSFULLY REGISTERED!'
                })
            }else{
                res.status(404).json({
                    message : 'Bad Request',
                    error : 'UNFORTUNATELY NOT REGISTERED!'
                })
            }
        }
    // } catch (error) {
    //     console.log(error);
    //     res.status(404).json({
    //         message : 'Bad Request',
    //         error : 'Something Went Wrong!'
    //     })
    // }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const findData = await userModel.findOne({
            where : {
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
                res.status(200).json({
                    message : 'LOGGED IN SUCCESSFULLY',
                    'token' : token
                })
            }else{
                res.status(404).send('PASSWORD DOES NOT MATCH!')
            }
        }else{
            res.status(404).send('USER NOT EXISTS!')
        }
    } catch (error) {
        res.status(404).send('SOMETHING WENT WRONG!')
    }
}
