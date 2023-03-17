const express = require('express');
const { signup, login } = require('../controllers/userController');
const { isAuth } = require('../middlewares/isAuth');
const { validateLogin } = require('../middlewares/loginCheck');
const { validateUser } = require('../middlewares/signupCheck');
const router = express.Router();


router
.route("/signup")
.get((req, res) => {
    res.send(`THIS IS SIGN-UP PAGE 
    1) EMAIL MUST END WITH .com or .net (no other!)
    2) PASSWORD MUST BE 5 MINIMUM CHARACTERS AND 20 MAX CHARACTERS WITH NO SYMBOL`)
})
.post(validateUser ,signup)

router
.route("/login")
.get((req, res) => {
    res.send('THIS IS LOG-IN PAGE! PROVIDE YOUR EMAIL AND PASSWORD')
})
.post(validateLogin, login)

module.exports = router

